import type { ObjDirective } from "@/obj-parser/directives/base";
import type { Handler } from "@/handler/handler";
import { tokenize } from "@/tokenize";

export interface Bevel extends ObjDirective {
    type: "bevel";
    on: boolean;
}

export function isBevel(directive: ObjDirective): directive is Bevel {
    return directive.type === "bevel";
}

export class BevelHandler implements Handler<Bevel> {
    canHandle(request: string[], lineIndex: number): boolean {
        return tokenize(request[lineIndex])[0] === "bevel";
    }

    handle(request: string[], lineIndex: number): [Bevel, number] {
        const [_, on] = tokenize(request[lineIndex]);
        return [{ type: "bevel", on: on === "on" }, lineIndex + 1];
    }
}