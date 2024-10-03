import type { Handler } from "src/handler/handler";
import type { ObjDirective } from "src/obj-parser/directives/base";
import { tokenize } from "src/tokenize";

export interface Group extends ObjDirective {
  type: "g";
  groupNames: string[];
}

export function isGroup(directive: ObjDirective): directive is Group {
  return directive.type === "g";
}

export class GroupHandler implements Handler<Group> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "g";
  }

  handle(request: string[], lineIndex: number): [Group, number] {
    const [_, ...names] = tokenize(request[lineIndex]);
    return [{ type: "g", groupNames: names }, lineIndex + 1];
  }
}
