import type { ObjDirective } from "@/obj-parser/directives/base";
import type { Handler } from "@/handler/handler";
import { tokenize } from "@/tokenize";

export interface Polygon extends ObjDirective {
    type: "p";
    v: number[];
}

export function isPolygon(directive: ObjDirective): directive is Polygon {
    return directive.type === "p";
}

export class PolygonHandler implements Handler<Polygon> {
    canHandle(request: string[], lineIndex: number): boolean {
        return tokenize(request[lineIndex])[0] === "p";
    }

    handle(request: string[], lineIndex: number): [Polygon, number] {
        const [_, ...vIndices] = tokenize(request[lineIndex]);
        return [{ type: "p", v: vIndices.map(vIndex => parseInt(vIndex)) }, lineIndex + 1];
    }
}
