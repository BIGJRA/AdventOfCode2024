import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const solve = (input, part2 = false) => {
  const blocks = input.split("\n\n");
  const towels = blocks[0].split(", ");
  const patterns = blocks[1].split("\n");

  const memo = new Map();
  memo.set("", 1);

  const recur = (pattern) => {
    if (memo.has(pattern)) return memo.get(pattern);
    if (pattern == "") return true;
    let count = 0;
    for (let towel of towels) {
      if (pattern.startsWith(towel)) {
        if (recur(pattern.slice(towel.length))) {
          count += memo.get(pattern.slice(towel.length));
        }
      }
    }
    memo.set(pattern, count);
    return count > 0;
  };

  let p1 = 0;
  let p2 = 0;
  for (let p = 0; p < patterns.length; p++) {
    const patt = patterns[p];
    recur(patt);
    p1 += memo.get(patt) > 0 ? 1 : 0;
    p2 += memo.get(patt);
  }
  if (!part2) return p1;
  return p2;
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
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
`,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
`,
        expected: 16,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
