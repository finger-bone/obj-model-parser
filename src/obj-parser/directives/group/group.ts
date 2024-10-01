import type { ObjDirective } from "@/obj-parser/directives/base";
import type { Handler } from "@/handler/handler";
import { tokenize } from "@/tokenize";

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