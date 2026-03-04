import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from "./sum";

const implementations = [
  { name: "sum_to_n_a (Gauss formula)", fn: sum_to_n_a },
  { name: "sum_to_n_b (iterative loop)", fn: sum_to_n_b },
  { name: "sum_to_n_c (recursion)", fn: sum_to_n_c },
];

describe.each(implementations)("$name", ({ fn }) => {
  // Given a positive integer
  // When we compute the summation to n
  // Then it should return the sum of 1 + 2 + ... + n

  it("given n = 1, then it should return 1", () => {
    expect(fn(1)).toBe(1);
  });

  it("given n = 5, then it should return 15", () => {
    expect(fn(5)).toBe(15);
  });

  it("given n = 10, then it should return 55", () => {
    expect(fn(10)).toBe(55);
  });

  it("given n = 100, then it should return 5050", () => {
    expect(fn(100)).toBe(5050);
  });

  // Given zero
  // When we compute the summation
  // Then it should return 0

  it("given n = 0, then it should return 0", () => {
    expect(fn(0)).toBe(0);
  });

  // Given a large number
  // When we compute the summation
  // Then the result should still be correct and within safe integer range

  it("given n = 1000, then it should return 500500", () => {
    expect(fn(1000)).toBe(500500);
  });
});
