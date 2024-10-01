import type { ObjDirective } from "@/obj-parser/directives/base";
import type { Handler } from "@/handler/handler";
import { tokenize } from "@/tokenize";

export interface FreeformBodySp extends ObjDirective {
    type: "sp";
    vp1: number;
    vps: number[];
}

export function isFreeformBodySp(directive: ObjDirective): directive is FreeformBodySp {
    return directive.type === "sp";
}

export class FreeformBodySpHandler implements Handler<FreeformBodySp> {
    canHandle(request: string[], lineIndex: number): boolean {
        return tokenize(request[lineIndex])[0] === "sp";
    }

    handle(request: string[], lineIndex: number): [FreeformBodySp, number] {
        const [_, vp1, ...vps] = tokenize(request[lineIndex]);
        return [{ type: "sp", vp1: parseFloat(vp1), vps: vps.map(parseFloat) }, lineIndex + 1];
    }
}