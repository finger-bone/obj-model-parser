import type { Handler } from "src/handler/handler";
import type { ObjDirective } from "src/obj-parser/directives/base";
import { tokenize } from "src/tokenize";

export interface CInterp extends ObjDirective {
  type: "c_interp";
  on: boolean;
}

export function isCInterp(directive: ObjDirective): directive is CInterp {
  return directive.type === "c_interp";
}

export class CInterpHandler implements Handler<CInterp> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "c_interp";
  }

  handle(request: string[], lineIndex: number): [CInterp, number] {
    const [_, on] = tokenize(request[lineIndex]);
    return [{ type: "c_interp", on: on === "on" }, lineIndex + 1];
  }
}
