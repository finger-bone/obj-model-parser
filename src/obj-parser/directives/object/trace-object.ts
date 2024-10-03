import type { Handler } from "src/handler/handler";
import type { ObjDirective } from "src/obj-parser/directives/base";
import { tokenize } from "src/tokenize";

export interface TraceObject extends ObjDirective {
  type: "trace_obj";
  filename: string;
}

export function isTraceObject(directive: ObjDirective): directive is TraceObject {
  return directive.type === "trace_obj";
}

export class TraceObjectHandler implements Handler<TraceObject> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "trace_obj";
  }

  handle(request: string[], lineIndex: number): [TraceObject, number] {
    const [_, filename] = tokenize(request[lineIndex]);
    return [{ type: "trace_obj", filename }, lineIndex + 1];
  }
}
