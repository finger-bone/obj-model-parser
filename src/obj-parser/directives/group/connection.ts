import type { Handler } from "@/handler/handler";
import type { ObjDirective } from "@/obj-parser/directives/base";
import { tokenize } from "@/tokenize";

export interface Connection extends ObjDirective {
  type: "con";
  connections: {
    surf: number;
    q0: number;
    q1: number;
    curv2d: number;
  }[];
}

export function isConnection(directive: ObjDirective): directive is Connection {
  return directive.type === "con";
}

export class ConnectionHandler implements Handler<Connection> {
  canHandle(request: string[], lineIndex: number): boolean {
    return tokenize(request[lineIndex])[0] === "con";
  }

  handle(request: string[], lineIndex: number): [Connection, number] {
    const [_, ...connections] = tokenize(request[lineIndex]);
    const surfs = connections.filter((_, i) => i % 4 === 0).map(parseInt);
    const q0s = connections.filter((_, i) => i % 4 === 1).map(parseFloat);
    const q1s = connections.filter((_, i) => i % 4 === 2).map(parseFloat);
    const curv2ds = connections.filter((_, i) => i % 4 === 3).map(parseInt);
    return [{
      type: "con",
      connections: surfs.map((_, i) => ({ surf: surfs[i], q0: q0s[i], q1: q1s[i], curv2d: curv2ds[i] })),
    }, lineIndex + 1];
  }
}
