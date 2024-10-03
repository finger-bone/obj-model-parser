import type { Handler } from "src/handler/handler";
import type { ObjDirective } from "src/obj-parser/directives/base";
import { tokenize } from "src/tokenize";

export interface UseMap extends ObjDirective {
  type: "usemap";
  off: boolean;
  name: string;
}

export function isUseMap(directive: ObjDirective): directive is UseMap {
  return directive.type === "usemap";
}

export class UseMapHandler implements Handler<UseMap> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "usemap";
  }

  handle(request: string[], lineIndex: number): [UseMap, number] {
    const [_, name] = tokenize(request[lineIndex]);
    if (name === "off") {
      return [{ type: "usemap", off: true, name: "" }, lineIndex + 1];
    }
    return [{ type: "usemap", off: false, name: name }, lineIndex + 1];
  }
}
