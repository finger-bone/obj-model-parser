import type { ObjDirective } from "@/obj-parser/directives/base";
import type { Handler } from "@/handler/handler";
import { tokenize } from "@/tokenize";

export interface FreeformBodyTrim extends ObjDirective {
    type: "trim";
    trims: {
        u0: number;
        u1: number;
        curv2d: number;
    }[];
};

export function isFreeformBodyTrim(directive: ObjDirective): directive is FreeformBodyTrim {
    return directive.type === "trim";
}

export class FreeformBodyTrimHandler implements Handler<FreeformBodyTrim> {
    canHandle(request: string[], lineIndex: number): boolean {
        return tokenize(request[lineIndex])[0] === "trim";
    }

    handle(request: string[], lineIndex: number): [FreeformBodyTrim, number] {
        const [_, ...trims] = tokenize(request[lineIndex]);
        const u0s = trims.filter((_, i) => i % 3 === 0);
        const u1s = trims.filter((_, i) => i % 3 === 1);
        const curv2ds = trims.filter((_, i) => i % 3 === 2);
        return [{ type: "trim", trims: u0s.map((_, i) => ({ u0: parseFloat(u0s[i]), u1: parseFloat(u1s[i]), curv2d: parseFloat(curv2ds[i]) })) }, lineIndex + 1];
    }
}