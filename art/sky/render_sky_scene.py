"""
Look-dev preview renders of full sky scenes — Blender 5.2 / Cycles.

    blender --background --factory-startup --python render_sky_scene.py -- \
        --condition partlyCloudy --sun-el 38 --sun-az 150 --out out.png

These are PREVIEWS, not bakes, so unlike bake_cloud_basis.py they deliberately
use the AgX view transform: highlight rolloff is what you want for a human
looking at a sunset, and what you must not have when baking data.

Scene units: 1 unit ~ 100 m. Camera sits at the origin looking along +Y.

Precipitation (rain/snow/hail) is intentionally NOT rendered here. It belongs to
a runtime particle layer in Metal/SceneKit, not to a baked asset — simulating it
in Cycles would tell us nothing about how the app will look.
"""
import bpy
import sys
import os
import math
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from conditions import CONDITIONS                      # noqa: E402
from bake_cloud_basis import ARCHETYPES, sock          # noqa: E402


def parse_args():
    argv = sys.argv
    argv = argv[argv.index("--") + 1:] if "--" in argv else []
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--condition", required=True, choices=sorted(CONDITIONS))
    p.add_argument("--out", required=True)
    p.add_argument("--sun-el", type=float, default=38.0)
    p.add_argument("--sun-az", type=float, default=150.0)
    p.add_argument("--sun-size", type=float, default=5.0, help="x real angular size")
    p.add_argument("--moon", action="store_true")
    p.add_argument("--moon-el", type=float, default=30.0)
    p.add_argument("--moon-az", type=float, default=205.0)
    p.add_argument("--moon-size", type=float, default=3.0, help="x real angular size")
    p.add_argument("--moon-brightness", type=float, default=0.25,
                   help="peak radiance BEFORE exposure; keep exposure*this near 1-3 "
                        "or the disc clips to white and the maria vanish")
    p.add_argument("--exposure", type=float, default=0.0)
    p.add_argument("--width", type=int, default=960)
    p.add_argument("--height", type=int, default=600)
    p.add_argument("--samples", type=int, default=64)
    p.add_argument("--pitch", type=float, default=112.0,
                   help="camera pitch, deg; 90 = level, >90 looks up")
    p.add_argument("--seed", type=int, default=7)
    return p.parse_args(argv)


def direction(el_deg, az_deg):
    """Unit vector toward a body at (elevation, azimuth). Matches Astronomy.swift."""
    el, az = math.radians(el_deg), math.radians(az_deg)
    return np.array([math.cos(el) * math.sin(az),
                     -math.cos(el) * math.cos(az),
                     math.sin(el)])


def solar_extinction(el_deg):
    """Sun colour and relative intensity from atmospheric extinction.

    The sun is not white — it is whatever survives the air it shone through.
    Kasten-Young air mass, then Rayleigh optical depth per channel (tau ~
    lambda^-4.09 at 610/550/470 nm) plus a broadly neutral aerosol term.

    Returns (normalised rgb, peak transmittance). At 34 deg this gives a warm
    white (1.00, 0.94, 0.80); at 4 deg a deep orange (1.00, 0.65, 0.21) at ~13%
    the intensity, which is exactly why you can look at a setting sun.
    """
    el = max(el_deg, -1.5)
    m = 1.0 / (math.sin(math.radians(el)) + 0.50572 * (el + 6.07995) ** -1.6364)
    m = min(max(m, 1.0), 40.0)
    rayleigh = (0.0663, 0.1014, 0.1927)
    aerosol = 0.10
    t = [math.exp(-(tau + aerosol) * m) for tau in rayleigh]
    peak = max(t)
    return [c / peak for c in t], peak


