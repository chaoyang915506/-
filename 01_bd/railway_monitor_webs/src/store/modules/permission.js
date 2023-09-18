import { constantRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import Layout2 from '@/layout2/index'
import ParentView from '@/components/ParentView'
import ParentView2 from '@/components/ParentView/index2'
import InnerLink from '@/layout/components/InnerLink'
import InnerLink2 from '@/layout2/components/InnerLink'
import { DataBoard } from '@element-plus/icons'

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue')

const permission = {
  state: {
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    topbarRouters2: [],
    sidebarRouters: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = constantRoutes.concat(routes)
    },
    SET_TOPBAR_ROUTES: (state, routes) => {
      // 顶部导航菜单默认添加统计报表栏指向首页
      const index = [{
        path: 'index',
        meta: { title: '首页', icon: 'dashboard' }
      }]
      state.topbarRouters = index.concat(routes);
      // state.topbarRouters = routes
    },
    SET_TOPBAR_ROUTES2: (state, routes) => {
      // 顶部导航菜单默认添加统计报表栏指向首页
      // const index = [{
      //   path: 'index',
      //   meta: { title: '统计报表', icon: 'dashboard' }
      // }]
      state.topbarRouters2 = routes;
    },
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = routes
    },
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }, param) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getRouters().then(res => {
          let sdata = null, rdata = null, defaultData = null, defaultData2 = null;
          let digiMenu = [], simMenu = [], sysMenu = []
          if (param.roles[0] === 'admin') {
            digiMenu = res.data.digitalTwinMenus[0].children
            simMenu = res.data.simulationMenus[0].children
            sysMenu = res.data.systemMenus[0].children
            sdata = JSON.parse(JSON.stringify(digiMenu.concat(sysMenu).concat(simMenu)))
            rdata = JSON.parse(JSON.stringify(digiMenu.concat(sysMenu).concat(simMenu)))
            // 两个layout里的topMenu
            defaultData = JSON.parse(JSON.stringify(digiMenu.concat(sysMenu)))
            defaultData2 = JSON.parse(JSON.stringify(simMenu.concat(sysMenu)))
          } else if (param.roles[0] === '数字') {
            digiMenu = res.data.digitalTwinMenus[0].children
            sdata = JSON.parse(JSON.stringify(digiMenu))
            rdata = JSON.parse(JSON.stringify(digiMenu))
            defaultData = JSON.parse(JSON.stringify(digiMenu))
          } else if (param.roles[0] === '仿真') {
            simMenu = res.data.simulationMenus[0].children
            sdata = JSON.parse(JSON.stringify(simMenu))
            rdata = JSON.parse(JSON.stringify(simMenu))
            defaultData = JSON.parse(JSON.stringify(simMenu))
          }

          const sidebarRoutes = filterAsyncRouter(sdata)
          const rewriteRoutes = filterAsyncRouter(rdata, false, true)
          const defaultRoutes = filterAsyncRouter(defaultData)
          let defaultRoutes2;
          if (param.roles[0] === 'admin') {
            defaultRoutes2 = filterAsyncRouter(defaultData2)
          }
          commit('SET_ROUTES', rewriteRoutes)
          commit('SET_SIDEBAR_ROUTERS', constantRoutes.concat(sidebarRoutes))
          commit('SET_DEFAULT_ROUTES', sidebarRoutes)
          commit('SET_TOPBAR_ROUTES', defaultRoutes)
          if (param.roles[0] === 'admin') {
            commit('SET_TOPBAR_ROUTES2', defaultRoutes2)
          }
          if (param.roles[0] === '仿真') {
            commit('SET_TOPBAR_ROUTES2', defaultRoutes)
          }

          resolve(rewriteRoutes)
        })
      })
    }
  }
}


const simLayoutDic = ['CompTest', 'MapConfig', 'SimAssess']
const simComponentDic = ['AlgLibrary', 'MapConfig', 'Monitoring']
// 判断是不是仿真推演的菜单，加到layout2里面
function isSimLayout(route) {
  return simLayoutDic.includes(route.name)
}

function isSimComponent(route) {
  return simComponentDic.includes(route.name)
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {

    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // console.log(route)
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        if (isSimLayout(route)) {
          route.component = Layout2
        } else {
          route.component = Layout
        }
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        // if (isSimComponent(route)) {
        //   route.component = InnerLink2
        // } else {
        route.component = InnerLink
        // }
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

export const loadView = (view) => {
  let res;
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0];
    if (dir === view) {
      res = () => modules[path]();
    }
  }
  return res;
}

export default permission
