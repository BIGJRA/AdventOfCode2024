import run from "aocrunner";

const parseInput = (rawInput) => {
  const input = rawInput.split("\n\n");
  const incoming = new Map();
  input[0].split("\n").forEach((rule_string) => {
    let nums = rule_string.split("|").map((x) => parseInt(x, 10));
    if (!incoming.has(nums[0])) {
      incoming.set(nums[0], new Set());
    }
    if (!incoming.has(nums[1])) {
      incoming.set(nums[1], new Set());
    }
    incoming.get(nums[1]).add(nums[0]);
  });
  const books = input[1]
    .split("\n")
    .map((row) => row.split(",").map((x) => parseInt(x)));
  return [incoming, books];
};

const part1 = (rawInput) => {
  const [incoming, books] = parseInput(rawInput);
  let res = 0;
  books.forEach((book) => {
    let bookValid = true;
    for (let i = 0; i < book.length; i++) {
      for (let j = i + 1; j < book.length; j++) {
        if (incoming.get(book.at(i)).has(book.at(j))) {
          bookValid = false;
          break;
        }
      }
      if (bookValid == false) {
        break;
      }
    }
    if (bookValid) {
      res += book.at(book.length / 2);
    }
  });
  return res;
};

const part2 = (rawInput) => {
  const [incoming, books] = parseInput(rawInput);
  let res = 0;
  books.forEach((book) => {
    let isValid = false;
    let wasInvalid = false;
    while (isValid == false) {
      isValid = true;
      for (let i = 0; i < book.length; i++) {
        for (let j = i + 1; j < book.length; j++) {
          if (incoming.get(book.at(i)).has(book.at(j))) {
            isValid = false;
            wasInvalid = true;
            const swapped = [...book]; // Create a copy of the array (optional if modifying in place is fine)
            [swapped[i], swapped[j]] = [swapped[j], swapped[i]]; // Swap using destructuring
            book = swapped;
          }
        }
      }
    }
    if (wasInvalid) {
      res += book.at(book.length / 2);
    }
  });
  return res;
};

run({
  part1: {
    tests: [
      {
        input: `
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
        `,
        expected: 143,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
        `,
        expected: 123,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