def setup_render(scene, a):
    scene.render.engine = "CYCLES"
    scene.render.resolution_x = a.width
    scene.render.resolution_y = a.height
    scene.render.film_transparent = False
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.image_settings.color_depth = "8"
    # Previews want a filmic response; bakes must not have one.
    scene.view_settings.view_transform = "AgX"
    for look in ("AgX - Punchy", "Punchy", "None"):
        try:
            scene.view_settings.look = look
            break
        except TypeError:
            continue
    scene.view_settings.exposure = a.exposure

    cy = scene.cycles
    cy.samples = a.samples
    cy.use_denoising = True
    cy.seed = a.seed
    cy.max_bounces = 6
    cy.volume_bounces = 4           # scenes: cheaper than the 12 used for bakes
    cy.transmission_bounces = 6
    cy.volume_step_rate = 0.9
    cy.volume_max_steps = 192
    try:
        prefs = bpy.context.preferences.addons["cycles"].preferences
        prefs.compute_device_type = "METAL"
        prefs.get_devices()
        for d in prefs.devices:
            d.use = True
        cy.device = "GPU"
    except Exception as e:  # noqa: BLE001
        print("[scene] CPU fallback:", e)


def build_world(a, cfg):
    world = bpy.data.worlds.new("Sky")
    bpy.context.scene.world = world
    world.use_nodes = True
    nt = world.node_tree
    nt.nodes.clear()

    sky = nt.nodes.new("ShaderNodeTexSky")
    try:
        sky.sky_type = "NISHITA"
    except TypeError:
        pass
    sky.sun_elevation = math.radians(a.sun_el)
    sky.sun_rotation = math.radians(a.sun_az)
    sky.sun_disc = False                       # we place our own, see build_sun
    # Aerosol/haze: Nishita's dust knob is exactly the right control for this.
    try:
        sky.dust_density = 1.0 + 8.0 * cfg["haze"]
        sky.air_density = 1.0 + 0.5 * cfg["haze"]
        # Ground bounce; without it cloud bases get no warm up-light at sunset.
        sky.ground_albedo = 0.28
    except AttributeError:
        pass

    out = nt.nodes.new("ShaderNodeOutputWorld")
    bg = nt.nodes.new("ShaderNodeBackground")

    if a.sun_el < -2.0:
        # Night: dim the sky and add a star field.
        tc = nt.nodes.new("ShaderNodeTexCoord")
        vor = nt.nodes.new("ShaderNodeTexVoronoi")
        vor.feature = "F1"
        sock(vor, "Scale", 220.0)
        nt.links.new(tc.outputs["Generated"], vor.inputs["Vector"])
        ramp = nt.nodes.new("ShaderNodeValToRGB")
        ramp.color_ramp.elements[0].position = 0.0
        ramp.color_ramp.elements[1].position = 0.035     # tight -> pinpoint stars
        ramp.color_ramp.elements[0].color = (1, 1, 1, 1)
        ramp.color_ramp.elements[1].color = (0, 0, 0, 1)
        nt.links.new(vor.outputs["Distance"], ramp.inputs["Fac"])

        # Stars only above the horizon.
        sep = nt.nodes.new("ShaderNodeSeparateXYZ")
        nt.links.new(tc.outputs["Generated"], sep.inputs["Vector"])
        gate = nt.nodes.new("ShaderNodeMath")
        gate.operation = "GREATER_THAN"
        gate.inputs[1].default_value = 0.0
        nt.links.new(sep.outputs["Z"], gate.inputs[0])

        starmask = nt.nodes.new("ShaderNodeMath")
        starmask.operation = "MULTIPLY"
        nt.links.new(ramp.outputs["Color"], starmask.inputs[0])
        nt.links.new(gate.outputs["Value"], starmask.inputs[1])

        boost = nt.nodes.new("ShaderNodeMath")
        boost.operation = "MULTIPLY"
        nt.links.new(starmask.outputs["Value"], boost.inputs[0])
        boost.inputs[1].default_value = 40.0

        add = nt.nodes.new("ShaderNodeMixRGB")
        add.blend_type = "ADD"
        add.inputs["Fac"].default_value = 1.0
        nt.links.new(sky.outputs["Color"], add.inputs["Color1"])
        nt.links.new(boost.outputs["Value"], add.inputs["Color2"])
        nt.links.new(add.outputs["Color"], bg.inputs["Color"])
    else:
        nt.links.new(sky.outputs["Color"], bg.inputs["Color"])

    sock(bg, "Strength", 1.0)
    nt.links.new(bg.outputs["Background"], out.inputs["Surface"])


