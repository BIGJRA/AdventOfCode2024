import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const solve = (input, blinks) => {
  const mapAdd = (map, key, valueToAdd) => {
    if (!map.has(key)) {
      map.set(key, 0);
    }
    map.set(key, map.get(key) + valueToAdd);
  };
  const leftHalf = (int) =>
    parseInt(("" + int).slice(0, ("" + int).length / 2));
  const rightHalf = (int) => parseInt(("" + int).slice(("" + int).length / 2));

  const stones = input.split(" ").map((x) => parseInt(x));
  let stoneCounts = new Map();
  stones.forEach((s) => {
    stoneCounts.set(s, 1);
  });
  for (let b = 0; b < blinks; b++) {
    let nxtCounts = new Map();
    stoneCounts.forEach((count, stone) => {
      if (stone == 0) {
        mapAdd(nxtCounts, 1, count);
      } else if (("" + stone).length % 2 == 0) {
        mapAdd(nxtCounts, leftHalf(stone), count);
        mapAdd(nxtCounts, rightHalf(stone), count);
      } else {
        mapAdd(nxtCounts, stone * 2024, count);
      }
    });
    stoneCounts = nxtCounts;
  }
  let res = 0;
  stoneCounts.forEach((c, _s) => {
    res += c;
  });
  return res;
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  return solve(input, 25);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  return solve(input, 75);
};

run({
  part1: {
    tests: [
      {
        input: `125 17`,
        expected: 55312,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `125 17`,
        expected: 65601038650482,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
