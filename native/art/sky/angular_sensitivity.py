"""
Measure how finely sun direction must be sampled for interpolation to hold.

    blender --background --factory-startup --python angular_sensitivity.py -- --out build/_ang

The 6-direction cube basis fails on backlit angles (see validate_basis.py). That
does not condemn impostors -- it only means 90-degree spacing is too coarse.
This renders a centre direction plus a +/-delta pair and asks how well the pair
predicts the centre. The largest delta that stays under ~10% sets the bake grid.
"""
import bpy
import sys
import os
import math
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bake_cloud_basis import (  # noqa: E402
    ARCHETYPES, SUN_ENERGY, setup_render, build_world, build_cloud, read_exr,
)


def parse_args():
    argv = sys.argv
    argv = argv[argv.index("--") + 1:] if "--" in argv else []
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--out", required=True)
    p.add_argument("--archetype", default="cumulus_fair")
    p.add_argument("--res", type=int, default=192)
    p.add_argument("--samples", type=int, default=64)
    return p.parse_args(argv)


def main():
    args = parse_args()
    out = os.path.abspath(args.out)
    os.makedirs(out, exist_ok=True)

    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene

    class A:
        res, samples = args.res, args.samples
    setup_render(scene, A)
    bg = build_world()
    bg.inputs["Strength"].default_value = 0.0

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
    light.energy = SUN_ENERGY
    sun = bpy.data.objects.new("Sun", light)
    bpy.context.collection.objects.link(sun)
    build_cloud(ARCHETYPES[args.archetype], seed=1000)

    cache = {}

    def render(el, az):
        key = (round(el, 2), round(az, 2))
        if key in cache:
            return cache[key]
        sun.rotation_euler = (math.pi / 2 - math.radians(el), 0.0, math.radians(az))
        p = os.path.join(out, "a_%s_%s.exr" % key)
        scene.render.filepath = p
        bpy.ops.render.render(write_still=True)
        px = read_exr(p)
        cache[key] = px
        return px

    alpha = render(60, 30)[..., 3]
    mask = alpha > 0.5

    cases = [
        ("front/top  ", 60, 30),
        ("oblique    ", 40, 125),
        ("backlit    ", 20, 200),
        ("backlit low", -5, 160),
    ]
    deltas = [45, 30, 20, 10]

    print("%-12s %s" % ("case", "  ".join("d=%d" % d for d in deltas)))
    for name, el, az in cases:
        gt = render(el, az)[..., :3].mean(2)[mask]
        gtm = max(gt.mean(), 1e-9)
        row = []
        for d in deltas:
            lo = render(el, az - d)[..., :3].mean(2)[mask]
            hi = render(el, az + d)[..., :3].mean(2)[mask]
            pred = 0.5 * (lo + hi)
            row.append(np.abs(pred - gt).mean() / gtm * 100)
        print("%-12s %s" % (name, "  ".join("%5.1f%%" % v for v in row)))


if __name__ == "__main__":
    main()
