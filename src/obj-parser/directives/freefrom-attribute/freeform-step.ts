import type { Handler } from "@/handler/handler";
import type { ObjDirective } from "@/obj-parser/directives/base";
import { tokenize } from "@/tokenize";

export interface FreeformStep extends ObjDirective {
  type: "step";
  u: number;
  v: number | undefined;
}

export function isFreeformStep(directive: ObjDirective): directive is FreeformStep {
  return directive.type === "step";
}

export class FreeformStepHandler implements Handler<FreeformStep> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "step";
  }

  handle(request: string[], lineIndex: number): [FreeformStep, number] {
    const [_, u, v] = tokenize(request[lineIndex]);
    return [{ type: "step", u: parseFloat(u), v: v ? parseFloat(v) : undefined }, lineIndex + 1];
  }
}
