import type { Handler } from "src/handler/handler";
import type { ObjDirective } from "src/obj-parser/directives/base";
import { tokenize } from "src/tokenize";

export interface MaterialLibraries extends ObjDirective {
  type: "matlib";
  filenames: string[];
}

export function isMaterialLibraries(directive: ObjDirective): directive is MaterialLibraries {
  return directive.type === "matlib";
}

export class MaterialLibrariesHandler implements Handler<MaterialLibraries> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "mtllib";
  }

  handle(request: string[], lineIndex: number): [MaterialLibraries, number] {
    const [_, ...filenames] = tokenize(request[lineIndex]);
    return [{ type: "matlib", filenames }, lineIndex + 1];
  }
}