def build_sun(a):
    """Directional lamp (known convention) + a visible disc along the same ray.

    At night the real Sun is blocked by the Earth, but a Blender SUN lamp has no
    planet to occlude it and would light the clouds from below. So below the
    horizon the lamp is re-pointed at the Moon and dimmed to moonlight levels;
    the Moon's own disc is shaded analytically instead (see build_moon).
    """
    night = a.sun_el < -2.0
    d = direction(a.sun_el, a.sun_az)
    light = bpy.data.lights.new("Sun", type="SUN")
    light.angle = math.radians(0.526)

    if night:
        # Moonlight: ~400,000x dimmer than sunlight and slightly blue-shifted
        # by the eye's Purkinje response, which is what sells a night sky.
        light.energy = 0.05 if a.moon else 0.0
        light.color = (0.72, 0.80, 1.0)
        md = direction(a.moon_el, a.moon_az)
        sun = bpy.data.objects.new("Moonlight", light)
        bpy.context.collection.objects.link(sun)
        sun.rotation_euler = (math.pi / 2 - math.radians(a.moon_el), 0.0,
                              math.radians(a.moon_az))
        _ = md
        return sun

    tint, transmit = solar_extinction(a.sun_el)
    # Intensity falls with the same extinction that reddens it -- that coupling
    # is why a low sun is orange AND dim, and why you can look at it.
    light.energy = 5.5 * transmit / 0.75
    light.color = tuple(tint)
    sun = bpy.data.objects.new("Sun", light)
    bpy.context.collection.objects.link(sun)
    sun.rotation_euler = (math.pi / 2 - math.radians(a.sun_el), 0.0, math.radians(a.sun_az))

    if a.sun_el > -1.0:
        R = 2400.0
        bpy.ops.mesh.primitive_uv_sphere_add(radius=R * math.tan(math.radians(0.266)) * a.sun_size,
                                             location=tuple(d * R), segments=24, ring_count=12)
        disc = bpy.context.active_object
        m = bpy.data.materials.new("SunDisc")
        m.use_nodes = True
        nt = m.node_tree
        nt.nodes.clear()
        em = nt.nodes.new("ShaderNodeEmission")
        sock(em, "Color", (tint[0], tint[1], tint[2], 1.0))
        # Scaling strength BY the transmittance is the whole fix: at 900 the disc
        # clipped to white at every elevation, so no tint could ever show. Now a
        # high sun still blows out (as it should) while a low one stays orange.
        sock(em, "Strength", 520.0 * transmit)
        o = nt.nodes.new("ShaderNodeOutputMaterial")
        nt.links.new(em.outputs["Emission"], o.inputs["Surface"])
        disc.data.materials.append(m)
    return sun


