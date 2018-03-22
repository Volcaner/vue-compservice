<template>
	<div class="main">
		<div class="header">
			<div class="headerpic" @click='click2Data'>
				<img :src='icon' alt="">
			</div>

			<div class="company" @click='click2Data'>
				<p>{{comp_name}}<span class="icon iconfont">&#xe656;</span></p>
			</div>
		</div>

		<div class="manage">
			<div class="member" v-show='1 == ismanager || 2 == ismanager'>
				<div class="ico" @click='click2Member'>
					<img src="./../images/icon_1.png" alt="ico">
				</div>

				<div class="handle" @click='click2Member'>
					<p>成员管理<span class="icon iconfont">&#xe656;</span></p>
				</div>
			</div>

			<div class="transfer" v-show='1 == ismanager'>
				<div class="ico" @click='click2Transfer'>
					<img src="./../images/icon_2.png" alt="ico">
				</div>

				<div class="handle" @click='click2Transfer'>
					<p>社区转让<span class="icon iconfont">&#xe656;</span></p>
				</div>
			</div>
		</div>

		<div class="switch" @click='click2Switch'>
			<p>管理<br />社区</p>
		</div>
	</div>
</template>
<script type="text/javascript" charset="utf-8" async defer>
	import Mock from 'mockjs';
	export default({
		data() {
			return {
				uid: '291',
				fid: '125',
				ismanager: 0,
				comp_name: '',
				icon: '',
				comp_info: '',
			}
		},
		beforeCreate() {
			this.DomLoading.show(1);
		},
		mounted() {
			let that = this;

			// post for data
			let url = window.publicPath + '/home.php';
			let params = {
				op: 'home_default',
			};
			let template = {
				'uid': /[0-9][0-9][0-9]/,
				'fid': /[0-9][0-9][0-9]/,
				// 'ismanager': /[0-3]/,
				'ismanager': 1,  // 管理等级 1为群主 2为管理员 其他为非管理
				'comp_name|1-4': /新共秀网络/,
				'description|0-100': /社区简介/,
				'icon': 'http://www.damai186.com/uc_server/avatar.php?uid=0&size=middle',
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
					this.uid = result.uid;
					this.fid = result.fid;
					this.ismanager = result.ismanager;
					this.comp_name = result.comp_name;
					this.icon = result.icon + "?" + Math.round(Math.random()*8999 + 1000);
					this.compInfo = result.description;

					this.LocalStorage.setItem("uid", this.uid);
					this.LocalStorage.setItem("fid", this.fid);
					this.LocalStorage.setItem("comp_name", this.comp_name);
					this.LocalStorage.setItem("comp_info", this.compInfo);
					this.LocalStorage.setItem("icon", this.icon);
					this.LocalStorage.setItem("ismanager", this.ismanager);

					document.title = result.comp_name;
				}

				this.DomLoading.hide(1);
			},
			click2Data: function() {
				window.location.href = window.publicPath + "/dist/compdatasetting/compdatasetting.html";
			},
			click2Member: function() {
				window.location.href = window.publicPath + "/dist/membermg/membermg.html";
			},
			click2Transfer: function() {
				window.location.href = window.publicPath + "/dist/comptransfer/comptransfer.html";
			},
			click2Switch: function() {
				window.location.href = window.publicPath + "/dist/compswitch/compswitch.html";
			},
		},
	});
</script>
<style lang="less" scoped></style>