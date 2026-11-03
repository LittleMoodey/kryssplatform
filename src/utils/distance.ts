import type { Coordinates } from "./location";

// Mean Earth radius in metres; Haversine treats the Earth as a sphere.
const EARTH_RADIUS_METERS = 6_371_000;

function validateCoordinates(coordinates: Coordinates): void {
  if (
    !coordinates ||
    !Number.isFinite(coordinates.latitude) ||
    !Number.isFinite(coordinates.longitude) ||
    coordinates.latitude < -90 || coordinates.latitude > 90 ||
    coordinates.longitude < -180 || coordinates.longitude > 180
  ) {
    throw new RangeError(
      "Coordinates must have a finite latitude (-90 to 90) and longitude (-180 to 180)."
    );
  }
}

function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

/**
 * Calculate the shortest surface distance in metres using the Haversine formula.
 * Throws RangeError if either coordinate is invalid. Does not round the result.
 */
export function calculateDistanceMeters(
  from: Coordinates,
  to: Coordinates
): number {
  validateCoordinates(from);
  validateCoordinates(to);

  // JavaScript's trigonometry functions use radians instead of degrees.
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);
  const latitudeDifference = toRadians(to.latitude - from.latitude);
  const longitudeDifference = toRadians(to.longitude - from.longitude);

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(fromLatitude) * Math.cos(toLatitude) *
    Math.sin(longitudeDifference / 2) ** 2;

  // Floating-point rounding can put a slightly outside its valid range.
  const clampedA = Math.min(1, Math.max(0, a));
  const centralAngle = 2 * Math.atan2(
    Math.sqrt(clampedA),
    Math.sqrt(1 - clampedA)
  );

  return EARTH_RADIUS_METERS * centralAngle;
}

/**
 * Check whether the user is inside or exactly on the challenge's radius in metres.
 * Throws RangeError for invalid coordinates or a radius that is not finite and positive.
 */
export function isWithinChallengeRadius(
  userCoordinates: Coordinates,
  challengeCoordinates: Coordinates,
  radiusMeters: number
): boolean {
  if (!Number.isFinite(radiusMeters) || radiusMeters <= 0) {
    throw new RangeError("Radius must be a finite, positive number of metres.");
  }

  return calculateDistanceMeters(userCoordinates, challengeCoordinates) <= radiusMeters;
}
