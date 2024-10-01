export interface ObjDirective {
    type: string;
    [key: string]: unknown;
}

export { type GeometricVertex, GeometricVertexHandler, isGeometricVertex } from "./vertex/geometric-vertex";
export { type VertexNormal, VertexNormalHandler, isVertexNormal } from "./vertex/vertex-normal";
export { type ParameterSpaceVertex, ParameterSpaceVertexHandler, isParameterSpaceVertex } from "./vertex/parameter-space-vertex";
export { type TextureVertex, TextureVertexHandler, isTextureVertex } from "./vertex/texture-vertex";

// Polygonal directives
export { type Polygon, PolygonHandler, isPolygon } from "./polygonal/polygon";
export { type Line, LineHandler, isLine } from "./polygonal/line";
export { type Face, FaceHandler, isFace } from "./polygonal/face";

// Freeform directives
export { type Curve2d, Curve2dHandler, isCurve2d } from "./freeform/curve-2d";
export { type Curve, CurveHandler, isCurve } from "./freeform/curve";
export { type Surface, SurfaceHandler, isSurface } from "./freeform/surface";

// Freeform attribute directives
export { type FreeformBmat, FreeformBmatHandler, isFreeformBmat } from "./freefrom-attribute/freeform-bmat";
export { type FreeformDegree, FreeformDegreeHandler, isFreeformDegree } from "./freefrom-attribute/freeform-degree";
export { type FreeformStep, FreeformStepHandler, isFreeformStep } from "./freefrom-attribute/freeform-step";
export { type FreeformType, FreeformTypeHandler, isFreeformType } from "./freefrom-attribute/freeform-type";

// Freeform body directives
export { type FreeformBodyEnd, FreeformBodyEndHandler, isFreeformBodyEnd } from "./freefrom-body/freeform-body-end";
export { type FreeformBodyHole, FreeformBodyHoleHandler, isFreeformBodyHole } from "./freefrom-body/freeform-body-hole";
export { type FreeformBodyParam, FreeformBodyParamHandler, isFreeformBodyParam } from "./freefrom-body/freeform-body-param";
export { type FreeformBodyScrv, FreeformBodyScrvHandler, isFreeformBodyScrv } from "./freefrom-body/freeform-body-scrv";
export { type FreeformBodySp, FreeformBodySpHandler, isFreeformBodySp } from "./freefrom-body/freeform-body-sp";
export { type FreeformBodyTrim, FreeformBodyTrimHandler, isFreeformBodyTrim } from "./freefrom-body/freeform-body-trim";

// Group directives
export { type Connection, ConnectionHandler, isConnection } from "./group/connection";
export { type Group, GroupHandler, isGroup } from "./group/group";
export { type MergingGroup, MergingGroupHandler, isMergingGroup } from "./group/merging-group";
export { type SmoothingGroup, SmoothingGroupHandler, isSmoothingGroup } from "./group/smoothing-group";

// Object directives
export { type Bevel, BevelHandler, isBevel } from "./object/bevel";
export { type CInterp, CInterpHandler, isCInterp } from "./object/c-interp";
export { type CTech, CTechHandler, isCTech } from "./object/c-tech";
export { type DInterp, DInterpHandler, isDInterp } from "./object/d-interp";
export { type Lod, LodHandler, isLod } from "./object/lod";
export { type MapLibraries, MapLibrariesHandler, isMapLibraries } from "./object/map-libraries";
export { type MaterialLibraries, MaterialLibrariesHandler, isMaterialLibraries } from "./object/material-libraries";
export { type Object, ObjectHandler, isObject } from "./object/object";
export { type STech, STechHandler, isSTech } from "./object/s-tech";
export { type ShadowObject, ShadowObjectHandler, isShadowObject } from "./object/shadow-object";
export { type TraceObject, TraceObjectHandler, isTraceObject } from "./object/trace-object";
export { type UseMap, UseMapHandler, isUseMap } from "./object/use-map";
export { type UseMaterial, UseMaterialHandler, isUseMaterial } from "./object/use-material";
