import parseDirectives from "./directives-parser";
import { Bevel, CInterp, Connection, CTech, Curve, Curve2d, DInterp, Face, FreeformBmat, FreeformBodyHole, FreeformBodyParam, FreeformBodyScrv, FreeformBodySp, FreeformBodyTrim, FreeformDegree, FreeformStep, FreeformType, GeometricVertex, isBevel, isCInterp, isConnection, isCTech, isCurve, isCurve2d, isDInterp, isFace, isFreeformBmat, isFreeformBodyEnd, isFreeformBodyHole, isFreeformBodyParam, isFreeformBodyScrv, isFreeformBodySp, isFreeformBodyTrim, isFreeformDegree, isFreeformStep, isFreeformType, isGeometricVertex, isGroup, isLine, isLod, isMaterialLibraries, isMergingGroup, isObject, isParameterSpaceVertex, isPolygon, isShadowObject, isSmoothingGroup, isSTech, isSurface, isTextureVertex, isTraceObject, isUseMaterial, isVertexNormal, Line, Lod, MaterialLibraries, MergingGroup, ObjDirective, ParameterSpaceVertex, Polygon, ShadowObject, SmoothingGroup, STech, Surface, TextureVertex, TraceObject, UseMaterial, VertexNormal } from "./directives/base";

export function convertRelativeToAbsoluteInPlace(
  directives: ObjDirective[],
): void {
  let vertexCount = 0;
  let vertexNormalCount = 0;
  let textureVertexCount = 0;
  let parameterSpaceVertexCount = 0;
  let surfCount = 0;
  let curve2dCount = 0;
  for (const directive of directives) {
    if (isLine(directive)) {
      directive.v = directive.v.map((index) => {
        if (index < 0) {
          return vertexCount + index;
        }
        return index;
      });
      if (directive.vt) {
        directive.vt = directive.vt.map((index) => {
          if (index < 0) {
            return textureVertexCount + index;
          }
          return index;
        });
      }
    } else if (isFace(directive)) {
      directive.v = directive.v.map((index) => {
        if (index < 0) {
          return vertexCount + index;
        }
        return index;
      });
      if (directive.vt) {
        directive.vt = directive.vt.map((index) => {
          if (index < 0) {
            return textureVertexCount + index;
          }
          return index;
        });
      }
      if (directive.vn) {
        directive.vn = directive.vn.map((index) => {
          if (index < 0) {
            return vertexNormalCount + index;
          }
          return index;
        });
      }
    } else if (isCurve(directive)) {
      directive.v = directive.v.map((index) => {
        if (index < 0) {
          return vertexCount + index;
        }
        return index;
      });
    } else if (isCurve2d(directive)) {
      directive.vp = directive.vp.map((index) => {
        if (index < 0) {
          return parameterSpaceVertexCount + index;
        }
        return index;
      });
    } else if (isSurface(directive)) {
      directive.v = directive.v.map((index) => {
        if (index < 0) {
          return vertexCount + index;
        }
        return index;
      });
      if (directive.vt) {
        directive.vt = directive.vt.map((index) => {
          if (index < 0) {
            return textureVertexCount + index;
          }
          return index;
        });
      }
      if (directive.vn) {
        directive.vn = directive.vn.map((index) => {
          if (index < 0) {
            return vertexNormalCount + index;
          }
          return index;
        });
      }
    } else if (isConnection(directive)) {
      directive.connections = directive.connections.map((connection) => {
        return {
          surf: connection.surf < 0 ? surfCount + connection.surf : connection.surf,
          q0: connection.q0,
          q1: connection.q1,
          curv2d: connection.curv2d < 0 ? curve2dCount + connection.curv2d : connection.curv2d,
        };
      });
    }

    if (isGeometricVertex(directive)) {
      vertexCount++;
    } else if (isVertexNormal(directive)) {
      vertexNormalCount++;
    } else if (isTextureVertex(directive)) {
      textureVertexCount++;
    } else if (isParameterSpaceVertex(directive)) {
      parameterSpaceVertexCount++;
    } else if (isSurface(directive)) {
      surfCount++;
    } else if (isCurve2d(directive)) {
      curve2dCount++;
    }
  }
}

