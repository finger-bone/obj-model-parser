import type { ObjDirective } from "@/obj-parser/directives/base";
import type { Handler } from "@/handler/handler";
import { tokenize } from "@/tokenize";

export interface SmoothingGroup extends ObjDirective {
    type: "s";
    groupNumber: number;
}

export function isSmoothingGroup(directive: ObjDirective): directive is SmoothingGroup {
    return directive.type === "s";
}

export class SmoothingGroupHandler implements Handler<SmoothingGroup> {
    canHandle(request: string[], lineIndex: number): boolean {
        return tokenize(request[lineIndex])[0] === "s";
    }

    handle(request: string[], lineIndex: number): [SmoothingGroup, number] {
        const [_, group] = tokenize(request[lineIndex]);
        return [{ type: "s", groupNumber: parseInt(group) }, lineIndex + 1];
    }
}