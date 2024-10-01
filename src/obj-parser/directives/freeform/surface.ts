import type { ObjDirective } from "@/obj-parser/directives/base";
import type { Handler } from "@/handler/handler";
import { tokenize } from "@/tokenize";

export interface Surface extends ObjDirective {
    type: "surf";
    s0: number;
    s1: number;
    t0: number;
    t1: number;
    v: number[];
    vt: number[] | undefined;
    vn: number[] | undefined;
}

export function isSurface(directive: ObjDirective): directive is Surface {
    return directive.type === "surf";
}

export class SurfaceHandler implements Handler<Surface> {
    canHandle(request: string[], lineIndex: number): boolean {
        return tokenize(request[lineIndex])[0] === "surf";
    }

    handle(request: string[], lineIndex: number): [Surface, number] {
        const [_, s0, s1, t0, t1, ...vertices] = tokenize(request[lineIndex]);
        const v = vertices.map((vIndex) => {
            const [vIndexStr, vtIndexStr, vnIndexStr] = vIndex.split("/");
            return parseInt(vIndexStr);
        });
        const vt = vertices.map((vIndex) => {
            const [vIndexStr, vtIndexStr, vnIndexStr] = vIndex.split("/");
            return parseInt(vtIndexStr);
        });
        const vn = vertices.map((vIndex) => {
            const [vIndexStr, vtIndexStr, vnIndexStr] = vIndex.split("/");
            return parseInt(vnIndexStr);
        });
        return [{
            type: "surf",
            s0: parseFloat(s0),
            s1: parseFloat(s1),
            t0: parseFloat(t0),
            t1: parseFloat(t1),
            v,
            vt: vt[0] === undefined ? undefined : vt,
            vn: vn[0] === undefined ? undefined : vn
        }, lineIndex + 1];
    }
}
