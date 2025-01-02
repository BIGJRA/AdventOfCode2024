import run from "aocrunner";
import { combinations } from "mathjs";

const parseInput = (rawInput) => rawInput;

const solve = (input, part2 = false) => {
  const bronKerbosch = (map) => {
    // Wikipedia algorithm goes brrrr
    const bkRecur = (R, P, X) => {
      if (P.size == 0 && X.size == 0) {
        maximalCliques.push(R);
        return;
      }
      for (const v of P) {
        const setV = new Set([v]);
        const Nv = map.get(v); // We need to intersect with neighbors of V for recursion
        bkRecur(R.union(setV), P.intersection(Nv), X.intersection(Nv));
        P = P.difference(setV);
        X = X.union(setV);
      }
    };
    const V = new Set(map.keys());
    const maximalCliques = [];

    bkRecur(new Set(), V, new Set());

    return maximalCliques;
  };

  const getCombinations = (array, k) => {
    // Recursive combination function
    if (k === 0) return [[]];
    if (array.length === 0) return [];
    const [first, ...rest] = array;
    const withFirst = getCombinations(rest, k - 1).map((combo) => [
      first,
      ...combo,
    ]);
    const withoutFirst = getCombinations(rest, k);
    return [...withFirst, ...withoutFirst];
  };

  const lines = input.split("\n");
  const map = new Map();

  for (const line of lines) {
    // Create graph
    const [l, r] = line.split("-");
    if (!map.has(l)) map.set(l, new Set());
    if (!map.has(r)) map.set(r, new Set());
    map.get(l).add(r);
    map.get(r).add(l);
  }

  const uniqueTrios = new Set();
  let bestCliqueSize = 0;
  let bestClique = "";

  for (const c of bronKerbosch(map)) {
    if (c.size < 3) continue;
    const nodes = Array.from(c);
    const trios = getCombinations(nodes, 3);

    // We simply check all the combinations of the cliques
    // as any trio is a subset of at least one maximal clique
    for (const trio of trios) {
      if (trio.some((node) => node.startsWith("t"))) {
        uniqueTrios.add(trio.sort().join(","));
      }
    }
    // bronKerbosch guarantees maximal clique size so part 2 becomes trivial
    if (c.size > bestCliqueSize) {
      bestCliqueSize = c.size;
      bestClique = c;
    }
  }
  if (!part2) return uniqueTrios.size;
  return Array.from(bestClique).sort().join(",");
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
        kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`,
        expected: 7,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`,
        expected: "co,de,ka,ta",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
