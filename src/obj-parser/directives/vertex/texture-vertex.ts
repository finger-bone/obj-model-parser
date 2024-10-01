import type { ObjDirective } from "@/obj-parser/directives/base";
import type { Handler } from "@/handler/handler";
import { tokenize } from "@/tokenize";

export interface TextureVertex extends ObjDirective {
    type: "vt";
    u: number;
    v: number;
    w: number | undefined;
}

export function isTextureVertex(directive: ObjDirective): directive is TextureVertex {
    return directive.type === "vt";
}

export class TextureVertexHandler implements Handler<TextureVertex> {
    canHandle(request: string[], lineIndex: number): boolean {
        return tokenize(request[lineIndex])[0] === "vt";
    }

    handle(request: string[], lineIndex: number): [TextureVertex, number] {
        const [_, u, v, w] = tokenize(request[lineIndex]);
        return [{ type: "vt", u: parseFloat(u), v: parseFloat(v), w: w ? parseFloat(w) : undefined }, lineIndex + 1];
    }
}