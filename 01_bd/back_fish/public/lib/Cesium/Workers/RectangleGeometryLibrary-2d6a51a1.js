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
define(["exports","./Matrix2-735f0ea9","./defaultValue-6ed27e8d","./RuntimeError-17a7ed3d","./Transforms-b683baff","./ComponentDatatype-6ff7d2c3"],(function(t,n,a,e,o,r){"use strict";const s=Math.cos,i=Math.sin,c=Math.sqrt,g={computePosition:function(t,n,e,o,r,g,u){const h=n.radiiSquared,l=t.nwCorner,C=t.boundingRectangle;let d=l.latitude-t.granYCos*o+r*t.granXSin;const S=s(d),w=i(d),M=h.z*w;let f=l.longitude+o*t.granYSin+r*t.granXCos;const m=S*s(f),X=S*i(f),Y=h.x*m,p=h.y*X,x=c(Y*m+p*X+M*w);if(g.x=Y/x,g.y=p/x,g.z=M/x,e){const n=t.stNwCorner;a.defined(n)?(d=n.latitude-t.stGranYCos*o+r*t.stGranXSin,f=n.longitude+o*t.stGranYSin+r*t.stGranXCos,u.x=(f-t.stWest)*t.lonScalar,u.y=(d-t.stSouth)*t.latScalar):(u.x=(f-C.west)*t.lonScalar,u.y=(d-C.south)*t.latScalar)}}},u=new n.Matrix2;let h=new n.Cartesian3;const l=new n.Cartographic;let C=new n.Cartesian3;const d=new o.GeographicProjection;function S(t,a,e,o,r,s,i){const c=Math.cos(a),g=o*c,l=e*c,S=Math.sin(a),w=o*S,M=e*S;h=d.project(t,h),h=n.Cartesian3.subtract(h,C,h);const f=n.Matrix2.fromRotation(a,u);h=n.Matrix2.multiplyByVector(f,h,h),h=n.Cartesian3.add(h,C,h),s-=1,i-=1;const m=(t=d.unproject(h,t)).latitude,X=m+s*M,Y=m-g*i,p=m-g*i+s*M,x=Math.max(m,X,Y,p),R=Math.min(m,X,Y,p),G=t.longitude,y=G+s*l,O=G+i*w,b=G+i*w+s*l;return{north:x,south:R,east:Math.max(G,y,O,b),west:Math.min(G,y,O,b),granYCos:g,granYSin:w,granXCos:l,granXSin:M,nwCorner:t}}g.computeOptions=function(t,a,e,o,s,i,c){let g,u=t.east,h=t.west,w=t.north,M=t.south,f=!1,m=!1;w===r.CesiumMath.PI_OVER_TWO&&(f=!0),M===-r.CesiumMath.PI_OVER_TWO&&(m=!0);const X=w-M;g=h>u?r.CesiumMath.TWO_PI-h+u:u-h;const Y=Math.ceil(g/a)+1,p=Math.ceil(X/a)+1,x=g/(Y-1),R=X/(p-1),G=n.Rectangle.northwest(t,i),y=n.Rectangle.center(t,l);0===e&&0===o||(y.longitude<G.longitude&&(y.longitude+=r.CesiumMath.TWO_PI),C=d.project(y,C));const O=R,b=x,P=n.Rectangle.clone(t,s),W={granYCos:O,granYSin:0,granXCos:b,granXSin:0,nwCorner:G,boundingRectangle:P,width:Y,height:p,northCap:f,southCap:m};if(0!==e){const t=S(G,e,x,R,0,Y,p);w=t.north,M=t.south,u=t.east,h=t.west,W.granYCos=t.granYCos,W.granYSin=t.granYSin,W.granXCos=t.granXCos,W.granXSin=t.granXSin,P.north=w,P.south=M,P.east=u,P.west=h}if(0!==o){e-=o;const t=n.Rectangle.northwest(P,c),a=S(t,e,x,R,0,Y,p);W.stGranYCos=a.granYCos,W.stGranXCos=a.granXCos,W.stGranYSin=a.granYSin,W.stGranXSin=a.granXSin,W.stNwCorner=t,W.stWest=a.west,W.stSouth=a.south}return W},t.RectangleGeometryLibrary=g}));
