"""
Validate the 6-direction lighting basis against ground truth.

    blender --background --factory-startup --python validate_basis.py -- \
        --passes build/cumulus_fair/_passes --sprite 0

Renders the same cloud lit from several arbitrary sun directions, then compares
each against what the basis reconstruction predicts. If the error is large the
impostor approach needs more basis directions; if it is small, one sprite can be
relit continuously through a day/night cycle from 7 baked images.

Cloud space: +X right, +Y away from viewer, +Z up.
Sun direction of arrival for (elevation el, azimuth az):
    d = (cos el sin az, -cos el cos az, sin el)
"""
import bpy
import sys
import os
import math
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bake_cloud_basis import (  # noqa: E402
    ARCHETYPES, BASIS, SUN_ENERGY, setup_render, build_world, build_cloud, read_exr,
)


def parse_args():
    argv = sys.argv
    argv = argv[argv.index("--") + 1:] if "--" in argv else []
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--passes", required=True)
    p.add_argument("--archetype", default="cumulus_fair")
    p.add_argument("--sprite", type=int, default=0)
    p.add_argument("--res", type=int, default=192)
    p.add_argument("--samples", type=int, default=64)
    return p.parse_args(argv)


def sun_dir(el_deg, az_deg):
    el, az = math.radians(el_deg), math.radians(az_deg)
    return np.array([math.cos(el) * math.sin(az),
                     -math.cos(el) * math.cos(az),
                     math.sin(el)], dtype=np.float64)


def reconstruct(basis, d, mode="linear"):
    """Ambient-cube style blend of the six directional responses."""
    w = np.array([max(d[0], 0), max(d[1], 0), max(d[2], 0),
                  max(-d[0], 0), max(-d[1], 0), max(-d[2], 0)], dtype=np.float64)
    if mode == "squared":
        w = w ** 2
    s = w.sum()
    if s < 1e-9:
        return np.zeros_like(basis[0])
    w = w / s
    out = np.zeros_like(basis[0])
    for wi, b in zip(w, basis):
        out += wi * b
    return out


def main():
    args = parse_args()
    pdir = os.path.abspath(args.passes)
    basis = [read_exr(os.path.join(pdir, "s%02d_%s.exr" % (args.sprite, lbl)))[..., :3].mean(2)
             for lbl, _ in BASIS]
    alpha = read_exr(os.path.join(pdir, "s%02d_posZ.exr" % args.sprite))[..., 3]
    mask = alpha > 0.5

    # Rebuild the identical scene for ground-truth renders.
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene

    class A:
        res, samples = args.res, args.samples
    setup_render(scene, A)
    bg = build_world()
    bg.inputs["Strength"].default_value = 0.0     # sun only, matching the basis

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

    build_cloud(ARCHETYPES[args.archetype], seed=1000 + args.sprite)

    tests = [(60, 30), (40, 125), (20, 200), (8, 95), (-5, 160)]
    # Stack basis as columns for the least-squares lower-bound test.
    B = np.stack([b[mask] for b in basis], axis=1)   # (pixels, 6)

    print("%-14s %9s %9s %9s %9s" % ("sun(el,az)", "linear", "squared", "LSQ", "LSQ+amb"))
    amb = np.ones((B.shape[0], 1), dtype=B.dtype)
    B_amb = np.concatenate([B, amb], axis=1)
    for el, az in tests:
        d = sun_dir(el, az)
        # Blender sun: rotation (pi/2 - el, 0, az) reproduces this arrival dir.
        sun.rotation_euler = (math.pi / 2 - math.radians(el), 0.0, math.radians(az))
        p = os.path.join(pdir, "_gt_%d_%d.exr" % (el, az))
        scene.render.filepath = p
        bpy.ops.render.render(write_still=True)
        gt = read_exr(p)[..., :3].mean(2)

        g = gt[mask]
        gtm = g.mean()
        row = []
        for mode in ("linear", "squared"):
            rec = reconstruct(basis, d, mode)
            row.append(np.abs(rec[mask] - g).mean() / max(gtm, 1e-9) * 100)
        # Lower bound: best possible weights for THIS basis, fitted to ground truth.
        for M in (B, B_amb):
            w, *_ = np.linalg.lstsq(M, g, rcond=None)
            row.append(np.abs(M @ w - g).mean() / max(gtm, 1e-9) * 100)
        print("el=%3d az=%3d %8.1f%% %8.1f%% %8.1f%% %8.1f%%"
              % (el, az, row[0], row[1], row[2], row[3]))


if __name__ == "__main__":
    main()
