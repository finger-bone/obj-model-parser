import type { Handler } from "src/handler/handler";
import type { ObjDirective } from "src/obj-parser/directives/base";
import { tokenize } from "src/tokenize";

export interface Curve2d extends ObjDirective {
  type: "curv2";
  vp: number[];
}

export function isCurve2d(directive: ObjDirective): directive is Curve2d {
  return directive.type === "curv2";
}

export class Curve2dHandler implements Handler<Curve2d> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "curv2";
  }

  handle(request: string[], lineIndex: number): [Curve2d, number] {
    const [_, ...vp] = tokenize(request[lineIndex]);
    return [{ type: "curv2", vp: vp.map(parseFloat) }, lineIndex + 1];
  }
}
