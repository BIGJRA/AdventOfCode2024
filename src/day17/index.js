import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const modulo = (x, n) => ((x % n) + n) % n;

const arraysMatch = (a, b) =>
  a.length === b.length && a.every((val, i) => val === b[i]);

const process = (startA, startB, startC, instructions) => {
  const comboOp = (operand) => {
    if (operand < 4) return operand;
    return { 4: rA, 5: rB, 6: rC }[operand];
  };

  const opcodes = {
    // I store the number of extra jumps we will make as the return value. A bit messy but it works!
    0: (op) => {
      rA = Math.trunc(rA / 2 ** comboOp(op));
      return 1;
    },
    1: (op) => {
      rB = rB ^ op;
      return 1;
    },
    2: (op) => {
      rB = modulo(comboOp(op), 8);
      return 1;
    },
    3: (op) => {
      if (rA == 0) return 1;
      pointer = op; // Here we set the pointer to the jump value; returning 0 means it won't add after this jump to op
      return 0;
    },
    4: (op) => {
      rB = rB ^ rC;
      return 1;
    },
    5: (op) => {
      output.push(modulo(comboOp(op), 8));
      return 1;
    },
    6: (op) => {
      rB = Math.trunc(rA / 2 ** comboOp(op));
      return 1;
    },
    7: (op) => {
      rC = Math.trunc(rA / 2 ** comboOp(op));
      return 1;
    },
  };

  let rA = startA,
    rB = startB,
    rC = startC;
  let pointer = 0;
  const output = [];
  while (true) {
    if (pointer >= instructions.length) break;
    const [operation, operand] = instructions[pointer];
    const jump = opcodes[operation](operand);
    pointer += jump;
  }
  return output;
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const nums = Array.from(input.match(/\d+/g));
  let [rA, rB, rC] = [...nums.slice(0, 3)].map((x) => parseInt(x));
  const instructions = nums
    .slice(3)
    .map((x) => parseInt(x))
    .reduce(function (result, value, index, array) {
      if (modulo(index, 2) === 0) result.push(array.slice(index, index + 2));
      return result;
    }, []);

  return process(rA, rB, rC, instructions).join(",");
};

const part2 = (rawInput) => {
  // Part 2 relies on a few facts. These are all observations of the test cases as well as my input, so I use them here.
  // One, that the input simply cycles (0,1,2,3,...,n-1),(0,1,...) until step n-1 exits precisely when A = 0.
  // Two, that B and C are constructed and fully determined by A within each cycle, so storing them is not needed.
  // Three, that A is divided by 8 and truncated once per cycle.

  const input = parseInput(rawInput);
  const nums = Array.from(input.match(/\d+/g)).map(Number);

  const targets = nums.slice(3);

  const instructions = nums.slice(3).reduce((result, value, index, array) => {
    if (modulo(index, 2) === 0) result.push(array.slice(index, index + 2));
    return result;
  }, []);

  // DFS by prioritizing smallest children
  let stack = [{ currA: 0, idx: 0, path: [] }];

  while (stack.length > 0) {
    const { currA, idx, path } = stack.pop();

    // Exit condition is when the target array (instructions) fully matches what we are getting back:
    // This only gets pushed when currA is precisely our answer. This is the win con!
    if (idx === targets.length) {
      return currA;
    }

    // We do largest to smallest so that DFS's pop from the back is getting the smaller before the larger
    for (let add = 7; add >= 0; add--) {
      const nextNum = currA * 8 + add;
      const result = process(nextNum, 0, 0, instructions);

      // Compare the last `idx + 1` elements of result to targets slice
      const targetSlice = targets.slice(targets.length - idx - 1);
      const resultSlice = result.slice(-targetSlice.length);

      // Note that in this example we can't let 0 be the first modulo of 8 because then the program will not print the final 0.
      // This is always relevant and suitable because of observation 1 (inputs end with 3,0)
      if (!(currA + add == 0) && arraysMatch(resultSlice, targetSlice)) {
        stack.push({ currA: nextNum, idx: idx + 1, path: [...path, nextNum] });
      }
    }
  }
};

run({
  part1: {
    tests: [
      {
        input: `
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`,
        expected: "4,6,3,5,6,3,5,2,1,0",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0
        `,
        expected: 117440,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
