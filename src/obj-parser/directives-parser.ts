import type { Handler } from "@/handler/handler";
import { NoHandlerError } from "@/handler/no-handler";
import type { ObjDirective } from "@/obj-parser/directives/base";
import * as directives from "@/obj-parser/directives/base";

const handlers: Handler<ObjDirective>[] = [
  new directives.GeometricVertexHandler(),
  new directives.VertexNormalHandler(),
  new directives.ParameterSpaceVertexHandler(),
  new directives.TextureVertexHandler(),
  new directives.PolygonHandler(),
  new directives.LineHandler(),
  new directives.FaceHandler(),
  new directives.Curve2dHandler(),
  new directives.CurveHandler(),
  new directives.SurfaceHandler(),
  new directives.FreeformBmatHandler(),
  new directives.FreeformDegreeHandler(),
  new directives.FreeformStepHandler(),
  new directives.FreeformTypeHandler(),
  new directives.FreeformBodyEndHandler(),
  new directives.FreeformBodyHoleHandler(),
  new directives.FreeformBodyParamHandler(),
  new directives.FreeformBodyScrvHandler(),
  new directives.FreeformBodySpHandler(),
  new directives.FreeformBodyTrimHandler(),
  new directives.ConnectionHandler(),
  new directives.GroupHandler(),
  new directives.MergingGroupHandler(),
  new directives.SmoothingGroupHandler(),
  new directives.BevelHandler(),
  new directives.CInterpHandler(),
  new directives.CTechHandler(),
  new directives.DInterpHandler(),
  new directives.LodHandler(),
  new directives.MapLibrariesHandler(),
  new directives.MaterialLibrariesHandler(),
  new directives.ObjectHandler(),
  new directives.STechHandler(),
  new directives.ShadowObjectHandler(),
  new directives.TraceObjectHandler(),
  new directives.UseMapHandler(),
  new directives.UseMaterialHandler(),
];

function parseEachDirective(request: string[], lineIndex: number): [ObjDirective, number] {
  for (const handler of handlers) {
    if (handler.canHandle(request, lineIndex)) {
      const [component, newIndex] = handler.handle(request, lineIndex);
      return [component, newIndex];
    }
  }
  throw new NoHandlerError(request[lineIndex]);
}

function removeEmptyLinesAndComments(lines: string[]): string[] {
  return lines.filter((line) => line.trim() !== "").filter((line) => !line.includes("#"));
}

function SquashSpaces(str: string): string {
  return str.replace(/\s+/g, " ");
}

export default function parseDirectives(obj: string): ObjDirective[] {
  const lines = removeEmptyLinesAndComments(obj.split("\n")).map((line) => line.trim()).map(SquashSpaces);
  let lineIndex = 0;
  const components: ObjDirective[] = [];
  while (lineIndex < lines.length) {
    const [component, newIndex] = parseEachDirective(lines, lineIndex);
    components.push(component);
    lineIndex = newIndex;
  }
  return components;
}
