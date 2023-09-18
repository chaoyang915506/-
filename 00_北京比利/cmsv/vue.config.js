const webpack = require("webpack")

module.exports = {
  publicPath: "/cmsv",
  pages: {
    main: {
      entry: "src/main.js",
      template: "public/index.html",
      filename: "index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "main"]
    },
    //酒店管理
    hotel: {
      entry: "src/pages/hotel/main.js",
      template: "public/index.html",
      filename: "hotel/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "hotel"]
    },
    //酒店栏目参数管理
    hotelItemParam: {
      entry: "src/views/hotelItemParam/main.js",
      template: "public/index.html",
      filename: "hotelItemParam.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-element", "chunk-vendors", "chunk-xlsx", "hotelItemParam"]
    },
    //欢迎页管理(提测通过)
    welcome: {
      entry: "src/views/welcome/main.js",
      template: "public/index.html",
      filename: "welcome.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "welcome"]
    },
    //UID管理
    uid: {
      entry: "src/views/uid/main.js",
      template: "public/index.html",
      filename: "uid.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "uid"]
    },
    //UID配置项
    uidExtra: {
      entry: "src/views/uid/extra/main.js",
      template: "public/index.html",
      filename: "uidExtra.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "uidExtra"]
    },
    //点餐栏目页面
    hotelItemContent: {
      entry: "src/views/hotelItemContent/main.js",
      template: "public/index.html",
      filename: "hotelItemContent.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "hotelItemContent"]
    },
    //海花岛送餐员通讯录页面
    ofiIrdContact: {
      entry: "src/pages/ofi/ird/main.js",
      template: "public/index.html",
      filename: "ofiIrdContact.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "ofiIrdContact"]
    },
    //海花岛订单和支付页面
    ofiOrder: {
      entry: "src/pages/ofi/order/main.js",
      template: "public/index.html",
      filename: "ofiOrder.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "ofiOrder"]
    },
    //洗衣分类页面
    laundryClass: {
      entry: "src/pages/laundry/class/main.js",
      template: "public/index.html",
      filename: "laundry/class.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "laundryClass"]
    },
    //洗衣服务页面
    laundry: {
      entry: "src/pages/laundry/main.js",
      template: "public/index.html",
      filename: "laundry/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "laundry"]
    },
    //客房报修
    repair: {
      entry: "src/pages/repair/main.js",
      template: "public/index.html",
      filename: "repair/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "repair"]
    },
    // 投屏设备管理
    cast: {
      entry: "src/pages/cast/main.js",
      template: "public/index.html",
      filename: "cast/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-element", "chunk-vendors", "chunk-xlsx", "cast"]
    },
    //客信管理
    message: {
      entry: "src/pages/message/main.js",
      template: "public/index.html",
      filename: "message/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-element", "chunk-vendors", "chunk-xlsx", "message"]
    },
    //基础栏目管理
    itemBasic: {
      entry: "src/pages/itemBasic/main.js",
      template: "public/index.html",
      filename: "itemBasic/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-element", "chunk-vendors", "chunk-xlsx", "itemBasic"]
    },
    //左邻右舍(提测通过)
    gallery: {
      entry: "src/pages/gallery/main.js",
      template: "public/index.html",
      filename: "gallery/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "gallery"]
    },
    //栏目内容页面(提测通过)
    columncount: {
      entry: "src/pages/columncount/main.js",
      template: "public/index.html",
      filename: "columncount/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "columncount"]
    },
    //引导页后台管理(提测通过)
    guidance: {
      entry: "src/pages/guidance/main.js",
      template: "public/index.html",
      filename: "guidance/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "guidance"]
    },
    //APK版本上传(提测通过)
    updateform: {
      entry: "src/pages/updateform/main.js",
      template: "public/index.html",
      filename: "updateform/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "updateform"]
    },
    //设备类型管理(提测通过)
    devicetype: {
      entry: "src/pages/devicetype/main.js",
      template: "public/index.html",
      filename: "devicetype/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "devicetype"]
    },
    //设备厂商管理(提测通过)
    devicefirm: {
      entry: "src/pages/devicefirm/main.js",
      template: "public/index.html",
      filename: "devicefirm/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "devicefirm"]
    },
    //语言管理模块(提测通过)
    language: {
      entry: "src/pages/language/main.js",
      template: "public/index.html",
      filename: "language/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "language"]
    },
    // 酒店天气合并(提测通过)
    selecthotel: {
      entry: "src/pages/selecthotel/main.js",
      template: "public/index.html",
      filename: "selecthotel/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "selecthotel"]
    },
    // 酒店集团管理
    hotelGroup: {
      entry: "src/pages/hotelGroup/main.js",
      template: "public/index.html",
      filename: "hotelGroup/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "hotelGroup"]
    },
    //公告管理(产品说需求取消暂时不上线)
    notice: {
      entry: "src/pages/notice/main.js",
      template: "public/index.html",
      filename: "notice/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-element", "chunk-vendors", "chunk-xlsx", "notice"]
    },
    //按键管理(提测通过)
    keymanage: {
      entry: "src/pages/keymanage/main.js",
      template: "public/index.html",
      filename: "keymanage/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "keymanage"]
    },
    //天气城市列表页面(提测通过)
    weathercity: {
      entry: "src/pages/weathercity/main.js",
      template: "public/index.html",
      filename: "weathercity/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "weathercity"]
    },
    //新电影审查页面(提测通过)
    movieView: {
      entry: "src/pages/movieView/main.js",
      template: "public/index.html",
      filename: "movieView/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "movieView"]
    },
    // PMS状态管理
    lms: {
      entry: "src/pages/lms/main.js",
      template: "public/index.html",
      filename: "lms/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "lms"]
    },
    // 控制策略
    strategy: {
      entry: "src/pages/lms/strategy/main.js",
      template: "pulic/index.html",
      filename: "lms/strategy/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "strategy"]
    },
    // 触发点
    trigger: {
      entry: "src/pages/lms/trigger/main.js",
      template: "pulic/index.html",
      filename: "lms/trigger/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "trigger"]
    },
    // 触发类型
    triggertype: {
      entry: "src/pages/lms/triggertype/main.js",
      template: "pulic/index.html",
      filename: "lms/triggertype/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "triggertype"]
    },
    // 控制命令
    cmd: {
      entry: "src/pages/lms/cmd/main.js",
      template: "pulic/index.html",
      filename: "lms/cmd/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "cmd"]
    },
    // 酒店克隆
    hotelclone: {
      entry: "src/pages/lms/hotelclone/main.js",
      template: "pulic/index.html",
      filename: "lms/hotelclone/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "hotelclone"]
    },
    // 设备触发类型
    devicetriggertype: {
      entry: "src/pages/lms/devicetriggertype/main.js",
      template: "pulic/index.html",
      filename: "lms/devicetriggertype/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "devicetriggertype"]
    },
    //远程设备控制
    longrangedevice: {
      entry: "src/pages/lms/longrangedevice/main.js",
      template: "public/index.html",
      filename: "lms/longrangedevice/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "longrangedevice"]
    },
    //园区天气城市列表(提测通过)
    gardenweathercity: {
      entry: "src/pages/gardenweathercity/main.js",
      template: "public/index.html",
      filename: "gardenweathercity/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "gardenweathercity"]
    },
    //区域管理模块(提测通过)
    areamanagemodule: {
      entry: "src/pages/areamanagemodule/main.js",
      template: "public/index.html",
      filename: "areamanagemodule/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "areamanagemodule"]
    },
    //媒体排序(提测通过)
    mediasort: {
      entry: "src/pages/mediasort/main.js",
      template: "public/index.html",
      filename: "mediasort/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "mediasort"]
    },
    //酒店字体管理(提测通过)
    fontmanage: {
      entry: "src/pages/fontmanage/main.js",
      template: "public/index.html",
      filename: "fontmanage/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "fontmanage"]
    },
    //epg频道对应管理(提测通过)
    chanelmanage: {
      entry: "src/pages/chanelmanage/main.js",
      template: "public/index.html",
      filename: "chanelmanage/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "chanelmanage"]
    },
    //epg同步状态(提测通过)
    synchstate: {
      entry: "src/pages/synchstate/main.js",
      template: "public/index.html",
      filename: "synchstate/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-element", "chunk-xlsx", "synchstate"]
    },
    //删除酒店页面(提测通过)
    deletehotel: {
      entry: "src/pages/deletehotel/main.js",
      template: "public/index.html",
      filename: "deletehotel/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "deletehotel"]
    },
    //遥控器管理页面(提测通过)
    remotemanage: {
      entry: "src/pages/remotemanage/main.js",
      template: "public/index.html",
      filename: "remotemanage/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "remotemanage"]
    },
    //移机(提测通过)
    moveengine: {
      entry: "src/pages/moveengine/main.js",
      template: "public/index.html",
      filename: "moveengine/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "moveengine"]
    },
    //客房订餐管理未写完
    roomreservation: {
      entry: "src/pages/roomreservation/main.js",
      template: "public/index.html",
      filename: "roomreservation/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "roomreservation"]
    },
    //客房管理 接口有误未写完
    roommanage: {
      entry: "src/pages/roommanage/main.js",
      template: "public/index.html",
      filename: "roommanage/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "roommanage"]
    },
    //酒店配置页面
    syscnf: {
      entry: "src/pages/syscnf/main.js",
      template: "public/index.html",
      filename: "syscnf/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "syscnf"]
    },
    //基础配置管理(提测通过)
    syscnfmetalist: {
      entry: "src/pages/syscnf/syscnfmetalist/main.js",
      template: "public/index.html",
      filename: "syscnf/syscnfmetalist/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "syscnfmetalist"]
    },
    //栏目架构页面
    columnmanage: {
      entry: "src/pages/columnmanage/main.js",
      template: "public/index.html",
      filename: "columnmanage/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-element", "chunk-xlsx", "columnmanage"]
    },
    //电影分类管理
    movieclassify: {
      entry: "src/pages/movieclassify/main.js",
      template: "public/index.html",
      filename: "movieclassify/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "movieclassify"]
    },
    //电影列表管理
    movicelist: {
      entry: "src/pages/movicelist/main.js",
      template: "public/index.html",
      filename: "movicelist/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-element", "chunk-xlsx", "movicelist"]
    },
    //电影版权分组
    movicecopyright: {
      entry: "src/pages/movicecopyright/main.js",
      template: "public/index.html",
      filename: "movicecopyright/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-element", "chunk-xlsx", "movicecopyright"]
    },
    //团客管理
    groupGuestManage: {
      entry: "src/pages/groupGuest/main.js",
      template: "public/index.html",
      filename: "groupGuest/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-element", "chunk-xlsx", "groupGuestManage"]
    },
    // 基础电视管理
    TvChannel: {
      entry: "src/pages/TvChannel/main.js",
      template: "public/index.html",
      filename: "tvChannel/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-element", "chunk-xlsx", "TvChannel"]
    },
    // 酒店客人信息页面
    guestInformation: {
      entry: "src/pages/guestInformation/main.js",
      template: "public/index.html",
      filename: "guestInformation/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "chunk-element", "guestInformation"]
    },
    // 酒店客人姓名页面
    guestName: {
      entry: "src/pages/guestInformation/guestName/main.js",
      template: "public/index.html",
      filename: "guestName/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-element", "chunk-xlsx", "guestName"]
    },
    airlines: {
      entry: "src/pages/airlines/main.js",
      template: "public/index.html",
      filename: "airlines/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "airlines"]
    },
    cacheUpdate: {
      entry: "src/pages/cacheUpdate/main.js",
      template: "public/index.html",
      filename: "cacheUpdate/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "cacheUpdate"]
    },
    cacheModuleControl: {
      entry: "src/pages/cacheModuleControl/main.js",
      template: "public/index.html",
      filename: "cacheModuleControl/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "cacheModuleControl"]
    },
    device: {
      entry: "src/pages/device/index.js",
      template: "public/index.html",
      filename: "device/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "device"]
    },
    cooliooSpecialVideo: {
      entry: "src/pages/cooliooSpecialVideo/main.js",
      template: "public/index.html",
      filename: "cooliooSpecialVideo/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors","chunk-element", "cooliooSpecialVideo"]
    },
    cooliooGroup: {
      entry: "src/pages/cooliooGroup/index.js",
      template: "public/index.html",
      filename: "cooliooGroup/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors","chunk-element", "cooliooGroup"]
    },
    cooliooConfig: {
      entry: "src/pages/cooliooConfig/index.js",
      template: "public/index.html",
      filename: "cooliooConfig/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors","chunk-element", "cooliooConfig"]
    },
    cooliooCopyright: {
      entry: "src/pages/cooliooCopyright/index.js",
      template: "public/index.html",
      filename: "cooliooCopyright/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors","chunk-element", "cooliooCopyright"]
    },
    //酒店语言管理
    hotellanguage: {
      entry: "src/pages/hotellanguage/main.js",
      template: "public/index.html",
      filename: "hotellanguage/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "chunk-element", "hotellanguage"]
    },
    //收费策略
    chargingstrategy: {
      entry: "src/pages/chargingstrategy/main.js",
      template: "public/index.html",
      filename: "chargingstrategy/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "chunk-element", "chargingstrategy"]
    },
    //资源管理
    resource: {
      entry: "src/pages/resource/main.js",
      template: "public/index.html",
      filename: "resource/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "chunk-element", "resource"]
    },
    //机场管理
    toairportlist: {
      entry: "src/pages/toairportlist/main.js",
      template: "public/index.html",
      filename: "toairportlist/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "chunk-element", "toairportlist"]
    },
    // coolioo 关联版权
    cooliooAssociated: {
      entry: "src/pages/cooliooAssociated/index.js",
      template: "public/index.html",
      filename: "cooliooAssociated/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors","chunk-element", "cooliooAssociated"]
    },
    //模板
    querytemplates: {
      entry: "src/pages/querytemplates/main.js",
      template: "public/index.html",
      filename: "querytemplates/index.html",
      chunks: ["chunk-common", "chunk-vue", "chunk-vendors", "chunk-xlsx", "chunk-element", "querytemplates"]
    },
  },
  devServer: {
    contentBase: "dist",
    port: 58080
  },
  configureWebpack: {
    module: {
      rules: [
        // {
        //   test: /\.css$/,
        //   loaders: ["style", "css", "sass-loader"]
        // },
        // {
        //   test: /\.scss$/,
        //   loader: "sass-loader"
        // },
      ]
    },
    devtool: "inline-source-map",
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
      })
    ],
    optimization: {
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vue: {
            name: "chunk-vue",
            test: /[\\/]node_modules[\\/]_?vue(.*)/,
            priority: 20
          },
          xlsx: {
            name: "chunk-xlsx",
            test: /[\\/]node_modules[\\/]xlsx[\\/]/,
            priority: 20
          },
          element: {
            name: "chunk-element",
            test: /[\\/]node_modules[\\/]element[\\-]ui[\\/]/,
            priority: 20
          }
        }
      }
    }
  },
  pluginOptions: {
    i18n: {
      locale: "0",
      fallbackLocale: "0",
      localeDir: "i18n/locales",
      enableInSFC: false,
      enableLegacy: false
    }
  }
}
