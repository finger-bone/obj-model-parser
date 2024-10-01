import type { ObjDirective } from "@/obj-parser/directives/base";
import type { Handler } from "@/handler/handler";
import { tokenize } from "@/tokenize";

export interface VertexNormal extends ObjDirective {
    type: "vn";
    i: number;
    j: number;
    k: number;
}

export function isVertexNormal(directive: ObjDirective): directive is VertexNormal {
    return directive.type === "vn";
}

export class VertexNormalHandler implements Handler<VertexNormal> {
    canHandle(request: string[], lineIndex: number): boolean {
        return tokenize(request[lineIndex])[0] === "vn";
    }

    handle(request: string[], lineIndex: number): [VertexNormal, number] {
        const [_, i, j, k] = tokenize(request[lineIndex]);
        return [{ type: "vn", i: parseFloat(i), j: parseFloat(j), k: parseFloat(k) }, lineIndex + 1];
    }
}