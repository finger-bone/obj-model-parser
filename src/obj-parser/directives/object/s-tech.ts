import { NoHandlerError } from "src/handler/no-handler";
import type { Handler } from "src/handler/handler";
import type { ObjDirective } from "src/obj-parser/directives/base";
import { tokenize } from "src/tokenize";


export interface STech extends ObjDirective {
  type: "stech";
  sTechType: "cparma" | "cparmb" | "cspace" | "curv";
  ures: number | undefined;
  vres: number | undefined;
  uvres: number | undefined;
  maxLength: number | undefined;
  maxDist: number | undefined;
  maxAngle: number | undefined;
}

export function isSTech(directive: ObjDirective): directive is STech {
  return directive.type === "stech";
}

export class STechHandler implements Handler<STech> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "stech";
  }

  handle(request: string[], lineIndex: number): [STech, number] {
    const [_, sTechType, ...values] = tokenize(request[lineIndex]);
    if (sTechType === "cparma") {
      const [ures, vres] = values;
      return [{
        type: "stech",
        sTechType,
        ures: parseInt(ures),
        vres: parseInt(vres),
        uvres: undefined,
        maxLength: undefined,
        maxDist: undefined,
        maxAngle: undefined,
      }, lineIndex + 1];
    } else if (sTechType === "cparmb") {
      const [uvres] = values;
      return [{
        type: "stech",
        sTechType,
        ures: undefined,
        vres: undefined,
        uvres: parseInt(uvres),
        maxLength: undefined,
        maxDist: undefined,
        maxAngle: undefined,
      }, lineIndex + 1];
    } else if (sTechType === "cspace") {
      const [maxLength] = values;
      return [{
        type: "stech",
        sTechType,
        ures: undefined,
        vres: undefined,
        uvres: undefined,
        maxLength: parseFloat(maxLength),
        maxDist: undefined,
        maxAngle: undefined,
      }, lineIndex + 1];
    } else if (sTechType === "curv") {
      const [maxDist, maxAngle] = values;
      return [{
        type: "stech",
        sTechType,
        ures: undefined,
        vres: undefined,
        uvres: undefined,
        maxLength: undefined,
        maxDist: parseFloat(maxDist),
        maxAngle: parseFloat(maxAngle),
      }, lineIndex + 1];
    }
    throw new NoHandlerError(request[lineIndex]);
  }
}
