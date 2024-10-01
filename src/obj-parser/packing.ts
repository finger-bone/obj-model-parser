import * as d from "@/obj-parser/directives/base";
import parseDirectives from "./directives-parser";

export function convertRelativeToAbsoluteInPlace(
  directives: d.ObjDirective[],
): void {
  let vertexCount = 0;
  let vertexNormalCount = 0;
  let textureVertexCount = 0;
  let parameterSpaceVertexCount = 0;
  let surfCount = 0;
  let curve2dCount = 0;
  for (const directive of directives) {
    if (d.isLine(directive)) {
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
    } else if (d.isFace(directive)) {
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
    } else if (d.isCurve(directive)) {
      directive.v = directive.v.map((index) => {
        if (index < 0) {
          return vertexCount + index;
        }
        return index;
      });
    } else if (d.isCurve2d(directive)) {
      directive.vp = directive.vp.map((index) => {
        if (index < 0) {
          return parameterSpaceVertexCount + index;
        }
        return index;
      });
    } else if (d.isSurface(directive)) {
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
    } else if (d.isConnection(directive)) {
      directive.connections = directive.connections.map((connection) => {
        return {
          surf: connection.surf < 0 ? surfCount + connection.surf : connection.surf,
          q0: connection.q0,
          q1: connection.q1,
          curv2d: connection.curv2d < 0 ? curve2dCount + connection.curv2d : connection.curv2d,
        };
      });
    }

    if (d.isGeometricVertex(directive)) {
      vertexCount++;
    } else if (d.isVertexNormal(directive)) {
      vertexNormalCount++;
    } else if (d.isTextureVertex(directive)) {
      textureVertexCount++;
    } else if (d.isParameterSpaceVertex(directive)) {
      parameterSpaceVertexCount++;
    } else if (d.isSurface(directive)) {
      surfCount++;
    } else if (d.isCurve2d(directive)) {
      curve2dCount++;
    }
  }
}

export interface VertexData {
  geometricVertices: d.GeometricVertex[];
  vertexNormals: d.VertexNormal[];
  parameterSpaceVertices: d.ParameterSpaceVertex[];
  textureVertices: d.TextureVertex[];
}

export function packVertexData(
  directives: d.ObjDirective[],
): VertexData {
  return {
    geometricVertices: directives.filter(d.isGeometricVertex),
    vertexNormals: directives.filter(d.isVertexNormal),
    parameterSpaceVertices: directives.filter(d.isParameterSpaceVertex),
    textureVertices: directives.filter(d.isTextureVertex),
  };
}

export function packMaterialLibraries(
  directives: d.ObjDirective[],
): d.MaterialLibraries[] {
  return directives.filter(d.isMaterialLibraries);
}

export interface Group {
  groupNames: string[] | undefined;
  mergingGroup: d.MergingGroup | undefined;
  smoothingGroup: d.SmoothingGroup | undefined;
  directives: d.ObjDirective[];
}

export interface ObjectModel {
  name: string | undefined;
  groups: Group[];
}

