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
define(["exports","./Matrix2-735f0ea9","./EllipsoidTangentPlane-12fe3e10","./ComponentDatatype-6ff7d2c3","./PolylinePipeline-4244f016","./Transforms-b683baff","./defaultValue-6ed27e8d","./RuntimeError-17a7ed3d"],(function(e,a,t,n,r,i,o,s){"use strict";var l=Object.freeze({ROUNDED:0,MITERED:1,BEVELED:2});const c={};function C(e,a){o.defined(c[e])||(c[e]=!0,console.warn(o.defaultValue(a,e)))}C.geometryOutlines="Entity geometry outlines are unsupported on terrain. Outlines will be disabled. To enable outlines, disable geometry terrain clamping by explicitly setting height to 0.",C.geometryZIndex="Entity geometry with zIndex are unsupported when height or extrudedHeight are defined.  zIndex will be ignored",C.geometryHeightReference="Entity corridor, ellipse, polygon or rectangle with heightReference must also have a defined height.  heightReference will be ignored",C.geometryExtrudedHeightReference="Entity corridor, ellipse, polygon or rectangle with extrudedHeightReference must also have a defined extrudedHeight.  extrudedHeightReference will be ignored";const u=[new a.Cartesian3,new a.Cartesian3],d=new a.Cartesian3,g=new a.Cartesian3,y=new a.Cartesian3,f=new a.Cartesian3,m=new a.Cartesian3,h=new a.Cartesian3,p=new a.Cartesian3,w=new a.Cartesian3,x=new a.Cartesian3,E=new a.Cartesian3,P=new a.Cartesian3,M={};let b=new a.Cartographic;function T(e,t,n,r){const i=e[0],o=e[1],s=a.Cartesian3.angleBetween(i,o),l=Math.ceil(s/r),c=new Array(l);let C;if(t===n){for(C=0;C<l;C++)c[C]=t;return c.push(n),c}const u=(n-t)/l;for(C=1;C<l;C++){const e=t+C*u;c[C]=e}return c[0]=t,c.push(n),c}const B=new a.Cartesian3,z=new a.Cartesian3;const S=new a.Cartesian3(-1,0,0);let A=new a.Matrix4;const D=new a.Matrix4;let R=new a.Matrix3;const O=a.Matrix3.IDENTITY.clone(),V=new a.Cartesian3,I=new a.Cartesian4,N=new a.Cartesian3;function v(e,n,r,o,s,l,c,C){let u=V,d=I;A=i.Transforms.eastNorthUpToFixedFrame(e,s,A),u=a.Matrix4.multiplyByPointAsVector(A,S,u),u=a.Cartesian3.normalize(u,u);const g=function(e,n,r,i){const o=new t.EllipsoidTangentPlane(r,i),s=o.projectPointOntoPlane(a.Cartesian3.add(r,e,B),B),l=o.projectPointOntoPlane(a.Cartesian3.add(r,n,z),z),c=a.Cartesian2.angleBetween(s,l);return l.x*s.y-l.y*s.x>=0?-c:c}(u,n,e,s);R=a.Matrix3.fromRotationZ(g,R),N.z=l,A=a.Matrix4.multiplyTransformation(A,a.Matrix4.fromRotationTranslation(R,N,D),A);const y=O;y[0]=c;for(let e=0;e<C;e++)for(let e=0;e<r.length;e+=3)d=a.Cartesian3.fromArray(r,e,d),d=a.Matrix3.multiplyByVector(y,d,d),d=a.Matrix4.multiplyByPoint(A,d,d),o.push(d.x,d.y,d.z);return o}const G=new a.Cartesian3;function H(e,t,n,r,i,o,s){for(let l=0;l<e.length;l+=3){r=v(a.Cartesian3.fromArray(e,l,G),t,n,r,i,o[l/3],s,1)}return r}function L(e,a){const t=e.length,n=new Array(3*t);let r=0;const i=a.x+a.width/2,o=a.y+a.height/2;for(let a=0;a<t;a++)n[r++]=e[a].x-i,n[r++]=0,n[r++]=e[a].y-o;return n}const j=new i.Quaternion,Q=new a.Cartesian3,q=new a.Matrix3;function F(e,t,r,o,s,c,C,u,d,g){const y=a.Cartesian3.angleBetween(a.Cartesian3.subtract(t,e,E),a.Cartesian3.subtract(r,e,P)),f=o===l.BEVELED?0:Math.ceil(y/n.CesiumMath.toRadians(5));let m,h,p;if(m=s?a.Matrix3.fromQuaternion(i.Quaternion.fromAxisAngle(a.Cartesian3.negate(e,E),y/(f+1),j),q):a.Matrix3.fromQuaternion(i.Quaternion.fromAxisAngle(e,y/(f+1),j),q),t=a.Cartesian3.clone(t,Q),f>0){const n=g?2:1;for(let r=0;r<f;r++)t=a.Matrix3.multiplyByVector(m,t,t),h=a.Cartesian3.subtract(t,e,E),h=a.Cartesian3.normalize(h,h),s||(h=a.Cartesian3.negate(h,h)),p=c.scaleToGeodeticSurface(t,P),C=v(p,h,u,C,c,d,1,n)}else h=a.Cartesian3.subtract(t,e,E),h=a.Cartesian3.normalize(h,h),s||(h=a.Cartesian3.negate(h,h)),p=c.scaleToGeodeticSurface(t,P),C=v(p,h,u,C,c,d,1,1),r=a.Cartesian3.clone(r,Q),h=a.Cartesian3.subtract(r,e,E),h=a.Cartesian3.normalize(h,h),s||(h=a.Cartesian3.negate(h,h)),p=c.scaleToGeodeticSurface(r,P),C=v(p,h,u,C,c,d,1,1);return C}M.removeDuplicatesFromShape=function(e){const t=e.length,n=[];for(let r=t-1,i=0;i<t;r=i++){const t=e[r],o=e[i];a.Cartesian2.equals(t,o)||n.push(o)}return n},M.angleIsGreaterThanPi=function(e,n,r,i){const o=new t.EllipsoidTangentPlane(r,i),s=o.projectPointOntoPlane(a.Cartesian3.add(r,e,B),B),l=o.projectPointOntoPlane(a.Cartesian3.add(r,n,z),z);return l.x*s.y-l.y*s.x>=0};const U=new a.Cartesian3,_=new a.Cartesian3;M.computePositions=function(e,t,i,o,s){const c=o._ellipsoid,P=function(e,a){const t=new Array(e.length);for(let n=0;n<e.length;n++){const r=e[n];b=a.cartesianToCartographic(r,b),t[n]=b.height,e[n]=a.scaleToGeodeticSurface(r,r)}return t}(e,c),B=o._granularity,z=o._cornerType,S=s?function(e,a){const t=e.length,n=new Array(6*t);let r=0;const i=a.x+a.width/2,o=a.y+a.height/2;let s=e[0];n[r++]=s.x-i,n[r++]=0,n[r++]=s.y-o;for(let a=1;a<t;a++){s=e[a];const t=s.x-i,l=s.y-o;n[r++]=t,n[r++]=0,n[r++]=l,n[r++]=t,n[r++]=0,n[r++]=l}return s=e[0],n[r++]=s.x-i,n[r++]=0,n[r++]=s.y-o,n}(t,i):L(t,i),A=s?L(t,i):void 0,D=i.height/2,R=i.width/2;let O=e.length,V=[],I=s?[]:void 0,N=d,G=g,j=y,Q=f,q=m,Z=h,W=p,Y=w,k=x,J=e[0],K=e[1];Q=c.geodeticSurfaceNormal(J,Q),N=a.Cartesian3.subtract(K,J,N),N=a.Cartesian3.normalize(N,N),Y=a.Cartesian3.cross(Q,N,Y),Y=a.Cartesian3.normalize(Y,Y);let X,$,ee=P[0],ae=P[1];s&&(I=v(J,Y,A,I,c,ee+D,1,1)),k=a.Cartesian3.clone(J,k),J=K,G=a.Cartesian3.negate(N,G);for(let t=1;t<O-1;t++){const i=s?2:1;if(K=e[t+1],J.equals(K)){C("Positions are too close and are considered equivalent with rounding error.");continue}N=a.Cartesian3.subtract(K,J,N),N=a.Cartesian3.normalize(N,N),j=a.Cartesian3.add(N,G,j),j=a.Cartesian3.normalize(j,j),Q=c.geodeticSurfaceNormal(J,Q);const o=a.Cartesian3.multiplyByScalar(Q,a.Cartesian3.dot(N,Q),U);a.Cartesian3.subtract(N,o,o),a.Cartesian3.normalize(o,o);const d=a.Cartesian3.multiplyByScalar(Q,a.Cartesian3.dot(G,Q),_);a.Cartesian3.subtract(G,d,d),a.Cartesian3.normalize(d,d);if(!n.CesiumMath.equalsEpsilon(Math.abs(a.Cartesian3.dot(o,d)),1,n.CesiumMath.EPSILON7)){j=a.Cartesian3.cross(j,Q,j),j=a.Cartesian3.cross(Q,j,j),j=a.Cartesian3.normalize(j,j);const e=1/Math.max(.25,a.Cartesian3.magnitude(a.Cartesian3.cross(j,G,E))),t=M.angleIsGreaterThanPi(N,G,J,c);t?(q=a.Cartesian3.add(J,a.Cartesian3.multiplyByScalar(j,e*R,j),q),Z=a.Cartesian3.add(q,a.Cartesian3.multiplyByScalar(Y,R,Z),Z),u[0]=a.Cartesian3.clone(k,u[0]),u[1]=a.Cartesian3.clone(Z,u[1]),X=T(u,ee+D,ae+D,B),$=r.PolylinePipeline.generateArc({positions:u,granularity:B,ellipsoid:c}),V=H($,Y,S,V,c,X,1),Y=a.Cartesian3.cross(Q,N,Y),Y=a.Cartesian3.normalize(Y,Y),W=a.Cartesian3.add(q,a.Cartesian3.multiplyByScalar(Y,R,W),W),z===l.ROUNDED||z===l.BEVELED?F(q,Z,W,z,t,c,V,S,ae+D,s):(j=a.Cartesian3.negate(j,j),V=v(J,j,S,V,c,ae+D,e,i)),k=a.Cartesian3.clone(W,k)):(q=a.Cartesian3.add(J,a.Cartesian3.multiplyByScalar(j,e*R,j),q),Z=a.Cartesian3.add(q,a.Cartesian3.multiplyByScalar(Y,-R,Z),Z),u[0]=a.Cartesian3.clone(k,u[0]),u[1]=a.Cartesian3.clone(Z,u[1]),X=T(u,ee+D,ae+D,B),$=r.PolylinePipeline.generateArc({positions:u,granularity:B,ellipsoid:c}),V=H($,Y,S,V,c,X,1),Y=a.Cartesian3.cross(Q,N,Y),Y=a.Cartesian3.normalize(Y,Y),W=a.Cartesian3.add(q,a.Cartesian3.multiplyByScalar(Y,-R,W),W),z===l.ROUNDED||z===l.BEVELED?F(q,Z,W,z,t,c,V,S,ae+D,s):V=v(J,j,S,V,c,ae+D,e,i),k=a.Cartesian3.clone(W,k)),G=a.Cartesian3.negate(N,G)}else V=v(k,Y,S,V,c,ee+D,1,1),k=J;ee=ae,ae=P[t+1],J=K}u[0]=a.Cartesian3.clone(k,u[0]),u[1]=a.Cartesian3.clone(J,u[1]),X=T(u,ee+D,ae+D,B),$=r.PolylinePipeline.generateArc({positions:u,granularity:B,ellipsoid:c}),V=H($,Y,S,V,c,X,1),s&&(I=v(J,Y,A,I,c,ae+D,1,1)),O=V.length;const te=s?O+I.length:O,ne=new Float64Array(te);return ne.set(V),s&&ne.set(I,O),ne},e.CornerType=l,e.PolylineVolumeGeometryLibrary=M,e.oneTimeWarning=C}));
