import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const numRows = input.split("\n").length;
  const numCols = input.split("\n")[0].length;
  const antennas = new Map();
  const coordsInBounds = (coords) =>
    0 <= coords[0] &&
    coords[0] < numCols &&
    0 <= coords[1] &&
    coords[1] < numCols;
  const getValidAntinodes = (a1, a2) => {
    const dx = a2[0] - a1[0];
    const dy = a2[1] - a1[1];
    // This gets us all the specified nodes at the a2 + (a2 - a1) and a1 + (a1 - a2) vector locations
    return [
      [a2[0] + dx, a2[1] + dy],
      [a1[0] - dx, a1[1] - dy],
    ];
  };
  let char;
  for (let x = 0; x < numCols; x++) {
    for (let y = 0; y < numRows; y++) {
      char = input.split("\n")[y][x];
      if (char == ".") {
        continue;
      }
      if (!antennas.has(char)) {
        antennas.set(char, []);
      }
      antennas.get(char).push([x, y]);
    }
  }
  const antinodePos = new Set();
  let potAntinodes;
  antennas.forEach((posArr, antSym) => {
    for (let i = 0; i < posArr.length; i++) {
      for (let j = i + 1; j < posArr.length; j++) {
        potAntinodes = getValidAntinodes(posArr[i], posArr[j]);
        potAntinodes.forEach((anti) => {
          if (coordsInBounds(anti)) {
            antinodePos.add(anti.join(","));
          }
        });
      }
    }
  });
  return antinodePos.size;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const numRows = input.split("\n").length;
  const numCols = input.split("\n")[0].length;
  const antennas = new Map();
  const coordsInBounds = (coords) =>
    0 <= coords[0] &&
    coords[0] < numCols &&
    0 <= coords[1] &&
    coords[1] < numCols;
  const getValidAntinodes = (a1, a2) => {
    const dx = a2[0] - a1[0];
    const dy = a2[1] - a1[1];
    const antinodes = [];
    let mult = 0;
    let nxt;
    while (true) {
      // Here we visit all the nodes starting from a2, in the direction away from a1
      nxt = [a2[0] + mult * dx, a2[1] + mult * dy];
      if (coordsInBounds(nxt)) {
        mult += 1;
        antinodes.push(nxt);
      } else {
        break;
      }
    }
    mult = 0;
    while (true) {
      // Here we visit all the nodes starting from a1, in the direction away from a2
      nxt = [a1[0] - mult * dx, a1[1] - mult * dy];
      if (coordsInBounds(nxt)) {
        mult += 1;
        antinodes.push(nxt);
      } else {
        break;
      }
    }
    return antinodes;
  };
  let char;
  for (let x = 0; x < numCols; x++) {
    for (let y = 0; y < numRows; y++) {
      char = input.split("\n")[y][x];
      if (char == ".") {
        continue;
      }
      if (!antennas.has(char)) {
        antennas.set(char, []);
      }
      antennas.get(char).push([x, y]);
    }
  }
  const antinodePos = new Set();
  let potAntinodes;
  antennas.forEach((posArr, antSym) => {
    for (let i = 0; i < posArr.length; i++) {
      for (let j = i + 1; j < posArr.length; j++) {
        potAntinodes = getValidAntinodes(posArr[i], posArr[j]);
        potAntinodes.forEach((anti) => {
          antinodePos.add(anti.join(","));
        });
      }
    }
  });
  return antinodePos.size;
};

run({
  part1: {
    tests: [
      {
        input: `
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
        `,
        expected: 14,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
        `,
        expected: 34,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
