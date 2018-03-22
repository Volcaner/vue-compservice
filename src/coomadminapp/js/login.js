import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';

import index from './../comp_parent/login.vue';
import maincss from './../less/main.less';
import css from './../less/login.less';
import mainjs from './../public/public.js';
import VuePrototype from './../../plugins/vueprototype/vueprototype.js';

Vue.use(VuePrototype);
Vue.use(VueResource);
Vue.use(VueRouter);

var vm = new Vue({
	el: '#app',
	data: {},
	render: z=>z(index),
});