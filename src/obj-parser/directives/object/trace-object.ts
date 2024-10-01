import type { ObjDirective } from "@/obj-parser/directives/base";
import type { Handler } from "@/handler/handler";
import { tokenize } from "@/tokenize";

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
