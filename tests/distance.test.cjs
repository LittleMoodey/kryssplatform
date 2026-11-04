const assert = require("node:assert/strict");
const { test } = require("node:test");
const {
  calculateDistanceMeters,
  isWithinChallengeRadius,
} = require("../src/utils/distance.ts");

const oslo = { latitude: 59.9139, longitude: 10.7522 };
const nearby = { latitude: 59.9149, longitude: 10.7532 };

test("identical coordinates have zero distance", () => {
  assert.equal(calculateDistanceMeters(oslo, oslo), 0);
});

test("nearby coordinates measure about 124 metres", () => {
  const distance = calculateDistanceMeters(oslo, nearby);
  assert.ok(Math.abs(distance - 124.4) < 0.1);
});

test("London to New York measures about 5,570 kilometres", () => {
  const london = { latitude: 51.5074, longitude: -0.1278 };
  const newYork = { latitude: 40.7128, longitude: -74.0060 };
  const distance = calculateDistanceMeters(london, newYork);
  assert.ok(Math.abs(distance - 5_570_000) < 1_000);
});

test("distance is the same in either direction", () => {
  assert.equal(
    calculateDistanceMeters(oslo, nearby),
    calculateDistanceMeters(nearby, oslo)
  );
});

test("crossing the date line takes the short path", () => {
  const distance = calculateDistanceMeters(
    { latitude: 0, longitude: 179.999 },
    { latitude: 0, longitude: -179.999 }
  );
  assert.ok(Math.abs(distance - 222.39) < 0.01);
});

test("opposite sides of the Earth return a finite distance", () => {
  const distance = calculateDistanceMeters(
    { latitude: 0, longitude: 0 },
    { latitude: 0, longitude: 180 }
  );
  assert.ok(Math.abs(distance - 20_015_086.8) < 0.1);
});

test("latitude and longitude range endpoints are accepted", () => {
  for (const latitude of [-90, 90]) {
    for (const longitude of [-180, 180]) {
      const coordinates = { latitude, longitude };
      assert.equal(calculateDistanceMeters(coordinates, coordinates), 0);
    }
  }
});

test("invalid latitude or longitude in either argument throws RangeError", () => {
  for (const field of ["latitude", "longitude"]) {
    const limit = field === "latitude" ? 90 : 180;
    const invalidValues = [
      -limit - 0.001, limit + 0.001,
      NaN, Infinity, -Infinity, undefined, null, "10",
    ];

    for (const value of invalidValues) {
      const invalid = { ...oslo, [field]: value };
      assert.throws(() => calculateDistanceMeters(invalid, oslo), RangeError);
      assert.throws(() => calculateDistanceMeters(oslo, invalid), RangeError);
    }
  }
});

test("missing coordinates throw RangeError", () => {
  for (const invalid of [undefined, null, {}]) {
    assert.throws(() => calculateDistanceMeters(invalid, oslo), RangeError);
    assert.throws(() => calculateDistanceMeters(oslo, invalid), RangeError);
  }
});

test("a user at the challenge is within a positive radius", () => {
  assert.equal(isWithinChallengeRadius(oslo, oslo, 1), true);
});

test("a user inside the radius is accepted and one outside is rejected", () => {
  assert.equal(isWithinChallengeRadius(oslo, nearby, 125), true);
  assert.equal(isWithinChallengeRadius(oslo, nearby, 124), false);
});

test("the exact radius boundary is included without rounding", () => {
  const distance = calculateDistanceMeters(oslo, nearby);
  assert.equal(isWithinChallengeRadius(oslo, nearby, distance), true);
  assert.equal(isWithinChallengeRadius(oslo, nearby, distance + 0.001), true);
  assert.equal(isWithinChallengeRadius(oslo, nearby, distance - 0.001), false);
});

test("a radius must be a finite, positive number", () => {
  for (const radius of [0, -1, NaN, Infinity, -Infinity, undefined, null, "125"]) {
    assert.throws(() => isWithinChallengeRadius(oslo, nearby, radius), RangeError);
  }
});

test("the radius check validates both coordinate arguments", () => {
  const invalid = { latitude: 91, longitude: 0 };
  assert.throws(() => isWithinChallengeRadius(invalid, oslo, 125), RangeError);
  assert.throws(() => isWithinChallengeRadius(oslo, invalid, 125), RangeError);
});
