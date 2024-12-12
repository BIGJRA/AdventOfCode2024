import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const solve = (input, part2 = false) => {
  const coordsToHash = (coords) => coords[0] + "," + coords[1];
  const isOutOfBounds = (coords) =>
    coords[0] < 0 || coords[0] >= C || coords[1] < 0 || coords[1] >= R;
  const fourNeighbors = (coords) => {
    const n = [];
    const vecs = new Map([
      ["U", [0, -1]],
      ["D", [0, 1]],
      ["L", [-1, 0]],
      ["R", [1, 0]],
    ]);

    vecs.forEach((vec, dir) => {
      n.push([dir, [coords[0] + vec[0], coords[1] + vec[1]]]);
    });
    return n;
  };
  const R = input.split("\n").length;
  const C = input.split("\n")[0].length;
  const visitedPoints = new Set();
  const plotLookup = ([x, y]) => input.split("\n")[y][x];
  let score = 0;

  for (let y = 0; y < R; y++) {
    for (let x = 0; x < C; x++) {
      // Here we start crawling, looking for each region. Skips if a point has already been found (thorough)
      if (visitedPoints.has(coordsToHash([x, y]))) {
        continue;
      }
      const letter = plotLookup([x, y]);
      let area = 0;

      const fences = new Map(); // Structures fences. Note that we don't connect U/D on diagonals, eg.
      fences.set("U", []);
      fences.set("D", []);
      fences.set("L", []);
      fences.set("R", []);

      const adj = [[x, y]];
      let curr;
      visitedPoints.add(coordsToHash([x, y]));
      while (adj.length > 0) {
        curr = adj.pop();
        area += 1;
        for (const [dir, neighbor] of fourNeighbors(curr)) {
          // If a neighbor is the same letter then there is no fence, otherwise there always is
          if (isOutOfBounds(neighbor) || plotLookup(neighbor) != letter) {
            fences.get(dir).push(curr);
          } else {
            // And, when there is no fence, that is when we push the neighborto DFS
            if (!visitedPoints.has(coordsToHash(neighbor))) {
              visitedPoints.add(coordsToHash(neighbor));
              adj.push(neighbor);
            }
          }
        }
      }
      if (!part2) {
        // Part 1 only wants simple perimeter: count the fences per type
        score +=
          area *
          (fences.get("U").length +
            fences.get("D").length +
            fences.get("R").length +
            fences.get("L").length);
      } else {
        // Part 2 wants lengths per fence: simply sorting in each direction solves this for us nicely
        let lengths = 0;
        fences.forEach((fenceArr, dir) => {
          if (dir == "U" || dir == "D") {
            fenceArr.sort((a, b) => 10000 * (a[1] - b[1]) + (a[0] - b[0])); // primary sort on the Y coord
            let prev = [-1, -1];
            fenceArr.forEach((fencePoint) => {
              if (!(prev[0] + 1 == fencePoint[0] && prev[1] == fencePoint[1])) {
                lengths += 1;
              }
              prev = fencePoint;
            });
          } else {
            fenceArr.sort((a, b) => 10000 * (a[0] - b[0]) + (a[1] - b[1])); // primary sort on the X coord
            let prev = [-1, -1];
            fenceArr.forEach((fencePoint) => {
              if (!(prev[0] == fencePoint[0] && prev[1] + 1 == fencePoint[1])) {
                lengths += 1;
              }
              prev = fencePoint;
            });
          }
        });
        score += area * lengths;
      }
    }
  }
  return score;
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
AAAA
BBCD
BBCC
EEEC`,
        expected: 140,
      },
      {
        input: `
OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`,
        expected: 772,
      },
      {
        input: `
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
        expected: 1930,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
AAAA
BBCD
BBCC
EEEC`,
        expected: 80,
      },
      {
        input: `
OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`,
        expected: 436,
      },
      {
        input: `
EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`,
        expected: 236,
      },
      {
        input: `
AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`,
        expected: 368,
      },
      {
        input: `
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
        expected: 1206,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
