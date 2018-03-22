<template>
	<div class="main">
		<div class="compswitch">
			<div class="header" @click='click2EditProfile'>
				<div class="meIcon">
					<img :src='myInfo.avatarimg' alt="">
				</div>

				<div class="meInfo clearfix">
					<div class="meName">
						<p>{{myInfo.username}}</p>
						<!-- <p>昵称：<b>{{myInfo.username}}</b></p> -->
						<span class="icon iconfont">&#xe656;</span>
					</div>
				</div>
			</div>

			<div class="compCre" v-show='hostGroups.length > 0'>
				<p>我创建的社区（管理后台）</p>
				<ul>
					<li v-for='(item, index) in hostGroups' @click='skipPage(item)'>
						<div class="comppic">
							<img :src='item.icon' alt="">
						</div>

						<div class="operate clearfix">
							<p :class="{name: true, active: parseInt(item.lastenter) == 2}">{{item.name}}</p>
							<span class="icon iconfont">&#xe656;</span>
						</div>
					</li>
				</ul>
			</div>

			<div class="compMg" v-show='adminGroups.length > 0'>
				<p>我管理的社区（管理后台）</p>
				<ul>
					<li v-for='(item, index) in adminGroups'  @click='skipPage(item)'>
						<div class="comppic">
							<img :src='item.icon' alt="">
						</div>

						<div class="operate clearfix">
							<p :class="{name: true, active: parseInt(item.lastenter) == 2}">{{item.name}}</p>
							<span class="icon iconfont">&#xe656;</span>
						</div>
					</li>
				</ul>
			</div>

			<div class="compJoin" v-show='joinGroups.length > 0'>
				<p>我加入的社区</p>
				<ul>
					<li v-for='(item, index) in joinGroups'  @click='skipPage(item)'>
						<div class="comppic">
							<img :src='item.icon' alt="">
						</div>

						<div class="operate clearfix">
							<p :class="{name: true, active: parseInt(item.lastenter) == 1}">{{item.name}}</p>
							<span class="icon iconfont">&#xe656;</span>
						</div>
					</li>
				</ul>
			</div>

			<div class="noComp" v-show='bIsNoComp'>
				<span>
					<img src="./../images/no_topic.png"alt="">
				</span>
				<p>暂无加入的社区</p>
			</div>
		</div>

		<transition name="fade1">
			<editprofile v-if='bIsEditProfile' :data='strProFile' @return2Me='return2Me' @changeIcon='changeIcon'></editprofile>
		</transition>
	</div>
</template>
<script type="text/javascript" charset="utf-8" async defer>
	import Mock from 'mockjs';
	import EditProFile from './../comp_child/editprofile.vue';
	export default({
		data() {
			return {
				myInfo: {},
				hostGroups: [],
				adminGroups: [],
				joinGroups: [],
				bIsNoComp: false,
				bIsEditProfile: false,
				strProFile: '',
			}
		},
		beforeCreate() {
			this.DomLoading.show(1);
		},
		mounted() {
			let that = this;

			// title
			document.title = window.serviceName;

			let url = window.publicPath + '/home.php';
			let params = {
				op: "group_trans",
			};
			let template = {
				'my_info': {
					'avatarimg': "http://www.damai186.com/uc_server/avatar.php?uid=0&size=middle",
					'tel': "15189761997",
					'username': "WZH555",
				},
				'host_groups|0-10': [
					{
						'fid': "136",
						'icon': "http://www.damai186.com/uc_server/avatar.php?uid=0&size=middle",
						'level': "1",
						'name': "公司名（35）",
						'lastenter': 0,
					},
				],
				'admin_groups|0-10': [
					{
						'fid': "136",
						'icon': "http://www.damai186.com/uc_server/avatar.php?uid=0&size=middle",
						'level': "2",
						'name': "公司名（35）",
						'lastenter': 0,
					},
				],
				'join_groups|0-10': [
					{
						'fid': "136",
						'icon': "http://www.damai186.com/uc_server/avatar.php?uid=0&size=middle",
						'level': "4",
						'name': "公司名（35）",
						'lastenter': 0,
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
					if(result.my_info) {
						this.myInfo = result.my_info;
						// this.strProFile = JSON.stringify(result.my_info);

						this.myInfo.avatarimg += "?" + Math.round(Math.random()*8999 + 1000);
					}
					
					if(result.host_groups) {
						this.hostGroups = result.host_groups;
					}

					if(result.admin_groups) {
						this.adminGroups = result.admin_groups;
					}
					
					if(result.join_groups) {
						this.joinGroups = result.join_groups;
					}

					if(this.hostGroups.length == 0 && this.adminGroups.length == 0 && this.joinGroups.length == 0) {
						this.bIsNoComp = true;
					}
				}

				this.DomLoading.hide(1);
			},
			skipPage: function(item) {
				let that = this;

				if(parseInt(item.lastenter) == 1) {
					window.location.href = window.publicPath3 + "/dist/communityhome/communityhome.html?fid=" + item.fid;
				}
				else if(parseInt(item.lastenter) == 2) {
					window.location.href = window.publicPath + "/dist/comphome/comphome.html?fid=" + item.fid;
				}
				else {
					let url = window.publicPath + '/home.php';
					let params = {
						op: "access_group",
						acc_fid: item.fid,
						level: item.level,
					};
					let template = 1;
					this.mock(url, template);
					this.ajax(url, params, function(res) {
						let result = res.body;
						if(parseInt(result) == 1) {
							// console.log("记录成功");
							if(item.level == 1 || item.level == 2) {
								window.location.href = window.publicPath + "/dist/comphome/comphome.html?fid=" + item.fid;
							}
							else if(item.level == 4) {
								window.location.href = window.publicPath3 + "/dist/communityhome/communityhome.html?fid=" + item.fid;
							}
						}
						else {
							// console.log("记录失败或没有权限");
						}
					});
				}
			},
			click2EditProfile: function() {
				this.bIsEditProfile = true;

				this.htmlScrollPok();
			},
			return2Me: function(bool) {
				this.bIsEditProfile = bool;
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
			changeIcon: function(src) {
 				this.myInfo.avatarimg = src;
			},
		},
		watch: {
			'myInfo': {
				deep: true,
				handler: function(newVal, olaVal) {
					this.strProFile = JSON.stringify(newVal);
				},
			},
		},
		components: {
			'editprofile': EditProFile,
		},
	});
</script>
<style lang="less" scoped></style>