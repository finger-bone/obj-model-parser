import type { Handler } from "src/handler/handler";
import type { ObjDirective } from "src/obj-parser/directives/base";
import { tokenize } from "src/tokenize";

export interface Curve extends ObjDirective {
  type: "curv";
  u0: number;
  u1: number;
  v: number[];
}

export function isCurve(directive: ObjDirective): directive is Curve {
  return directive.type === "curv";
}

export class CurveHandler implements Handler<Curve> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "curv";
  }

  handle(request: string[], lineIndex: number): [Curve, number] {
    const [_, u0, u1, ...v] = tokenize(request[lineIndex]);
    return [{ type: "curv", u0: parseFloat(u0), u1: parseFloat(u1), v: v.map(parseFloat) }, lineIndex + 1];
  }
}