export interface VertexData {
  geometricVertices: GeometricVertex[];
  vertexNormals: VertexNormal[];
  parameterSpaceVertices: ParameterSpaceVertex[];
  textureVertices: TextureVertex[];
}

export function packVertexData(
  directives: ObjDirective[],
): VertexData {
  return {
    geometricVertices: directives.filter(isGeometricVertex),
    vertexNormals: directives.filter(isVertexNormal),
    parameterSpaceVertices: directives.filter(isParameterSpaceVertex),
    textureVertices: directives.filter(isTextureVertex),
  };
}

export function packMaterialLibraries(
  directives: ObjDirective[],
): MaterialLibraries[] {
  return directives.filter(isMaterialLibraries);
}

export interface Group {
  groupNames: string[] | undefined;
  mergingGroup: MergingGroup | undefined;
  smoothingGroup: SmoothingGroup | undefined;
  directives: ObjDirective[];
}

export interface ObjectModel {
  name: string | undefined;
  groups: Group[];
}

export function packDirectivesByObjectAndGroup(
  directives: ObjDirective[],
): ObjectModel[] {
  directives = directives.filter((directive) => {
    return !isGeometricVertex(directive) && !isVertexNormal(directive) && !isParameterSpaceVertex(directive)
      && !isTextureVertex(directive);
  }).filter((directive) => {
    return !isMaterialLibraries(directive);
  });

  const objects: ObjectModel[] = [];
  let currentObject: ObjectModel = {
    name: undefined,
    groups: [],
  };
  let currentGroup: Group = {
    groupNames: undefined,
    mergingGroup: undefined,
    smoothingGroup: undefined,
    directives: [],
  };

  for (const directive of directives) {
    if (isGroup(directive)) {
      if (currentGroup.directives.length > 0) {
        currentObject.groups.push(currentGroup);
      }
      currentGroup = {
        groupNames: directive.groupNames,
        mergingGroup: undefined,
        smoothingGroup: undefined,
        directives: [],
      };
    } else if (isObject(directive)) {
      if (currentGroup.directives.length > 0) {
        currentObject.groups.push(currentGroup);
      }
      if (currentObject.groups.length > 0) {
        objects.push(currentObject);
      }
      currentObject = {
        name: directive.name,
        groups: [],
      };
    } else {
      if (isMergingGroup(directive)) {
        currentGroup.mergingGroup = directive;
      } else if (isSmoothingGroup(directive)) {
        currentGroup.smoothingGroup = directive;
      } else {
        currentGroup.directives.push(directive);
      }
    }
  }

  if (currentGroup.directives.length > 0) {
    currentObject.groups.push(currentGroup);
  }
  if (currentObject.groups.length > 0) {
    objects.push(currentObject);
  }

  return objects;
}

export interface ComponentsChunkAttributes {
  bevel: Bevel | undefined;
  cInterp: CInterp | undefined;
  dInterp: DInterp | undefined;
  lod: Lod | undefined;
  useMtl: UseMaterial | undefined;
  shadowObj: ShadowObject | undefined;
  traceObj: TraceObject | undefined;
  cTech: CTech | undefined;
  sTech: STech | undefined;
}

export interface Freeform {
  directive: Curve | Curve2d | Surface;
  body: {
    holes: FreeformBodyHole[];
    params: FreeformBodyParam[];
    scrvs: FreeformBodyScrv[];
    sps: FreeformBodySp[];
    trims: FreeformBodyTrim[];
  };
}

export interface FreeformChunk {
  attributes: {
    uBmat: FreeformBmat | undefined;
    vBmat: FreeformBmat | undefined;
    uDegree: FreeformDegree | undefined;
    vDegree: FreeformDegree | undefined;
    uStep: FreeformStep | undefined;
    vStep: FreeformStep | undefined;
    type: FreeformType | undefined;
  };
  freeforms: Freeform[];
}

