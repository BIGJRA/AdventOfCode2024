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
  const dirs = [
    [1, 0],
    [0, -1],
    [-1, 0],
    [0, 1],
  ]; // Right, Up, Left, Down

  const grid = input.split("\n");
  const isPassable = (x, y) => {
    return grid[y] && grid[y][x] && grid[y][x] !== "#";
  };

  const findStartEnd = (grid) => {
    let start = null,
      end = null;
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        if (grid[y][x] === "S") start = [x, y];
        if (grid[y][x] === "E") end = [x, y];
      }
    }
    return { start, end };
  };

  const dijkstra = (grid, start, end) => {
    const heap = new MinHeap();
    const distances = new Map(); // Distances map
    const visited = new Set(); // Visited states
    const previous = new Map(); // Tracks merged predecessors

    // Initialize distances
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        if (!isPassable(x, y)) continue;
        for (let dir = 0; dir < dirs.length; dir++) {
          distances.set(`${x},${y},${dir}`, Infinity);
        }
      }
    }

    const startState = `${start[0]},${start[1]},0`;
    distances.set(startState, 0);
    heap.push([startState, 0]);

    while (heap.size() > 0) {
      const [currentState, currentDist] = heap.pop();

      if (visited.has(currentState)) continue;
      visited.add(currentState);

      const [cx, cy, cdir] = currentState.split(",").map(Number);

      // Helper function to handle state updates
      const updateState = (nextState, newDist) => {
        const currentBestDist = distances.get(nextState);

        if (newDist < currentBestDist) {
          // If new distance is smaller, update distance and reset predecessors
          distances.set(nextState, newDist);

          // Create a new Set with all predecessors of currentState and add currentState itself
          const newSet = new Set(previous.get(currentState));
          newSet.add(currentState.slice(0, currentState.length - 2));
          newSet.add(nextState.slice(0, nextState.length - 2));

          previous.set(nextState, newSet);

          heap.push([nextState, newDist]);
        } else if (newDist === currentBestDist) {
          // If distance is the same, merge predecessors
          const prevSet = previous.get(nextState);
          const currentSet = new Set(previous.get(currentState));
          currentSet.add(currentState.slice(0, currentState.length - 2)); // Include currentState itself in its own predecessor chain

          // Merge the currentSet into prevSet
          for (const state of currentSet) {
            prevSet.add(state);
          }

          heap.push([nextState, newDist]);
        }
      };

      // Turn CCW
      let nextState = [cx, cy, (((cdir + 1) % 4) + 4) % 4].join(",");
      updateState(nextState, currentDist + 1000);

      // Turn CW
      nextState = [cx, cy, (((cdir - 1) % 4) + 4) % 4].join(",");
      updateState(nextState, currentDist + 1000);

      // Move forward
      const [dx, dy] = dirs[cdir];
      const nx = cx + dx;
      const ny = cy + dy;
      if (isPassable(nx, ny)) {
        nextState = [nx, ny, cdir].join(",");
        updateState(nextState, currentDist + 1);
      }
    }

    // Find the shortest distance to the end
    const endStates = [
      `${end[0]},${end[1]},0`,
      `${end[0]},${end[1]},1`,
      `${end[0]},${end[1]},2`,
      `${end[0]},${end[1]},3`,
    ];
    const shortest = Math.min(
      ...endStates.map((state) => distances.get(state) ?? Infinity),
    );
    if (!part2) return shortest;

    let answer = new Set();
    endStates
      .filter((state) => distances.get(state) == shortest)
      .forEach((es) => {
        answer = new Set([...answer, ...previous.get(es)]);
      });
    return answer.size;
  };

  const { start, end } = findStartEnd(grid);
  return dijkstra(grid, start, end);
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
####
#.E#
#S.#
####
`,
        expected: 1002,
      },
      {
        input: `
#####
#..E#
#.#.#
#S..#
#####
`,
        expected: 1004,
      },
      {
        input: `
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
`,
        expected: 7036,
      },
      {
        input: `
#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################
`,
        expected: 11048,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
#####
#..E#
#.#.#
#S..#
#####
`,
        expected: 5,
      },
      {
        input: `
#####
###E#
#...#
#.#.#
#...#
#S###
#####
`,
        expected: 10,
      },
      {
        input: `
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
`,
        expected: 45,
      },
      {
        input: `
#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################
`,
        expected: 64,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
