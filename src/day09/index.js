import run from "aocrunner";
import { start } from "repl";

const parseInput = (rawInput) => rawInput;

const findBlockLength = (array, element) =>
  array.filter((n) => n == element).length;

const isAllSame = (arr) => {
  if (arr.length === 0) {
    return true; // Empty array considered all the same
  }
  const firstElement = arr[0];
  return arr.every((element) => element === firstElement);
};

const isAllEmpty = (arr) => {
  return isAllSame(arr) && arr[0] === -1;
};

const getEmptyBlockIdx = (array, emptyBlockSize) => {
  // This code looks for an empty Block of valid size
  for (let i = 0; i < array.length - emptyBlockSize + 1; i++) {
    if (isAllEmpty(array.slice(i, i + emptyBlockSize))) {
      return i;
    }
  }
  return -1;
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const nums = input.split("").map((x) => parseInt(x));
  let disk = [];
  let blockSize;
  nums.forEach((blockSize, idx) => {
    if (idx % 2 === 0) {
      // Here we have an actual block
      // divide idx by two to get the block's ID
      disk = disk.concat([...Array(blockSize).fill(idx / 2)]);
    } else {
      // Here we have empty space
      disk = disk.concat([...Array(blockSize).fill(-1)]);
    }
  });
  let idx = 0;
  while (true) {
    if (idx >= disk.length) {
      break;
    }
    if (disk[idx] === -1) {
      let right = disk.pop();
      while (right === -1) {
        right = disk.pop();
      }
      disk[idx] = right;
    }
    if (idx >= disk.length) {
      break;
    }
    idx += 1;
  }
  let res = 0;
  disk.forEach((value, idx) => {
    res += value * idx;
  });

  return res;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const nums = input.split("").map((x) => parseInt(x));
  let disk = [];
  let blockSize;
  nums.forEach((blockSize, idx) => {
    if (idx % 2 === 0) {
      // Here we have an actual block
      // divide idx by two to get the block's ID
      disk = disk.concat([...Array(blockSize).fill(idx / 2)]);
    } else {
      // Here we have empty space
      disk = disk.concat([...Array(blockSize).fill(-1)]);
    }
  });
  for (let fileIdx = disk[disk.length - 1]; fileIdx >= 0; fileIdx--) {
    let blockSize = findBlockLength(disk, fileIdx);
    let blockIdx = disk.findIndex((el) => el == fileIdx);
    let move = getEmptyBlockIdx(disk, blockSize);

    if (move !== -1 && move < blockIdx) {
      for (let i = 0; i < blockSize; i++) {
        disk[move + i] = fileIdx;
        disk[blockIdx + i] = -1;
      }
    }
  }
  let res = 0;
  disk.forEach((value, idx) => {
    if (value !== -1) {
      res += value * idx;
    }
  });

  return res;
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