export interface ComponentsChunk {
  attributes: ComponentsChunkAttributes;
  polygons: (Polygon | Line | Face)[];
  freeforms: FreeformChunk[];
  freeformConnections: Connection[];
}

export function packDirectivesInAGroup(directivesInAGroup: ObjDirective[]): ComponentsChunk[] {
  const componentsChunks: ComponentsChunk[] = [];
  let currentComponentsChunk: ComponentsChunk = {
    attributes: {
      bevel: undefined,
      cInterp: undefined,
      dInterp: undefined,
      lod: undefined,
      useMtl: undefined,
      shadowObj: undefined,
      traceObj: undefined,
      cTech: undefined,
      sTech: undefined,
    },
    polygons: [],
    freeforms: [],
    freeformConnections: [],
  };

  let currentFreeformChunk: FreeformChunk = {
    attributes: {
      uBmat: undefined,
      vBmat: undefined,
      uDegree: undefined,
      vDegree: undefined,
      uStep: undefined,
      vStep: undefined,
      type: undefined,
    },
    freeforms: [],
  };

  let i = 0;
  while (i < directivesInAGroup.length) {
    const directive = directivesInAGroup[i];
    // if any of the chunk attributes change, start a new chunk after pushing the current chunk
    // if the current chunk is not empty
    if (
      isBevel(directive)
      || isCInterp(directive)
      || isDInterp(directive)
      || isLod(directive)
      || isUseMaterial(directive)
      || isShadowObject(directive)
      || isTraceObject(directive)
      || isCTech(directive)
      || isSTech(directive)
    ) {
      if (currentComponentsChunk.polygons.length > 0 || currentFreeformChunk.freeforms.length > 0) {
        componentsChunks.push(currentComponentsChunk);
        currentComponentsChunk = {
          ...currentComponentsChunk,
          polygons: [],
          freeformConnections: [],
          freeforms: [],
        };
      }
      if (isBevel(directive)) {
        currentComponentsChunk.attributes.bevel = directive;
      } else if (isCInterp(directive)) {
        currentComponentsChunk.attributes.cInterp = directive;
      } else if (isDInterp(directive)) {
        currentComponentsChunk.attributes.dInterp = directive;
      } else if (isLod(directive)) {
        currentComponentsChunk.attributes.lod = directive;
      } else if (isUseMaterial(directive)) {
        currentComponentsChunk.attributes.useMtl = directive;
      } else if (isShadowObject(directive)) {
        currentComponentsChunk.attributes.shadowObj = directive;
      } else if (isTraceObject(directive)) {
        currentComponentsChunk.attributes.traceObj = directive;
      } else if (isCTech(directive)) {
        currentComponentsChunk.attributes.cTech = directive;
      } else if (isSTech(directive)) {
        currentComponentsChunk.attributes.sTech = directive;
      }
      ++i;
      continue;
    }

    // if it is a polygon, just push it to the current chunk
    if (isPolygon(directive) || isLine(directive) || isFace(directive)) {
      currentComponentsChunk.polygons.push(directive);
      ++i;
      continue;
    }

    // if any of the freeform attributes change, start a new freeform chunk after pushing the current freeform chunk
    // if the current freeform chunk is not empty
    if (
      isFreeformBmat(directive)
      || isFreeformDegree(directive)
      || isFreeformStep(directive)
      || isFreeformType(directive)
    ) {
      if (currentFreeformChunk.freeforms.length > 0) {
        currentComponentsChunk.freeforms.push(currentFreeformChunk);
        currentFreeformChunk = {
          ...currentFreeformChunk,
          freeforms: [],
        };
      }
      if (isFreeformBmat(directive)) {
        if (directive.uOrV === "u") {
          currentFreeformChunk.attributes.uBmat = directive;
        } else {
          currentFreeformChunk.attributes.vBmat = directive;
        }
      } else if (isFreeformDegree(directive)) {
        if (directive.uOrV === "u") {
          currentFreeformChunk.attributes.uDegree = directive;
        } else {
          currentFreeformChunk.attributes.vDegree = directive;
        }
      } else if (isFreeformStep(directive)) {
        if (directive.u) {
          currentFreeformChunk.attributes.uStep = directive;
        } else {
          currentFreeformChunk.attributes.vStep = directive;
        }
      } else if (isFreeformType(directive)) {
        currentFreeformChunk.attributes.type = directive;
      }
      ++i;
      continue;
    }

    // if it is a freeform, parse its body if exists and push it to the current freeform chunk
    if (
      isCurve(directive)
      || isCurve2d(directive)
      || isSurface(directive)
    ) {
      const freeform: Freeform = {
        directive: directive,
        body: {
          holes: [],
          params: [],
          scrvs: [],
          sps: [],
          trims: [],
        },
      };
      while (i < directivesInAGroup.length && !isFreeformBodyEnd(directivesInAGroup[i])) {
        const nextDirective = directivesInAGroup[i];
        if (isFreeformBodyHole(nextDirective)) {
          freeform.body.holes.push(nextDirective);
        } else if (isFreeformBodyParam(nextDirective)) {
          freeform.body.params.push(nextDirective);
        } else if (isFreeformBodyScrv(nextDirective)) {
          freeform.body.scrvs.push(nextDirective);
        } else if (isFreeformBodySp(nextDirective)) {
          freeform.body.sps.push(nextDirective);
        } else if (isFreeformBodyTrim(nextDirective)) {
          freeform.body.trims.push(nextDirective);
        } else {
          break;
        }
        ++i;
      }
      currentFreeformChunk.freeforms.push(freeform);
      continue;
    }

    // if it is a connection, push it to the current freeform chunk
    if (isConnection(directive)) {
      currentComponentsChunk.freeformConnections.push(directive);
      ++i;
      continue;
    }
  }

  if (currentFreeformChunk.freeforms.length > 0) {
    currentComponentsChunk.freeforms.push(currentFreeformChunk);
  }

  if (currentComponentsChunk.polygons.length > 0 || currentFreeformChunk.freeforms.length > 0) {
    componentsChunks.push(currentComponentsChunk);
  }

  return componentsChunks;
}

