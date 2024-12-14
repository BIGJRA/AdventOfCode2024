import run from "aocrunner";
import { create, all } from "mathjs";

const math = create(all, { matrix: "Array" });

const EPSILON = 0.001;

const solveMatrix = (A, b) => {
  const result = math.lusolve(A, b); // Math 4A memories!
  for (let i = 0; i < result.size()[0]; i++) {
    // Classic programming language division issues arise. Here I fiddled with above constant
    // EPSILON until I found a suitable one that got correct answers on the examples.
    // Replaces matrix values with rounded integers if they are close enough otherwise
    // We know the matrix simply isn't a solution.
    if (
      Math.abs(result.get([i, 0]) - Math.round(result.get([i, 0]))) <= EPSILON
    ) {
      result.set([i, 0], Math.round(result.get([i, 0])));
    } else {
      return "No Solution";
    }
  }
  return result;
};

const parseInput = (rawInput) => rawInput;

const solve = (input, part2 = false) => {
  const equationBlocks = input.split("\n\n");
  let res = 0;

  equationBlocks.forEach((eqBlock) => {
    const nums = eqBlock.match(/\d+/g).map((x) => parseInt(x));
    const A = math.matrix([
      [nums[0], nums[2]],
      [nums[1], nums[3]],
    ]);
    // We only add 10 to the whatever power for part 2
    const b = math.matrix([
      nums[4] + 10000000000000 * part2,
      nums[5] + 10000000000000 * part2,
    ]);
    const solution = solveMatrix(A, b);
    // 2 equations and 2 variables means exactly 1 solution, thankfully.
    // We must exclude those that aren't integer solutions - see EPSILON func above
    if (solution == "No Solution") {
      return;
    }
    res += 3 * solution.get([0, 0]) + 1 * solution.get([1, 0]);
  });
  return res;
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  return solve(input);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  return solve(input, true);
};

run({
  part1: {
    tests: [
      {
        input: `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`,
        expected: 480,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`,
        expected: 875318608908,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
