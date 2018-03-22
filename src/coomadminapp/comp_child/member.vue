<template>
	<div class="compo">
		<div class="memberlist">
			<div class="shopkeeper">
				<p>掌柜（<b>{{host.length}}/{{user_count}}</b>）</p>
				<ul>
					<li v-for='item in host'>
						<div class="mem clearfix">
							<img :src='item.avatarimg' alt="">
							<p>{{item.username}}</p>
						</div>
					</li>
				</ul>
			</div>

			<div v-show='admin_count > 0' class="manager">
				<p>管理员（<b>{{admin_count}}/{{user_count}}</b>）</p>
				<ul>
					<li v-for='(item, index) in admin'>
						<div class="mem clearfix">
							<img :src='item.avatarimg' alt="">
							<p>{{item.username}}</p>
						</div>

						<b v-if='item.banned == 1'>禁言</b>

						<div v-if='ismanager == 1' class="handle clearfix" @click='click2Handle($event, item)'>
							<p class="icon iconfont">&#xe60e;</p>
						</div>
					</li>
				</ul>
			</div>

			<div v-show='common_count > 0' class="ordinary">
				<p>普通成员（<b>{{common_count}}/{{user_count}}</b>）</p>
				<ul>
					<li v-for='(item, index) in common'>
						<div class="mem clearfix">
							<img :src='item.avatarimg' alt="">
							<p>{{item.username}}</p>
						</div>

						<b v-if='item.banned == 1'>禁言</b>

						<div v-if='ismanager == 1 || ismanager == 2' class="handle clearfix" @click='click2Handle($event, item)'>
							<p class="icon iconfont">&#xe60e;</p>
						</div>
					</li>
				</ul>
			</div>

			<handlepopmenu v-if='bIsHandle' :data='popMenuData' @event='popMenuEvent'></handlepopmenu>
			<popchoosetip v-if='bIsPopTip' :strTips='strPopTips' @hide='hidePopTip' @callback='cancelMgTipCallback'></popchoosetip>
		</div>
	</div>
