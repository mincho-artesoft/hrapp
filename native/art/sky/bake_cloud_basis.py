"""
Bake relightable volumetric cloud impostors — Blender 5.2 / Cycles.

    blender --background --factory-startup --python bake_cloud_basis.py -- \
        --archetype cumulus_fair --sprites 6 --res 256 --samples 96 --out ../../art/sky/build

Why a lighting basis instead of a sun-angle atlas
-------------------------------------------------
The weather view's camera is effectively fixed (you look *at* the sky), so a
cloud impostor only ever needs ONE view angle. That frees the whole budget for
relighting. Each sprite is rendered under six orthogonal directional lights
(+/-X, +/-Y, +/-Z) plus one uniform-ambient pass. At runtime the shader
reconstructs any sun direction as a weighted blend of the six, tinted by the
sun colour, plus the ambient pass tinted by sky colour.

Radiative transfer is linear in its light sources, so the blend is well-posed.
The one thing it smears is the sharp forward-scattering silver lining, which is
a narrow function of sun angle; the runtime shader adds that back analytically
with a Henyey-Greenstein term (see CloudBillboard.metal).

Output (per archetype):
    basisA_<n>.png  RGB = [+X, +Y, +Z] response, A = coverage/alpha
    basisB_<n>.png  RGB = [-X, -Y, -Z] response, A = ambient response
    atlas.json      normalisation scale + conventions the shader must match

All PNGs are 16-bit linear, colorspace Non-Color. Values are divided by a single
shared `scale` (recorded in atlas.json) so the six passes stay relatable to each
other -- normalising per-pass would destroy the directional ratios.
"""
import bpy
import sys
import os
import json
import math
import numpy as np

# --- Archetypes -------------------------------------------------------------
# One parametric cloud; the 34 WeatherKit conditions select and blend these.
ARCHETYPES = {
    # Fair-weather cumulus: flat base, moderate vertical development.
    "cumulus_fair": dict(density=150.0, coverage=1.02, erosion=0.55, squash=1.60,
                         flat_bottom=0.55, billow_scale=2.2, anisotropy=0.55),
    # Towering/congestus: taller, denser, more billow -> thunderstorm families.
    "cumulus_congestus": dict(density=260.0, coverage=1.10, erosion=0.45, squash=0.95,
                              flat_bottom=0.70, billow_scale=1.7, anisotropy=0.60),
    # Stratus: flat, wide, low contrast -> cloudy/overcast/fog families.
    "stratus": dict(density=90.0, coverage=1.15, erosion=0.70, squash=3.20,
                    flat_bottom=0.30, billow_scale=3.4, anisotropy=0.40),
    # Cirrus: thin, wispy, high erosion -> mostlyClear/hazy families.
    "cirrus": dict(density=28.0, coverage=1.20, erosion=0.95, squash=4.50,
                   flat_bottom=0.10, billow_scale=5.0, anisotropy=0.30),
}

# Light directions in cloud space. The shader MUST use this same order.
# Each entry is (label, rotation_euler) for a Blender SUN, whose default
# orientation travels -Z (i.e. arrives from +Z).
BASIS = [
    ("posX", (0.0, math.radians(90.0), 0.0)),
    ("posY", (math.radians(-90.0), 0.0, 0.0)),
    ("posZ", (0.0, 0.0, 0.0)),
    ("negX", (0.0, math.radians(-90.0), 0.0)),
    ("negY", (math.radians(90.0), 0.0, 0.0)),
    ("negZ", (math.radians(180.0), 0.0, 0.0)),
]

SUN_ENERGY = 3.0  # fixed across all basis passes so ratios stay meaningful


def parse_args():
    argv = sys.argv
    argv = argv[argv.index("--") + 1:] if "--" in argv else []
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--archetype", default="cumulus_fair", choices=sorted(ARCHETYPES))
    p.add_argument("--sprites", type=int, default=6)
    p.add_argument("--res", type=int, default=256)
    p.add_argument("--samples", type=int, default=96)
    p.add_argument("--out", required=True)
    return p.parse_args(argv)