export interface PackedObject {
  name: string | undefined;
  groups: {
    groupNames: string[] | undefined;
    mergingGroup: MergingGroup | undefined;
    smoothingGroup: SmoothingGroup | undefined;
    componentsChunks: ComponentsChunk[];
  }[];
}

export interface PackedObj {
  vertexData: VertexData;
  materialLibraries: MaterialLibraries[];
  objects: PackedObject[];
}

export function packObject(objects: ObjectModel[]): PackedObject[] {
  const packedObjects: PackedObject[] = objects.map(
    (rawPackedObject) => {
      return {
        name: rawPackedObject.name,
        groups: rawPackedObject.groups.map(
          (rawGroup) => {
            return {
              groupNames: rawGroup.groupNames,
              mergingGroup: rawGroup.mergingGroup,
              smoothingGroup: rawGroup.smoothingGroup,
              componentsChunks: packDirectivesInAGroup(rawGroup.directives),
            };
          },
        ),
      };
    },
  );
  return packedObjects;
}

export function packDirectives(directives: ObjDirective[]): PackedObj {
  convertRelativeToAbsoluteInPlace(directives);
  const vertexData = packVertexData(directives);
  const materialLibraries = packMaterialLibraries(directives);
  const objects = packDirectivesByObjectAndGroup(directives);
  return {
    vertexData,
    materialLibraries,
    objects: packObject(objects),
  };
}

export default function parseObj(fileContent: string): PackedObj {
  const directives = parseDirectives(fileContent);
  return packDirectives(directives);
}
