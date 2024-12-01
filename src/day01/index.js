import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const dictIncrement = (d, k) => {
  if (k in d) {
    d[k] += 1
  } else {
    d[k] = 1
  }
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  let res = 0;
  const rows = input.split("\n")
  const l = rows.map((x) => x.split(/\s+/)[0])
  const r = rows.map((x) => x.split(/\s+/)[1])
  l.sort();
  r.sort();
  for (let i=0; i < l.length; i++) {
    res += Math.abs(l[i] - r[i])
  }

  return res;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  let res = 0;
  const rows = input.split("\n")
  const l = rows.map((x) => parseInt(x.split(/\s+/)[0]))
  const r = rows.map((x) => parseInt(x.split(/\s+/)[1]))
  const dl = {}
  const dr = {}
  for (let i=0; i<l.length; i++) {
    dictIncrement(dl, l[i]);
    dictIncrement(dr, r[i]);
  }
  for (const [key, value] of Object.entries(dl)) {
    if (!(key in dr)) {
      continue;
    }
    res += parseInt(key) * value * dr[key];
  }
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
