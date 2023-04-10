import {
  Color,
  hashSizedToken,
  hashToken,
  Shape,
  Size,
} from "../lib/TokenModel.js";

describe("hashing tokens", () => {
  it("should hash each unique sized token to a unique value", function () {
    const hashes = new Set();
    for (const size in Size) {
      for (const shape in Shape) {
        for (const color in Color) {
          hashes.add(
            hashSizedToken({
              size: Size[size],
              shape: Shape[shape],
              color: Color[color],
            })
          );
        }
      }
    }
    expect(hashes.size).toBe(
      Object.keys(Color).length *
        Object.keys(Shape).length *
        Object.keys(Size).length
    );
  });

  it("should hash each unique token to a unique value", function () {
    const hashes = new Set();
    for (const shape in Shape) {
      for (const color in Color) {
        hashes.add(
          hashToken({
            shape: Shape[shape],
            color: Color[color],
          })
        );
      }
    }
    expect(hashes.size).toBe(
      Object.keys(Color).length * Object.keys(Shape).length
    );
  });
});
