import type { Handler } from "@/handler/handler";
import type { ObjDirective } from "@/obj-parser/directives/base";
import { tokenize } from "@/tokenize";

export interface FreeformType extends ObjDirective {
  type: "cstype";
  rational: boolean | undefined;
  freeformType: "bmatrix" | "bspline" | "cardinal" | "bezier" | "taylor";
}

export function isFreeformType(directive: ObjDirective): directive is FreeformType {
  return directive.type === "cstype";
}

export class FreeformTypeHandler implements Handler<FreeformType> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "cstype";
  }

  handle(request: string[], lineIndex: number): [FreeformType, number] {
    const tokens = tokenize(request[lineIndex]);
    const freeformType = tokens[tokens.length - 1];
    const rational = tokens.length === 3 ? tokens[1] : undefined;
    return [{
      type: "cstype",
      freeformType: freeformType as FreeformType["freeformType"],
      rational: rational === "rat",
    }, lineIndex + 1];
  }
}
