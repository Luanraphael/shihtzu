import { test } from "node:test";
import assert from "node:assert/strict";

// Same algorithm as `toggleWithExclusive` in src/components/steps/Choice.tsx (kept import-free so
// the test runs without a JSX toolchain); the component file is checked to contain it verbatim.
import { readFileSync } from "node:fs";

function toggleWithExclusive<V extends string>(list: V[], v: V, exclusive: V[] = []): V[] {
  if (list.includes(v)) return list.filter((x) => x !== v);
  if (exclusive.includes(v)) return [v];
  return [...list.filter((x) => !exclusive.includes(x)), v];
}

test("component uses the tested exclusivity algorithm", () => {
  const src = readFileSync(new URL("../src/components/steps/Choice.tsx", import.meta.url), "utf8");
  assert.ok(src.includes("if (exclusive.includes(v)) return [v];"));
  assert.ok(src.includes("return [...list.filter((x) => !exclusive.includes(x)), v];"));
});

test("exclusive option clears the others and vice-versa", () => {
  assert.deepEqual(toggleWithExclusive(["night", "alone"], "ok", ["ok"]), ["ok"]);
  assert.deepEqual(toggleWithExclusive(["ok"], "night", ["ok"]), ["night"]);
  assert.deepEqual(toggleWithExclusive(["night"], "night", ["ok"]), []);
  assert.deepEqual(toggleWithExclusive(["a"], "b"), ["a", "b"]);
});
