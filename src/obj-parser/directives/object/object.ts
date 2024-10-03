import type { Handler } from "src/handler/handler";
import type { ObjDirective } from "src/obj-parser/directives/base";
import { tokenize } from "src/tokenize";

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
