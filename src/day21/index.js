import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const solve = (input, part2 = false) => {
  const splitStringByChar = (str, char) => {
    const arr = str.split(char).map((x) => x + char);
    const res = arr.slice(0, arr.length - 1);
    return res;
  };

  const getNeighbors = (x, y) => [
    { pos: [x, y - 1], dir: "^" },
    { pos: [x + 1, y], dir: ">" },
    { pos: [x, y + 1], dir: "v" },
    { pos: [x - 1, y], dir: "<" },
  ];

  const bfsAllPaths = (start, end, gridPositions) => {
    const [sx, sy] = start;
    const [ex, ey] = end;
    const queue = [[sx, sy, ""]];
    const visited = new Map();
    const paths = [];
    let shortestPathLength = Infinity;

    while (queue.length) {
      const [x, y, path] = queue.shift();
      const pathLength = path.length;

      if (x === ex && y === ey) {
        if (pathLength <= shortestPathLength) {
          if (pathLength < shortestPathLength) {
            paths.length = 0;
            shortestPathLength = pathLength;
          }
          paths.push(path);
        }
        continue;
      }

      for (const {
        pos: [nx, ny],
        dir,
      } of getNeighbors(x, y)) {
        const posKey = `${nx},${ny}`;
        if (gridPositions.has(posKey)) {
          const existingLength = visited.get(posKey);
          if (
            existingLength === undefined ||
            pathLength + 1 <= existingLength
          ) {
            visited.set(posKey, pathLength + 1);
            queue.push([nx, ny, path + dir]);
          }
        }
      }
    }
    return paths;
  };

  const buildPathsMap = (keypad) => {
    const resultMap = {};
    const gridPositions = new Set(
      Object.values(keypad).map(([x, y]) => `${x},${y}`),
    );

    for (const [key1, startPos] of Object.entries(keypad)) {
      resultMap[key1] = {};
      for (const [key2, endPos] of Object.entries(keypad)) {
        if (key1 !== key2) {
          resultMap[key1][key2] = bfsAllPaths(startPos, endPos, gridPositions);
        } else {
          resultMap[key1][key2] = [""];
        }
      }
    }
    return resultMap;
  };

  const countTurns = (path) => {
    if (path.length <= 1) return 0;
    let turns = 0;
    for (let i = 1; i < path.length; i++) {
      if (path[i] !== path[i - 1]) turns += 1;
    }
    return turns;
  };

  const prunePathsByTurns = (map) => {
    for (const start in map) {
      for (const end in map[start]) {
        const paths = map[start][end];
        if (!paths || paths.length === 0) continue;

        const turnsList = paths.map(countTurns);

        const minTurns = Math.min(...turnsList);

        map[start][end] = paths.filter(
          (path, idx) => turnsList[idx] === minTurns,
        );
      }
    }
    return map;
  };

  const prunePathsByTurnsArray = (paths) => {
    if (!paths || paths.length === 0) return [];
    const turnsList = paths.map(countTurns);
    const minTurns = Math.min(...turnsList);
    return paths.filter((path, idx) => turnsList[idx] === minTurns);
  };

  const buildSeq = (seq, padType = "dirpad") => {
    if (cache1.has(seq)) return cache1.get(seq);
    const pathMap = padType === "keypad" ? keypadPathsMap : dirpadPathsMap;

    const recur = (keys, index, prevKey, currPath) => {
      if (index == keys.length) {
        result.push(currPath);
        return;
      }
      for (const path of pathMap[prevKey][keys.charAt(index)]) {
        recur(
          keys,
          index + 1,
          keys.charAt(index),
          currPath.concat(path).concat(["A"]),
          padType,
        );
      }
    };
    const result = [];
    recur(seq, 0, "A", "");
    cache1.set(seq, result);
    return result;
  };

  const getShortestSeq = (seq, depth) => {
    if (cache2.has(`${seq},${depth}`)) return cache2.get(`${seq},${depth}`);
    if (depth === 0) {
      cache2.set(`${seq},${depth}`, seq.length);
      return seq.length;
    }

    const subseqs = splitStringByChar(seq, "A");
    let totalScore = 0;
    for (const subseq of subseqs) {
      const subseqGens = buildSeq(subseq);
      let minSubseqScore = Infinity;
      for (const subseqGen of subseqGens) {
        const subseqGenScore = getShortestSeq(subseqGen, depth - 1);
        if (subseqGenScore < minSubseqScore) {
          minSubseqScore = subseqGenScore;
        }
      }
      totalScore += minSubseqScore;
    }
    cache2.set(`${seq},${depth}`, totalScore);
    return totalScore;
  };

  const keypadPos = {
    0: [1, 3],
    1: [0, 2],
    2: [1, 2],
    3: [2, 2],
    4: [0, 1],
    5: [1, 1],
    6: [2, 1],
    7: [0, 0],
    8: [1, 0],
    9: [2, 0],
    A: [2, 3],
  };

  const dirpadPos = {
    "<": [0, 1],
    ">": [2, 1],
    "^": [1, 0],
    v: [1, 1],
    A: [2, 0],
  };

  const keypadPathsMap = buildPathsMap(keypadPos);
  prunePathsByTurns(keypadPathsMap);

  const dirpadPathsMap = buildPathsMap(dirpadPos);
  prunePathsByTurns(dirpadPathsMap);

  const MAX_DEPTH = part2 ? 25 : 2;

  const cache1 = new Map();
  const cache2 = new Map();

  let totalComp = 0;
  for (const l of input.split("\n")) {
    const numPart = l.match(/\d+/g).map(Number)[0];
    const firstSequences2 = buildSeq(l, "keypad");

    let minScore = Infinity;
    for (const firstSeq of firstSequences2) {
      const currScore = getShortestSeq(firstSeq, MAX_DEPTH);
      if (currScore < minScore) minScore = currScore;
    }
    let score = numPart * minScore;
    totalComp += score;
  }
  return totalComp;
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
029A
980A
179A
456A
379A    
        `,
        expected: 126384,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
029A
980A
179A
456A
379A    
        `,
        expected: 154115708116294,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
