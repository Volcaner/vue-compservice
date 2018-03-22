import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';

import index from './../comp_parent/comptransfer.vue';
import maincss from './../less/main.less';
import css from './../less/comptransfer.less';
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