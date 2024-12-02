import run from "aocrunner";

const parseInput = (rawInput) => {
  const raw_lines = rawInput.split("\n");
  const records = [];
  raw_lines.forEach((l) => {
    records.push(l.split(" ").map((x) => parseInt(x)));
  });
  return records;
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  let res = 0;
  input.forEach((record) => {
    let valid = true;
    let prev = record[0];
    let ascdesc = (record[1] - record[0]) / Math.abs(record[1] - record[0]);
    for (let i = 1; i < record.length; i++) {
      let diff = record[i] - prev;
      if (diff == 0 || diff / Math.abs(diff) != ascdesc || Math.abs(diff) > 3) {
        valid = false;
        break;
      }
      prev = record[i];
    }
    if (valid) {
      res += 1;
    }
  });

  return res;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  let res = 0;

  const isValidSequence = (sequence) => {
    if (sequence.length < 2) return true;
    const direction = Math.sign(sequence[1] - sequence[0]);
    if (direction === 0) return false;

    for (let i = 1; i < sequence.length; i++) {
      const diff = sequence[i] - sequence[i - 1];
      if (Math.sign(diff) !== direction || Math.abs(diff) > 3) {
        return false;
      }
    }
    return true;
  };

  input.forEach((record) => {
    const n = record.length;

    if (isValidSequence(record)) {
      res += 1;
      return;
    }

    // Potential mismatches: the first and last number removed
    const candidates = [record.slice(1), record.slice(0, n - 1)];

    // Other mismatches: when any condition is problematic we try removing both sides of the comparison
    for (let i = 1; i < n; i++) {
      const diff = record[i] - record[i - 1];
      if (
        Math.abs(diff) > 3 ||
        Math.sign(diff) !== Math.sign(record[1] - record[0])
      ) {
        candidates.push(record.slice(0, i).concat(record.slice(i + 1)));
        candidates.push(record.slice(0, i - 1).concat(record.slice(i)));
      }
    }

    if (candidates.some(isValidSequence)) {
      res += 1;
    }
  });
  return res;
};

run({
  part1: {
    tests: [
      {
        input: `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
        `,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
              `,
        expected: 4,
      },
      {
        input: `
        79 80 83 82 83 86 88
        76 69 66 65 62 62 61 62
        14 13 7 5 4 7
        56 50 48 45 45 41
        62 64 65 69 73
                `,
        expected: 1,
      },
      {
        input: `
          49 50 51 53 56 58 60 60
                  `,
        expected: 1,
      },
      {
        input: `
          70 71 74 77 78 80 86
          `,
        expected: 1,
      },
      {
        input: `
        7 10 13 14 16 19 18 22
        `,
        expected: 1,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
