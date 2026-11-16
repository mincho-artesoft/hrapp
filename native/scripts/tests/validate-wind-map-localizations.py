"""Validate the complete Wind Map table in every supported app localization."""
import json
import re
from pathlib import Path
import subprocess

root = Path(__file__).resolve().parents[2] / "Calendar"


def read(path):
    return json.loads(subprocess.check_output(["plutil", "-convert", "json", "-o", "-", str(path)]))


expected = set(read(root / "en.lproj/WindMap.strings"))
used = set()
for swift in (root / "WeatherView/WindMap").glob("*.swift"):
    used.update(re.findall(r'WindMapLabels\.text\("([^"\\]+)"\)', swift.read_text()))
assert used <= expected, f"Untranslated map strings: {used - expected}"
localizations = sorted(root.glob("*.lproj/Localizable.strings"))
for source in localizations:
    path = source.parent / "WindMap.strings"
    values = read(path)
    assert set(values) == expected, f"Missing or extra wind map keys: {path}"
    assert all(value.strip() for value in values.values()), f"Empty translation: {path}"
    shared = read(source)
    for unit in ("Unit_Speed_kmh", "Unit_Speed_mph", "Unit_Precipitation_mm", "Unit_Precipitation_in"):
        assert shared.get(unit, "").strip(), f"Missing localized wind unit {unit}: {source}"
print(f"PASS: Wind Map strings and speed units in all {len(localizations)} app localizations")
