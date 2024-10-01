import type { Handler } from "@/handler/handler";
import type { ObjDirective } from "@/obj-parser/directives/base";
import { tokenize } from "@/tokenize";

export interface Object extends ObjDirective {
  type: "o";
  name: string;
}

export function isObject(directive: ObjDirective): directive is Object {
  return directive.type === "o";
}

export class ObjectHandler implements Handler<Object> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "o";
  }

  handle(request: string[], lineIndex: number): [Object, number] {
    const [_, name] = tokenize(request[lineIndex]);
    return [{ type: "o", name }, lineIndex + 1];
  }
}
