import type { Handler } from "@/handler/handler";
import type { ObjDirective } from "@/obj-parser/directives/base";
import { tokenize } from "@/tokenize";

export interface ShadowObject extends ObjDirective {
  type: "shadow_obj";
  filename: string;
}

export function isShadowObject(directive: ObjDirective): directive is ShadowObject {
  return directive.type === "shadow_obj";
}

export class ShadowObjectHandler implements Handler<ShadowObject> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "shadow_obj";
  }

  handle(request: string[], lineIndex: number): [ShadowObject, number] {
    const [_, filename] = tokenize(request[lineIndex]);
    return [{ type: "shadow_obj", filename }, lineIndex + 1];
  }
}
