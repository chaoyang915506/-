/**
 * Mars3D平台插件,结合mapv可视化功能插件  mars3d-mapv
 *
 * 版本信息：v3.4.3
 * 编译日期：2022-08-09 13:25:56
 * 版权所有：Copyright by 火星科技  http://mars3d.cn
 * 使用单位：免费公开版 ，2022-06-01
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, (window.mapv || require('mapv')), (window.mars3d || require('mars3d'))) :
  typeof define === 'function' && define.amd ? define(['exports', 'mapv', 'mars3d'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["mars3d-mapv"] = {}, global.mapv, global.mars3d));
})(this, (function (exports, mapv, mars3d) { 
'use strict';var _0x5e77=_0x3965;(function(_0x19418e,_0x1a9edf){var _0x52973d=_0x3965,_0x3fe770=_0x19418e();while(!![]){try{var _0xa8cd3d=-parseInt(_0x52973d(0x1f8))/0x1+parseInt(_0x52973d(0x1c6))/0x2+parseInt(_0x52973d(0x193))/0x3+parseInt(_0x52973d(0x180))/0x4+-parseInt(_0x52973d(0x175))/0x5+-parseInt(_0x52973d(0x1f0))/0x6*(parseInt(_0x52973d(0x1b5))/0x7)+-parseInt(_0x52973d(0x158))/0x8*(-parseInt(_0x52973d(0x204))/0x9);if(_0xa8cd3d===_0x1a9edf)break;else _0x3fe770['push'](_0x3fe770['shift']());}catch(_0x156b23){_0x3fe770['push'](_0x3fe770['shift']());}}}(_0x1fb1,0x5a8a8));function _interopNamespace(_0x3a5f86){var _0x4f04a1=_0x3965;if(_0x3a5f86&&_0x3a5f86[_0x4f04a1(0x17b)])return _0x3a5f86;var _0x2c7667=Object[_0x4f04a1(0x163)](null);return _0x3a5f86&&Object[_0x4f04a1(0x178)](_0x3a5f86)[_0x4f04a1(0x1ef)](function(_0x28c726){var _0x53f8c7=_0x4f04a1;if(_0x28c726!=='default'){var _0x357e27=Object['getOwnPropertyDescriptor'](_0x3a5f86,_0x28c726);Object[_0x53f8c7(0x171)](_0x2c7667,_0x28c726,_0x357e27[_0x53f8c7(0x179)]?_0x357e27:{'enumerable':!![],'get':function(){return _0x3a5f86[_0x28c726];}});}}),_0x2c7667['default']=_0x3a5f86,_0x2c7667;}var mapv__namespace=_interopNamespace(mapv),mars3d__namespace=_interopNamespace(mars3d);function ownKeys(_0x3c56a6,_0x35a438){var _0x12dcb0=_0x3965,_0x2f136d=Object[_0x12dcb0(0x178)](_0x3c56a6);if(Object[_0x12dcb0(0x15a)]){var _0x5010ca=Object['getOwnPropertySymbols'](_0x3c56a6);_0x35a438&&(_0x5010ca=_0x5010ca['filter'](function(_0x3a8dc9){var _0x2f3193=_0x12dcb0;return Object['getOwnPropertyDescriptor'](_0x3c56a6,_0x3a8dc9)[_0x2f3193(0x170)];})),_0x2f136d[_0x12dcb0(0x1dc)][_0x12dcb0(0x1bf)](_0x2f136d,_0x5010ca);}return _0x2f136d;}function _objectSpread2(_0x369a11){var _0x1e66d9=_0x3965;for(var _0x1f0e6a=0x1;_0x1f0e6a<arguments[_0x1e66d9(0x1e9)];_0x1f0e6a++){var _0x2421df=null!=arguments[_0x1f0e6a]?arguments[_0x1f0e6a]:{};_0x1f0e6a%0x2?ownKeys(Object(_0x2421df),!0x0)[_0x1e66d9(0x1ef)](function(_0x4411ff){_defineProperty(_0x369a11,_0x4411ff,_0x2421df[_0x4411ff]);}):Object[_0x1e66d9(0x1cc)]?Object[_0x1e66d9(0x1b3)](_0x369a11,Object[_0x1e66d9(0x1cc)](_0x2421df)):ownKeys(Object(_0x2421df))[_0x1e66d9(0x1ef)](function(_0x40a183){var _0x1b91eb=_0x1e66d9;Object[_0x1b91eb(0x171)](_0x369a11,_0x40a183,Object[_0x1b91eb(0x17a)](_0x2421df,_0x40a183));});}return _0x369a11;}function _classCallCheck(_0x315378,_0x30f5f9){var _0x4db610=_0x3965;if(!(_0x315378 instanceof _0x30f5f9))throw new TypeError(_0x4db610(0x202));}function _defineProperties(_0x555478,_0x3eed59){var _0x784d70=_0x3965;for(var _0x411d4e=0x0;_0x411d4e<_0x3eed59['length'];_0x411d4e++){var _0x4caa41=_0x3eed59[_0x411d4e];_0x4caa41[_0x784d70(0x170)]=_0x4caa41['enumerable']||![],_0x4caa41[_0x784d70(0x200)]=!![];if(_0x784d70(0x1d1)in _0x4caa41)_0x4caa41[_0x784d70(0x1c0)]=!![];Object['defineProperty'](_0x555478,_0x4caa41[_0x784d70(0x185)],_0x4caa41);}}function _createClass(_0x1957d7,_0x364aa5,_0x1f4d96){var _0x328b32=_0x3965;if(_0x364aa5)_defineProperties(_0x1957d7['prototype'],_0x364aa5);if(_0x1f4d96)_defineProperties(_0x1957d7,_0x1f4d96);return Object[_0x328b32(0x171)](_0x1957d7,_0x328b32(0x173),{'writable':![]}),_0x1957d7;}function _defineProperty(_0x1aab7a,_0x232cd0,_0x5d0c96){return _0x232cd0 in _0x1aab7a?Object['defineProperty'](_0x1aab7a,_0x232cd0,{'value':_0x5d0c96,'enumerable':!![],'configurable':!![],'writable':!![]}):_0x1aab7a[_0x232cd0]=_0x5d0c96,_0x1aab7a;}function _0x3965(_0x5a1558,_0x2964bf){var _0x1fb132=_0x1fb1();return _0x3965=function(_0x39650a,_0x397421){_0x39650a=_0x39650a-0x158;var _0x2de002=_0x1fb132[_0x39650a];if(_0x3965['BqGnTw']===undefined){var _0x2ae9d4=function(_0x3a5f86){var _0x2c7667='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var _0x28c726='',_0x357e27='';for(var _0x3c56a6=0x0,_0x35a438,_0x2f136d,_0x5010ca=0x0;_0x2f136d=_0x3a5f86['charAt'](_0x5010ca++);~_0x2f136d&&(_0x35a438=_0x3c56a6%0x4?_0x35a438*0x40+_0x2f136d:_0x2f136d,_0x3c56a6++%0x4)?_0x28c726+=String['fromCharCode'](0xff&_0x35a438>>(-0x2*_0x3c56a6&0x6)):0x0){_0x2f136d=_0x2c7667['indexOf'](_0x2f136d);}for(var _0x3a8dc9=0x0,_0x369a11=_0x28c726['length'];_0x3a8dc9<_0x369a11;_0x3a8dc9++){_0x357e27+='%'+('00'+_0x28c726['charCodeAt'](_0x3a8dc9)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x357e27);};_0x3965['WafZmq']=_0x2ae9d4,_0x5a1558=arguments,_0x3965['BqGnTw']=!![];}var _0x2e4237=_0x1fb132[0x0],_0x13578a=_0x39650a+_0x2e4237,_0x474449=_0x5a1558[_0x13578a];return!_0x474449?(_0x2de002=_0x3965['WafZmq'](_0x2de002),_0x5a1558[_0x13578a]=_0x2de002):_0x2de002=_0x474449,_0x2de002;},_0x3965(_0x5a1558,_0x2964bf);}function _inherits(_0x599115,_0x25d549){var _0x4d248a=_0x3965;if(typeof _0x25d549!=='function'&&_0x25d549!==null)throw new TypeError(_0x4d248a(0x160));_0x599115[_0x4d248a(0x173)]=Object[_0x4d248a(0x163)](_0x25d549&&_0x25d549['prototype'],{'constructor':{'value':_0x599115,'writable':!![],'configurable':!![]}}),Object[_0x4d248a(0x171)](_0x599115,'prototype',{'writable':![]});if(_0x25d549)_setPrototypeOf(_0x599115,_0x25d549);}function _getPrototypeOf(_0x49c2f4){var _0x3439e7=_0x3965;return _getPrototypeOf=Object[_0x3439e7(0x20c)]?Object['getPrototypeOf']:function _0x32db49(_0x141106){var _0x516cd0=_0x3439e7;return _0x141106[_0x516cd0(0x1df)]||Object[_0x516cd0(0x18b)](_0x141106);},_getPrototypeOf(_0x49c2f4);}function _setPrototypeOf(_0x354fc9,_0x589448){return _setPrototypeOf=Object['setPrototypeOf']||function _0x4c38a7(_0x1329d9,_0x3fe367){return _0x1329d9['__proto__']=_0x3fe367,_0x1329d9;},_setPrototypeOf(_0x354fc9,_0x589448);}function _0x1fb1(){var _0x4298cf=['DxbKyxrLrgf0yq','Aw5PDefUAw1HDg9Y','yxjNq2HLy2S','rgf0yvnLDa','BgvMDa','zhjHD0nVBNrLEhq','Bw9Kzq','Bgf5zxi','zgvMAw5LuhjVCgvYDgLLCW','zgf0yvnLDa','mty5nZi5CMDRuK14','CMvZAxPL','BwfWDKf1Dg9izwLNAhq','Eg1HEa','q2fYDgvZAwfUmW','y2XLyxjszwn0','y2XPy2TfDMvUDa','ywrKqw5PBwf0B3jfDMvUDa','zMLSBfn0EwXL','x29UtwfWq2XPy2S','yxbWBhK','D3jPDgfIBgu','y2fTzxjHtw92zuvUza','Cg9PBNrLCKv2zw50CW','ywrK','BwfWDKrLChrOvgvZDa','y2fTzxjH','ndi5mdG2wvrUvgLy','C2nLBMu','ywjZB2X1Dgu','CMvZDg9Yzq','CgfYzw50rwXLBwvUDa','BwfYCZnKlw1HChy','z2v0t3DUuhjVCgvYDhLezxnJCMLWDg9YCW','x29Utw92zvn0yxj0rxzLBNq','6k+35BYv5ywLig1HChyG5BQtia','zgf0yq','Aw5PDerHDgfsyw5Nzq','DMfSDwu','vxrPBa','y29UC3rYDwn0B3i','rxzLBNruExbL','x3nPEMu','yw5PBwf0B3jnB3zLzw5KrxzLBNq','CMvTB3zL','zgvWDgHuzxn0','z2XVyMfSq29TCg9ZAxrLt3bLCMf0Aw9U','ChjVy2vZC0rHDge','D2LUzg93ug9ZAxrPB24','ChvZAa','y29UC3rYDwn0','x3jLBw92zwriB29R','x19WCM90B19F','z2v0q29UDgv4Da','y2XPy2S','zNvUy3rPB24','ywrKrgf0yq','txvSDgLqB2X5z29U','y2fYDgvZAwfUvg9dyw52yxndB29YzgLUyxrLCW','x21HCa','z2v0rgf0yq','x2nHy2HLx2v2zw50','BgvUz3rO','Bw91C2vTB3zL','DxbKyxrL','C2HHBq','yw5PBwf0B3i','Ew1PBG','zM9YrwfJAa','ntrvtuXfzwW','yMfPzhvnyxbmyxLLCG','yMLUzev2zw50','C3rHCNq','C2L6zq','C3rLCa','yxv0BW','AgvPz2H0','nJi3otCZtxfeCxfi','zhjHDW','yMLUza','CMvTB3zLrgf0yq','Aw5PDerLDMLJzvbPEgvSuMf0Aw8','ug9SEwDVBG','yw5PBwf0Aw9U','Aw5PDa','y29UzMLNDxjHyMXL','x3jLC2v0','q2fUBM90ignHBgWGysbJBgfZCYbHCYbHigz1BMn0Aw9U','DhLWzq','ntrxt0n0A3G','rgvYAxzLzcbJB25ZDhj1y3rVCNmGBwf5ig9UBhKGCMv0DxjUig9IAMvJDcbVCIb1BMrLzMLUzwq','zgvZDhjVEq','x3nOB3DiB29R','B3b0Aw9UCW','uMvJDgfUz2XL','Bwv0Ag9KCW','DxbKyxrLq2fSBgjHy2S','C2v0uhjVDg90ExbLt2y','txvSDgLmAw5Lu3rYAw5N','u0nftKuZra','D2LKDgG','ndGXody0B2T1B29l','Bw91C2veB3DU','z2v0t3DUuhjVCgvYDhLtEw1IB2XZ','y2XLyxi','AxnfBMfIBgvKvgLTzq','CMvUzgvY','x2nHBNzHC1vWzgf0zq','tgLUzvn0CMLUzW','u3vWzxiGzxHWCMvZC2LVBIbTDxn0igvPDgHLCIbIzsbUDwXSig9YigeGzNvUy3rPB24','Bw91C2vnB3zL','zNjVBurLz3jLzxm','y3jLyxrL','y29UDgv4Da','BwfWDG','y2XLyxjeyxrH','q2fYDg9NCMfWAgLJ','DhjHBNnMzxjdB29YzgLUyxrL','Dg9W','zML4zwrizwLNAhq','Cg9ZDfjLBMrLCG','Dw5IAw5KrxzLBNq','C3rLChnsyw5Nzq','C2v0wKLUzgv4','C3r5Bgu','zw51BwvYywjSzq','zgvMAw5LuhjVCgvYDhK','ug9PBNq','ChjVDg90ExbL','mhb4','mtiYnZi4mfPZsLnuDW','DgLTzq','DgHPCYbOyxnUj3qGyMvLBIbPBML0AwfSAxnLzcaTihn1CgvYkcKGAgfZBID0igjLzw4Gy2fSBgvK','A2v5CW','z2v0','z2v0t3DUuhjVCgvYDhLezxnJCMLWDg9Y','x19LC01VzhvSzq','y2fUDMfZtgf5zxi','EKLUzgv4','rMvHDhvYzunVBgXLy3rPB24','y2fUDMfZ','mtq4odyZmLj3B1r3vW','x2fKzgvKsg9VAW','AgfZt3DUuhjVCgvYDhK','C3rVCa','x2nVB3jKAw5HDgvZ','A2v5','CMvTB3zLq2HPBgq','y2XHBxbuB0DYB3vUza','qMfZzuXHEwvY','Bgf5zxjPza','y29Uy2f0','z2v0uhjVDg90ExbLt2y','C3rVCefUAwfTyxrPB24','Dw5KzwzPBMvK','Ew1HEa','BM9Uzq','C3rLChm','y2fSBa','Cg9ZAxrPB25xqW','mtu0mZiYn1H0ChHYtq','ywXS','rg9TvxrPBa','C2nHBgu','x2rHDge','zMLSBfjLy3q','B2zM','x29Utw92zuvUzev2zw50','x3nLDe9WDgLVBNniB29R','yMXVy2S','x21HCfzszw5KzxjLCG','zgv2AwnLugL4zwXsyxrPBW','x3bVAw50zxjfDMvUDhm','BwfWDKzPEgvKsgvPz2H0','Dw5PDa','x29UtwfWtw91C2vnB3zL','yw5PBwf0B3jnB3zLC3rHCNrfDMvUDa','C2f2zq','rwXSAxbZB2LKywXpy2nSDwrLCG','Eg1PBG','zgvMyxvSDa','x2nYzwf0zunHBNzHCW','CMDIysGWlcaWlcaWlcaUmsK','Cg9ZAxrPB24'];_0x1fb1=function(){return _0x4298cf;};return _0x1fb1();}function _isNativeReflectConstruct(){var _0x299c20=_0x3965;if(typeof Reflect===_0x299c20(0x18d)||!Reflect['construct'])return![];if(Reflect['construct'][_0x299c20(0x1ec)])return![];if(typeof Proxy===_0x299c20(0x1e2))return!![];try{return Boolean[_0x299c20(0x173)]['valueOf']['call'](Reflect[_0x299c20(0x1dd)](Boolean,[],function(){})),!![];}catch(_0x362bff){return![];}}function _assertThisInitialized(_0x37c260){var _0x1f32d6=_0x3965;if(_0x37c260===void 0x0)throw new ReferenceError(_0x1f32d6(0x177));return _0x37c260;}function _possibleConstructorReturn(_0x469b51,_0x595e5a){var _0x5469fa=_0x3965;if(_0x595e5a&&(typeof _0x595e5a==='object'||typeof _0x595e5a===_0x5469fa(0x1e2)))return _0x595e5a;else{if(_0x595e5a!==void 0x0)throw new TypeError(_0x5469fa(0x205));}return _assertThisInitialized(_0x469b51);}function _createSuper(_0x437921){var _0x57a681=_isNativeReflectConstruct();return function _0x37f20f(){var _0x503b07=_0x3965,_0x58fbf4=_getPrototypeOf(_0x437921),_0xd43e49;if(_0x57a681){var _0x1ed254=_getPrototypeOf(this)[_0x503b07(0x1d3)];_0xd43e49=Reflect[_0x503b07(0x1dd)](_0x58fbf4,arguments,_0x1ed254);}else _0xd43e49=_0x58fbf4[_0x503b07(0x1bf)](this,arguments);return _possibleConstructorReturn(this,_0xd43e49);};}function _superPropBase(_0x27e6ba,_0x1cc11b){var _0x8305=_0x3965;while(!Object[_0x8305(0x173)][_0x8305(0x182)]['call'](_0x27e6ba,_0x1cc11b)){_0x27e6ba=_getPrototypeOf(_0x27e6ba);if(_0x27e6ba===null)break;}return _0x27e6ba;}function _get(){var _0xcb3f27=_0x3965;return typeof Reflect!==_0xcb3f27(0x18d)&&Reflect[_0xcb3f27(0x179)]?_get=Reflect[_0xcb3f27(0x179)]:_get=function _0x422890(_0x572319,_0x4d640e,_0x36bd4b){var _0x4bae75=_0xcb3f27,_0x419e7f=_superPropBase(_0x572319,_0x4d640e);if(!_0x419e7f)return;var _0x51be23=Object[_0x4bae75(0x17a)](_0x419e7f,_0x4d640e);if(_0x51be23[_0x4bae75(0x179)])return _0x51be23[_0x4bae75(0x179)]['call'](arguments[_0x4bae75(0x1e9)]<0x3?_0x572319:_0x36bd4b);return _0x51be23[_0x4bae75(0x1d1)];},_get['apply'](this,arguments);}var Cesium$1=mars3d__namespace['Cesium'],baiduMapLayer=mapv__namespace?mapv__namespace[_0x5e77(0x1f1)]:null,BaseLayer$1=baiduMapLayer?baiduMapLayer[_0x5e77(0x1df)]:Function,MapVRenderer=function(_0x325a29){var _0xb51707=_0x5e77;_inherits(_0x323778,_0x325a29);var _0x82f1f6=_createSuper(_0x323778);function _0x323778(_0x3faa08,_0x24bbaa,_0x220c87,_0x10767f){var _0x44a09d=_0x3965,_0xcea7be;_classCallCheck(this,_0x323778),_0xcea7be=_0x82f1f6[_0x44a09d(0x191)](this,_0x3faa08,_0x24bbaa,_0x220c87);if(!BaseLayer$1)return _possibleConstructorReturn(_0xcea7be);return _0xcea7be['map']=_0x3faa08,_0xcea7be[_0x44a09d(0x1c7)]=_0x3faa08[_0x44a09d(0x1c7)],_0xcea7be['dataSet']=_0x24bbaa,_0x220c87=_0x220c87||{},_0xcea7be[_0x44a09d(0x1ff)](_0x220c87),_0xcea7be[_0x44a09d(0x1ad)](_0x220c87),_0xcea7be[_0x44a09d(0x1fc)](),_0xcea7be['canvasLayer']=_0x10767f,_0xcea7be[_0x44a09d(0x18c)]=!0x1,_0xcea7be[_0x44a09d(0x1fe)]=_0x220c87[_0x44a09d(0x1fe)],_0xcea7be;}return _createClass(_0x323778,[{'key':'initDevicePixelRatio','value':function _0x47c335(){var _0x1972f2=_0x3965;this[_0x1972f2(0x19e)]=window['devicePixelRatio']||0x1;}},{'key':_0xb51707(0x1bc),'value':function _0x2c296c(){}},{'key':'animatorMovestartEvent','value':function _0x14e798(){var _0xe47a9a=_0xb51707,_0x14b512=this[_0xe47a9a(0x208)]['animation'];this['isEnabledTime']()&&this[_0xe47a9a(0x1ed)]&&(this[_0xe47a9a(0x190)][_0xe47a9a(0x1f5)]=_0x14b512[_0xe47a9a(0x16d)][_0xe47a9a(0x1f3)]);}},{'key':_0xb51707(0x1d6),'value':function _0x4fc0a3(){var _0x27969d=_0xb51707;this[_0x27969d(0x15c)]()&&this[_0x27969d(0x1ed)];}},{'key':_0xb51707(0x1e0),'value':function _0x517c00(){var _0x4f2c9f=_0xb51707;return this[_0x4f2c9f(0x17c)][_0x4f2c9f(0x17f)][_0x4f2c9f(0x1e0)](this[_0x4f2c9f(0x164)]);}},{'key':'init','value':function _0x5090e8(_0x32d82d){var _0x2de796=_0xb51707;this[_0x2de796(0x208)]=_0x32d82d,this[_0x2de796(0x1d0)](_0x32d82d),this[_0x2de796(0x164)]=this[_0x2de796(0x208)][_0x2de796(0x164)]||'2d',this[_0x2de796(0x208)]['zIndex']&&this[_0x2de796(0x17c)]&&this[_0x2de796(0x17c)][_0x2de796(0x16e)]&&this[_0x2de796(0x17c)][_0x2de796(0x16e)](this[_0x2de796(0x208)][_0x2de796(0x17d)]),this[_0x2de796(0x1ac)]();}},{'key':_0xb51707(0x15e),'value':function _0x3bd0ed(_0x2bcb40){var _0x1ed77f=_0xb51707,_0x2cd611=this['scene'];if(this[_0x1ed77f(0x17c)]&&!this['stopAniamation']){var _0x2af8e1=this[_0x1ed77f(0x208)][_0x1ed77f(0x1fe)],_0x3c90b8=this['getContext']();if(this[_0x1ed77f(0x15c)]()){if(void 0x0===_0x2bcb40)return void this[_0x1ed77f(0x15b)](_0x3c90b8);this['context']==='2d'&&(_0x3c90b8[_0x1ed77f(0x1a4)](),_0x3c90b8[_0x1ed77f(0x1d9)]='destination-out',_0x3c90b8[_0x1ed77f(0x1bd)]=_0x1ed77f(0x1a9),_0x3c90b8[_0x1ed77f(0x198)](0x0,0x0,_0x3c90b8[_0x1ed77f(0x17f)][_0x1ed77f(0x20f)],_0x3c90b8['canvas'][_0x1ed77f(0x1f7)]),_0x3c90b8[_0x1ed77f(0x1c9)]());}else this[_0x1ed77f(0x15b)](_0x3c90b8);if(this['context']==='2d')for(var _0x33653b in this[_0x1ed77f(0x208)]){_0x3c90b8[_0x33653b]=this[_0x1ed77f(0x208)][_0x33653b];}else _0x3c90b8[_0x1ed77f(0x15b)](_0x3c90b8['COLOR_BUFFER_BIT']);var _0x422478={'transferCoordinate':function _0x5223c9(_0x26dd0d){var _0xbca1fe=_0x1ed77f,_0x4403e8=null,_0x4772ee=_0x2cd611['mapvFixedHeight'];_0x2cd611[_0xbca1fe(0x1b7)]&&(_0x4772ee=_0x2cd611['globe']['getHeight'](Cesium$1[_0xbca1fe(0x167)][_0xbca1fe(0x162)](_0x26dd0d[0x0],_0x26dd0d[0x1])));var _0x597cc1=Cesium$1[_0xbca1fe(0x1b9)]['fromDegrees'](_0x26dd0d[0x0],_0x26dd0d[0x1],_0x4772ee);if(!_0x597cc1)return _0x4403e8;var _0x325c16=_0x2cd611[_0xbca1fe(0x1e5)](_0x597cc1);if(!_0x325c16)return _0x4403e8;if(_0x2cd611[_0xbca1fe(0x1c4)]&&_0x2cd611[_0xbca1fe(0x1b1)]===Cesium$1['SceneMode'][_0xbca1fe(0x20e)]){var _0x30af2f=new Cesium$1[(_0xbca1fe(0x1a5))](_0x2cd611['globe']['ellipsoid'],_0x2cd611[_0xbca1fe(0x1c5)][_0xbca1fe(0x192)]),_0x3092fa=_0x30af2f['isPointVisible'](_0x597cc1);if(!_0x3092fa)return _0x4403e8;}return[_0x325c16['x'],_0x325c16['y']];}};void 0x0!==_0x2bcb40&&(_0x422478['filter']=function(_0x400e44){var _0x1ff882=_0x1ed77f,_0x3487e6=_0x2af8e1['trails']||0xa;return!!(_0x2bcb40&&_0x400e44[_0x1ff882(0x176)]>_0x2bcb40-_0x3487e6&&_0x400e44['time']<_0x2bcb40);});var _0x567ae6=this['dataSet'][_0x1ed77f(0x179)](_0x422478);this[_0x1ed77f(0x1da)](_0x567ae6),this[_0x1ed77f(0x208)][_0x1ed77f(0x1a1)]==='m'&&this[_0x1ed77f(0x208)][_0x1ed77f(0x1f4)],this['options'][_0x1ed77f(0x1d5)]=this[_0x1ed77f(0x208)][_0x1ed77f(0x1f4)];var _0x1ac14a=_0x2cd611[_0x1ed77f(0x1e5)](Cesium$1[_0x1ed77f(0x1b9)][_0x1ed77f(0x162)](0x0,0x0));if(!_0x1ac14a)return;this[_0x1ed77f(0x1b0)](_0x3c90b8,new mapv__namespace[(_0x1ed77f(0x1ae))](_0x567ae6),this[_0x1ed77f(0x208)],_0x1ac14a),this[_0x1ed77f(0x208)]['updateCallback']&&this[_0x1ed77f(0x208)][_0x1ed77f(0x20b)](_0x2bcb40);}}},{'key':_0xb51707(0x1ab),'value':function _0x17be30(_0x2d2e90,_0x4bce6e){var _0x23dde7=_0xb51707,_0x57af61=_0x2d2e90;_0x57af61&&_0x57af61[_0x23dde7(0x179)]&&(_0x57af61=_0x57af61[_0x23dde7(0x179)]()),void 0x0!==_0x57af61&&this[_0x23dde7(0x1b4)]['set'](_0x57af61),_get(_getPrototypeOf(_0x323778[_0x23dde7(0x173)]),'update',this)[_0x23dde7(0x191)](this,{'options':_0x4bce6e});}},{'key':'addData','value':function _0x3e0ae4(_0x55b084,_0x33b8d3){var _0x181e6c=_0xb51707,_0x382341=_0x55b084;_0x55b084&&_0x55b084[_0x181e6c(0x179)]&&(_0x382341=_0x55b084[_0x181e6c(0x179)]()),this[_0x181e6c(0x1b4)][_0x181e6c(0x1c3)](_0x382341),this[_0x181e6c(0x1eb)]({'options':_0x33b8d3});}},{'key':'getData','value':function _0xc1fd5e(){return this['dataSet'];}},{'key':_0xb51707(0x1fb),'value':function _0x2b1963(_0x2d91a0){var _0x13126d=_0xb51707;if(this[_0x13126d(0x1b4)]){var _0x5d0b21=this['dataSet'][_0x13126d(0x179)]({'filter':function _0x4861e2(_0x259814){var _0x5603a0=_0x13126d;return _0x2d91a0==null||typeof _0x2d91a0!==_0x5603a0(0x1e2)||!_0x2d91a0(_0x259814);}});this[_0x13126d(0x1b4)]['set'](_0x5d0b21),this[_0x13126d(0x1eb)]({'options':null});}}},{'key':_0xb51707(0x166),'value':function _0x342317(){var _0x1d477f=_0xb51707;this[_0x1d477f(0x1b4)]&&this['dataSet'][_0x1d477f(0x15b)](),this[_0x1d477f(0x1eb)]({'options':null});}},{'key':_0xb51707(0x1f9),'value':function _0x1e7991(){var _0xe46d4=_0xb51707;this[_0xe46d4(0x17c)][_0xe46d4(0x1f9)]();}},{'key':'clear','value':function _0xea712c(_0x587403){var _0x4a9bd5=_0xb51707;_0x587403&&_0x587403['clearRect']&&_0x587403[_0x4a9bd5(0x1ba)](0x0,0x0,_0x587403[_0x4a9bd5(0x17f)][_0x4a9bd5(0x20f)],_0x587403[_0x4a9bd5(0x17f)][_0x4a9bd5(0x1f7)]);}},{'key':_0xb51707(0x206),'value':function _0x12fdcc(){var _0x3aaaab=_0xb51707;this[_0x3aaaab(0x15b)](this['getContext']()),this['clearData'](),this[_0x3aaaab(0x1ed)]&&this[_0x3aaaab(0x1ed)][_0x3aaaab(0x183)](),this[_0x3aaaab(0x1ed)]=null,this[_0x3aaaab(0x17c)]=null;}}]),_0x323778;}(BaseLayer$1);if(mapv__namespace!==null&&mapv__namespace!==void 0x0&&mapv__namespace[_0x5e77(0x1ae)])mapv__namespace[_0x5e77(0x1ae)][_0x5e77(0x173)][_0x5e77(0x168)]=function(_0x588a66,_0x139526,_0x494859,_0x1be11b){var _0x126a07=_0x5e77;_0x1be11b=_0x1be11b||_0x126a07(0x184),_0x494859=_0x494859||'coordinates';for(var _0xc4246b=0x0;_0xc4246b<_0x588a66[_0x126a07(0x1e9)];_0xc4246b++){var _0x4d8b3a=_0x588a66[_0xc4246b]['geometry'],_0x5f2b38=_0x4d8b3a[_0x494859];switch(_0x4d8b3a[_0x126a07(0x203)]){case _0x126a07(0x172):{var _0x3441b9=_0x139526(_0x5f2b38);_0x3441b9?_0x4d8b3a[_0x1be11b]=_0x3441b9:_0x4d8b3a[_0x1be11b]=[-0x3e7,-0x3e7];}break;case _0x126a07(0x15f):{var _0x6914f3=[];for(var _0x4c8b0c=0x0;_0x4c8b0c<_0x5f2b38[_0x126a07(0x1e9)];_0x4c8b0c++){var _0x10c2a1=_0x139526(_0x5f2b38[_0x4c8b0c]);_0x10c2a1&&_0x6914f3[_0x126a07(0x1dc)](_0x10c2a1);}_0x4d8b3a[_0x1be11b]=_0x6914f3;}break;case _0x126a07(0x20d):case _0x126a07(0x1fd):{var _0x503093=_0x5b2384(_0x5f2b38);_0x4d8b3a[_0x1be11b]=_0x503093;}break;case _0x126a07(0x1e4):{var _0x1b4e5c=[];for(var _0x1b4c76=0x0;_0x1b4c76<_0x5f2b38[_0x126a07(0x1e9)];_0x1b4c76++){var _0x48d9ae=_0x5b2384(_0x5f2b38[_0x1b4c76]);_0x48d9ae[_0x126a07(0x1e9)]>0x0&&_0x1b4e5c['push'](_0x48d9ae);}_0x4d8b3a[_0x1be11b]=_0x1b4e5c;}break;}}function _0x5b2384(_0x3468a8){var _0x15ae39=_0x126a07,_0x54734b=[];for(var _0x4392d1=0x0;_0x4392d1<_0x3468a8[_0x15ae39(0x1e9)];_0x4392d1++){var _0xa7cdfb=_0x3468a8[_0x4392d1],_0x16efb3=[];for(var _0x85b47c=0x0;_0x85b47c<_0xa7cdfb['length'];_0x85b47c++){var _0x5685fd=_0x139526(_0xa7cdfb[_0x85b47c]);_0x5685fd&&_0x16efb3['push'](_0x5685fd);}_0x16efb3[_0x15ae39(0x1e9)]>0x0&&_0x54734b[_0x15ae39(0x1dc)](_0x16efb3);}return _0x54734b;}return _0x588a66;};else throw new Error(_0x5e77(0x1ce));var Cesium=mars3d__namespace['Cesium'],BaseLayer=mars3d__namespace[_0x5e77(0x1b2)][_0x5e77(0x188)],divId=0x0,MapVLayer=function(_0x3cb42f){var _0x3ff52d=_0x5e77;_inherits(_0x1685bd,_0x3cb42f);var _0x163535=_createSuper(_0x1685bd);function _0x1685bd(_0x1802b5,_0x39caff){var _0x1cc4a7=_0x3965,_0x20a353;return _classCallCheck(this,_0x1685bd),_0x20a353=_0x163535[_0x1cc4a7(0x191)](this,_0x1802b5),_0x20a353[_0x1cc4a7(0x19f)]=_0x20a353['options']['pointerEvents'],_0x20a353[_0x1cc4a7(0x1b4)]=_0x39caff||new mapv__namespace[(_0x1cc4a7(0x1ae))](_0x1802b5[_0x1cc4a7(0x1cf)]),_0x20a353[_0x1cc4a7(0x17f)]=null,_0x20a353;}return _createClass(_0x1685bd,[{'key':_0x3ff52d(0x1c2),'get':function _0xfda1de(){return this['_pointerEvents'];},'set':function _0x353860(_0x185daf){var _0xf01cf4=_0x3ff52d;this[_0xf01cf4(0x19f)]=_0x185daf,this['canvas']&&(_0x185daf?this[_0xf01cf4(0x17f)][_0xf01cf4(0x16f)]['pointerEvents']=_0xf01cf4(0x194):this[_0xf01cf4(0x17f)][_0xf01cf4(0x16f)][_0xf01cf4(0x1c2)]=_0xf01cf4(0x18f));}},{'key':_0x3ff52d(0x207),'value':function _0x378558(_0x2bdc3a){var _0x6cee48=_0x3ff52d;_0x2bdc3a?this[_0x6cee48(0x17f)]['style']['display']=_0x6cee48(0x19c):this[_0x6cee48(0x17f)][_0x6cee48(0x16f)]['display']=_0x6cee48(0x18f);}},{'key':'_mountedHook','value':function _0x230758(){var _0xcb6567=_0x3ff52d,_0x7b265c,_0xb330f2,_0x1f1231;this[_0xcb6567(0x1e6)][_0xcb6567(0x1c7)][_0xcb6567(0x1c4)]=(_0x7b265c=this[_0xcb6567(0x208)][_0xcb6567(0x1d8)])!==null&&_0x7b265c!==void 0x0?_0x7b265c:!![],this[_0xcb6567(0x1e6)]['scene'][_0xcb6567(0x1b7)]=(_0xb330f2=this[_0xcb6567(0x208)][_0xcb6567(0x187)])!==null&&_0xb330f2!==void 0x0?_0xb330f2:![],this['_map'][_0xcb6567(0x1c7)][_0xcb6567(0x1a0)]=(_0x1f1231=this[_0xcb6567(0x208)][_0xcb6567(0x16a)])!==null&&_0x1f1231!==void 0x0?_0x1f1231:0x0;}},{'key':_0x3ff52d(0x181),'value':function _0x1bbcf4(){var _0x7870d=_0x3ff52d;this[_0x7870d(0x1b4)]&&(!this['dataSet'][_0x7870d(0x197)]||this[_0x7870d(0x1b4)][_0x7870d(0x197)][_0x7870d(0x1e9)]===0x0)&&(this['dataSet'][_0x7870d(0x197)]=[][_0x7870d(0x18a)](this['dataSet']['_dataCache'])),this[_0x7870d(0x19d)]=new MapVRenderer(this['_map'],this['dataSet'],this['options'],this),this[_0x7870d(0x1fc)](),this['canvas']=this['_createCanvas'](),this['render']=this['render'][_0x7870d(0x1fa)](this),this[_0x7870d(0x1f2)](),this[_0x7870d(0x201)]();}},{'key':'_removedHook','value':function _0x2eaa81(){var _0x2ae300=_0x3ff52d;this[_0x2ae300(0x16c)](),this['_mapVRenderer']&&(this['_mapVRenderer'][_0x2ae300(0x206)](),this['_mapVRenderer']=null),this[_0x2ae300(0x17f)][_0x2ae300(0x1ca)][_0x2ae300(0x186)](this[_0x2ae300(0x17f)]);}},{'key':_0x3ff52d(0x1fc),'value':function _0xc355f7(){var _0xd6a83=_0x3ff52d;this[_0xd6a83(0x19e)]=window[_0xd6a83(0x19e)]||0x1;}},{'key':_0x3ff52d(0x1f2),'value':function _0x338641(){var _0x425407=_0x3ff52d,_0x3a987e,_0x250029,_0x5ec529,_0x69f3a0;this['_map']['on'](mars3d__namespace['EventType'][_0x425407(0x159)],this[_0x425407(0x1cd)],this),this[_0x425407(0x1e6)]['on'](mars3d__namespace['EventType']['cameraMoveStart'],this[_0x425407(0x1cd)],this),this[_0x425407(0x1e6)]['on'](mars3d__namespace[_0x425407(0x1d4)][_0x425407(0x1c1)],this['_onMoveEndEvent'],this),(_0x3a987e=this['options'])!==null&&_0x3a987e!==void 0x0&&(_0x250029=_0x3a987e[_0x425407(0x20a)])!==null&&_0x250029!==void 0x0&&_0x250029[_0x425407(0x1e1)]&&this['_map']['on'](mars3d__namespace[_0x425407(0x1d4)][_0x425407(0x1e1)],this[_0x425407(0x1be)],this),(_0x5ec529=this['options'])!==null&&_0x5ec529!==void 0x0&&(_0x69f3a0=_0x5ec529[_0x425407(0x20a)])!==null&&_0x69f3a0!==void 0x0&&_0x69f3a0['mousemove']&&this[_0x425407(0x1e6)]['on'](mars3d__namespace[_0x425407(0x1d4)][_0x425407(0x161)],this[_0x425407(0x1a2)],this);}},{'key':_0x3ff52d(0x16c),'value':function _0x483dbf(){var _0x237f00=_0x3ff52d,_0x5799dd,_0x25cda2,_0x41040a,_0xeab691;this[_0x237f00(0x1e6)][_0x237f00(0x199)](mars3d__namespace[_0x237f00(0x1d4)][_0x237f00(0x159)],this[_0x237f00(0x1cd)],this),this[_0x237f00(0x1e6)][_0x237f00(0x199)](mars3d__namespace['EventType']['cameraMoveStart'],this[_0x237f00(0x1cd)],this),this[_0x237f00(0x1e6)]['off'](mars3d__namespace['EventType'][_0x237f00(0x1c1)],this[_0x237f00(0x19a)],this),this[_0x237f00(0x1e6)]['off'](mars3d__namespace[_0x237f00(0x1d4)]['postRender'],this[_0x237f00(0x201)],this),(_0x5799dd=this['options'])!==null&&_0x5799dd!==void 0x0&&(_0x25cda2=_0x5799dd[_0x237f00(0x20a)])!==null&&_0x25cda2!==void 0x0&&_0x25cda2['click']&&this[_0x237f00(0x1e6)][_0x237f00(0x199)](mars3d__namespace[_0x237f00(0x1d4)][_0x237f00(0x1e1)],this[_0x237f00(0x1be)],this),(_0x41040a=this[_0x237f00(0x208)])!==null&&_0x41040a!==void 0x0&&(_0xeab691=_0x41040a[_0x237f00(0x20a)])!==null&&_0xeab691!==void 0x0&&_0xeab691['mousemove']&&this[_0x237f00(0x1e6)][_0x237f00(0x199)](mars3d__namespace[_0x237f00(0x1d4)]['mouseMove'],this['_onMapMouseMove'],this);}},{'key':_0x3ff52d(0x1cd),'value':function _0xa88752(){var _0x3aa7c4=_0x3ff52d;this[_0x3aa7c4(0x19d)]&&(this[_0x3aa7c4(0x19d)][_0x3aa7c4(0x1a3)](),this[_0x3aa7c4(0x1e6)]['off'](mars3d__namespace[_0x3aa7c4(0x1d4)]['postRender'],this[_0x3aa7c4(0x201)],this),this[_0x3aa7c4(0x1e6)]['on'](mars3d__namespace[_0x3aa7c4(0x1d4)][_0x3aa7c4(0x16b)],this[_0x3aa7c4(0x201)],this));}},{'key':'_onMoveEndEvent','value':function _0xbef226(){var _0x2d6f09=_0x3ff52d;this[_0x2d6f09(0x19d)]&&(this[_0x2d6f09(0x1e6)]['off'](mars3d__namespace['EventType'][_0x2d6f09(0x16b)],this['_reset'],this),this[_0x2d6f09(0x19d)][_0x2d6f09(0x1d6)](),this[_0x2d6f09(0x201)]());}},{'key':_0x3ff52d(0x19b),'value':function _0x42b0e6(_0x247ca8){var _0x5d7b47=_0x3ff52d;this[_0x5d7b47(0x1de)](),this['_addedHook']();}},{'key':_0x3ff52d(0x1e3),'value':function _0x5f000d(_0x29da3b){var _0x52c48a=_0x3ff52d;this['_mapVRenderer']&&this['_mapVRenderer'][_0x52c48a(0x1e3)](_0x29da3b,this['options']);}},{'key':_0x3ff52d(0x1ab),'value':function _0x4385d3(_0x16d8d9){var _0x3ef893=_0x3ff52d;this[_0x3ef893(0x19d)]&&this[_0x3ef893(0x19d)][_0x3ef893(0x1ab)](_0x16d8d9,this[_0x3ef893(0x208)]);}},{'key':_0x3ff52d(0x1e7),'value':function _0x17579e(){var _0xd452e0=_0x3ff52d;return this[_0xd452e0(0x19d)]&&(this[_0xd452e0(0x1b4)]=this[_0xd452e0(0x19d)][_0xd452e0(0x1e7)]()),this[_0xd452e0(0x1b4)];}},{'key':_0x3ff52d(0x1fb),'value':function _0x54ef66(_0x4fc460){var _0x3fb2fa=_0x3ff52d;this['_mapVRenderer']&&this[_0x3fb2fa(0x19d)]['removeData'](_0x4fc460);}},{'key':'removeAllData','value':function _0x3e5fea(){var _0x12dcb3=_0x3ff52d;this['_mapVRenderer']&&this[_0x12dcb3(0x19d)][_0x12dcb3(0x166)]();}},{'key':_0x3ff52d(0x1a8),'value':function _0x2ffe59(){var _0x226aba=_0x3ff52d,_0x18572d=mars3d__namespace[_0x226aba(0x195)][_0x226aba(0x163)](_0x226aba(0x17f),_0x226aba(0x1cb),this[_0x226aba(0x1e6)]['container']);_0x18572d['id']=this[_0x226aba(0x208)][_0x226aba(0x189)]||_0x226aba(0x165)+divId++,_0x18572d[_0x226aba(0x16f)][_0x226aba(0x1aa)]='absolute',_0x18572d[_0x226aba(0x16f)][_0x226aba(0x169)]=_0x226aba(0x174),_0x18572d[_0x226aba(0x16f)][_0x226aba(0x1af)]='0px',_0x18572d['style'][_0x226aba(0x1c2)]=this[_0x226aba(0x19f)]?_0x226aba(0x1f6):_0x226aba(0x18f),_0x18572d[_0x226aba(0x16f)]['zIndex']=this[_0x226aba(0x208)][_0x226aba(0x17d)]||0x64,_0x18572d['width']=parseInt(this[_0x226aba(0x1e6)][_0x226aba(0x17f)][_0x226aba(0x20f)]),_0x18572d[_0x226aba(0x1f7)]=parseInt(this[_0x226aba(0x1e6)]['canvas']['height']),_0x18572d['style']['width']=this[_0x226aba(0x1e6)][_0x226aba(0x17f)][_0x226aba(0x16f)][_0x226aba(0x20f)],_0x18572d['style'][_0x226aba(0x1f7)]=this[_0x226aba(0x1e6)][_0x226aba(0x17f)][_0x226aba(0x16f)]['height'];if(this[_0x226aba(0x208)][_0x226aba(0x164)]==='2d'){var _0x465f27=this[_0x226aba(0x19e)];_0x18572d['getContext'](this[_0x226aba(0x208)][_0x226aba(0x164)])[_0x226aba(0x196)](_0x465f27,_0x465f27);}return _0x18572d;}},{'key':_0x3ff52d(0x201),'value':function _0x59df21(){var _0x18a68b=_0x3ff52d;this[_0x18a68b(0x1b6)](),this['render']();}},{'key':_0x3ff52d(0x1f9),'value':function _0x5d04e7(){this['_reset']();}},{'key':_0x3ff52d(0x1d7),'value':function _0x376265(){var _0x3482d2=_0x3ff52d;this[_0x3482d2(0x19d)]&&(this[_0x3482d2(0x19d)][_0x3482d2(0x206)](),this['_mapVRenderer']=null),this[_0x3482d2(0x17f)]['parentElement'][_0x3482d2(0x186)](this['canvas']);}},{'key':_0x3ff52d(0x15d),'value':function _0x3c6900(){var _0x585eb2=_0x3ff52d;this[_0x585eb2(0x19d)]['_canvasUpdate']();}},{'key':_0x3ff52d(0x1b6),'value':function _0x20ab9e(){var _0x28f6aa=_0x3ff52d;if(this['canvas']){var _0x59e70b=this[_0x28f6aa(0x17f)];_0x59e70b['style'][_0x28f6aa(0x1aa)]=_0x28f6aa(0x1c8),_0x59e70b[_0x28f6aa(0x16f)][_0x28f6aa(0x169)]=_0x28f6aa(0x174),_0x59e70b[_0x28f6aa(0x16f)][_0x28f6aa(0x1af)]=_0x28f6aa(0x174),_0x59e70b[_0x28f6aa(0x20f)]=parseInt(this[_0x28f6aa(0x1e6)]['canvas'][_0x28f6aa(0x20f)]),_0x59e70b['height']=parseInt(this[_0x28f6aa(0x1e6)]['canvas'][_0x28f6aa(0x1f7)]),_0x59e70b[_0x28f6aa(0x16f)][_0x28f6aa(0x20f)]=this[_0x28f6aa(0x1e6)][_0x28f6aa(0x17f)][_0x28f6aa(0x16f)][_0x28f6aa(0x20f)],_0x59e70b[_0x28f6aa(0x16f)]['height']=this[_0x28f6aa(0x1e6)][_0x28f6aa(0x17f)]['style'][_0x28f6aa(0x1f7)];}}},{'key':'getRectangle','value':function _0x4fe30e(_0x2b79a9){var _0x1f0301=_0x3ff52d;if(!this['dataSet']||!this['dataSet']['_data'])return;var _0x1a0015=mars3d__namespace[_0x1f0301(0x1d2)]['getExtentByGeoJSON']({'type':_0x1f0301(0x17e),'features':this[_0x1f0301(0x1b4)][_0x1f0301(0x197)]});if(!_0x1a0015)return;return _0x2b79a9!==null&&_0x2b79a9!==void 0x0&&_0x2b79a9['isFormat']?_0x1a0015:Cesium[_0x1f0301(0x209)]['fromDegrees'](_0x1a0015[_0x1f0301(0x1a6)],_0x1a0015[_0x1f0301(0x1ee)],_0x1a0015[_0x1f0301(0x1b8)],_0x1a0015[_0x1f0301(0x18e)]);}},{'key':_0x3ff52d(0x1be),'value':function _0x1fefe6(_0x368c6a){var _0x474d1b=_0x3ff52d;this[_0x474d1b(0x1e8)]=_0x368c6a,this[_0x474d1b(0x19d)]&&this[_0x474d1b(0x19d)][_0x474d1b(0x1bb)](_0x368c6a['windowPosition'],_0x368c6a);}},{'key':_0x3ff52d(0x1a2),'value':function _0x48a205(_0x865b98){var _0x504f8b=_0x3ff52d;this[_0x504f8b(0x1e8)]=_0x865b98,this[_0x504f8b(0x19d)]&&this[_0x504f8b(0x19d)]['mousemoveEvent'](_0x865b98[_0x504f8b(0x1db)],_0x865b98);}},{'key':'on','value':function _0x531786(_0x196e9c,_0x7244fe,_0x59c988){var _0x65a282=_0x3ff52d,_0x4bbb8c=this;this[_0x65a282(0x208)][_0x65a282(0x20a)]=this[_0x65a282(0x208)]['methods']||{};if(_0x196e9c===mars3d__namespace[_0x65a282(0x1d4)][_0x65a282(0x1e1)])this['options'][_0x65a282(0x20a)][_0x65a282(0x1e1)]=function(_0x115c66){var _0x2a4a11=_0x65a282;_0x115c66&&_0x7244fe[_0x2a4a11(0x1fa)](_0x59c988)(_objectSpread2(_objectSpread2({},_0x4bbb8c[_0x2a4a11(0x1e8)]),{},{'layer':_0x4bbb8c,'data':_0x115c66}));},this['_map']['on'](mars3d__namespace[_0x65a282(0x1d4)][_0x65a282(0x1e1)],this['_onMapClick'],this);else _0x196e9c===mars3d__namespace['EventType'][_0x65a282(0x161)]&&(this[_0x65a282(0x208)]['methods'][_0x65a282(0x1ea)]=function(_0x3ec9f8){var _0x35a85b=_0x65a282;_0x3ec9f8&&_0x7244fe[_0x35a85b(0x1fa)](_0x59c988)(_objectSpread2(_objectSpread2({},_0x4bbb8c[_0x35a85b(0x1e8)]),{},{'layer':_0x4bbb8c,'data':_0x3ec9f8}));},this[_0x65a282(0x1e6)]['on'](mars3d__namespace[_0x65a282(0x1d4)][_0x65a282(0x161)],this[_0x65a282(0x1a2)],this));return this;}},{'key':_0x3ff52d(0x199),'value':function _0x550bd9(_0x4d9e44,_0x4f0a8b){var _0x3c7bb7=_0x3ff52d;if(_0x4d9e44==='click'){var _0x102c09;this[_0x3c7bb7(0x1e6)][_0x3c7bb7(0x199)](_0x4d9e44,this[_0x3c7bb7(0x1be)],this),(_0x102c09=this[_0x3c7bb7(0x208)]['methods'])!==null&&_0x102c09!==void 0x0&&_0x102c09[_0x3c7bb7(0x1ea)]&&delete this[_0x3c7bb7(0x208)][_0x3c7bb7(0x20a)]['click'];}else{if(_0x4d9e44===_0x3c7bb7(0x161)){var _0x2545ed;this[_0x3c7bb7(0x1e6)][_0x3c7bb7(0x199)](_0x4d9e44,this[_0x3c7bb7(0x1a2)],this),(_0x2545ed=this[_0x3c7bb7(0x208)][_0x3c7bb7(0x20a)])!==null&&_0x2545ed!==void 0x0&&_0x2545ed[_0x3c7bb7(0x1ea)]&&delete this[_0x3c7bb7(0x208)][_0x3c7bb7(0x20a)][_0x3c7bb7(0x1ea)];}}return this;}}]),_0x1685bd;}(BaseLayer);mars3d__namespace['LayerUtil']['register']('mapv',MapVLayer),mars3d__namespace[_0x5e77(0x1b2)]['MapVLayer']=MapVLayer,exports['MapVLayer']=MapVLayer,Object[_0x5e77(0x178)](mapv)['forEach'](function(_0x26664e){var _0x5ea72d=_0x5e77;if(_0x26664e!==_0x5ea72d(0x1a7)&&!exports[_0x5ea72d(0x182)](_0x26664e))Object[_0x5ea72d(0x171)](exports,_0x26664e,{'enumerable':!![],'get':function(){return mapv[_0x26664e];}});}),Object[_0x5e77(0x171)](exports,_0x5e77(0x17b),{'value':!![]});
}));