import type { Handler } from "@/handler/handler";
import type { ObjDirective } from "@/obj-parser/directives/base";
import { tokenize } from "@/tokenize";

export interface UseMaterial extends ObjDirective {
  type: "usemtl";
  name: string;
}

export function isUseMaterial(directive: ObjDirective): directive is UseMaterial {
  return directive.type === "usemtl";
}

export class UseMaterialHandler implements Handler<UseMaterial> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "usemtl";
  }

  handle(request: string[], lineIndex: number): [UseMaterial, number] {
    const [_, name] = tokenize(request[lineIndex]);
    return [{
      type: "usemtl",
      name,
    }, lineIndex + 1];
  }
}