def build_moon(a):
    """A real sphere lit by the real sun: the phase then emerges from geometry."""
    d = direction(a.moon_el, a.moon_az)
    R = 2000.0
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=R * math.tan(math.radians(0.259)) * a.moon_size,
        location=tuple(d * R), segments=64, ring_count=32)
    moon = bpy.context.active_object
    bpy.ops.object.shade_smooth()

    m = bpy.data.materials.new("Moon")
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    tc = nt.nodes.new("ShaderNodeTexCoord")

    # What makes a sphere read as *the Moon* is the maria/highlands albedo
    # contrast — basalt plains at ~0.06 against ~0.13 highlands, a 2:1 ratio in
    # large irregular patches. Generic mottling reads as a golf ball instead.
    warp = nt.nodes.new("ShaderNodeTexNoise")
    nt.links.new(tc.outputs["Generated"], warp.inputs["Vector"])
    sock(warp, "Scale", 2.2)
    sock(warp, "Detail", 4.0)
    wv = nt.nodes.new("ShaderNodeVectorMath")
    wv.operation = "MULTIPLY_ADD"
    nt.links.new(warp.outputs["Color"], wv.inputs[0])
    wv.inputs[1].default_value = (0.55, 0.55, 0.55)   # irregular mare borders
    nt.links.new(tc.outputs["Generated"], wv.inputs[2])

    maria = nt.nodes.new("ShaderNodeTexNoise")
    nt.links.new(wv.outputs["Vector"], maria.inputs["Vector"])
    sock(maria, "Scale", 2.6)
    sock(maria, "Detail", 5.0)
    sock(maria, "Roughness", 0.55)

    mare_mask = nt.nodes.new("ShaderNodeMapRange")
    nt.links.new(maria.outputs["Fac"], mare_mask.inputs["Value"])
    sock(mare_mask, "From Min", 0.44)     # fairly sharp coastline
    sock(mare_mask, "From Max", 0.54)
    sock(mare_mask, "To Min", 1.0)
    sock(mare_mask, "To Max", 0.0)
    mare_mask.clamp = True

    albedo = nt.nodes.new("ShaderNodeMapRange")
    nt.links.new(mare_mask.outputs["Result"], albedo.inputs["Value"])
    sock(albedo, "From Min", 0.0)
    sock(albedo, "From Max", 1.0)
    sock(albedo, "To Min", 0.135)         # highlands
    sock(albedo, "To Max", 0.060)         # mare basalt
    albedo.clamp = True

    # Crater rims: distance-to-edge gives ring structures, unlike plain F1.
    rims = nt.nodes.new("ShaderNodeTexVoronoi")
    try:
        rims.feature = "DISTANCE_TO_EDGE"
    except TypeError:
        rims.feature = "F1"
    nt.links.new(wv.outputs["Vector"], rims.inputs["Vector"])
    sock(rims, "Scale", 11.0)
    rim_mask = nt.nodes.new("ShaderNodeMapRange")
    nt.links.new(rims.outputs["Distance"], rim_mask.inputs["Value"])
    sock(rim_mask, "From Min", 0.0)
    sock(rim_mask, "From Max", 0.055)
    sock(rim_mask, "To Min", 1.0)
    sock(rim_mask, "To Max", 0.0)
    rim_mask.clamp = True

    with_rims = nt.nodes.new("ShaderNodeMath")
    with_rims.operation = "MULTIPLY_ADD"
    nt.links.new(rim_mask.outputs["Result"], with_rims.inputs[0])
    with_rims.inputs[1].default_value = 0.045      # rims catch more light
    nt.links.new(albedo.outputs["Result"], with_rims.inputs[2])

    # Fine regolith speckle so the disc is not glassy at large apparent sizes.
    speck = nt.nodes.new("ShaderNodeTexNoise")
    nt.links.new(tc.outputs["Generated"], speck.inputs["Vector"])
    sock(speck, "Scale", 38.0)
    sock(speck, "Detail", 2.0)
    sp = nt.nodes.new("ShaderNodeMapRange")
    nt.links.new(speck.outputs["Fac"], sp.inputs["Value"])
    sock(sp, "To Min", 0.93)
    sock(sp, "To Max", 1.07)

    final_alb = nt.nodes.new("ShaderNodeMath")
    final_alb.operation = "MULTIPLY"
    nt.links.new(with_rims.outputs["Value"], final_alb.inputs[0])
    nt.links.new(sp.outputs["Result"], final_alb.inputs[1])

    # Regolith is slightly warm-grey, not neutral white.
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.045
    ramp.color_ramp.elements[0].color = (0.29, 0.28, 0.265, 1)
    ramp.color_ramp.elements[1].position = 0.185
    ramp.color_ramp.elements[1].color = (1.0, 0.975, 0.93, 1)
    nt.links.new(final_alb.outputs["Value"], ramp.inputs["Fac"])

    # Shade the phase analytically from the true Sun direction rather than with
    # a lamp: the Moon is outside the atmosphere, so it gets full neutral
    # sunlight even when the Sun is below our horizon.
    sd = direction(a.sun_el, a.sun_az)
    geo = nt.nodes.new("ShaderNodeNewGeometry")
    dot = nt.nodes.new("ShaderNodeVectorMath")
    dot.operation = "DOT_PRODUCT"
    nt.links.new(geo.outputs["Normal"], dot.inputs[0])
    dot.inputs[1].default_value = tuple(sd)

    lit = nt.nodes.new("ShaderNodeMath")
    lit.operation = "MAXIMUM"
    nt.links.new(dot.outputs["Value"], lit.inputs[0])
    lit.inputs[1].default_value = 0.0

    # The real Moon stays bright almost to the terminator (strong backscatter
    # from regolith), unlike a Lambertian sphere which falls off as cos.
    flat = nt.nodes.new("ShaderNodeMath")
    flat.operation = "POWER"
    nt.links.new(lit.outputs["Value"], flat.inputs[0])
    flat.inputs[1].default_value = 0.5

    # Earthshine: the "old moon in the new moon's arms".
    earth = nt.nodes.new("ShaderNodeMath")
    earth.operation = "ADD"
    nt.links.new(flat.outputs["Value"], earth.inputs[0])
    earth.inputs[1].default_value = 0.006

    bright = nt.nodes.new("ShaderNodeMath")
    bright.operation = "MULTIPLY"
    nt.links.new(earth.outputs["Value"], bright.inputs[0])
    bright.inputs[1].default_value = a.moon_brightness

    em = nt.nodes.new("ShaderNodeEmission")
    nt.links.new(ramp.outputs["Color"], em.inputs["Color"])
    nt.links.new(bright.outputs["Value"], em.inputs["Strength"])
    o = nt.nodes.new("ShaderNodeOutputMaterial")
    nt.links.new(em.outputs["Emission"], o.inputs["Surface"])
    moon.data.materials.append(m)
    return moon


