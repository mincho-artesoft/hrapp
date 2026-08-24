import Foundation

/// Sun and Moon positions for the 3D sky.
///
/// WeatherKit gives discrete *events* (`sunrise`, `sunset`, `moonrise`, `solarNoon`,
/// and an 8-case `MoonPhase`), which is enough to label a card but not to place a
/// light in a scene: rendering needs azimuth and altitude at an arbitrary instant,
/// and a continuous illuminated fraction rather than eight buckets.
///
/// Sun: NOAA solar position algorithm (~0.01 deg).
/// Moon: Meeus, *Astronomical Algorithms* ch. 47, abbreviated series (~0.2 deg).
/// Both are far tighter than a sky render can resolve.
public struct SkyPosition: Equatable, Sendable {
    /// Degrees clockwise from true north (0 = N, 90 = E, 180 = S, 270 = W).
    public let azimuth: Double
    /// Degrees above the horizon; negative when below.
    public let altitude: Double
}

public struct MoonState: Equatable, Sendable {
    public let position: SkyPosition
    /// 0 = new, 1 = full. Continuous — this is what shades the terminator.
    public let illuminatedFraction: Double
    /// Sun–Moon–Earth phase angle in degrees (0 = full, 180 = new).
    public let phaseAngle: Double
    /// Position angle of the bright limb's midpoint, degrees east of north.
    /// Rotates the lit crescent so it correctly points at the (possibly
    /// below-horizon) sun.
    public let brightLimbAngle: Double
    /// True between new and full.
    public let isWaxing: Bool
    /// Distance in km — drives apparent size (supermoon vs apogee).
    public let distanceKm: Double
}

public enum Astronomy {

    // MARK: - Public API

    public static func sunPosition(date: Date, latitude: Double, longitude: Double) -> SkyPosition {
        let jd = julianDay(date)
        let t = julianCentury(jd)
        let eq = sunEquatorial(t)
        return horizontal(rightAscension: eq.ra, declination: eq.dec,
                          jd: jd, t: t, latitude: latitude, longitude: longitude)
    }

    public static func moonState(date: Date, latitude: Double, longitude: Double) -> MoonState {
        let jd = julianDay(date)
        let t = julianCentury(jd)

        let sun = sunEquatorial(t)
        let moon = moonEcliptic(t)
        let eps = obliquity(t)

        let moonEq = eclipticToEquatorial(lambda: moon.lambda, beta: moon.beta, eps: eps)
        let pos = horizontal(rightAscension: moonEq.ra, declination: moonEq.dec,
                             jd: jd, t: t, latitude: latitude, longitude: longitude)

        // Geocentric elongation of the Moon from the Sun.
        let psi = acos(clamp(cos(rad(moon.beta)) * cos(rad(moon.lambda - sun.lambda)), -1, 1))

        // Phase angle: the Sun is far enough that this stays near 180 - elongation,
        // but the exact form matters near the limb.
        let sunDistKm = 1.495978707e8
        let i = atan2(sunDistKm * sin(psi), moon.distanceKm - sunDistKm * cos(psi))
        let k = (1.0 + cos(i)) / 2.0

        // Position angle of the bright limb (Meeus 48.5).
        let dRA = rad(sun.ra - moonEq.ra)
        let chi = atan2(cos(rad(sun.dec)) * sin(dRA),
                        sin(rad(sun.dec)) * cos(rad(moonEq.dec))
                        - cos(rad(sun.dec)) * sin(rad(moonEq.dec)) * cos(dRA))

        return MoonState(
            position: pos,
            illuminatedFraction: k,
            phaseAngle: deg(i),
            brightLimbAngle: normalize360(deg(chi)),
            isWaxing: normalize360(moon.lambda - sun.lambda) < 180.0,
            distanceKm: moon.distanceKm
        )
    }

    // MARK: - Time

    static func julianDay(_ date: Date) -> Double {
        date.timeIntervalSince1970 / 86400.0 + 2440587.5
    }

    static func julianCentury(_ jd: Double) -> Double {
        (jd - 2451545.0) / 36525.0
    }

    // MARK: - Sun (NOAA)

    struct Equatorial { let ra: Double; let dec: Double; let lambda: Double }

    static func sunEquatorial(_ t: Double) -> Equatorial {
        let l0 = normalize360(280.46646 + t * (36000.76983 + 0.0003032 * t))
        let m = normalize360(357.52911 + t * (35999.05029 - 0.0001537 * t))

        let c = sin(rad(m)) * (1.914602 - t * (0.004817 + 0.000014 * t))
            + sin(rad(2 * m)) * (0.019993 - 0.000101 * t)
            + sin(rad(3 * m)) * 0.000289

        let trueLong = l0 + c
        let omega = 125.04 - 1934.136 * t
        // Apparent longitude: nutation + aberration.
        let lambda = trueLong - 0.00569 - 0.00478 * sin(rad(omega))
        let eps = obliquity(t) + 0.00256 * cos(rad(omega))

        let dec = asin(sin(rad(eps)) * sin(rad(lambda)))
        let ra = atan2(cos(rad(eps)) * sin(rad(lambda)), cos(rad(lambda)))
        return Equatorial(ra: normalize360(deg(ra)), dec: deg(dec), lambda: normalize360(lambda))
    }

    /// Mean obliquity of the ecliptic, degrees.
    static func obliquity(_ t: Double) -> Double {
        23.0 + (26.0 + (21.448 - t * (46.8150 + t * (0.00059 - t * 0.001813))) / 60.0) / 60.0
    }

    // MARK: - Moon (Meeus ch. 47, abbreviated)

