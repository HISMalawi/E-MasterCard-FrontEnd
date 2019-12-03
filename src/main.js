import Vue from 'vue'
import store from './store'

import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
 

import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '../src/assets/css/main.css'
import VeeValidate from 'vee-validate'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner, faLock, faCheck, faSearch, faPlus, faSave, faCog} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueIziToast from "vue-izitoast";
import VueMoment from 'vue-moment'
import handleErrors from './helpers/handleErrors'
import "izitoast/dist/css/iziToast.css";

//Importing configurations
import CONFIG from '../public/config.json'

Vue.use(VueIziToast);

Vue.use(VueMoment)

Vue.config.silent = true // show : hide erros in console
handleErrors()
library.add(faSpinner, faLock, faCheck, faSearch, faPlus, faSave, faCog)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(BootstrapVue)
Vue.use(VeeValidate, {
    classes:true
});


Vue.config.productionTip = true

Vue.mixin({
    data(){
        return {
            APIHosts : {
                art : `${CONFIG.api.protocol}://${CONFIG.api.host}:${CONFIG.api.port}/api/${CONFIG.api.version}`
            },
            messageStr: 'Hello'
        }
    },
    methods: {
        logout(){
            localStorage.removeItem('vuex')
            sessionStorage.removeItem('auth')
            this.$router.push('/login')
        },
        openFullscreen(elem) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen().catch(() => {})
            } else if (elem.mozRequestFullScreen) { /* Firefox */
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE/Edge */
                elem.msRequestFullscreen();
            }
        }
              
    },
    created(){
        const elem = document.documentElement
        this.openFullscreen(elem)
    }
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
