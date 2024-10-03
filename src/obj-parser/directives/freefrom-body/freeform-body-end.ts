import type { Handler } from "src/handler/handler";
import type { ObjDirective } from "src/obj-parser/directives/base";
import { tokenize } from "src/tokenize";

export interface FreeformBodyEnd extends ObjDirective {
  type: "end";
}

export function isFreeformBodyEnd(directive: ObjDirective): directive is FreeformBodyEnd {
  return directive.type === "end";
}

export class FreeformBodyEndHandler implements Handler<FreeformBodyEnd> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "end";
  }

  handle(request: string[], lineIndex: number): [FreeformBodyEnd, number] {
    return [{ type: "end" }, lineIndex + 1];
  }
}
