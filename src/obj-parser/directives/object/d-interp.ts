import type { Handler } from "src/handler/handler";
import type { ObjDirective } from "src/obj-parser/directives/base";
import { tokenize } from "src/tokenize";

export interface DInterp extends ObjDirective {
  type: "d_interp";
  on: boolean;
}

export function isDInterp(directive: ObjDirective): directive is DInterp {
  return directive.type === "d_interp";
}

export class DInterpHandler implements Handler<DInterp> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "d_interp";
  }

  handle(request: string[], lineIndex: number): [DInterp, number] {
    const [_, on] = tokenize(request[lineIndex]);
    return [{ type: "d_interp", on: on === "on" }, lineIndex + 1];
  }
}
