import run from "aocrunner";

const parseInput = (rawInput) => {
  const res = [];
  rawInput.split("\n").forEach((line) => {
    const l = parseInt(line.split(": ")[0]);
    const r = line
      .split(": ")[1]
      .split(" ")
      .map((x) => parseInt(x));
    res.push([l, r]);
  });
  return res;
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  let res = 0;
  input.forEach((entry) => {
    const [target, nums] = entry;
    const dp = [[nums[0], 1]]; // Current Score, next index to try
    while (dp.length > 0) {
      let [score, idx] = dp.pop();
      if (score > target) {
        continue;
      }
      if (score == target && idx == nums.length) {
        res += target;
        return;
      } else if (idx >= nums.length) {
        continue;
      }
      dp.push([score + nums[idx], idx + 1]);
      dp.push([score * nums[idx], idx + 1]);
    }
  });
  return res;
};

const part2 = (rawInput) => {
  const concatNums = (a, b) => parseInt("" + a + b);
  const input = parseInput(rawInput);
  let res = 0;
  input.forEach((entry) => {
    const [target, nums] = entry;
    const dp = [[nums[0], 1]]; // Current Score, next index to try
    while (dp.length > 0) {
      let [score, idx] = dp.pop();
      if (score > target) {
        continue;
      }
      if (score == target && idx == nums.length) {
        res += target;
        return;
      } else if (idx >= nums.length) {
        continue;
      }
      dp.push([score + nums[idx], idx + 1]);
      dp.push([score * nums[idx], idx + 1]);
      dp.push([concatNums(score, nums[idx]), idx + 1]);
    }
  });
  return res;
};

run({
  part1: {
    tests: [
      {
        input: `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
        `,
        expected: 3749,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
        `,
        expected: 11387,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
