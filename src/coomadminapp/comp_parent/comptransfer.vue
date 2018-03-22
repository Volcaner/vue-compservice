<template>
	<div class="main">
		<div class="comptransfer">
			<p>管理员（<b>{{data.admin_count}}/{{data.user_count}}</b>）</p>
			<ul>
				<li v-for='(item, index) in data.admin'>
					<div class="mem clearfix">
						<img :src='item.avatarimg' alt="">
						<p>{{item.username}}</p>
					</div>
					<div class="iftransfer clearfix">
						<p @click='click2Transfer(item.uid)'>转让给TA</p>
					</div>
				</li>
			</ul>
		</div>

		<div v-if='bIsTrasfer' class="dialog_layout">
			<div class="dialog">
				<div class="title">
					<p>转让社区</p>
					<span class="icon iconfont" @click='hideDialog'>&#xe603;</span>
				</div>

				<div class="validate">
					<div class="tel">
						<label>
							<span class="icon iconfont">&#xe600;</span>
							<input type="text" name="telinput" placeholder="请输入手机号" size="10" v-model='telVal' :value="telVal.trim()" @focus='afterInputFocus("telinput")' @blur='afterInputBlur("telinput")'>
						</label>
						<span class="getidcode" v-show='!bIsGetCode' @click='post4IdCode'>获取验证码</span>
						<span class="countdown" v-show='bIsGetCode'>倒计时<b>60</b>秒</span>
						<p class="tipsone" v-show='bIsTipOne'>{{tipsone}}</p>
					</div>
					<div class="idcode">
						<label>
							<span class="icon iconfont">&#xe6dd;</span>
							<input type="text" name="idcode" placeholder="请输入验证码" size="20" v-model='idcodeVal' :value="idcodeVal.trim()" @focus='afterInputFocus("idcode")' @blur='afterInputBlur("idcode")'>
						</label>
						<p class="tipstwo" v-show='bIsTipTwo'>{{tipstwo}}</p>
					</div>	
				</div>	

				<div class="comfirm">
					<input type="button" name="confirm" value="确定" @click='submit'>
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript" charset="utf-8" async defer>
	import Mock from 'mockjs';
	export default({
		data() {
			return {
				uid: '',
				fid: '',
				comp_name: '',
				ismanager: '',
				data: {
					user_count: 0,
					host: [
						// {
						// 	uid: '291',
						// 	username: 'WZH55',
						// 	avatarimg: 'http://test1.ant188.com/yich/uc_server/data/avatar/000/00/02/91_avatar_middle-8259.jpg',
						// 	banned: 0,
						// }
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
				bIsTrasfer: false,
				bIsTipOne: false,
				bIsTipTwo: false,
				tipsone: '',
				tipstwo: '',
				idcodeVal: '',
				telVal: '',
				bIsGetCode: false,
				countDownTimer: null,
				cha_uid: '',
				bIsTelUsable: false,
			}
		},
		beforeCreate() {
			this.DomLoading.show(1);
		},
		created() {
			// init data
			this.uid = this.LocalStorage.getItem("uid");
			this.fid = this.LocalStorage.getItem("fid");
			this.comp_name = this.LocalStorage.getItem("comp_name");
			this.ismanager = this.LocalStorage.getItem("ismanager");
		},
		mounted() {
			let that = this;

			// title
			document.title = this.comp_name;

			// post for data
			let url = window.publicPath + '/home.php';
			let params = {
				op: 'group_users',
			};
			let template = {
				'user_count': 36,
				'host': [
					{
						'uid': /[0-9][0-9][0-9]/,
						"username|1-3": /WZH55/,
						'avatarimg': 'http://test1.ant188.com/yich/uc_server/data/avatar/000/00/02/91_avatar_middle-8259.jpg',
						'banned': 0,
						'level': 1,
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
					this.data = result;
				}

				this.DomLoading.hide(1);
			},
			click2Transfer: function(cha_uid) {
				let that = this;
				this.bIsTrasfer = true;
				this.bIsTelUsable = false;
				setTimeout(function() {
					document.querySelector("input[name='telinput']").focus(); 
					that.idcodeVal = '';
					that.telVal = '';
					that.cha_uid = cha_uid;
				}, 10);
			},
			hideDialog: function() {
				this.bIsTrasfer = false;

				clearInterval(this.countDownTimer);
				this.bIsGetCode = false;
				let countDownEl = document.querySelector('span.countdown').childNodes.item(1);
				countDownEl.innerHTML = 60;
			},
			submit: function() {
				let that = this;
				let telPattern = /^1(3|4|5|7|8)\d{9}$/;
				let bIsNull = /^\s*$/g;
				if(telPattern.test(this.telVal) && !bIsNull.test(this.idcodeVal) && this.bIsTelUsable) {
					let url = window.publicPath + '/home.php';
					let params = {
						op: 'host_trans',
						tel: this.telVal,
						code: this.idcodeVal,
						cha_uid: this.cha_uid,
					};
					let template = 1;
					this.mock(url, template);
					this.ajax(url, params, function(res) {
						let result = res.body;
						if(parseInt(result) > 0) {
							alert("转让成功");

							// hide dialog
							that.hideDialog();
						}
						else if(parseInt(result) == 0) {
							alert("转让失败");
						}
						else if(parseInt(result) == -1) {
							alert("手机号已更改");
						}
						else if(parseInt(result) == -4) {
							alert("没有权限");
						}
						else if(parseInt(result) == -5) {
							alert("验证码错误");
						}
						else if(parseInt(result) == -8) {
							alert("验证码过期");
						}
						else if(parseInt(result) == -99) {
							alert("未发送短信");
						}
					});
				}
				else {
					// do nothing
					return;
				}
			},
			isNullOrEmpty: function(str) {
				if(str == null || str == undefined || str == "") {
					return true;
				}
				else {
					return false;
				}
			},
			afterInputFocus: function(strName) {
				// input focus聚焦 
				let that = this;

				switch(strName) {
					case "telinput": {
						this.bIsTipOne = false;
						break;
					}
					case "idcode": {
						break;
					}
				}
			},
			afterInputBlur: function(strName) {
				// input blur失焦
				let that = this;
				let strVal = document.querySelector('input[name='+ strName + ']').value;
				let telPattern = /^1(3|4|5|7|8)\d{9}$/;

				switch(strName) {
					case "telinput": {
						if(!telPattern.test(strVal)){
							this.bIsTipOne = true;
							this.tipsone = "请输入正确的手机号码";
						}
						break;
					}
					case "idcode": {
						break;
					}
				}
			},
			post4IdCode: function() {
				let telPattern = /^1(3|4|5|7|8)\d{9}$/;
				let that = this;

				// bis telphone number available?
				if(telPattern.test(this.telVal)) {
					let count = 60;
					this.bIsGetCode = true;
					clearInterval(this.countDownTimer);

					// count down
					this.countDownTimer = setInterval(function() {
						let countDownEl = document.querySelector('span.countdown').childNodes.item(1);
						countDownEl.innerHTML = count;
						count--;
						if(count < 0) {
							clearInterval(that.countDownTimer);
							that.bIsGetCode = false;

							count = 60;
							countDownEl.innerHTML = count;
						}
					}, 1000);

					// post , {emulateJSON:true}
					let url = window.publicPath + '/home.php';
					let params = {
						op: 'verify_code',
						tel: this.telVal,
					};
					let template = 1;
					this.mock(url, template);
					this.ajax(url, params, function(res) {
						let result = res.body;
						that.bIsTipOne = true;
						if(0 < parseInt(result)) {
							// 发送成功
							that.bIsTipOne = false;

							// tel usable
							that.bIsTelUsable = true;
						}
						else if(-4 == parseInt(result) || -41 == parseInt(result)) {
							// 手机格式错误
							that.tipsone = "手机格式错误";
						}
						else if(-1 == parseInt(result) || -11 == parseInt(result)) {
							// 手机号有误或被禁用，请输入其他手机号
							that.tipsone = "手机号有误或被禁用，请输入其他手机号";
						}
						else {
							// 接口错误，短信发送失败
							that.tipsone = "短信发送失败";
						}
					});
				}
				else {
					this.bIsTipOne = true;
					this.tipsone = "请输入正确的手机号码";
				}
			},
		},
		watch: {
			'telVal': function(newVal, oldVal) {
				this.telVal = newVal.replace(/\s+/g,'');
			},
			'idcodeVal': function(newVal, oldVal) {
				this.idcodeVal = newVal.replace(/\s+/g,'');
			},
		},
	});
</script>
<style lang="less" scoped></style>