    struct MoonEcliptic { let lambda: Double; let beta: Double; let distanceKm: Double }

    static func moonEcliptic(_ t: Double) -> MoonEcliptic {
        let lp = normalize360(218.3164477 + 481267.88123421 * t - 0.0015786 * t * t
                              + t * t * t / 538841.0 - t * t * t * t / 65194000.0)
        let d = normalize360(297.8501921 + 445267.1114034 * t - 0.0018819 * t * t
                             + t * t * t / 545868.0 - t * t * t * t / 113065000.0)
        let m = normalize360(357.5291092 + 35999.0502909 * t - 0.0001536 * t * t
                             + t * t * t / 24490000.0)
        let mp = normalize360(134.9633964 + 477198.8675055 * t + 0.0087414 * t * t
                              + t * t * t / 69699.0 - t * t * t * t / 14712000.0)
        let f = normalize360(93.2720950 + 483202.0175233 * t - 0.0036539 * t * t
                             - t * t * t / 3526000.0 + t * t * t * t / 863310000.0)

        func s(_ x: Double) -> Double { sin(rad(x)) }
        func c(_ x: Double) -> Double { cos(rad(x)) }

        // Longitude, degrees.
        var l = 6.288774 * s(mp)
        l += 1.274027 * s(2 * d - mp)
        l += 0.658314 * s(2 * d)
        l += 0.213618 * s(2 * mp)
        l -= 0.185116 * s(m)
        l -= 0.114332 * s(2 * f)
        l += 0.058793 * s(2 * d - 2 * mp)
        l += 0.057066 * s(2 * d - m - mp)
        l += 0.053322 * s(2 * d + mp)
        l += 0.045758 * s(2 * d - m)
        l -= 0.040923 * s(m - mp)
        l -= 0.034720 * s(d)
        l -= 0.030383 * s(m + mp)
        l += 0.015327 * s(2 * d - 2 * f)
        l -= 0.012528 * s(mp + 2 * f)
        l += 0.010980 * s(mp - 2 * f)
        l += 0.010675 * s(4 * d - mp)
        l += 0.010034 * s(3 * mp)
        l += 0.008548 * s(4 * d - 2 * mp)

        // Latitude, degrees.
        var b = 5.128122 * s(f)
        b += 0.280602 * s(mp + f)
        b += 0.277693 * s(mp - f)
        b += 0.173237 * s(2 * d - f)
        b += 0.055413 * s(2 * d - mp + f)
        b += 0.046271 * s(2 * d - mp - f)
        b += 0.032573 * s(2 * d + f)
        b += 0.017198 * s(2 * mp + f)
        b += 0.009266 * s(2 * d + mp - f)
        b += 0.008822 * s(2 * mp - f)
        b += 0.008216 * s(2 * d - m - f)

        // Distance, km.
        var dist = 385000.56
        dist -= 20905.355 * c(mp)
        dist -= 3699.111 * c(2 * d - mp)
        dist -= 2955.968 * c(2 * d)
        dist -= 569.925 * c(2 * mp)
        dist += 246.158 * c(2 * d - 2 * mp)
        dist -= 152.138 * c(2 * d - m - mp)
        dist -= 170.733 * c(2 * d + mp)
        dist -= 204.586 * c(2 * d - m)
        dist -= 129.620 * c(m)
        dist += 108.743 * c(d)

        return MoonEcliptic(lambda: normalize360(lp + l), beta: b, distanceKm: dist)
    }

    // MARK: - Coordinate conversion

    static func eclipticToEquatorial(lambda: Double, beta: Double, eps: Double) -> (ra: Double, dec: Double) {
        let sl = sin(rad(lambda)), cl = cos(rad(lambda))
        let sb = sin(rad(beta)), cb = cos(rad(beta))
        let se = sin(rad(eps)), ce = cos(rad(eps))
        let ra = atan2(sl * ce - (sb / cb) * se, cl)
        let dec = asin(sb * ce + cb * se * sl)
        return (normalize360(deg(ra)), deg(dec))
    }

    /// Greenwich mean sidereal time, degrees.
    static func gmst(jd: Double, t: Double) -> Double {
        normalize360(280.46061837 + 360.98564736629 * (jd - 2451545.0)
                     + 0.000387933 * t * t - t * t * t / 38710000.0)
    }

    static func horizontal(rightAscension ra: Double, declination dec: Double,
                           jd: Double, t: Double,
                           latitude: Double, longitude: Double) -> SkyPosition {
        // Local hour angle, east longitude positive.
        let h = rad(normalize360(gmst(jd: jd, t: t) + longitude - ra))
        let phi = rad(latitude)
        let d = rad(dec)

        let altitude = asin(sin(phi) * sin(d) + cos(phi) * cos(d) * cos(h))
        // atan2 form measured from south, then rotated to a north-based bearing.
        let azSouth = atan2(sin(h), cos(h) * sin(phi) - tan(d) * cos(phi))
        return SkyPosition(azimuth: normalize360(deg(azSouth) + 180.0), altitude: deg(altitude))
    }

    // MARK: - Helpers

    @inline(__always) static func rad(_ d: Double) -> Double { d * .pi / 180.0 }
    @inline(__always) static func deg(_ r: Double) -> Double { r * 180.0 / .pi }
    @inline(__always) static func clamp(_ v: Double, _ lo: Double, _ hi: Double) -> Double {
        min(max(v, lo), hi)
    }

    static func normalize360(_ d: Double) -> Double {
        let r = d.truncatingRemainder(dividingBy: 360.0)
        return r < 0 ? r + 360.0 : r
    }
}
