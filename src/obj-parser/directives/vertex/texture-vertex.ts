import type { Handler } from "src/handler/handler";
import type { ObjDirective } from "src/obj-parser/directives/base";
import { tokenize } from "src/tokenize";

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
