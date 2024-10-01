import type { Handler } from "@/handler/handler";
import type { ObjDirective } from "@/obj-parser/directives/base";
import { tokenize } from "@/tokenize";

export interface GeometricVertex extends ObjDirective {
  type: "v";
  x: number;
  y: number;
  z: number;
  w: number | undefined;
}

export function isGeometricVertex(directive: ObjDirective): directive is GeometricVertex {
  return directive.type === "v";
}

export class GeometricVertexHandler implements Handler<GeometricVertex> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "v";
  }

  handle(request: string[], lineIndex: number): [GeometricVertex, number] {
    const [_, x, y, z, w] = tokenize(request[lineIndex]);
    return [
      { type: "v", x: parseFloat(x), y: parseFloat(y), z: parseFloat(z), w: w ? parseFloat(w) : undefined },
      lineIndex + 1,
    ];
  }
}