</template>
<script type="text/javascript" charset="utf-8" async defer>
	import Mock from 'mockjs';
	import HandlePopMenu from './../comp_child/handlepopmenu.vue';
	import PopChooseTip from './../comp_child/popchoosetip.vue';
	export default({
		data() {
			return {
				uid: '',
				fid: '',
				comp_name: '',
				ismanager: '',
				// user_count: 36,
				// host: [
				// 	{
				// 		uid: '291',
				// 		username: 'WZH55',
				// 		avatarimg: 'http://test1.ant188.com/yich/uc_server/data/avatar/000/00/02/91_avatar_middle-8259.jpg',
				// 		banned: 0,  // 0正常，1禁言
				//   	level: 1,  // 1掌柜，2管理员，4普通成员
				// 	}
				// ],
				// admin_count: 2,
				// admin: [
				// 	{
				// 		uid: '291',
				// 		username: 'WZH55',
				// 		avatarimg: 'http://test1.ant188.com/yich/uc_server/data/avatar/000/00/02/91_avatar_middle-8259.jpg',
				// 		banned: 0,
				//   	level: 2,
				// 	},
				// ],
				// common_count: 33,
				// common: [
				// 	{
				// 		uid: '277',
				// 		username: 'WZH5364589',
				// 		avatarimg: 'http://www.damai186.com/uc_server/avatar.php?uid=277&size=middle',
				// 		banned: 1,
				//   	level: 4,
				// 	},
				// ],
				bIsHandle: false,
				curChaUid: '',
				popMenuData: '',  // JSON string
				bIsPopTip: false,
				strPopTips: '',
			}
		},
		props: ['data'],
		computed: {
			user_count: function() {
				if(this.data && this.data.user_count) {
					return this.data.user_count;
				}
				else {
					return 0;
				}
			},
			host: function() {
				if(this.data && this.data.host && this.data.host.length > 0) {
					return this.data.host;
				}
				else {
					return [];
				}
			},
			admin_count: function() {
				if(this.data && this.data.admin_count) {
					return this.data.admin_count;
				}
				else {
					return 0;
				}
			},
			admin: function() {
				if(this.data && this.data.admin && this.data.admin.length > 0) {
					return this.data.admin;
				}
				else {
					return [];
				}
			},
			common_count: function() {
				if(this.data && this.data.common_count) {
					return this.data.common_count;
				}
				else {
					return 0;
				}
			},
			common: function() {
				if(this.data && this.data.common && this.data.common.length > 0) {
					return this.data.common;
				}
				else {
					return [];
				}
			},
		},
		mounted() {
			let that = this;

			// init data
			this.uid = this.LocalStorage.getItem("uid");
			this.fid = this.LocalStorage.getItem("fid");
			this.comp_name = this.LocalStorage.getItem("comp_name");
			this.ismanager = this.LocalStorage.getItem("ismanager");
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
			hidePopMenu: function(bool) {
				this.bIsHandle = bool;

				this.htmlScrollOk();
			},
			hidePopTip: function(bool) {
				this.bIsHandle = bool;

				this.htmlScrollOk();
			},
			htmlScrollOk: function() {
				let htmlEl = document.querySelector('html');
				var htmlTop = parseFloat(htmlEl.getBoundingClientRect().top);
				htmlEl.style.overflow = "auto";
				htmlEl.style.position = "absolute";
				htmlEl.style.top = "0px";
				document.body.scrollTop = Math.abs(htmlTop);
			},
			htmlScrollPok: function() {
				let htmlEl = document.querySelector('html');
				var scrollTop = document.body.scrollTop;
				htmlEl.style.overflow = "hidden";
				htmlEl.style.position = "fixed";
				htmlEl.style.top = -scrollTop + "px";
			},
			setGag: function(item) {
				let that = this;
				let url = window.publicPath + '/home.php';
				let params = {
					op: 'change_ban',
					cha_uid: this.curChaUid,
					type: item.type,
				};
				let template = 1;
				this.mock(url, template);
				this.ajax(url, params, function(res) {
					let result = res.body;
					if(result !== null && result !== undefined && result !== "") {
						if(parseInt(result) == -4) {
							alert("没有操作权限");
						}
						else if(parseInt(result) == -2) {
							alert("操作有误");
						}
						else if(parseInt(result) == 0) {
							alert("修改失败");
						}
						else if(parseInt(result) > 0) {
							// alert("修改成功");

							// TODO: 提供局部更新方法
							// window.location.reload();
							let arr = [];
							if(parseInt(item.level) == 2) {
								arr = that.admin;
							}
							else if(parseInt(item.level) == 4) {
								arr = that.common;
							}

							for(let i = 0; i < arr.length; i++) {
								let obj = arr[i];
								if(obj.uid == that.curChaUid) {
									if(item.type == 1) {
										obj.banned = "1";
									}
									else if(item.type == -1) {
										obj.banned = "0";
									}
									break;
								}
							}
						}
					}
				});

				// hide pop menu
				this.hidePopMenu(false);
			},
			setMg: function(item) {
				let that = this;
				if(item.type == -1) {
					this.bIsPopTip = true;
					this.strPopTips = "确定取消管理员吗？";

					// hide pop menu
					this.hidePopMenu(false);
					this.htmlScrollPok();
				}
				else {
					this.post4SetMg(item.type);
					// hide pop menu
					this.hidePopMenu(false);
				}
			},
			cancelMgTipCallback: function(bool) {
				let that = this;
				if(bool) {
					let type = -1;
					this.post4SetMg(type);
				}
				else {
					// do nothing
				}

				this.bIsPopTip = false;
				this.htmlScrollOk();
			},
			post4SetMg: function(type) {
				let that = this;
				let url = window.publicPath + '/home.php';
				let params = {
					op: 'change_admin',
					cha_uid: this.curChaUid,
					type: type,
				};
				let template = 1;
				this.mock(url, template);
				this.ajax(url, params, function(res) {
					let result = res.body;
					if(result !== null && result !== undefined && result !== "") {
						if(parseInt(result) == -4) {
							alert("没有操作权限");
						}
						else if(parseInt(result) == -2) {
							alert("操作有误");
						}
						else if(parseInt(result) == 0) {
							alert("修改失败");
						}
						else if(parseInt(result) > 0) {
							// alert("修改成功");

							// TODO: 提供局部更新方法
							window.location.reload();
						}
					}
				});
			},
			click2Handle: function(e, item) {
				let that = this;
				let arrPopMenuData = {
					position: {
						x: e.x,
						y: e.y,
					},
					items: [],
				};

				this.curChaUid = item.uid;

				if(parseInt(this.ismanager) == 1) {
					// setgag & setmg
					if(item.banned == 0) {
						let data = {
							menuId: "SETGAG",
							btnName: "设置禁言",
							bIsAble: true,
							type: 1,
							level: item.level,
						};
						arrPopMenuData.items.push(data);
					}
					else if(item.banned == 1) {
						let data = {
							menuId: "SETGAG",
							btnName: "取消禁言",
							bIsAble: true,
							type: -1,
							level: item.level,
						};
						arrPopMenuData.items.push(data);
					}

					if(item.level == 1 || item.level == 2) {
						let data = {
							menuId: "SETMG",
							btnName: "取消管理员",
							bIsAble: true,
							type: -1,
							level: item.level,
						};
						arrPopMenuData.items.push(data);
					}
					else if(item.level == 4) {
						let data = {
							menuId: "SETMG",
							btnName: "设置管理员",
							bIsAble: true,
							type: 1,
							level: item.level,
						};
						arrPopMenuData.items.push(data);
					}

					this.bIsHandle = true;
				}
				else if(parseInt(this.ismanager) == 2 && parseInt(item.level) != 2) {
					// only setgag
					if(item.banned == 0) {
						let data = {
							menuId: "SETGAG",
							btnName: "设置禁言",
							bIsAble: true,
							type: 1,
							level: item.level,
						};
						arrPopMenuData.items.push(data);
					}
					else if(item.banned == 1) {
						let data = {
							menuId: "SETGAG",
							btnName: "取消禁言",
							bIsAble: true,
							type: -1,
							level: item.level,
						};
						arrPopMenuData.items.push(data);
					}

					this.bIsHandle = true;
				}
				else {
					// do nothing
					this.bIsHandle = false;
				}

				this.popMenuData = JSON.stringify(arrPopMenuData);

				this.htmlScrollPok();
			},
			popMenuEvent: function(item) {
				let that = this;
				if(item == "hide") {
					// hide pop menu
					this.hidePopMenu(false);
				}
				else {
					if(item.bIsAble) {
						switch (item.menuId) {
							case "SETGAG": {
								this.setGag(item);
								break;
							}
							case "SETMG": {
								this.setMg(item);
								break;
							}
						}
					}
					else {
						// do nothing
					}
				}
			},
		},
		components: {
			'handlepopmenu': HandlePopMenu,
			'popchoosetip': PopChooseTip,
		},
	});
</script>
<style lang="less" scoped></style>