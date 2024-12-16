import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const solve = (input, part2 = false) => {
  const dirMap = new Map([
    ["^", [0, -1]],
    ["v", [0, 1]],
    [">", [1, 0]],
    ["<", [-1, 0]],
  ]);

  const board = input.split("\n\n")[0];
  const moves = input.split("\n\n")[1];

  const wallMap = [];
  let boxes = [];

  const isWall = (pos) => wallMap[pos[1]][pos[0]] == "#";

  const addVectors = (v1, v2) => v1.map((val, idx) => val + v2[idx]);
  const compareVectors = (v1, v2) => v1.every((val, idx) => val === v2[idx]);

  let boxWidth = 1;
  if (part2) {
    boxWidth = 2;
  }

  let robot;
  for (const [y, line] of board.split("\n").entries()) {
    wallMap.push([]);
    for (const [x, char] of [...line].entries()) {
      for (let boxTile = 0; boxTile < boxWidth; boxTile++) {
        wallMap[wallMap.length - 1].push(char == "#" ? "#" : ".");
        // Store the walls and non-walls separately from the moveable robot/boxes
      }
      if (char == "@") {
        robot = {
          pos: [boxWidth * x, y],
          size: [1, 1],
        };
      } else if (char == "O") {
        boxes.push({
          pos: [boxWidth * x, y],
          size: [boxWidth, 1],
        });
      }
    }
  }

  const move = (dirVec, obj) => {
    const adjTile = obj.pos.map((val, idx) => val + dirVec[idx]);
    const otherTile = addVectors(adjTile, [obj.size[0] - 1, obj.size[1] - 1]);

    if (isWall(adjTile) || isWall(otherTile)) return false; // no move if we hit a wall

    let adjBoxes = boxes.filter((box) => {
      if (compareVectors(box.pos, obj.pos)) return false; // Box cannot be obstacle for itself

      // Part 1 only: 1 tile boxes
      if (box.size[0] == 1)
        return (
          compareVectors(box.pos, adjTile) || compareVectors(box.pos, otherTile)
        );

      // Part2 only: 2 tile boxes
      return (
        compareVectors(box.pos, adjTile) ||
        compareVectors(box.pos, otherTile) ||
        compareVectors(addVectors(box.pos, [1, 0]), adjTile)
      );
    });

    if (adjBoxes.length === 0 || adjBoxes.every((box) => move(dirVec, box))) {
      // Either the box moves to empty space, or every single adjacent box can move
      obj.pos = adjTile;
      return true;
    }
    return false;
  };

  moves.split("").forEach((dir) => {
    if (!dirMap.has(dir)) {
      return;
    } // catches newlines and junk

    let currBoxes = boxes.map((a) => ({
      pos: [...a.pos],
      size: [...a.size],
      type: a.type,
    }));
    let currRobot = { pos: [...robot.pos], size: [...robot.size] };

    // We execute the move function here: it will move the robot as well as all boxes it pushes into
    if (!move(dirMap.get(dir), robot)) {
      // If there is no move possible, we want to revert any changes to positions
      boxes = currBoxes;
      robot = currRobot;
    }
  });

  return boxes.reduce((res, box) => res + 100 * box.pos[1] + box.pos[0], 0);
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  return solve(input);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  return solve(input, part2);
};

run({
  part1: {
    tests: [
      {
        input: `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`,
        expected: 10092,
      },
      {
        input: `
########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<
`,
        expected: 2028,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`,
        expected: 9021,
      },
      {
        input: `
#######
#.....#
#.OO@.#
#.....#
#######

<<
`,
        expected: 406,
      },
      {
        input: `
#######
#.....#
#.O#..#
#..O@.#
#.....#
#######

<v<<^
`,
        expected: 509,
      },
      {
        input: `
#######
#.....#
#.#O..#
#..O@.#
#.....#
#######

<v<^
`,
        expected: 511,
      },
      {
        input: `
######
#....#
#.O..#
#.OO@#
#.O..#
#....#
######

<vv<<^
`,
        expected: 816,
      },
      {
        input: `
#######
#...#.#
#.....#
#.....#
#.....#
#.....#
#.OOO@#
#.OOO.#
#..O..#
#.....#
#.....#
#######

v<vv<<^^^^^
`,
        expected: 2339,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
