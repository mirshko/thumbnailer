// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Axios from 'axios'
import VeeValidate from 'vee-validate'

Vue.config.productionTip = false

Vue.use(Axios)

const config = {
  classes: false,
  classNames: {
    valid: 'valid',
    invalid: 'invalid'
  }
}

Vue.use(VeeValidate, config)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
