/**
 * Implementation A: Gauss's Formula
 *
 * Uses the closed-form formula n * (n + 1) / 2.
 *
 * Time complexity:  O(1) — constant time, just arithmetic operations.
 * Space complexity: O(1) — no extra memory.
 *
 * This is the most efficient approach.
 */
export function sum_to_n_a(n: number): number {
  return (n * (n + 1)) / 2;
}

/**
 * Implementation B: Iterative Loop
 *
 * Accumulates the sum by looping from 1 to n.
 *
 * Time complexity:  O(n) — iterates n times.
 * Space complexity: O(1) — only a single accumulator variable.
 */
export function sum_to_n_b(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

/**
 * Implementation C: Recursion
 *
 * Recursively adds n + sum_to_n(n - 1) until the base case.
 *
 * Time complexity:  O(n) — n recursive calls.
 * Space complexity: O(n) — n frames on the call stack.
 *
 * Least efficient of the three due to stack overhead and risk of
 * stack overflow for very large n.
 */
export function sum_to_n_c(n: number): number {
  if (n <= 0) return 0;
  return n + sum_to_n_c(n - 1);
}
