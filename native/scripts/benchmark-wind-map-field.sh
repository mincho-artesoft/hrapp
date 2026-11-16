#!/bin/bash
set -euo pipefail
repo_dir=$(cd "$(dirname "$0")/.." && pwd)
benchmark_dir=$(mktemp -d "${TMPDIR:-/tmp}/wind-map-benchmark.XXXXXX")
trap 'rm -rf "$benchmark_dir"' EXIT
xcrun swiftc "$repo_dir/Calendar/WeatherView/WindMap/WindMapField.swift" \
    "$repo_dir/scripts/tests/WindMapSamplingBenchmark.swift" -o "$benchmark_dir/benchmark"
"$benchmark_dir/benchmark"