def sock(node, name, value):
    s = node.inputs.get(name)
    if s is not None:
        s.default_value = value


def setup_render(scene, args):
    scene.render.engine = "CYCLES"
    scene.render.resolution_x = args.res
    scene.render.resolution_y = args.res
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "OPEN_EXR"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.color_depth = "32"
    scene.view_settings.view_transform = "Standard"   # never AgX for a bake
    scene.view_settings.look = "None"
    scene.view_settings.exposure = 0.0

    cy = scene.cycles
    cy.samples = args.samples
    cy.use_denoising = True
    cy.max_bounces = 16
    cy.volume_bounces = 12
    cy.transmission_bounces = 12
    cy.volume_step_rate = 0.4
    cy.volume_max_steps = 512
    try:
        prefs = bpy.context.preferences.addons["cycles"].preferences
        prefs.compute_device_type = "METAL"
        prefs.get_devices()
        for d in prefs.devices:
            d.use = True
        cy.device = "GPU"
    except Exception as e:  # noqa: BLE001
        print("[bake] Metal unavailable, CPU:", e)
        cy.device = "CPU"


def build_world():
    """Uniform white ambient. Runtime multiplies this pass by real sky colour."""
    world = bpy.data.worlds.new("Ambient")
    bpy.context.scene.world = world
    world.use_nodes = True
    nt = world.node_tree
    nt.nodes.clear()
    bg = nt.nodes.new("ShaderNodeBackground")
    sock(bg, "Color", (1.0, 1.0, 1.0, 1.0))
    sock(bg, "Strength", 1.0)
    out = nt.nodes.new("ShaderNodeOutputWorld")
    nt.links.new(bg.outputs["Background"], out.inputs["Surface"])
    return bg


