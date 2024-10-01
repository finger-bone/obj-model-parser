import type { ObjDirective } from "@/obj-parser/directives/base";
import type { Handler } from "@/handler/handler";
import { tokenize } from "@/tokenize";

export interface MergingGroup extends ObjDirective {
    type: "mg";
    groupNumber: number;
    groupNames: string[];
}

export function isMergingGroup(directive: ObjDirective): directive is MergingGroup {
    return directive.type === "mg";
}

export class MergingGroupHandler implements Handler<MergingGroup> {
    canHandle(request: string[], lineIndex: number): boolean {
        return tokenize(request[lineIndex])[0] === "mg";
    }

    handle(request: string[], lineIndex: number): [MergingGroup, number] {
        const [_, group, ...names] = tokenize(request[lineIndex]);
        return [{ type: "mg", groupNumber: parseInt(group), groupNames: names }, lineIndex + 1];
    }
}