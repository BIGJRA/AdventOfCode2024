import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const solve = (input, part2 = false) => {
  const dirs = [
    [1, 0],
    [0, -1],
    [-1, 0],
    [0, 1],
  ]; // Right, Up, Left, Down
  const grid = input.split("\n");
  const isPassable = (x, y) => {
    return grid[y] && grid[y][x] && grid[y][x] !== "#";
  };

  const findStartEnd = (grid) => {
    let start = null,
      end = null;
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        if (grid[y][x] === "S") start = [x, y];
        if (grid[y][x] === "E") end = [x, y];
      }
    }
    return { start, end };
  };
  const { start, end } = findStartEnd(grid);

  const mhRad = part2 ? 20 : 2; // This represents the manhattan radius that we are searching on: 2 / 20 dep. part

  let picoArray = [];
  let picoMap = new Map();

  let q = [[start, 0]];
  while (q.length > 0) {
    // Simple BFS to find all the points on the path and what picosecond they are ordinarily reached
    const [[cx, cy], cd] = q.pop();
    picoArray.push([cx, cy].join(","));
    picoMap.set([cx, cy].join(","), cd);
    for (const [dx, dy] of dirs) {
      const [nx, ny] = [cx + dx, cy + dy];
      if (picoMap.has([nx, ny].join(","))) continue;
      if (!isPassable(nx, ny)) continue;
      q.push([[nx, ny], cd + 1]);
    }
  }

  let res = 0;

  for (let startIdx = 0; startIdx < picoArray.length; startIdx++) {
    const [sx, sy] = picoArray[startIdx].split(",").map(Number);

    // Iterate over all the tiles within square with side length 2*mhRad, but...
    for (let dx = -mhRad; dx < mhRad + 1; dx++) {
      for (let dy = -mhRad; dy < mhRad + 1; dy++) {
        // ...we only want the manhattan diamond, so here is my extremely lazy way to rule out the outer triangles.
        // There is surely room for optimization here but I got under 1s so it works for now
        const totalMh = Math.abs(dx) + Math.abs(dy);
        if (totalMh > mhRad) continue;

        const [nx, ny] = [sx + dx, sy + dy];

        // We can't finish a cheat in a wall
        if (!isPassable(nx, ny)) continue;

        // Now we simply check that the move actually saves over 100 picoseconds!
        // This generates the answer: each [startIdx, nbrIdx] that satisfies the condition reaches here exactly once
        const nbrIdx = picoMap.get([nx, ny].join(","));
        if (nbrIdx - startIdx - totalMh >= 100) res += 1;
      }
    }
  }

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
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############  
        `,
        expected: 0,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############  
        `,
        expected: 0,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