# Tau through the cloud DIAMETER. The normalised field averages well below
# 1.0 inside the body, so these run higher than the physical optical depth
# you would quote for a real cumulus.
TARGET_TAU = {"cumulus_fair": 170.0, "cumulus_congestus": 260.0,
              "stratus": 90.0, "cirrus": 14.0}


def cloud_material(params, cfg, seed, size, archetype):
    """Rounded, per-cloud-varied cumulus.

    Two things made the previous version read as stone rather than vapour:

    1. RIDGED_MULTIFRACTAL noise. That function exists to make *mountains* — it
       produces sharp creases and hard ridgelines. Cloud lobes are convex and
       rounded, which is what inverted Worley/Voronoi gives (the "Perlin-Worley"
       combination used for real-time cloudscapes).
    2. Every cloud shared one spherical falloff and identical parameters, so
       the whole sky was the same silhouette repeated at different scales.

    So: independent ellipsoid axes per cloud, domain warping to break up the
    regularity, smooth-Voronoi lobes, and per-cloud jitter of every parameter.
    """
    mat = bpy.data.materials.new("Cloud")
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    co = nt.nodes.new("ShaderNodeTexCoord")
    rng = np.random.default_rng(seed)

    # --- per-cloud parameter jitter -----------------------------------------
    coverage = params["coverage"] * rng.uniform(0.86, 1.12)
    erosion = params["erosion"] * rng.uniform(0.75, 1.30)
    # Hold tau roughly constant so a big cloud is not a brick: a light ray
    # must penetrate ~1/density, i.e. a few percent of the cloud, for the
    # fractal surface to be lit and visible at all.
    tau = TARGET_TAU.get(archetype, 45.0) * rng.uniform(0.75, 1.35)
    density = tau / max(2.0 * size, 1e-3) * cfg["density_mul"]
    lobe_scale = params["billow_scale"] * rng.uniform(0.7, 1.5)
    # Independent axes: a sphere scaled per-axis gives lens, egg and tower
    # silhouettes instead of one repeated ball.
    ax = rng.uniform(0.62, 1.45)
    ay = rng.uniform(0.62, 1.45)
    az = params["squash"] * rng.uniform(0.82, 1.28)

    off = nt.nodes.new("ShaderNodeVectorMath")
    off.operation = "ADD"
    nt.links.new(co.outputs["Object"], off.inputs[0])
    off.inputs[1].default_value = tuple(rng.uniform(-60, 60, 3))

    # --- domain warp: bends the whole field so lobes are not on a lattice ---
    warp_noise = nt.nodes.new("ShaderNodeTexNoise")
    warp_noise.noise_dimensions = "3D"
    nt.links.new(off.outputs["Vector"], warp_noise.inputs["Vector"])
    sock(warp_noise, "Scale", 1.1)
    sock(warp_noise, "Detail", 3.0)

    warp_vec = nt.nodes.new("ShaderNodeVectorMath")
    warp_vec.operation = "MULTIPLY_ADD"
    nt.links.new(warp_noise.outputs["Color"], warp_vec.inputs[0])
    warp_vec.inputs[1].default_value = (0.45, 0.45, 0.30)
    nt.links.new(off.outputs["Vector"], warp_vec.inputs[2])

    # --- ellipsoid shape ----------------------------------------------------
    squash = nt.nodes.new("ShaderNodeVectorMath")
    squash.operation = "MULTIPLY"
    nt.links.new(co.outputs["Object"], squash.inputs[0])
    squash.inputs[1].default_value = (1.0 / ax, 1.0 / ay, az)
    length = nt.nodes.new("ShaderNodeVectorMath")
    length.operation = "LENGTH"
    nt.links.new(squash.outputs["Vector"], length.inputs[0])

    shape = nt.nodes.new("ShaderNodeMapRange")
    nt.links.new(length.outputs["Value"], shape.inputs["Value"])
    sock(shape, "From Min", 0.0)
    sock(shape, "From Max", coverage)
    sock(shape, "To Min", 1.0)
    sock(shape, "To Max", 0.0)
    shape.clamp = True

    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(co.outputs["Object"], sep.inputs["Vector"])
    bottom = nt.nodes.new("ShaderNodeMapRange")
    nt.links.new(sep.outputs["Z"], bottom.inputs["Value"])
    fb = params["flat_bottom"] * rng.uniform(0.85, 1.15)
    sock(bottom, "From Min", -fb)
    sock(bottom, "From Max", -fb + 0.22)
    sock(bottom, "To Min", 0.0)
    sock(bottom, "To Max", 1.0)
    bottom.clamp = True

    shaped = nt.nodes.new("ShaderNodeMath")
    shaped.operation = "MULTIPLY"
    nt.links.new(shape.outputs["Result"], shaped.inputs[0])
    nt.links.new(bottom.outputs["Result"], shaped.inputs[1])

    # --- rounded lobes: inverted smooth Voronoi, two octaves -----------------
    def lobes(scale):
        v = nt.nodes.new("ShaderNodeTexVoronoi")
        try:
            v.feature = "SMOOTH_F1"     # convex, blobby cells — not creased
        except TypeError:
            v.feature = "F1"
        nt.links.new(warp_vec.outputs["Vector"], v.inputs["Vector"])
        sock(v, "Scale", scale)
        sock(v, "Smoothness", 0.35)
        inv = nt.nodes.new("ShaderNodeMath")
        inv.operation = "SUBTRACT"
        inv.inputs[0].default_value = 1.0
        nt.links.new(v.outputs["Distance"], inv.inputs[1])
        return inv

    l1, l2 = lobes(lobe_scale), lobes(lobe_scale * 2.4)
    mixl = nt.nodes.new("ShaderNodeMath")
    mixl.operation = "MULTIPLY_ADD"
    nt.links.new(l2.outputs["Value"], mixl.inputs[0])
    mixl.inputs[1].default_value = 0.34
    nt.links.new(l1.outputs["Value"], mixl.inputs[2])

    gain = nt.nodes.new("ShaderNodeMapRange")
    nt.links.new(mixl.outputs["Value"], gain.inputs["Value"])
    sock(gain, "From Min", 0.0)
    sock(gain, "From Max", 1.35)
    sock(gain, "To Min", 0.55)
    sock(gain, "To Max", 1.45)
    gain.clamp = False

    billowed = nt.nodes.new("ShaderNodeMath")
    billowed.operation = "MULTIPLY"
    nt.links.new(shaped.outputs["Value"], billowed.inputs[0])
    nt.links.new(gain.outputs["Result"], billowed.inputs[1])

    # --- multiplicative fractal detail throughout the body ------------------
    # This is what separates cloud from stone. At these optical depths only the
    # ~0.1-density shell is ever visible, so if the field is smooth underneath,
    # that shell renders as a solid surface. Modulating density *everywhere*
    # with fBM makes the visible isosurface fractal at every scale.
    fine = nt.nodes.new("ShaderNodeTexNoise")
    nt.links.new(warp_vec.outputs["Vector"], fine.inputs["Vector"])
    sock(fine, "Scale", lobe_scale * 5.5)
    sock(fine, "Detail", 8.0)
    sock(fine, "Roughness", 0.62)

    fine_gain = nt.nodes.new("ShaderNodeMapRange")
    nt.links.new(fine.outputs["Fac"], fine_gain.inputs["Value"])
    sock(fine_gain, "From Min", 0.0)
    sock(fine_gain, "From Max", 1.0)
    sock(fine_gain, "To Min", 0.45)
    sock(fine_gain, "To Max", 1.45)
    fine_gain.clamp = False

    detailed = nt.nodes.new("ShaderNodeMath")
    detailed.operation = "MULTIPLY"
    nt.links.new(billowed.outputs["Value"], detailed.inputs[0])
    nt.links.new(fine_gain.outputs["Result"], detailed.inputs[1])

    # --- wispy erosion, weighted to the rim ---------------------------------
    erode = nt.nodes.new("ShaderNodeTexNoise")
    nt.links.new(warp_vec.outputs["Vector"], erode.inputs["Vector"])
    sock(erode, "Scale", lobe_scale * 11.0)
    sock(erode, "Detail", 8.0)
    sock(erode, "Roughness", 0.66)

    edge = nt.nodes.new("ShaderNodeMath")
    edge.operation = "SUBTRACT"
    edge.inputs[0].default_value = 1.15
    nt.links.new(shaped.outputs["Value"], edge.inputs[1])
    edge.use_clamp = True
    ea = nt.nodes.new("ShaderNodeMath")
    ea.operation = "MULTIPLY"
    nt.links.new(erode.outputs["Fac"], ea.inputs[0])
    ea.inputs[1].default_value = erosion
    em = nt.nodes.new("ShaderNodeMath")
    em.operation = "MULTIPLY"
    nt.links.new(ea.outputs["Value"], em.inputs[0])
    nt.links.new(edge.outputs["Value"], em.inputs[1])

    sub = nt.nodes.new("ShaderNodeMath")
    sub.operation = "SUBTRACT"
    nt.links.new(detailed.outputs["Value"], sub.inputs[0])
    nt.links.new(em.outputs["Value"], sub.inputs[1])
    sub.use_clamp = True

    contrast = nt.nodes.new("ShaderNodeMapRange")
    nt.links.new(sub.outputs["Value"], contrast.inputs["Value"])
    sock(contrast, "From Min", 0.10)
    sock(contrast, "From Max", 0.58)
    sock(contrast, "To Min", 0.0)
    sock(contrast, "To Max", 1.0)
    contrast.clamp = True

    dens = nt.nodes.new("ShaderNodeMath")
    dens.operation = "MULTIPLY"
    nt.links.new(contrast.outputs["Result"], dens.inputs[0])
    dens.inputs[1].default_value = density

    vol = nt.nodes.new("ShaderNodeVolumePrincipled")
    t = cfg["tint"]
    sock(vol, "Color", (t, t, t * 0.99, 1.0))
    sock(vol, "Anisotropy", params["anisotropy"])
    nt.links.new(dens.outputs["Value"], vol.inputs["Density"])
    o = nt.nodes.new("ShaderNodeOutputMaterial")
    nt.links.new(vol.outputs["Volume"], o.inputs["Volume"])
    return mat


