/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.96
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */
define(["./defaultValue-6ed27e8d","./Matrix2-735f0ea9","./arrayRemoveDuplicates-d332a3bf","./BoundingRectangle-d55ba9f7","./Transforms-b683baff","./ComponentDatatype-6ff7d2c3","./PolylineVolumeGeometryLibrary-1c97d86c","./RuntimeError-17a7ed3d","./GeometryAttribute-29ed65a7","./GeometryAttributes-cb1bf806","./IndexDatatype-d42fd89c","./PolygonPipeline-71c413e2","./_commonjsHelpers-c27c962c","./combine-c04aaa26","./WebGLConstants-d878ea52","./EllipsoidTangentPlane-12fe3e10","./AxisAlignedBoundingBox-b14143c9","./IntersectionTests-1cdbb657","./Plane-6c77dfaf","./PolylinePipeline-4244f016","./EllipsoidGeodesic-84738e5f","./EllipsoidRhumbLine-c3b11f35"],(function(e,t,n,i,o,a,l,r,s,p,c,d,u,y,f,g,h,m,E,_,P,b){"use strict";function k(n){const i=(n=e.defaultValue(n,e.defaultValue.EMPTY_OBJECT)).polylinePositions,o=n.shapePositions;this._positions=i,this._shape=o,this._ellipsoid=t.Ellipsoid.clone(e.defaultValue(n.ellipsoid,t.Ellipsoid.WGS84)),this._cornerType=e.defaultValue(n.cornerType,l.CornerType.ROUNDED),this._granularity=e.defaultValue(n.granularity,a.CesiumMath.RADIANS_PER_DEGREE),this._workerName="createPolylineVolumeOutlineGeometry";let r=1+i.length*t.Cartesian3.packedLength;r+=1+o.length*t.Cartesian2.packedLength,this.packedLength=r+t.Ellipsoid.packedLength+2}k.pack=function(n,i,o){let a;o=e.defaultValue(o,0);const l=n._positions;let r=l.length;for(i[o++]=r,a=0;a<r;++a,o+=t.Cartesian3.packedLength)t.Cartesian3.pack(l[a],i,o);const s=n._shape;for(r=s.length,i[o++]=r,a=0;a<r;++a,o+=t.Cartesian2.packedLength)t.Cartesian2.pack(s[a],i,o);return t.Ellipsoid.pack(n._ellipsoid,i,o),o+=t.Ellipsoid.packedLength,i[o++]=n._cornerType,i[o]=n._granularity,i};const C=t.Ellipsoid.clone(t.Ellipsoid.UNIT_SPHERE),L={polylinePositions:void 0,shapePositions:void 0,ellipsoid:C,height:void 0,cornerType:void 0,granularity:void 0};k.unpack=function(n,i,o){let a;i=e.defaultValue(i,0);let l=n[i++];const r=new Array(l);for(a=0;a<l;++a,i+=t.Cartesian3.packedLength)r[a]=t.Cartesian3.unpack(n,i);l=n[i++];const s=new Array(l);for(a=0;a<l;++a,i+=t.Cartesian2.packedLength)s[a]=t.Cartesian2.unpack(n,i);const p=t.Ellipsoid.unpack(n,i,C);i+=t.Ellipsoid.packedLength;const c=n[i++],d=n[i];return e.defined(o)?(o._positions=r,o._shape=s,o._ellipsoid=t.Ellipsoid.clone(p,o._ellipsoid),o._cornerType=c,o._granularity=d,o):(L.polylinePositions=r,L.shapePositions=s,L.cornerType=c,L.granularity=d,new k(L))};const T=new i.BoundingRectangle;return k.createGeometry=function(e){const r=e._positions,u=n.arrayRemoveDuplicates(r,t.Cartesian3.equalsEpsilon);let y=e._shape;if(y=l.PolylineVolumeGeometryLibrary.removeDuplicatesFromShape(y),u.length<2||y.length<3)return;d.PolygonPipeline.computeWindingOrder2D(y)===d.WindingOrder.CLOCKWISE&&y.reverse();const f=i.BoundingRectangle.fromPoints(y,T);return function(e,t){const n=new p.GeometryAttributes;n.position=new s.GeometryAttribute({componentDatatype:a.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:e});const i=t.length,l=n.position.values.length/3,r=e.length/3/i,d=c.IndexDatatype.createTypedArray(l,2*i*(r+1));let u,y,f=0;u=0;let g=u*i;for(y=0;y<i-1;y++)d[f++]=y+g,d[f++]=y+g+1;for(d[f++]=i-1+g,d[f++]=g,u=r-1,g=u*i,y=0;y<i-1;y++)d[f++]=y+g,d[f++]=y+g+1;for(d[f++]=i-1+g,d[f++]=g,u=0;u<r-1;u++){const e=i*u,t=e+i;for(y=0;y<i;y++)d[f++]=y+e,d[f++]=y+t}return new s.Geometry({attributes:n,indices:c.IndexDatatype.createTypedArray(l,d),boundingSphere:o.BoundingSphere.fromVertices(e),primitiveType:s.PrimitiveType.LINES})}(l.PolylineVolumeGeometryLibrary.computePositions(u,y,f,e,!1),y)},function(n,i){return e.defined(i)&&(n=k.unpack(n,i)),n._ellipsoid=t.Ellipsoid.clone(n._ellipsoid),k.createGeometry(n)}}));
