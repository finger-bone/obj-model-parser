import type { Handler } from "@/handler/handler";
import type { ObjDirective } from "@/obj-parser/directives/base";
import { tokenize } from "@/tokenize";

export interface Lod extends ObjDirective {
  type: "lod";
  level: number;
}

export function isLod(directive: ObjDirective): directive is Lod {
  return directive.type === "lod";
}

export class LodHandler implements Handler<Lod> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "lod";
  }

  handle(request: string[], lineIndex: number): [Lod, number] {
    const [_, level] = tokenize(request[lineIndex]);
    return [{ type: "lod", level: parseInt(level) }, lineIndex + 1];
  }
}
