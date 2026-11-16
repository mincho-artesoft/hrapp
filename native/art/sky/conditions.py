"""
All 34 WeatherKit `WeatherCondition` cases -> sky parameters.

Verified against the iOS 26.2 SDK's WeatherKit.swiftinterface, so this list is
exhaustive and the keys are exact `WeatherCondition.rawValue` strings.

The point of this table is that there are NOT 34 sky models -- there is one
parametric sky with 34 presets. At runtime the condition only picks the
archetype and the broad character; the *continuous* values that actually drive
the look come from live data the view model already fetches:

    cover      <- CurrentWeather.cloudCover        (currentCloudCover)
    wind       <- CurrentWeather.wind.speed/gust   (currentWindSpeed/Gust)
    haze       <- CurrentWeather.visibility
    precip_rate<- precipitationIntensity / precipitationChance

so `cover` etc. below are FALLBACKS used when live data is missing, and sensible
starting points for blending.

Fields
------
archetype    which baked cloud shape family (see bake_cloud_basis.ARCHETYPES)
cover        0..1 sky fraction occupied by cloud
density_mul  multiplies baked optical depth: >1 darker/heavier cloud
alt          cloud base, arbitrary scene units (low stratus vs high cirrus)
wind         0..1 drift speed + turbulence/reshaping rate
precip       none|rain|snow|sleet|hail|drizzle
precip_rate  0..1
haze         0..1 aerosol/fog: lifts blacks, lowers contrast, tints toward grey
lightning    bool
tint         multiplier on cloud albedo; <1 = dirty/storm grey
"""


def _c(archetype=None, cover=0.0, density_mul=1.0, alt=1.0, wind=0.25,
       precip="none", precip_rate=0.0, haze=0.0, lightning=False, tint=1.0):
    return dict(archetype=archetype, cover=cover, density_mul=density_mul, alt=alt,
                wind=wind, precip=precip, precip_rate=precip_rate, haze=haze,
                lightning=lightning, tint=tint)


