import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const matches = [...input.matchAll(/mul\(\d+,\d+\)/g)];
  // Regex matchAll function returns an array of RegExp match arrays: the matched text is in the first element of each
  let res = 0;
  matches.forEach((m) => {
    let nums = m[0].slice(4).slice(0, -1).split(",");
    res += nums[0] * nums[1];
  });
  return res;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const matches = [...input.matchAll(/(mul\(\d+,\d+\))|(do\(\))|(don't\(\))/g)];
  let res = 0;
  let enabled = true;
  matches.forEach((m) => {
    if (m[0] == "do()") {
      enabled = true;
    } else if (m[0] == "don't()") {
      enabled = false;
    } else if (enabled) {
      let nums = m[0].slice(4).slice(0, -1).split(",");
      res += nums[0] * nums[1];
    }
  });
  return res;
};

run({
  part1: {
    tests: [
      {
        input: `
        xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))
        `,
        expected: 161,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))        
        `,
        expected: 48,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
