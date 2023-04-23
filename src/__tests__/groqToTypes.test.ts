import { generateTypeFromValue } from "../groqToTypes";

describe("generateTypeFromValue", () => {
  test("should return correct types for primitive values", () => {
    expect(generateTypeFromValue("string")).toEqual("string");
    expect(generateTypeFromValue(42)).toEqual("number");
    expect(generateTypeFromValue(true)).toEqual("boolean");
    expect(generateTypeFromValue(null)).toEqual("unknown");
  });

  test("should return correct type for arrays", () => {
    expect(generateTypeFromValue(["a", "b", "c"])).toEqual("Array<string>");
    expect(generateTypeFromValue([1, 2, 3])).toEqual("Array<number>");
    expect(generateTypeFromValue([true, false])).toEqual("Array<boolean>");
  });

  test("should return correct type for objects", () => {
    const object = {
      a: "string",
      b: 42,
      c: true,
    };
    const expected = "{\n  a: string;\n  b: number;\n  c: boolean;\n}";
    expect(generateTypeFromValue(object)).toEqual(expected);
  });
});
