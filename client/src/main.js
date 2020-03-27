import Vue from "vue";
import VueRouter from "vue-router";
import VueAxios from 'vue-axios';
import axios from 'axios';
import VueSwal from 'vue-swal';
import App from "./App.vue";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueClipboard from 'vue-clipboard2'


import VideoCall from "./components/VideoCall";
import Booking from "./components/Booking";

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(VueRouter);
Vue.use(VueSwal);
Vue.use(VueClipboard);

Vue.use(BootstrapVue)

const routes = [
	{ path: '/booking', component: Booking },
	{ path: '/video', component: VideoCall, query: { token: '' } },
	{ path: '*', redirect: '/booking' }
];

const router = new VueRouter({
	mode: 'history',
	routes
});

new Vue({
	components: { App, Booking, VideoCall },
	render: h => h(App),
	router,
}).$mount('#app')