def build_cloud(params, seed):
    bpy.ops.mesh.primitive_cube_add(size=2.0, location=(0, 0, 0))
    cube = bpy.context.active_object
    cube.scale = (1.0, 1.0, 0.75)

    mat = bpy.data.materials.new("Cloud")
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()

    co = nt.nodes.new("ShaderNodeTexCoord")

    # Per-sprite variation: offset the noise field rather than rebuilding it.
    off = nt.nodes.new("ShaderNodeVectorMath")
    off.operation = "ADD"
    nt.links.new(co.outputs["Object"], off.inputs[0])
    rng = np.random.default_rng(seed)
    off.inputs[1].default_value = tuple(rng.uniform(-40, 40, 3))

    squash = nt.nodes.new("ShaderNodeVectorMath")
    squash.operation = "MULTIPLY"
    nt.links.new(co.outputs["Object"], squash.inputs[0])
    squash.inputs[1].default_value = (1.0, 1.0, params["squash"])

    length = nt.nodes.new("ShaderNodeVectorMath")
    length.operation = "LENGTH"
    nt.links.new(squash.outputs["Vector"], length.inputs[0])

    shape = nt.nodes.new("ShaderNodeMapRange")
    nt.links.new(length.outputs["Value"], shape.inputs["Value"])
    sock(shape, "From Min", 0.0)
    sock(shape, "From Max", params["coverage"])
    sock(shape, "To Min", 1.0)
    sock(shape, "To Max", 0.0)
    shape.clamp = True

    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(co.outputs["Object"], sep.inputs["Vector"])
    bottom = nt.nodes.new("ShaderNodeMapRange")
    nt.links.new(sep.outputs["Z"], bottom.inputs["Value"])
    sock(bottom, "From Min", -params["flat_bottom"])
    sock(bottom, "From Max", -params["flat_bottom"] + 0.18)
    sock(bottom, "To Min", 0.0)
    sock(bottom, "To Max", 1.0)
    bottom.clamp = True

    shaped = nt.nodes.new("ShaderNodeMath")
    shaped.operation = "MULTIPLY"
    nt.links.new(shape.outputs["Result"], shaped.inputs[0])
    nt.links.new(bottom.outputs["Result"], shaped.inputs[1])

    billow = nt.nodes.new("ShaderNodeTexNoise")
    try:
        billow.noise_type = "RIDGED_MULTIFRACTAL"
    except TypeError:
        pass
    nt.links.new(off.outputs["Vector"], billow.inputs["Vector"])
    sock(billow, "Scale", params["billow_scale"])
    sock(billow, "Detail", 8.0)
    sock(billow, "Roughness", 0.58)
    sock(billow, "Lacunarity", 2.1)

    gain = nt.nodes.new("ShaderNodeMapRange")
    nt.links.new(billow.outputs["Fac"], gain.inputs["Value"])
    sock(gain, "From Min", 0.0)
    sock(gain, "From Max", 1.0)
    sock(gain, "To Min", 0.45)
    sock(gain, "To Max", 1.60)
    gain.clamp = False

    billowed = nt.nodes.new("ShaderNodeMath")
    billowed.operation = "MULTIPLY"
    nt.links.new(shaped.outputs["Value"], billowed.inputs[0])
    nt.links.new(gain.outputs["Result"], billowed.inputs[1])

    erode = nt.nodes.new("ShaderNodeTexNoise")
    nt.links.new(off.outputs["Vector"], erode.inputs["Vector"])
    sock(erode, "Scale", params["billow_scale"] * 4.0)
    sock(erode, "Detail", 12.0)
    sock(erode, "Roughness", 0.62)

    edge = nt.nodes.new("ShaderNodeMath")     # erode the rim, not the core
    edge.operation = "SUBTRACT"
    edge.inputs[0].default_value = 1.0
    nt.links.new(shaped.outputs["Value"], edge.inputs[1])
    edge.use_clamp = True

    ea = nt.nodes.new("ShaderNodeMath")
    ea.operation = "MULTIPLY"
    nt.links.new(erode.outputs["Fac"], ea.inputs[0])
    ea.inputs[1].default_value = params["erosion"]

    em = nt.nodes.new("ShaderNodeMath")
    em.operation = "MULTIPLY"
    nt.links.new(ea.outputs["Value"], em.inputs[0])
    nt.links.new(edge.outputs["Value"], em.inputs[1])

    sub = nt.nodes.new("ShaderNodeMath")
    sub.operation = "SUBTRACT"
    nt.links.new(billowed.outputs["Value"], sub.inputs[0])
    nt.links.new(em.outputs["Value"], sub.inputs[1])
    sub.use_clamp = True

    dens = nt.nodes.new("ShaderNodeMath")
    dens.operation = "MULTIPLY"
    nt.links.new(sub.outputs["Value"], dens.inputs[0])
    dens.inputs[1].default_value = params["density"]

    vol = nt.nodes.new("ShaderNodeVolumePrincipled")
    sock(vol, "Color", (1.0, 1.0, 1.0, 1.0))
    sock(vol, "Anisotropy", params["anisotropy"])
    nt.links.new(dens.outputs["Value"], vol.inputs["Density"])

    out = nt.nodes.new("ShaderNodeOutputMaterial")
    nt.links.new(vol.outputs["Volume"], out.inputs["Volume"])
    cube.data.materials.append(mat)
    return cube


def read_exr(path):
    img = bpy.data.images.load(path)
    w, h = img.size
    px = np.array(img.pixels[:], dtype=np.float32).reshape(h, w, 4)[::-1]
    bpy.data.images.remove(img)
    return px


def write_png16(path, rgba):
    h, w, _ = rgba.shape
    img = bpy.data.images.new(os.path.basename(path), width=w, height=h,
                              alpha=True, float_buffer=True)
    img.colorspace_settings.name = "Non-Color"   # linear data, not colour
    img.pixels = np.clip(rgba[::-1], 0.0, 1.0).ravel().tolist()
    img.filepath_raw = path
    img.file_format = "PNG"
    bpy.context.scene.render.image_settings.color_depth = "16"
    img.save()
    bpy.data.images.remove(img)


