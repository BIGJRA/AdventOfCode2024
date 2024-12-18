import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

class MinHeap {
  constructor() {
    this.heap = [];
  }

  push([state, dist]) {
    this.heap.push([state, dist]);
    this._bubbleUp();
  }

  pop() {
    if (this.size() === 1) return this.heap.pop();
    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._bubbleDown();
    return min;
  }

  _bubbleUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index][1] >= this.heap[parentIndex][1]) break;
      [this.heap[index], this.heap[parentIndex]] = [
        this.heap[parentIndex],
        this.heap[index],
      ];
      index = parentIndex;
    }
  }

  _bubbleDown() {
    let index = 0;
    const length = this.heap.length;
    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let smallest = index;

      if (
        leftChild < length &&
        this.heap[leftChild][1] < this.heap[smallest][1]
      ) {
        smallest = leftChild;
      }
      if (
        rightChild < length &&
        this.heap[rightChild][1] < this.heap[smallest][1]
      ) {
        smallest = rightChild;
      }
      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [
        this.heap[smallest],
        this.heap[index],
      ];
      index = smallest;
    }
  }

  size() {
    return this.heap.length;
  }
}

const solve = (input, part2 = false) => {
  let R = 71;
  let C = 71;

  const start = [0, 0];
  const end = [C - 1, R - 1];
  const dirs = [
    [1, 0],
    [0, -1],
    [-1, 0],
    [0, 1],
  ];

  const bytes = input
    .split("\n")
    .map((x) => x.split(",").map((y) => parseInt(y)));

  const djikstra = (numBytes) => {
    const walls = new Set(bytes.slice(0, numBytes).map((x) => x.join(",")));

    const isPassable = (x, y) => {
      return !walls.has(`${x},${y}`);
    };

    const heap = new MinHeap();
    const distances = new Map();
    const visited = new Set();

    for (let y = 0; y < R; y++) {
      for (let x = 0; x < C; x++) {
        if (!isPassable(x, y)) continue;
        distances.set(`${x},${y}`, Infinity);
      }
    }

    const startState = `${start[0]},${start[1]}`;
    distances.set(startState, 0);
    heap.push([startState, 0]);

    while (heap.size() > 0) {
      const [currentState, currentDist] = heap.pop();

      if (visited.has(currentState)) continue;
      visited.add(currentState);

      const [cx, cy] = currentState.split(",").map(Number);

      for (const [dx, dy] of dirs) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (isPassable(nx, ny)) {
          const nextState = [nx, ny].join(",");
          if (nextState == end.join(",")) {
            return currentDist + 1;
          }

          const currentBestDist = distances.get(nextState);

          if (currentDist + 1 < currentBestDist) {
            distances.set(nextState, currentDist + 1);
            heap.push([nextState, currentDist + 1]);
          }
        }
      }
    }

    return distances.get(end.join(",")); // We only reach here if end was not found, so it will still be Infinity
  };
  if (!part2) {
    return djikstra(1024);
  }

  // Simple binary search
  let lo = 0;
  let hi = bytes.length;
  let mi;

  while (lo < hi) {
    mi = Math.trunc(lo + (hi - lo) / 2);
    if (djikstra(mi + 1) === Infinity) {
      // The byte at index n is the n + 1'th byte, so we pass mi + 1 to the function
      hi = mi;
    } else {
      lo = mi + 1;
    }
  }
  // Binary quits when the first index that causes failure is set to lo
  return bytes[lo].join(",");
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
    tests: [],
    solution: part1,
  },
  part2: {
    tests: [],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
