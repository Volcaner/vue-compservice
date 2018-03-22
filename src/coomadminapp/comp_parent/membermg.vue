<template>
	<div class="main">
		<div class="membermg">
			<transition name="fade">
				<memberlist v-show='bIsMember' :data='data'></memberlist>
			</transition>
		</div>
	</div>
</template>
<script type="text/javascript" charset="utf-8" async defer>
	import Mock from 'mockjs';
	import MemberList from './../comp_child/member.vue';
	export default({
		data() {
			return {
				uid: '',
				fid: '',
				comp_name: '',
				ismanager: '',
				data: {
					user_count: 0,
					ismanager: '',
					host: [
						// {
						// 	uid: '291',
						// 	username: 'WZH55',
						// 	avatarimg: 'http://test1.ant188.com/yich/uc_server/data/avatar/000/00/02/91_avatar_middle-8259.jpg',
						// 	banned: 0,
						// },
					],
					admin_count: 0,
					admin: [
						// {
						// 	uid: '291',
						// 	username: 'WZH55',
						// 	avatarimg: 'http://test1.ant188.com/yich/uc_server/data/avatar/000/00/02/91_avatar_middle-8259.jpg',
						// 	banned: 0,
						// },
					],
					common_count: 0,
					common: [
						// {
						// 	uid: '277',
						// 	username: 'WZH5364589',
						// 	avatarimg: 'http://www.damai186.com/uc_server/avatar.php?uid=277&size=middle',
						// 	banned: 1,
						// },
					],
				},
				bIsMember: false,
			}
		},
		beforeCreate() {
			this.DomLoading.show(1);
		},
		mounted() {
			let that = this;

			// init data
			this.uid = this.LocalStorage.getItem("uid");
			this.fid = this.LocalStorage.getItem("fid");
			this.comp_name = this.LocalStorage.getItem("comp_name");
			this.ismanager = this.LocalStorage.getItem("ismanager");

			// title
			document.title = this.comp_name;

			// post for data
			let url = window.publicPath + '/home.php';
			let params = {
				op: 'group_users',
			};
			let template = {
				'user_count': 36,
				'ismanager': '2',
				'host': [
					{
						'uid': /[0-9][0-9][0-9]/,
						"username|1-3": /WZH55/,
						'avatarimg': 'http://test1.ant188.com/yich/uc_server/data/avatar/000/00/02/91_avatar_middle-8259.jpg',
						'banned': 0,
						'level': 1,
						'ismanager': 1,  // 管理等级 1为群主 2为管理员 其他为非管理
					},
				],
				'admin_count': 2,
				'admin|0-10': [
					{
						'uid': /[0-9][0-9][0-9]/,
						"username|1-3": /H53/,
						'avatarimg': 'http://www.damai186.com/uc_server/avatar.php?uid=277&size=middle',
						'banned': /[0-1]/,
						'level': 2,
						'ismanager': 2,  // 管理等级 1为群主 2为管理员 其他为非管理
					},
				],
				'common_count': 33,
				'common|0-10': [
					{
						'uid': /[0-9][0-9][0-9]/,
						"username|1-3": /kc66/,
						'avatarimg': 'http://www.damai186.com/uc_server/avatar.php?uid=277&size=middle',
						'banned': /[0-1]/,
						'level': 4,
						'ismanager': 4,  // 管理等级 1为群主 2为管理员 其他为非管理
					},
				],
			};
			this.mock(url, template);
			this.ajax(url, params, function(res) {
				that.drawPage(res);
			});
		},
		methods: {
			ajax: function(url, params, successCallback) {
				let that = this;
				this.Loading.show(1);
				this.$http.post(url, params, {emulateJSON: true}).then(function(res) {
					// console.log(res);
					setTimeout(function() {
						that.Loading.hide(1);
						successCallback(res);
					}, 1000);
				}, function(error) {
					that.Loading.hide(1);
					// console.log(error);
				});
			},
			mock: function(url, template) {
				if(window.bIsMock) {
					Mock.mock(url, template);
				}
			},
			drawPage: function(res) {
				let that = this;
				let result = res.body;
				if(result) {
					if(result.admin && result.admin.length > 0) {
						result.admin.forEach(function(aitem, aindex, ) {
							aitem.avatarimg += "?" + Math.round(Math.random()*8999 + 1000);
						});
					}

					if(result.common && result.common.length > 0) {
						result.common.forEach(function(citem, cindex, ) {
							citem.avatarimg += "?" + Math.round(Math.random()*8999 + 1000);
						});
					}

					if(result.host && result.host.length > 0) {
						result.host.forEach(function(hitem, hindex, ) {
							hitem.avatarimg += "?" + Math.round(Math.random()*8999 + 1000);
						});
					}

					this.data = result;
					this.bIsMember = true;

					if(result.ismanager) {
						this.ismanager = result.ismanager;
						this.LocalStorage.setItem("ismanager", result.ismanager);
					}
				}

				this.DomLoading.hide(1);
			},
		},
		components: {
			'memberlist': MemberList,
		},
	});
</script>
<style lang="less" scoped></style>