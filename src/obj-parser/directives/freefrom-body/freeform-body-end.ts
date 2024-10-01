import type { ObjDirective } from "@/obj-parser/directives/base";
import type { Handler } from "@/handler/handler";
import { tokenize } from "@/tokenize";

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
