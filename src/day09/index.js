import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  return solve(input);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  return solve(input, true);
};

const solve = (input, part2 = false) => {
  const nums = input.split("").map((x) => parseInt(x));
  let files = [];
  let space = [];
  let resArray = [];
  let pos = 0;
  nums.forEach((blockSize, idx) => {
    if (idx % 2 === 0) {
      if (part2) {
        files.push([pos, blockSize, idx / 2]);
      }
      for (let byte = 0; byte < blockSize; byte++) {
        resArray.push(idx / 2);
        if (!part2) {
          files.push([pos, 1, idx / 2]);
        }
        pos += 1;
      }
    } else {
      space.push([pos, blockSize]);
      for (let byte = 0; byte < blockSize; byte++) {
        resArray.push(-1);
        pos += 1;
      }
    }
  });

  for (let fileIdx = files.length - 1; fileIdx >= 0; fileIdx--) {
    const [filePos, fileSize, fileId] = files[fileIdx];
    for (let spaceIdx = 0; spaceIdx < space.length; spaceIdx++) {
      const [spacePos, spaceSize] = space[spaceIdx];
      if (filePos > spacePos && fileSize <= spaceSize) {
        for (let byte = 0; byte < fileSize; byte++) {
          resArray[filePos + byte] = -1;
          resArray[spacePos + byte] = fileId;
        }
        space[spaceIdx] = [spacePos + fileSize, spaceSize - fileSize];
        break;
      }
    }
  }

  return resArray.reduce(
    (res, value, idx) => (value !== -1 ? res + value * idx : res),
    0,
  );
};

run({
  part1: {
    tests: [
      {
        input: `2333133121414131402`,
        expected: 1928,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2333133121414131402`,
        expected: 2858,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