export function packDirectivesByObjectAndGroup(
  directives: d.ObjDirective[],
): ObjectModel[] {
  directives = directives.filter((directive) => {
    return !d.isGeometricVertex(directive) && !d.isVertexNormal(directive) && !d.isParameterSpaceVertex(directive)
      && !d.isTextureVertex(directive);
  }).filter((directive) => {
    return !d.isMaterialLibraries(directive);
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
    if (d.isGroup(directive)) {
      if (currentGroup.directives.length > 0) {
        currentObject.groups.push(currentGroup);
      }
      currentGroup = {
        groupNames: directive.groupNames,
        mergingGroup: undefined,
        smoothingGroup: undefined,
        directives: [],
      };
    } else if (d.isObject(directive)) {
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
      if (d.isMergingGroup(directive)) {
        currentGroup.mergingGroup = directive;
      } else if (d.isSmoothingGroup(directive)) {
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
  bevel: d.Bevel | undefined;
  cInterp: d.CInterp | undefined;
  dInterp: d.DInterp | undefined;
  lod: d.Lod | undefined;
  useMtl: d.UseMaterial | undefined;
  shadowObj: d.ShadowObject | undefined;
  traceObj: d.TraceObject | undefined;
  cTech: d.CTech | undefined;
  sTech: d.STech | undefined;
}

export interface Freeform {
  directive: d.Curve | d.Curve2d | d.Surface;
  body: {
    holes: d.FreeformBodyHole[];
    params: d.FreeformBodyParam[];
    scrvs: d.FreeformBodyScrv[];
    sps: d.FreeformBodySp[];
    trims: d.FreeformBodyTrim[];
  };
}

export interface FreeformChunk {
  attributes: {
    uBmat: d.FreeformBmat | undefined;
    vBmat: d.FreeformBmat | undefined;
    uDegree: d.FreeformDegree | undefined;
    vDegree: d.FreeformDegree | undefined;
    uStep: d.FreeformStep | undefined;
    vStep: d.FreeformStep | undefined;
    type: d.FreeformType | undefined;
  };
  freeforms: Freeform[];
}

export interface ComponentsChunk {
  attributes: ComponentsChunkAttributes;
  polygons: (d.Polygon | d.Line | d.Face)[];
  freeforms: FreeformChunk[];
  freeformConnections: d.Connection[];
}

export function packDirectivesInAGroup(directivesInAGroup: d.ObjDirective[]): ComponentsChunk[] {
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
      d.isBevel(directive)
      || d.isCInterp(directive)
      || d.isDInterp(directive)
      || d.isLod(directive)
      || d.isUseMaterial(directive)
      || d.isShadowObject(directive)
      || d.isTraceObject(directive)
      || d.isCTech(directive)
      || d.isSTech(directive)
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
      if (d.isBevel(directive)) {
        currentComponentsChunk.attributes.bevel = directive;
      } else if (d.isCInterp(directive)) {
        currentComponentsChunk.attributes.cInterp = directive;
      } else if (d.isDInterp(directive)) {
        currentComponentsChunk.attributes.dInterp = directive;
      } else if (d.isLod(directive)) {
        currentComponentsChunk.attributes.lod = directive;
      } else if (d.isUseMaterial(directive)) {
        currentComponentsChunk.attributes.useMtl = directive;
      } else if (d.isShadowObject(directive)) {
        currentComponentsChunk.attributes.shadowObj = directive;
      } else if (d.isTraceObject(directive)) {
        currentComponentsChunk.attributes.traceObj = directive;
      } else if (d.isCTech(directive)) {
        currentComponentsChunk.attributes.cTech = directive;
      } else if (d.isSTech(directive)) {
        currentComponentsChunk.attributes.sTech = directive;
      }
      ++i;
      continue;
    }

    // if it is a polygon, just push it to the current chunk
    if (d.isPolygon(directive) || d.isLine(directive) || d.isFace(directive)) {
      currentComponentsChunk.polygons.push(directive);
      ++i;
      continue;
    }

    // if any of the freeform attributes change, start a new freeform chunk after pushing the current freeform chunk
    // if the current freeform chunk is not empty
    if (
      d.isFreeformBmat(directive)
      || d.isFreeformDegree(directive)
      || d.isFreeformStep(directive)
      || d.isFreeformType(directive)
    ) {
      if (currentFreeformChunk.freeforms.length > 0) {
        currentComponentsChunk.freeforms.push(currentFreeformChunk);
        currentFreeformChunk = {
          ...currentFreeformChunk,
          freeforms: [],
        };
      }
      if (d.isFreeformBmat(directive)) {
        if (directive.uOrV === "u") {
          currentFreeformChunk.attributes.uBmat = directive;
        } else {
          currentFreeformChunk.attributes.vBmat = directive;
        }
      } else if (d.isFreeformDegree(directive)) {
        if (directive.uOrV === "u") {
          currentFreeformChunk.attributes.uDegree = directive;
        } else {
          currentFreeformChunk.attributes.vDegree = directive;
        }
      } else if (d.isFreeformStep(directive)) {
        if (directive.u) {
          currentFreeformChunk.attributes.uStep = directive;
        } else {
          currentFreeformChunk.attributes.vStep = directive;
        }
      } else if (d.isFreeformType(directive)) {
        currentFreeformChunk.attributes.type = directive;
      }
      ++i;
      continue;
    }

    // if it is a freeform, parse its body if exists and push it to the current freeform chunk
    if (
      d.isCurve(directive)
      || d.isCurve2d(directive)
      || d.isSurface(directive)
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
      while (i < directivesInAGroup.length && !d.isFreeformBodyEnd(directivesInAGroup[i])) {
        const nextDirective = directivesInAGroup[i];
        if (d.isFreeformBodyHole(nextDirective)) {
          freeform.body.holes.push(nextDirective);
        } else if (d.isFreeformBodyParam(nextDirective)) {
          freeform.body.params.push(nextDirective);
        } else if (d.isFreeformBodyScrv(nextDirective)) {
          freeform.body.scrvs.push(nextDirective);
        } else if (d.isFreeformBodySp(nextDirective)) {
          freeform.body.sps.push(nextDirective);
        } else if (d.isFreeformBodyTrim(nextDirective)) {
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
    if (d.isConnection(directive)) {
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
    mergingGroup: d.MergingGroup | undefined;
    smoothingGroup: d.SmoothingGroup | undefined;
    componentsChunks: ComponentsChunk[];
  }[];
}

export interface PackedObj {
  vertexData: VertexData;
  materialLibraries: d.MaterialLibraries[];
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

export function packDirectives(directives: d.ObjDirective[]): PackedObj {
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
