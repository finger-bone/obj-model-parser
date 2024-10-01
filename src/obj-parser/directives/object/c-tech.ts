import type { ObjDirective } from "@/obj-parser/directives/base";
import type { Handler } from "@/handler/handler";
import { NoHandlerError } from "@/handler/no-handler";
import { tokenize } from "@/tokenize";

export interface CTech extends ObjDirective {
    type: "ctech";
    cTechType: "cparm" | "cspace" | "curve";
    res: number | undefined;
    maxLength: number | undefined;
    maxDist: number | undefined;
    maxAngle: number | undefined;
}

export function isCTech(directive: ObjDirective): directive is CTech {
    return directive.type === "ctech";
}

export class CTechHandler implements Handler<CTech> {
    canHandle(request: string[], lineIndex: number): boolean {
        return tokenize(request[lineIndex])[0] === "ctech";
    }

    handle(request: string[], lineIndex: number): [CTech, number] {
        const [_, cTechType, ...values] = tokenize(request[lineIndex]);
        if(cTechType === "cparm") {
            const [res] = values;
            return [{
                type: "ctech",
                cTechType,
                res: parseInt(res),
                maxLength: undefined,
                maxDist: undefined,
                maxAngle: undefined
            }, lineIndex + 1];
        }
        else if(cTechType === "cspace") {
            const [maxLength] = values;
            return [{
                type: "ctech",
                cTechType,
                res: undefined,
                maxLength: parseFloat(maxLength),
                maxDist: undefined,
                maxAngle: undefined,
            }, lineIndex + 1];
        }
        else if(cTechType === "curve") {
            const [maxDist, maxAngle] = values;
            return [{
                type: "ctech",
                cTechType,
                res: undefined,
                maxLength: undefined,
                maxDist: parseFloat(maxDist),
                maxAngle: parseFloat(maxAngle),
            }, lineIndex + 1];
        }
        throw new NoHandlerError(request[lineIndex]);
    }
}