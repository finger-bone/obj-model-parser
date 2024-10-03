import type { Handler } from "src/handler/handler";
import type { ObjDirective } from "src/obj-parser/directives/base";
import { tokenize } from "src/tokenize";

export interface FreeformBodyParam extends ObjDirective {
  type: "parm";
  uOrV: "u" | "v";
  params: number[];
}

export function isFreeformBodyParam(directive: ObjDirective): directive is FreeformBodyParam {
  return directive.type === "parm";
}

export class FreeformBodyParamHandler implements Handler<FreeformBodyParam> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "parm";
  }

  handle(request: string[], lineIndex: number): [FreeformBodyParam, number] {
    const [_, uOrV, ...params] = tokenize(request[lineIndex]);
    return [{ type: "parm", uOrV: uOrV as "u" | "v", params: params.map(parseFloat) }, lineIndex + 1];
  }
}
