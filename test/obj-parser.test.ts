import { expect, test } from "bun:test";

import parseDirectives from "src/obj-parser/directives-parser";

test("parse simple", () => {
  const obj = `
        v 1 2 3
        vt 4 5
        vn 6 7 8
        vp 9 10 11
        l 1 2 3 4
        f 1 2 3 4
    `;
  console.log(parseDirectives(obj));
});

import { promises as fs } from "fs";
import * as path from "path";
import parseObj from "src/exporter";

test("parse bird", async () => {
  const filePath = path.join(__dirname, "bird", "12213_Bird_v1_l3.obj");
  const obj = await fs.readFile(filePath, "utf-8");
  console.log(parseObj(obj).objects[0].groups[0].componentsChunks[0].polygons);
});

test("parse tree", async () => {
  const filePath = path.join(__dirname, "Tree1", "Tree1.obj");
  const obj = await fs.readFile(filePath, "utf-8");
  console.log(parseObj(obj));
});
