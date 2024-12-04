import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  const num_rows = lines.length;
  const num_cols = lines[0].length;
  const target = "XMAS";
  const directions = [
    [0, 1],
    [1, 0],
    [-1, 0],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  const tlen = target.length;
  const isValidCoords = (x, y) =>
    x >= 0 && x < num_cols && y >= 0 && y < num_rows;
  let res = 0;
  for (let r = 0; r < num_rows; r++) {
    for (let c = 0; c < num_cols; c++) {
      if (lines[r][c] != target[0]) {
        continue;
      }
      let valid = true;
      let point = [r, c];
      directions.forEach((dir) => {
        let broken = false;
        let curr = [...point];
        for (let move = 1; move < tlen; move++) {
          curr = [curr[0] + dir[0], curr[1] + dir[1]];
          if (
            !isValidCoords(curr[0], curr[1]) ||
            lines[curr[0]][curr[1]] != target[move]
          ) {
            broken = true;
          }
          if (move == tlen - 1 && broken == false) {
            res += 1;
          }
        }
      });
    }
  }
  return res;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  const num_rows = lines.length;
  const num_cols = lines[0].length;
  const directions = [
    [1, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
  ];
  // Note that by convention indexes 0,1 and indexes 2,3 of directions are opposite each other; catches SAS and MAM cases
  let res = 0;
  for (let r = 1; r < num_rows - 1; r++) {
    for (let c = 1; c < num_cols - 1; c++) {
      if (lines[r][c] != "A") {
        continue;
      }
      let diags = [];
      directions.forEach((dir) => {
        diags.push(lines[r + dir[0]][c + dir[1]]);
      });
      if (
        diags.filter((l) => l == "M").length == 2 &&
        diags.filter((l) => l == "S").length == 2 &&
        diags[0] != diags[1]
      ) {
        res += 1;
      }
    }
  }
  return res;
};

run({
  part1: {
    tests: [
      {
        input: `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
        `,
        expected: 18,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.
..........`,
        expected: 9,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
