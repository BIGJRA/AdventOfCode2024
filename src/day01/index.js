import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  let res = 0;
  const rows = input.split("\n")
  const l = rows.map((x) => parseInt(x.split(/\s+/)[0]))
  const r = rows.map((x) => parseInt(x.split(/\s+/)[1]))
  l.sort();
  r.sort();
  return l.reduce((res, left, i) => res + Math.abs(left - r[i]), 0);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  let res = 0;
  const rows = input.split("\n")
  const l = rows.map((x) => parseInt(x.split(/\s+/)[0]))
  const r = rows.map((x) => parseInt(x.split(/\s+/)[1]))
  const dl = new Map;
  const dr = new Map;
  l.forEach((num) => dl.set(num, (dl.get(num) || 0) + 1));
  r.forEach((num) => dr.set(num, (dr.get(num) || 0) + 1));
  dl.forEach((val, key) => {
    if (dr.has(key)) {
      res += key * val * dr.get(key)
    }
  });
  return res;
};

run({
  part1: {
    tests: [
       {
         input: `3   4
4   3
2   5
1   3
3   9
3   3`,
         expected: 11,
       },
    ],
    solution: part1,
  },
  part2: {
    tests: [
       {
         input: `3   4
4   3
2   5
1   3
3   9
3   3`,
         expected: 31,
       },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
