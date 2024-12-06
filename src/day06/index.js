import run from "aocrunner";
import { parse } from "path";

const dirs = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

const hashPos = (pos) => pos[0].toString() + "," + pos[1].toString();
const arrOutbounds = (pos, num_cols, num_rows) =>
  pos[0] == -1 || pos[0] == num_cols || pos[1] == -1 || pos[1] == num_rows;
const findNxt = (pos, dir, mult = 1) => [
  pos[0] + mult * dirs[dir][0],
  pos[1] + mult * dirs[dir][1],
];

const parseInput = (rawInput) => {
  const obstacles = new Set();
  let start;
  const num_cols = rawInput.split("\n").length;
  const num_rows = rawInput.split("\n")[0].length;
  for (let [y, line] of rawInput.split("\n").entries()) {
    for (let [x, char] of line.split("").entries()) {
      if (char == "#") {
        obstacles.add(x.toString() + "," + y.toString());
      } else if (char == "^") {
        start = [x, y];
      }
    }
  }
  return [start, obstacles, num_cols, num_rows];
};

const part1 = (rawInput) => {
  const [start, obstacles, num_cols, num_rows] = parseInput(rawInput);
  let dir = 0;
  let pos = start;
  let vis = new Set();
  let nxt;
  while (true) {
    if (arrOutbounds(pos, num_cols, num_rows)) {
      return vis.size;
    }
    vis.add(hashPos(pos));
    nxt = findNxt(pos, dir);
    while (obstacles.has(hashPos(nxt))) {
      dir = (dir + 1) % 4;
      nxt = findNxt(pos, dir);
    }
    pos = nxt;
  }
};

const part2 = (rawInput) => {
  const [start, obstacles, num_cols, num_rows] = parseInput(rawInput);
  const maxMoves = num_cols * num_rows * 4;

  const getVisited = () => {
    let dir = 0;
    let pos = start;
    const vis = new Set();
    let nxt;
    while (true) {
      if (arrOutbounds(pos, num_cols, num_rows)) {
        return vis;
      }
      vis.add(hashPos(pos));
      nxt = findNxt(pos, dir);
      while (obstacles.has(hashPos(nxt))) {
        dir = (dir + 1) % 4;
        nxt = findNxt(pos, dir);
      }
      pos = nxt;
    }
  };
  const visited = getVisited();
  let res = 0;

  visited.forEach((obs) => {
    if (obs == start) {
      return;
    }
    let dir = 0;
    let pos = start;
    let nxt;
    let moveCount = 0;
    while (true) {
      if (arrOutbounds(pos, num_cols, num_rows)) {
        return;
      }
      if (moveCount == maxMoves) {
        res += 1;
        return;
      }
      nxt = findNxt(pos, dir);
      while (obstacles.has(hashPos(nxt)) || obs == hashPos(nxt)) {
        dir = (dir + 1) % 4;
        nxt = findNxt(pos, dir);
      }
      pos = nxt;
      moveCount += 1;
    }
  });
  return res;
};

run({
  part1: {
    tests: [
      {
        input: `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
        `,
        expected: 41,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
        `,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
