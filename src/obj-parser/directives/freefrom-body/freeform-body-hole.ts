import type { Handler } from "src/handler/handler";
import type { ObjDirective } from "src/obj-parser/directives/base";
import { tokenize } from "src/tokenize";

export interface FreeformBodyHole extends ObjDirective {
  type: "hole";
  holes: {
    u0: number;
    u1: number;
    curv2d: number;
  }[];
}

export function isFreeformBodyHole(directive: ObjDirective): directive is FreeformBodyHole {
  return directive.type === "hole";
}

export class FreeformBodyHoleHandler implements Handler<FreeformBodyHole> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "hole";
  }

  handle(request: string[], lineIndex: number): [FreeformBodyHole, number] {
    const [_, ...holes] = tokenize(request[lineIndex]);
    const u0s = holes.filter((_, i) => i % 3 === 0);
    const u1s = holes.filter((_, i) => i % 3 === 1);
    const curv2ds = holes.filter((_, i) => i % 3 === 2);
    return [{
      type: "hole",
      holes: u0s.map((_, i) => ({ u0: parseFloat(u0s[i]), u1: parseFloat(u1s[i]), curv2d: parseFloat(curv2ds[i]) })),
    }, lineIndex + 1];
  }
}
