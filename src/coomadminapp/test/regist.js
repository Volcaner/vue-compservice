import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';

import index from './regist.vue';

Vue.use(VueResource);
Vue.use(VueRouter);

var vm = new Vue({
	el: '#app',
	data: {},
	// render: z=>z(test),
	render: z=>z(index),
});


// var vm = new Vue({
// 	el: '#app',
// 	data: {},
// 	render: z=>z(test)
// 	// render: z=>z(index)
// });