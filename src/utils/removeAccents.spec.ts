import removeAccents from "./removeAccents";

describe("removeAccents function", () => {
  test("removes accents from a string", () => {
    const input = "héllò wórld";
    const expectedOutput = "hello world";
    const result = removeAccents(input);
    expect(result).toEqual(expectedOutput);
  });

  test("handles empty string", () => {
    const input = "";
    const result = removeAccents(input);
    expect(result).toEqual("");
  });

  test("handles string with no accents", () => {
    const input = "hello world";
    const result = removeAccents(input);
    expect(result).toEqual(input);
  });

  test("handles string with special characters", () => {
    const input = "thïs @#$%^&*()_+ is spècial";
    const expectedOutput = "this @#$%^&*()_+ is special";
    const result = removeAccents(input);
    expect(result).toEqual(expectedOutput);
  });
});