def main():
    args = parse_args()
    params = ARCHETYPES[args.archetype]
    outdir = os.path.join(os.path.abspath(args.out), args.archetype)
    tmpdir = os.path.join(outdir, "_passes")
    os.makedirs(tmpdir, exist_ok=True)

    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    setup_render(scene, args)
    bg = build_world()

    cam_data = bpy.data.cameras.new("Cam")
    cam_data.type = "ORTHO"
    cam_data.ortho_scale = 2.6
    cam = bpy.data.objects.new("Cam", cam_data)
    bpy.context.collection.objects.link(cam)
    cam.location = (0.0, -6.0, 0.0)
    cam.rotation_euler = (math.pi / 2, 0.0, 0.0)
    scene.camera = cam

    light = bpy.data.lights.new("Sun", type="SUN")
    light.angle = math.radians(0.526)
    sun = bpy.data.objects.new("Sun", light)
    bpy.context.collection.objects.link(sun)

    manifest = {
        "archetype": args.archetype,
        "sprites": args.sprites,
        "resolution": args.res,
        "basis_order": [b[0] for b in BASIS],
        "basisA_channels": ["posX", "posY", "posZ", "alpha"],
        "basisB_channels": ["negX", "negY", "negZ", "ambient"],
        "sun_energy": SUN_ENERGY,
        "encoding": "16-bit PNG, linear (Non-Color)",
        "alpha": "premultiplied (associated) -- Blender film_transparent convention",
        "note": "Cloud space: +X right, +Y away from viewer, +Z up. "
                "Camera is orthographic looking along +Y.",
    }

    all_max = 0.0
    per_sprite = []

    for s in range(args.sprites):
        for ob in list(bpy.data.objects):
            if ob.type == "MESH":
                bpy.data.objects.remove(ob, do_unlink=True)
        build_cloud(params, seed=1000 + s)

        passes = {}
        # six directional basis passes: sun only, no ambient
        bg.inputs["Strength"].default_value = 0.0
        light.energy = SUN_ENERGY
        for label, rot in BASIS:
            sun.rotation_euler = rot
            p = os.path.join(tmpdir, "s%02d_%s.exr" % (s, label))
            scene.render.filepath = p
            bpy.ops.render.render(write_still=True)
            passes[label] = read_exr(p)

        # ambient pass: uniform white world, no sun
        bg.inputs["Strength"].default_value = 1.0
        light.energy = 0.0
        p = os.path.join(tmpdir, "s%02d_amb.exr" % s)
        scene.render.filepath = p
        bpy.ops.render.render(write_still=True)
        passes["ambient"] = read_exr(p)

        per_sprite.append(passes)
        for k, v in passes.items():
            all_max = max(all_max, float(np.percentile(v[..., :3], 99.9)))
        print("[bake] sprite %d/%d done" % (s + 1, args.sprites))

    scale = max(all_max, 1e-6)
    manifest["scale"] = scale
    print("[bake] shared normalisation scale = %.4f" % scale)

    for s, passes in enumerate(per_sprite):
        alpha = passes["posZ"][..., 3:4]          # identical across passes
        lum = lambda k: passes[k][..., :3].mean(2, keepdims=True) / scale  # noqa: E731
        a = np.concatenate([lum("posX"), lum("posY"), lum("posZ"), alpha], axis=2)
        b = np.concatenate([lum("negX"), lum("negY"), lum("negZ"),
                            np.clip(lum("ambient"), 0, 1)], axis=2)
        write_png16(os.path.join(outdir, "basisA_%d.png" % s), a)
        write_png16(os.path.join(outdir, "basisB_%d.png" % s), b)

    with open(os.path.join(outdir, "atlas.json"), "w") as f:
        json.dump(manifest, f, indent=2)
    print("[bake] wrote", outdir)


if __name__ == "__main__":
    main()
