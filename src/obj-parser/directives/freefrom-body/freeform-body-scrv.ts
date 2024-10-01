import type { Handler } from "@/handler/handler";
import type { ObjDirective } from "@/obj-parser/directives/base";
import { tokenize } from "@/tokenize";

export interface FreeformBodyScrv extends ObjDirective {
  type: "scrv";
  scrvs: {
    u0: number;
    u1: number;
    curv2d: number;
  }[];
}

export function isFreeformBodyScrv(directive: ObjDirective): directive is FreeformBodyScrv {
  return directive.type === "scrv";
}

export class FreeformBodyScrvHandler implements Handler<FreeformBodyScrv> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "scrv";
  }

  handle(request: string[], lineIndex: number): [FreeformBodyScrv, number] {
    const [_, ...scrvs] = tokenize(request[lineIndex]);
    const u0s = scrvs.filter((_, i) => i % 3 === 0);
    const u1s = scrvs.filter((_, i) => i % 3 === 1);
    const curv2ds = scrvs.filter((_, i) => i % 3 === 2);
    return [{
      type: "scrv",
      scrvs: u0s.map((_, i) => ({ u0: parseFloat(u0s[i]), u1: parseFloat(u1s[i]), curv2d: parseFloat(curv2ds[i]) })),
    }, lineIndex + 1];
  }
}
