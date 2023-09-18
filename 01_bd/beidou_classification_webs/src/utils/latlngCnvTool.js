  //经纬度格式转化工具 
  export function LatlngCnvTool(latlng,fmt1,fmt2){
    fmt1=fmt1||"DDD";
    fmt2=fmt2||"DMS";
    let lng ="";let lat ="";
    //判断类型 数组  对象  字符串 
    if(latlng instanceof Array){
      lng =latlng[0];lat =latlng[1];
    }else if(latlng instanceof Object){
      lng =latlng.lng;lat =latlng.lat;
    }else{let _a =latlng.split(",");
    lng =_a[0];lat =_a[1];
    }
    //按格式进行转化
    if(fmt1=="DDD"){
      if(fmt2=="DMS"){
        lng =DDDToDMS(lng);lat =DDDToDMS(lat);
      }else if(fmt2=="DMM"){
        lng =DDDToDMM(lng);lat =DDDToDMM(lat);
      }else if(fmt2=="DDD"){
        lng =DDDToDDD(lng);lat =DDDToDDD(lat);
      }
    }
    else if(fmt1=="DMS"){
      if(fmt2=="DDD"){
        lng =DMSToDDD(lng);lat =DMSToDDD(lat);
      }else {
        return "";
      }
    }
    else if(fmt1=="DMM"){
      if(fmt2=="DDD"){
        lng =DMMToDDD(lng);lat =DMMToDDD(lat);
      }else {
        return "";
      }
    }
    return [lng,lat] ;
  }
  //用户输入 任意格式转数据库存储
  export function LatlngInputToDB(_da){
    var str = ""+_da;
    var numArr = str.match(/(\d+\.\d+)|(\d+)/g);// console.log(numArr);
    if(numArr.length==1){let latlng=parseFloat(numArr[0]).toFixed(6);
      return latlng;
    }
    if(numArr.length==2){
      let latlng =Math.abs(numArr[0]) +(Math.abs(numArr[1])/60); latlng=parseFloat(latlng).toFixed(6);
      return latlng;
    }
    if(numArr.length==3){
      let latlng =Math.abs(numArr[0]) +(Math.abs(numArr[1])/60 + Math.abs(numArr[2])/3600);latlng=parseFloat(latlng).toFixed(6);
      return latlng;
    }
  }
  export function LatlngDBToInput(_da,ft){
    switch(ft){
      case "DDD": _da =DDDToDDD(_da);break;
      case "DMM": _da =DDDToDMM(_da);break;
      case "DMS": _da =DDDToDMS(_da);break;
    }
    return _da;
  }
  //对象转字符
  function LatlngToStr(_obj){
    let str =obj.Lat+","+obj.Lng;
  }
  //DDD转DDD
  function DDDToDDD(_data){
    let value = parseFloat(_data);
    return value.toFixed(6);
  }
  //DDD转DMS °、′、″ 这里为用 '代替了′ " 代替 ″ 8°14'2.8428"
  function DDDToDMS(_data){
    let value = parseFloat(_data);
    let _d = Math.floor(value);//度
    let _m = Math.floor((value - _d) * 60);//分
    //let _s = Math.round((value - _d) * 3600 % 60);//秒 保留整数
    let _s =  parseFloat((value - _d) * 3600 % 60).toFixed(2);//精确小数点后面两位
    return _d+ '°' + _m + '\'' + _s + '"';
  }
  //DDD转DMM
  function DDDToDMM(_data){
    let value = parseFloat(_data);
    let _d = Math.floor(value);//度
   // let _m =parseFloat((value - _d) * 60);//分
    let _m =parseFloat((value - _d) * 60).toFixed(4);//分 精确小数点后面4位
    return _d+ '°' + _m + '\'';
  }
  //DMS转DDD
  function DMSToDDD(_data){
    let du = _data.split("°")[0];
    let fen = _data.split("°")[1].split("'")[0];
    let miao = _data.split("°")[1].split("'")[1].split('"')[0];
    let res =Math.abs(du) +(Math.abs(fen)/60 + Math.abs(miao)/3600);
    res=parseFloat(res).toFixed(6);
    return res;
  }
  //DMM转DDD
  function DMMToDDD(_data){
    let du = _data.split("°")[0];
    let fen = _data.split("°")[1].split("'")[0];
    let res =Math.abs(du) +(Math.abs(fen)/60); res=parseFloat(res).toFixed(6);
    return res;
  }
  //格式化度分秒  方便不会打°符号的人调用转化 例如23*34*454 即可转化为23°34'454"
  export function formatDMS(_da){
    var str = ""+_da;
      var numArr = str.match(/(\d+\.\d+)|(\d+)/g);
    if(numArr.length==1){
      return numArr[0]+ '°' +numArr[1]+ '\'';
    }
    if(numArr.length>1){
      return numArr[0]+ '°' +numArr[1]+ '\'' + numArr[2]+ '"';
    }
    return '0°00\'00"';
  }
