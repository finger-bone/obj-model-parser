import type { Handler } from "@/handler/handler";
import type { ObjDirective } from "@/obj-parser/directives/base";
import { tokenize } from "@/tokenize";

export interface Line extends ObjDirective {
  type: "l";
  v: number[];
  vt: number[] | undefined;
}

export function isLine(directive: ObjDirective): directive is Line {
  return directive.type === "l";
}

export class LineHandler implements Handler<Line> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "l";
  }

  handle(request: string[], lineIndex: number): [Line, number] {
    const [_, ...vIndices] = tokenize(request[lineIndex]);
    const vtIndices = vIndices.map(vIndex => {
      const [vIndexStr, vtIndexStr] = vIndex.split("/");
      return vtIndexStr ? parseInt(vtIndexStr) : undefined;
    });
    return [{
      type: "l",
      v: vIndices.map(vIndex => parseInt(vIndex)),
      vt: vIndices[0] === undefined ? undefined : vtIndices as number[],
    }, lineIndex + 1];
  }
}
