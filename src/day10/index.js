import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const H = input.split("\n").length;
  const W = input.split("\n")[0].length;
  const pointMap = new Map();
  const trailheads = [];

  const toHash = (coords) => coords[0] + "," + coords[1];

  const adjPoints = (coords) => {
    const pts = [];
    [
      [0, 1],
      [1, 0],
      [-1, 0],
      [0, -1],
    ].forEach((move) => {
      let np = [coords[0] + move[0], coords[1] + move[1]];
      if (np[0] >= 0 && np[0] < W && np[1] >= 0 && np[1] < H) {
        pts.push(np);
      }
    });
    return pts;
  };
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) {
      let score = parseInt(input.split("\n")[y][x]);
      pointMap.set(toHash([x, y]), score);
      if (score === 0) {
        trailheads.push([x, y]);
      }
    }
  }
  let res = 0;
  trailheads.forEach((th) => {
    const dp = [[th, 0]];
    const found = new Set();
    while (dp.length > 0) {
      let [currCoords, currScore] = dp.pop();
      if (currScore === 9) {
        found.add(toHash(currCoords));
        continue;
      }
      for (let nxt of adjPoints(currCoords)) {
        if (pointMap.get(toHash(nxt)) === currScore + 1) {
          dp.push([nxt, currScore + 1]);
        }
      }
    }
    res += found.size;
  });
  return res;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const H = input.split("\n").length;
  const W = input.split("\n")[0].length;
  const pointMap = new Map();
  const trailheads = [];

  const toHash = (coords) => coords[0] + "," + coords[1];

  const adjPoints = (coords) => {
    const pts = [];
    [
      [0, 1],
      [1, 0],
      [-1, 0],
      [0, -1],
    ].forEach((move) => {
      let np = [coords[0] + move[0], coords[1] + move[1]];
      if (np[0] >= 0 && np[0] < W && np[1] >= 0 && np[1] < H) {
        pts.push(np);
      }
    });
    return pts;
  };
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) {
      let score = parseInt(input.split("\n")[y][x]);
      pointMap.set(toHash([x, y]), score);
      if (score === 0) {
        trailheads.push([x, y]);
      }
    }
  }
  let res = 0;
  trailheads.forEach((th) => {
    const dp = [[th, 0]];
    let found = 0;
    while (dp.length > 0) {
      let [currCoords, currScore] = dp.pop();
      if (currScore === 9) {
        found += 1;
        continue;
      }
      for (let nxt of adjPoints(currCoords)) {
        if (pointMap.get(toHash(nxt)) === currScore + 1) {
          dp.push([nxt, currScore + 1]);
        }
      }
    }
    res += found;
  });
  return res;
};

run({
  part1: {
    tests: [
      {
        input: `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
        `,
        expected: 36,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
        `,
        expected: 81,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
