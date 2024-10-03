import type { Handler } from "src/handler/handler";
import { NoHandlerError } from "src/handler/no-handler";
import {
  BevelHandler,
  CInterpHandler,
  ConnectionHandler,
  CTechHandler,
  Curve2dHandler,
  CurveHandler,
  DInterpHandler,
  FaceHandler,
  FreeformBmatHandler,
  FreeformBodyEndHandler,
  FreeformBodyHoleHandler,
  FreeformBodyParamHandler,
  FreeformBodyScrvHandler,
  FreeformBodySpHandler,
  FreeformBodyTrimHandler,
  FreeformDegreeHandler,
  FreeformStepHandler,
  FreeformTypeHandler,
  GeometricVertexHandler,
  GroupHandler,
  LineHandler,
  LodHandler,
  MapLibrariesHandler,
  MaterialLibrariesHandler,
  MergingGroupHandler,
  type ObjDirective,
  ObjectHandler,
  ParameterSpaceVertexHandler,
  PolygonHandler,
  ShadowObjectHandler,
  SmoothingGroupHandler,
  STechHandler,
  SurfaceHandler,
  TextureVertexHandler,
  TraceObjectHandler,
  UseMapHandler,
  UseMaterialHandler,
  VertexNormalHandler,
} from "src/obj-parser/directives/base";

const handlers: Handler<ObjDirective>[] = [
  new GeometricVertexHandler(),
  new VertexNormalHandler(),
  new ParameterSpaceVertexHandler(),
  new TextureVertexHandler(),
  new PolygonHandler(),
  new LineHandler(),
  new FaceHandler(),
  new Curve2dHandler(),
  new CurveHandler(),
  new SurfaceHandler(),
  new FreeformBmatHandler(),
  new FreeformDegreeHandler(),
  new FreeformStepHandler(),
  new FreeformTypeHandler(),
  new FreeformBodyEndHandler(),
  new FreeformBodyHoleHandler(),
  new FreeformBodyParamHandler(),
  new FreeformBodyScrvHandler(),
  new FreeformBodySpHandler(),
  new FreeformBodyTrimHandler(),
  new ConnectionHandler(),
  new GroupHandler(),
  new MergingGroupHandler(),
  new SmoothingGroupHandler(),
  new BevelHandler(),
  new CInterpHandler(),
  new CTechHandler(),
  new DInterpHandler(),
  new LodHandler(),
  new MapLibrariesHandler(),
  new MaterialLibrariesHandler(),
  new ObjectHandler(),
  new STechHandler(),
  new ShadowObjectHandler(),
  new TraceObjectHandler(),
  new UseMapHandler(),
  new UseMaterialHandler(),
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
