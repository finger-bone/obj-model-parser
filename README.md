# obj-model-parser

This is a simple parser for the Wavefront .obj file format.

To use the parser, simply import `parseObj`, which is a function that takes a string, the content of the obj file, and returns the parsed object.

For example,

```typescript
import parseObj from "obj-model-parser";

const objContent = `
v 0.0 0.0 0.0
`

const parsedObj = parseObj(objContent);
```

The following code will present you with its return type.

In the following code, `d` is `import * as d from "obj-parser/directives/base";`, which contains certain structures that saves the corresponding data. For example, for geometric vertices, `d.GeometricVertex` is a structure that contains the x, y, and z coordinates of the vertex.

The returned type is as follows,

```typescript
{
    vertexData: {
        geometricVertices: d.GeometricVertex[];
        vertexNormals: d.VertexNormal[];
        parameterSpaceVertices: d.ParameterSpaceVertex[];
        textureVertices: d.TextureVertex[];
    },
    materialLibraries: d.MaterialLibraries[],
    objects:  name: string | undefined;
    groups: {
        groupNames: string[] | undefined;
        mergingGroup: d.MergingGroup | undefined;
        smoothingGroup: d.SmoothingGroup | undefined;
        componentsChunks: {
            attributes: ComponentsChunkAttributes;
            polygons: (d.Polygon | d.Line | d.Face)[];
            freeforms: {
                attributes: {
                    uBmat: d.FreeformBmat | undefined;
                    vBmat: d.FreeformBmat | undefined;
                    uDegree: d.FreeformDegree | undefined;
                    vDegree: d.FreeformDegree | undefined;
                    uStep: d.FreeformStep | undefined;
                    vStep: d.FreeformStep | undefined;
                    type: d.FreeformType | undefined;
                };
                freeforms: {
                    directive: d.Curve | d.Curve2d | d.Surface;
                    body: {
                        holes: d.FreeformBodyHole[];
                        params: d.FreeformBodyParam[];
                        scrvs: d.FreeformBodyScrv[];
                        sps: d.FreeformBodySp[];
                        trims: d.FreeformBodyTrim[];
                    }
                }[]
            }[]
            freeformConnections: d.Connection[];
        };
    }[];
}
```

The structure above is not fully expanded for simplicity. It may seem kind of overwhelming, but if you are only working with polygons, the structure you need to care about is as follows,

```typescript
{
    objects:  name: string | undefined;
    groups: {
        groupNames: string[] | undefined;
        mergingGroup: d.MergingGroup | undefined;
        smoothingGroup: d.SmoothingGroup | undefined;
        componentsChunks: {
            attributes: ComponentsChunkAttributes;
            polygons: (d.Polygon | d.Line | d.Face)[];
        };
    }[];
}
```

## Other Notes

- The parser is not fully tested, so there may be some bugs.
- The order of the vertex data is the same as they appear in the file, so when indexing them, you just use the index.
- Notwithstanding being chunked, the order of `curv2d` and `surf` is the same as they appear in the file. If you need to index them, as you may need in `con` directive, you just iterate through the chunks.
- The relative index is automatically converted to an absolute index.
- The model used for testing is from [this page](https://free3d.com/3d-model/realistic-tree-pack-3-trees-95419.html) and [this page](https://free3d.com/3d-model/bird-v1--875504.html) respectively, all distributed under personal use license.