def scatter_clouds(a, cfg):
    if cfg["archetype"] is None or cfg["cover"] <= 0.001:
        return
    params = ARCHETYPES[cfg["archetype"]]
    rng = np.random.default_rng(a.seed)
    base_alt = 26.0 * cfg["alt"]

    overcast = cfg["cover"] >= 0.9 and cfg["archetype"] == "stratus"
    if overcast:
        # A solid deck reads better (and renders far faster) as one slab than
        # as a hundred overlapping puffs.
        #
        # Density must be re-derived here, NOT inherited: the archetype value is
        # tuned for a ~1.5-unit blob, and reusing it across a 20-unit-thick deck
        # gives optical depth in the hundreds -- an opaque black ceiling instead
        # of the bright grey dome an overcast sky actually is. Aim for tau ~30
        # through the deck, and far thinner for fog, which the camera is inside.
        params = dict(params)
        fog = cfg["alt"] <= 0.2
        half_z = 7.0 + 6.0 * cfg["haze"]
        if fog:
            # Camera sits inside: density sets visibility, ~1/tau per unit.
            params["density"] = 0.30 * cfg["density_mul"]   # unused; tau path below
            loc, scale = (0, 120, 0), (420.0, 420.0, 24.0)
        else:
            params["density"] = (30.0 / (2.0 * half_z)) * cfg["density_mul"]
            loc, scale = (0, 210, base_alt), (420.0, 320.0, half_z)
        bpy.ops.mesh.primitive_cube_add(size=2.0, location=loc)
        slab = bpy.context.active_object
        slab.scale = scale
        slab.data.materials.append(
            cloud_material(params, cfg, a.seed, half_z, cfg["archetype"]))
        return

    # The archetype squash already flattens the blob; squashing the object on
    # top of it made distant clouds read as pancakes.
    params = dict(params)
    if cfg["archetype"] != "stratus":
        params["squash"] *= 0.72

    count = int(round(4 + 16 * cfg["cover"]))
    if cfg["archetype"] == "cumulus_congestus":
        count = min(count, 24)
    for i in range(count):
        # Uniform angular spread: x scales with distance.
        near = 90.0 if cfg["archetype"] == "cumulus_congestus" else 26.0
        y = float(np.exp(rng.uniform(math.log(near), math.log(430))))
        x = rng.uniform(-0.95, 0.95) * y * 0.85
        z = base_alt * rng.uniform(0.82, 1.22) + rng.uniform(-3, 3)
        s = y * rng.uniform(0.10, 0.20) * (0.85 if cfg["archetype"] == "cumulus_congestus" else 1.0)
        bpy.ops.mesh.primitive_cube_add(size=2.0, location=(x, y, z))
        c = bpy.context.active_object
        c.scale = (s, s, s * 1.05)
        c.rotation_euler = (0, 0, rng.uniform(0, math.tau))
        c.data.materials.append(
            cloud_material(params, cfg, a.seed * 977 + i, s, cfg["archetype"]))


