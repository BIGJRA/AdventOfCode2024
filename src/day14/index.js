import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const solve = (input, part2 = false) => {
  let W = 101;
  let H = 103;
  const modulo = (x, n) => ((x % n) + n) % n;
  const quadrants = new Map([
    ["NW", 0],
    ["NE", 0],
    ["SW", 0],
    ["SE", 0],
  ]);
  const refreshQuadrants = () => {
    quadrants.set("NW", 0);
    quadrants.set("NE", 0);
    quadrants.set("SW", 0);
    quadrants.set("SE", 0);
  };
  const incrementQuadrant = (q) => {
    if (q == "MID") {
      return;
    }
    quadrants.set(q, quadrants.get(q) + 1);
  };
  const getQuadrant = (pos) => {
    if (pos[0] < (W - 1) / 2) {
      if (pos[1] < (H - 1) / 2) {
        return "NW";
      } else if (pos[1] > (H - 1) / 2) {
        return "SW";
      }
    } else if (pos[0] > (W - 1) / 2) {
      if (pos[1] < (H - 1) / 2) {
        return "NE";
      } else if (pos[1] > (H - 1) / 2) {
        return "SE";
      }
    }
    return "MID";
  };
  const scoreQuadrants = () => {
    return Array.from(quadrants.values()).reduce((a, cv) => a * cv, 1);
  };

  // Hacky part of the code to switch up the room size only for the single example Test Case
  if (input.startsWith("p=0,4")) {
    W = 11;
    H = 7;
  }
  const nextPos = (pos, vel) => [
    modulo(pos[0] + vel[0], W),
    modulo(pos[1] + vel[1], H),
  ];
  const vels = [];
  let posits = [];
  const scores = [10 ** 9];
  input.split("\n").forEach((line) => {
    const nums = line.match(/-?\d+/g).map((x) => parseInt(x));
    posits.push([nums[0], nums[1]]);
    vels.push([nums[2], nums[3]]);
  });
  // 10K moves to find the tree is arbitrary, true, but at least this one is easily verified.
  for (let move = 1; move < 10000; move++) {
    refreshQuadrants();
    const newPosits = [];
    for (let r = 0; r < vels.length; r++) {
      const newPos = nextPos(posits[r], vels[r]);
      newPosits.push(newPos);
      incrementQuadrant(getQuadrant(newPos));
    }
    scores.push(scoreQuadrants());
    if (move == 100 && !part2) {
      return scoreQuadrants();
    }
    posits = newPosits;
  }
  // I want to know where the lowest score across 10K iterations occurs:
  // this should line up with where a xmas tree will generate, since it clusters more than any other.
  const indexedScores = scores.map((value, index) => ({ index, value }));
  indexedScores.sort((a, b) => a.value - b.value);
  return indexedScores[0].index;
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
        input: `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`,
        expected: 12,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
