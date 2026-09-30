#!/bin/bash
set -euo pipefail
repo_dir=$(cd "$(dirname "$0")/.." && pwd)
test_dir=$(mktemp -d "${TMPDIR:-/tmp}/wind-map-tests.XXXXXX")
trap 'rm -rf "$test_dir"' EXIT
xcrun swiftc "$repo_dir/Calendar/WeatherView/WindMap/WindMapField.swift" \
    "$repo_dir/scripts/tests/WindMapFieldTests.swift" -o "$test_dir/WindMapFieldTests"
"$test_dir/WindMapFieldTests"
