import type { Handler } from "src/handler/handler";
import type { ObjDirective } from "src/obj-parser/directives/base";
import { tokenize } from "src/tokenize";

export interface FreeformBmat extends ObjDirective {
  type: "bmat";
  uOrV: "u" | "v";
  matrix: number[][];
}

export function isFreeformBmat(directive: ObjDirective): directive is FreeformBmat {
  return directive.type === "bmat";
}

export class FreeformBmatHandler implements Handler<FreeformBmat> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "bmat";
  }

  handle(request: string[], lineIndex: number): [FreeformBmat, number] {
    const [_, uOrV, ...matrix] = tokenize(request[lineIndex]);
    const values = [matrix];
    let nextLineIndex = lineIndex + 1;
    while (!/[a-zA-Z]/.test(tokenize(request[nextLineIndex])[0])) {
      values.push(tokenize(request[nextLineIndex]).slice(1));
      nextLineIndex++;
    }
    return [{
      type: "bmat",
      uOrV: uOrV === "u" ? "u" : "v",
      matrix: values.map(row => row.map(value => parseFloat(value))),
    }, nextLineIndex];
  }
}
