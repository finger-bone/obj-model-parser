import type { Handler } from "@/handler/handler";
import type { ObjDirective } from "@/obj-parser/directives/base";
import { tokenize } from "@/tokenize";

export interface ParameterSpaceVertex extends ObjDirective {
  type: "vp";
  u: number;
  v: number;
  w: number | undefined;
}

export function isParameterSpaceVertex(directive: ObjDirective): directive is ParameterSpaceVertex {
  return directive.type === "vp";
}

export class ParameterSpaceVertexHandler implements Handler<ParameterSpaceVertex> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "vp";
  }

  handle(request: string[], lineIndex: number): [ParameterSpaceVertex, number] {
    const [_, u, v, w] = tokenize(request[lineIndex]);
    return [{ type: "vp", u: parseFloat(u), v: parseFloat(v), w: w ? parseFloat(w) : undefined }, lineIndex + 1];
  }
}