def setup_glare(scene):
    """UNUSED. Blender 5.2's compositing_node_group did not receive the render
    result through a plain Group Input here, yielding black frames. Bloom is
    applied in post instead (see contact_sheet.py), which is cheaper anyway."""
    ng = bpy.data.node_groups.new("SkyComp", "CompositorNodeTree")
    ng.interface.new_socket("Image", in_out="INPUT", socket_type="NodeSocketColor")
    ng.interface.new_socket("Image", in_out="OUTPUT", socket_type="NodeSocketColor")
    gin = ng.nodes.new("NodeGroupInput")
    gout = ng.nodes.new("NodeGroupOutput")
    glare = ng.nodes.new("CompositorNodeGlare")
    for key, value in (("Type", "FOG_GLOW"), ("Quality", "HIGH"),
                       ("Threshold", 0.7), ("Size", 8.0), ("Strength", 0.55)):
        sk = glare.inputs.get(key)
        if sk is None:
            continue
        try:
            sk.default_value = value
        except (TypeError, ValueError):
            pass
    ng.links.new(gin.outputs[0], glare.inputs["Image"])
    ng.links.new(glare.outputs["Image"], gout.inputs[0])
    scene.use_nodes = True
    scene.compositing_node_group = ng


def main():
    a = parse_args()
    cfg = CONDITIONS[a.condition]

    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    setup_render(scene, a)
    build_world(a, cfg)
    build_sun(a)
    if a.moon:
        build_moon(a)
    scatter_clouds(a, cfg)

    cam_data = bpy.data.cameras.new("Cam")
    cam_data.lens = 22.0                       # wide, like a phone camera
    cam_data.clip_end = 12000.0
    cam = bpy.data.objects.new("Cam", cam_data)
    bpy.context.collection.objects.link(cam)
    cam.location = (0.0, 0.0, 0.0)
    cam.rotation_euler = (math.radians(a.pitch), 0.0, 0.0)
    scene.camera = cam

    scene.render.filepath = a.out
    bpy.ops.render.render(write_still=True)
    print("[scene] wrote", a.out)


if __name__ == "__main__":
    main()
