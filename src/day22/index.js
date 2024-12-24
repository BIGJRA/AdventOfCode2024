import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const solve = (input, part2 = false) => {
  const modulo = (x, n) => ((x % n) + n) % n;

  const mix = (val, sec) => {
    sec = val ^ sec;
    return sec;
  };

  const prune = (sec) => {
    sec = modulo(sec, 16777216);
    return sec;
  };

  const evolve = (sec) => {
    sec = mix(sec, sec * 64);
    sec = prune(sec);
    sec = mix(sec, Math.trunc(sec / 32));
    sec = prune(sec);
    sec = mix(sec, sec * 2048);
    sec = prune(sec);
    return sec;
  };

  let sum = 0;
  let sequenceScores = new Map();

  for (const num of input.split("\n").map(Number)) {
    const seqMap = new Map();
    let prev = num;
    let curr;
    const diffs = [];
    for (let iter = 0; iter < 2000; iter++) {
      curr = evolve(prev);

      if (part2) {
        // Sticking this in a block to not drag down p1 run time too much

        const prevModulo = modulo(prev, 10);
        const currModulo = modulo(curr, 10);
        const diff = currModulo - prevModulo;

        if (diffs.length < 4) {
          diffs.push(diff);
        } else {
          // Replace the first element and shift others manually
          diffs[0] = diffs[1];
          diffs[1] = diffs[2];
          diffs[2] = diffs[3];
          diffs[3] = diff;
        }

        if (diffs.length === 4) {
          const key = `${diffs[0]},${diffs[1]},${diffs[2]},${diffs[3]}`;
          if (!seqMap.has(key)) {
            seqMap.set(key, currModulo);
          }
        }
      }

      prev = curr;
    }
    sum += curr;

    // Add seqMap to the full sequence scores
    seqMap.forEach((score, key) => {
      if (!sequenceScores.has(key)) {
        sequenceScores.set(key, score);
      } else {
        sequenceScores.set(key, sequenceScores.get(key) + score);
      }
    });
  }
  if (!part2) {
    return sum;
  } else {
    return Math.max(...sequenceScores.values());
  }
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
        input: `1
10
100
2024`,
        expected: 37327623,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `1
2
3
2024`,
        expected: 23,
      },
      //       {
      //         input: `1
      // 10
      // 10
      // 100
      // 2024`,
      //         expected: 30,
      //       },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
