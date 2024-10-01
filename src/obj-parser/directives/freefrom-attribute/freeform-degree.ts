import type { ObjDirective } from "@/obj-parser/directives/base";
import type { Handler } from "@/handler/handler";
import { tokenize } from "@/tokenize";

export interface FreeformDegree extends ObjDirective {
    type: "deg";
    u: number;
    v: number | undefined;
}

export function isFreeformDegree(directive: ObjDirective): directive is FreeformDegree {
    return directive.type === "deg";
}

export class FreeformDegreeHandler implements Handler<FreeformDegree> {
    canHandle(request: string[], lineIndex: number): boolean {
        return tokenize(request[lineIndex])[0] === "deg";
    }

    handle(request: string[], lineIndex: number): [FreeformDegree, number] {
        const [_, u, v] = tokenize(request[lineIndex]);
        return [{ type: "deg", u: parseFloat(u), v: v ? parseFloat(v) : undefined }, lineIndex + 1];
    }
}