import { createStore } from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import mapbox from './modules/mapbox'

import getters from './getters'

const store = createStore({
  modules: {
    app,
    user,
    tagsView,
    permission,
    settings,
    mapbox
  },
  getters
});


export default store