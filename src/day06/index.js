import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const solve = (input, part2 = false) => {
  const C = input.split("\n").length;
  const R = input.split("\n")[0].length;
  const dirs = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];
  const coordsToHash = (coords) =>
    coords[0].toString() + "," + coords[1].toString();
  const coordsAndDirToHash = (coords, dir) =>
    coords[0].toString() + "," + coords[1].toString() + "," + dir.toString();

  const coordsAreOutside = (coords) =>
    coords[0] == -1 || coords[0] == C || coords[1] == -1 || coords[1] == R;
  const findNxt = (pos, dir, mult = 1) => [
    pos[0] + mult * dirs[dir][0],
    pos[1] + mult * dirs[dir][1],
  ];
  const findNxtAlongLine = (pos, dir, obs) => {
    let nxt;
    let curr = [...pos];
    while (true) {
      nxt = findNxt(curr, dir);

      if (coordsAreOutside(nxt)) {
        return -1;
      }
      if (obs.has(coordsToHash(nxt))) {
        return curr;
      }
      curr = nxt;
    }
  };

  const obstacles = new Set();
  const newStarts = [];
  let start;

  for (let [y, line] of input.split("\n").entries()) {
    for (let [x, char] of line.split("").entries()) {
      if (char == "#") {
        obstacles.add(coordsToHash([x, y]));
      } else if (char == "^") {
        start = [x, y];
      }
    }
  }
  const getVisited = () => {
    let dir = 0;
    let pos = [...start];
    const vis = new Set();
    let nxt;
    while (true) {
      if (coordsAreOutside(pos)) {
        return vis;
      }
      vis.add(coordsToHash(pos));
      nxt = findNxt(pos, dir);
      while (obstacles.has(coordsToHash(nxt))) {
        dir = (dir + 1) % 4;
        nxt = findNxt(pos, dir);
      }
      newStarts.push([pos, dir, nxt]);
      pos = nxt;
    }
  };
  const visited = getVisited();
  if (!part2) {
    return visited.size;
  }
  newStarts.pop(); // here we just get rid of the errant final one
  const obstaclesChecked = new Set();
  let res = 0;
  newStarts.forEach(([startPos, startDir, obs]) => {
    if (obstaclesChecked.has(coordsToHash(obs))) {
      return;
    }
    obstaclesChecked.add(coordsToHash(obs));

    const newObs = new Set([...obstacles]);
    newObs.add(coordsToHash(obs));

    const found = new Set();
    let [pos, dir] = [[...startPos], startDir];

    while (true) {
      // Exit and increment return if current state has already been done
      if (found.has(coordsAndDirToHash(pos, dir))) {
        res += 1;
        return;
      }

      // Add current state to found
      found.add(coordsAndDirToHash(pos, dir));

      // Move ahead to the next position (if out of bounds, return)
      // for simplicity, rotations and jumps are DIFFERENT

      if (newObs.has(coordsToHash(findNxt(pos, dir)))) {
        dir = (dir + 1) % 4;
      } else {
        const nxt = findNxtAlongLine(pos, dir, newObs);
        if (nxt == -1) {
          return;
        }
        pos = nxt;
      }
    }
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