CONDITIONS = {
    # --- clear / cloud amount -------------------------------------------------
    "clear":        _c(None,                cover=0.00, wind=0.15),
    "mostlyClear":  _c("cirrus",            cover=0.18, alt=2.2, wind=0.25),
    "partlyCloudy": _c("cumulus_fair",      cover=0.40, wind=0.30),
    "mostlyCloudy": _c("cumulus_fair",      cover=0.72, wind=0.35, tint=0.94),
    "cloudy":       _c("stratus",           cover=1.00, alt=0.8, wind=0.30, tint=0.85),

    # --- haze / obscuration ---------------------------------------------------
    "haze":         _c("cirrus",            cover=0.30, alt=2.0, haze=0.55, tint=0.95),
    "smoky":        _c("stratus",           cover=0.45, alt=1.2, haze=0.72, tint=0.78),
    "blowingDust":  _c("stratus",           cover=0.55, alt=0.5, wind=0.85, haze=0.80, tint=0.70),
    "foggy":        _c("stratus",           cover=1.00, alt=0.05, wind=0.15, haze=0.95, tint=0.92),

    # --- wind / temperature (sky is mostly clear; these are UI/motion cues) ---
    "breezy":       _c("cumulus_fair",      cover=0.30, wind=0.60),
    "windy":        _c("cumulus_fair",      cover=0.38, wind=0.95),
    "hot":          _c("cumulus_fair",      cover=0.15, haze=0.30, wind=0.20),
    "frigid":       _c("cirrus",            cover=0.22, alt=2.4, wind=0.40),

    # --- drizzle / rain -------------------------------------------------------
    "drizzle":      _c("stratus",           cover=0.95, alt=0.6, density_mul=1.10,
                       precip="drizzle", precip_rate=0.20, haze=0.35, tint=0.80),
    "rain":         _c("stratus",           cover=1.00, alt=0.7, density_mul=1.35,
                       precip="rain", precip_rate=0.55, haze=0.30, tint=0.70),
    "heavyRain":    _c("stratus",           cover=1.00, alt=0.6, density_mul=1.70,
                       precip="rain", precip_rate=1.00, haze=0.45, tint=0.55),
    "sunShowers":   _c("cumulus_fair",      cover=0.55, density_mul=1.15,
                       precip="rain", precip_rate=0.40, tint=0.88),
    "freezingDrizzle": _c("stratus",        cover=0.95, alt=0.5, density_mul=1.15,
                          precip="sleet", precip_rate=0.25, haze=0.40, tint=0.78),
    "freezingRain": _c("stratus",           cover=1.00, alt=0.6, density_mul=1.45,
                       precip="sleet", precip_rate=0.65, haze=0.40, tint=0.66),

    # --- snow / winter --------------------------------------------------------
    "flurries":     _c("stratus",           cover=0.70, alt=0.8, density_mul=1.05,
                       precip="snow", precip_rate=0.20, haze=0.30, tint=0.90),
    "snow":         _c("stratus",           cover=1.00, alt=0.7, density_mul=1.30,
                       precip="snow", precip_rate=0.60, haze=0.45, tint=0.82),
    "heavySnow":    _c("stratus",           cover=1.00, alt=0.6, density_mul=1.65,
                       precip="snow", precip_rate=1.00, haze=0.70, tint=0.72),
    "sunFlurries":  _c("cumulus_fair",      cover=0.50, precip="snow",
                       precip_rate=0.25, tint=0.93),
    "sleet":        _c("stratus",           cover=1.00, alt=0.7, density_mul=1.40,
                       precip="sleet", precip_rate=0.60, haze=0.40, tint=0.72),
    "wintryMix":    _c("stratus",           cover=1.00, alt=0.7, density_mul=1.40,
                       precip="sleet", precip_rate=0.55, haze=0.45, tint=0.74),
    "blowingSnow":  _c("stratus",           cover=1.00, alt=0.4, density_mul=1.35,
                       precip="snow", precip_rate=0.80, wind=0.90, haze=0.80, tint=0.78),
    "blizzard":     _c("stratus",           cover=1.00, alt=0.3, density_mul=1.60,
                       precip="snow", precip_rate=1.00, wind=1.00, haze=0.95, tint=0.70),

    # --- convective / severe --------------------------------------------------
    "isolatedThunderstorms": _c("cumulus_congestus", cover=0.45, density_mul=1.35,
                                precip="rain", precip_rate=0.45, lightning=True, tint=0.72),
    "scatteredThunderstorms": _c("cumulus_congestus", cover=0.65, density_mul=1.45,
                                 precip="rain", precip_rate=0.60, lightning=True, tint=0.66),
    "thunderstorms": _c("cumulus_congestus", cover=0.85, density_mul=1.60,
                        precip="rain", precip_rate=0.80, wind=0.60,
                        lightning=True, tint=0.55),
    "strongStorms": _c("cumulus_congestus", cover=0.95, density_mul=1.80,
                       precip="rain", precip_rate=0.90, wind=0.80,
                       lightning=True, tint=0.48),
    "hail":         _c("cumulus_congestus", cover=0.90, density_mul=1.70,
                       precip="hail", precip_rate=0.70, wind=0.65,
                       lightning=True, tint=0.55),
    "tropicalStorm": _c("cumulus_congestus", cover=1.00, density_mul=1.75, alt=0.6,
                        precip="rain", precip_rate=0.95, wind=0.95,
                        lightning=True, tint=0.48),
    "hurricane":    _c("cumulus_congestus", cover=1.00, density_mul=1.90, alt=0.5,
                       precip="rain", precip_rate=1.00, wind=1.00,
                       lightning=True, tint=0.42),
}

assert len(CONDITIONS) == 34, "expected 34 WeatherKit conditions, got %d" % len(CONDITIONS)
