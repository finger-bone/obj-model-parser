import type { ObjDirective } from "@/obj-parser/directives/base";
import type { Handler } from "@/handler/handler";
import { tokenize } from "@/tokenize";

export interface Face extends ObjDirective {
    type: "f";
    v: number[];
    vt: number[] | undefined;
    vn: number[] | undefined;
}

export function isFace(directive: ObjDirective): directive is Face {
    return directive.type === "f";
}

export class FaceHandler implements Handler<Face> {
    canHandle(request: string[], lineIndex: number): boolean {
        return tokenize(request[lineIndex])[0] === "f";
    }

    handle(request: string[], lineIndex: number): [Face, number] {
        const [_, ...vertices] = tokenize(request[lineIndex]);
        const vtIndices = vertices.map(vIndex => {
            const [vIndexStr, vtIndexStr] = vIndex.split("/");
            return vtIndexStr ? parseInt(vtIndexStr) : undefined;
        });
        const vnIndices = vertices.map(vIndex => {
            const [vIndexStr, vtIndexStr, vnIndexStr] = vIndex.split("/");
            return vnIndexStr ? parseInt(vnIndexStr) : undefined;
        });
        return [{
            type: "f",
            v: vertices.map(vIndex => parseInt(vIndex)),
            vt: vertices[0] === undefined ? undefined : vtIndices as number[],
            vn: vertices[0] === undefined ? undefined : vnIndices as number[]
        }, lineIndex + 1];
    }
}