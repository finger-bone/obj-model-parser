import type { ObjDirective } from "@/obj-parser/directives/base";
import type { Handler } from "@/handler/handler";
import { tokenize } from "@/tokenize";

export interface MapLibraries extends ObjDirective {
    type: "maplib";
    libraries: string[];
}

export function isMapLibraries(directive: ObjDirective): directive is MapLibraries {
    return directive.type === "maplib";
}

export class MapLibrariesHandler implements Handler<MapLibraries> {
    canHandle(request: string[], lineIndex: number): boolean {
        return tokenize(request[lineIndex])[0] === "maplib";
    }

    handle(request: string[], lineIndex: number): [MapLibraries, number] {
        const [_, ...libraries] = tokenize(request[lineIndex]);
        return [{ type: "maplib", libraries }, lineIndex + 1];
    }
}