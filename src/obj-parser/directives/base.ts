export interface ObjDirective {
  type: string;
  [key: string]: unknown;
}

export { type GeometricVertex, GeometricVertexHandler, isGeometricVertex } from "./vertex/geometric-vertex";
export {
  isParameterSpaceVertex,
  type ParameterSpaceVertex,
  ParameterSpaceVertexHandler,
} from "./vertex/parameter-space-vertex";
export { isTextureVertex, type TextureVertex, TextureVertexHandler } from "./vertex/texture-vertex";
export { isVertexNormal, type VertexNormal, VertexNormalHandler } from "./vertex/vertex-normal";

// Polygonal directives
export { type Face, FaceHandler, isFace } from "./polygonal/face";
export { isLine, type Line, LineHandler } from "./polygonal/line";
export { isPolygon, type Polygon, PolygonHandler } from "./polygonal/polygon";

// Freeform directives
export { type Curve, CurveHandler, isCurve } from "./freeform/curve";
export { type Curve2d, Curve2dHandler, isCurve2d } from "./freeform/curve-2d";
export { isSurface, type Surface, SurfaceHandler } from "./freeform/surface";

// Freeform attribute directives
export { type FreeformBmat, FreeformBmatHandler, isFreeformBmat } from "./freefrom-attribute/freeform-bmat";
export { type FreeformDegree, FreeformDegreeHandler, isFreeformDegree } from "./freefrom-attribute/freeform-degree";
export { type FreeformStep, FreeformStepHandler, isFreeformStep } from "./freefrom-attribute/freeform-step";
export { type FreeformType, FreeformTypeHandler, isFreeformType } from "./freefrom-attribute/freeform-type";

// Freeform body directives
export { type FreeformBodyEnd, FreeformBodyEndHandler, isFreeformBodyEnd } from "./freefrom-body/freeform-body-end";
export { type FreeformBodyHole, FreeformBodyHoleHandler, isFreeformBodyHole } from "./freefrom-body/freeform-body-hole";
export {
  type FreeformBodyParam,
  FreeformBodyParamHandler,
  isFreeformBodyParam,
} from "./freefrom-body/freeform-body-param";
export { type FreeformBodyScrv, FreeformBodyScrvHandler, isFreeformBodyScrv } from "./freefrom-body/freeform-body-scrv";
export { type FreeformBodySp, FreeformBodySpHandler, isFreeformBodySp } from "./freefrom-body/freeform-body-sp";
export { type FreeformBodyTrim, FreeformBodyTrimHandler, isFreeformBodyTrim } from "./freefrom-body/freeform-body-trim";

// Group directives
export { type Connection, ConnectionHandler, isConnection } from "./group/connection";
export { type Group, GroupHandler, isGroup } from "./group/group";
export { isMergingGroup, type MergingGroup, MergingGroupHandler } from "./group/merging-group";
export { isSmoothingGroup, type SmoothingGroup, SmoothingGroupHandler } from "./group/smoothing-group";

// Object directives
export { type Bevel, BevelHandler, isBevel } from "./object/bevel";
export { type CInterp, CInterpHandler, isCInterp } from "./object/c-interp";
export { type CTech, CTechHandler, isCTech } from "./object/c-tech";
export { type DInterp, DInterpHandler, isDInterp } from "./object/d-interp";
export { isLod, type Lod, LodHandler } from "./object/lod";
export { isMapLibraries, type MapLibraries, MapLibrariesHandler } from "./object/map-libraries";
export { isMaterialLibraries, type MaterialLibraries, MaterialLibrariesHandler } from "./object/material-libraries";
export { isObject, type Object, ObjectHandler } from "./object/object";
export { isSTech, type STech, STechHandler } from "./object/s-tech";
export { isShadowObject, type ShadowObject, ShadowObjectHandler } from "./object/shadow-object";
export { isTraceObject, type TraceObject, TraceObjectHandler } from "./object/trace-object";
export { isUseMap, type UseMap, UseMapHandler } from "./object/use-map";
export { isUseMaterial, type UseMaterial, UseMaterialHandler } from "./object/use-material";
