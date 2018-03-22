<template>
	<div class="main">
		<div class="header clearfix">
			<img src="./../images/registheader.png" alt="header">
		</div>

		<div class="validate">
			<div class="tel">
				<label>
					<span class="icon iconfont">&#xe600;</span>
					<input type="text" name="telinput" placeholder="手机号" size="20" v-model='telVal' :value="telVal.trim()" @focus='afterInputFocus("telinput")' @blur='afterInputBlur("telinput")'>
				</label>
				<p class="tipsone" v-show='bIsTipOne'>{{tipsone}}</p>
			</div>
			<div class="idcode">
				<label>
					<span class="icon iconfont">&#xe6dd;</span>
					<input type="text" name="idcode" placeholder="验证码" size="10" v-model='idcodeVal' :value="idcodeVal.trim()" @focus='afterInputFocus("idcode")' @blur='afterInputBlur("idcode")'>
				</label>
				<span class="getidcode" v-show='!bIsGetCode' @click='post4IdCode'>获取验证码</span>
				<span class="countdown" v-show='bIsGetCode'>倒计时<b>60</b>秒</span>
				<p class="tipstwo" v-show='bIsTipTwo'>{{tipstwo}}</p>
			</div>
			<div class="pw" v-show='bIsFirstLogin'>
				<label>
					<span class="icon iconfont">&#xe604;</span>
					<input @blur='afterInputBlur("password")' type="password" name="password" v-model='passwordVal' :value="passwordVal.trim()" placeholder="登录密码" size="10">
				</label>
				<p class="tipsthree" v-show='bIsTipsthree'>{{tipsthree}}</p>
			</div>
		</div>

		<div class="nextstap" @click='post4Login'>下一步</div>
	</div>
</template>
<script type="text/javascript" charset="utf-8" async defer>
	import Mock from 'mockjs';
	import md5 from 'md5';
	export default({
		data() {
			return {
				bIsGetCode: false,
				idcodeVal: '',
				telVal: '',
				bIsTipOne: false,
				bIsTipTwo: false,
				tipsone: '',
				tipstwo: '',
				countDownTimer: null,
				bIsTipsthree: false,
				tipsthree: '登录密码/手机号码错误！',
				bIsFirstLogin: false,
				passwordVal: '',
			}
		},
		mounted() {
			// title
			document.title = window.serviceName;
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
					// console.log(error);
					that.Loading.hide(1);
				});
			},
			mock: function(url, template) {
				if(window.bIsMock) {
					Mock.mock(url, template);
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
						this.bIsTipTwo = false;
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
						else{
							this.$http.post(window.publicPath1 + '/wechat_member.php', {action: 'check_tel', tel: strVal}, {emulateJSON:true}).then(function(res) {
								// console.log(res);
								let result = res.body;
								that.bIsTipsone = true;
								switch(Number(result.result)) {
									case 1: {
										// 不存在
										that.bIsTipsone = false;
										that.bIsFirstLogin = true;
										break;
									}
									case -6: {
										// 已存在
										that.bIsTipsone = false;
										that.bIsFirstLogin = false;
										break;
									}
									case -4: {
										// 格式错误
										that.bIsFirstLogin = false;
										that.tipsone = "格式错误";
										break;
									}
								}
							}, function(error) {
								// console.log(error);
								window.location.href = window.publicPath + "/dist/error404/error404.html"; 
							});
						}
						break;
					}
					case "idcode": {
						break;
					}
				}
			},
			post4Login: function() {
				let that = this;
				let telPattern = /^1(3|4|5|7|8)\d{9}$/;
				let bIsNull = /^\s*$/g;

				let bIsCanPost = false;
				let params = {};
				if(this.bIsFirstLogin) {
					bIsCanPost = telPattern.test(this.telVal) && !bIsNull.test(this.idcodeVal) && !bIsNull.test(this.passwordVal);
					params = {
						action: 'shot_login', 
						tel: this.telVal, 
						seccode: this.idcodeVal,
						password: md5(this.passwordVal)
					};
				}
				else {
					bIsCanPost = telPattern.test(this.telVal) && !bIsNull.test(this.idcodeVal);
					params = {
						action: 'shot_login', 
						tel: this.telVal, 
						seccode: this.idcodeVal,
					};
				}

				if(bIsCanPost) {
					let url = window.publicPath1 + '/wechat_member.php';
					// this.mock(url, template);
					this.ajax(url, params, function(res) {
						let result;
						let resReg = /\{\"result\"([^\}])+\}/g;
						let bodyText = res.bodyText;
						if(!res.body && bodyText.match(resReg).length > 0) {  // Object.prototype.toString.call(res.body) === "[object String]"
							result = JSON.parse(bodyText.match(resReg));
						}
						else {
							result = res.body;
						}

						that.bIsTipTwo = true;

						if(result && result.result) {
							switch(result.result) {
								// case "add_success": {
								// 	// 成功并跳转到2界面
								// 	that.bIsTipTwo = false;
									
								// 	window.location.href = window.publicPath + "/dist/coomadmin/regist/regist.html"; 
								// 	break;
								// }
								case "update_success": {
									// 成功并跳转到主界面
									that.bIsTipTwo = false;
									window.location.href = window.publicPath + "/dist/compswitch/compswitch.html"; 
									break;
								}
								case "noCode": {
									// 未发送验证码
									that.tipstwo = '未发送验证码';
									break;
								}
								case "mysql_Error": {
									// 信息添加错误
									that.tipstwo = '信息添加错误';
									break;
								}
								case "codeOutTime": {
									// 验证码超时
									that.tipstwo = '验证码超时';
									break;
								}
								case "codeError": {
									// 验证码错误
									that.tipstwo = '验证码错误';
									break;
								}
								case "telcheng": {
									// 手机号更改，请重新发送
									that.bIsTipTwo = false;
									that.bIsTipOne = true;
									that.tipsone = '手机号更改，请重新发送';
									break;
								}
								case "pwd_Error": {
									// 密码为空或未加密
									that.bIsTipTwo = false;
									that.bIsTipsthree = true;
									that.tipsthree = '密码为空或未加密';
									break;
								}
							}
						}
					});
					
				}else {
					// console.log("do nothing");
					return;
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
					let url = window.publicPath1 + '/get_verify.php';
					let params = {
						tel: this.telVal,
					};
					// this.mock(url, template);
					this.ajax(url, params, function(res) {
						let result = res.body;
						that.bIsTipsone = true;
						if(0 < parseInt(result.res)) {
							// 发送成功
							that.bIsTipsone = false;
						}else if(-4 == parseInt(result.res) || -41 == parseInt(result.res)) {
							// 手机格式错误
							that.tipsone = "手机格式错误";
						}else if(-1 == parseInt(result.res) || -11 == parseInt(result.res)) {
							// 手机号有误或被禁用，请输入其他手机号
							that.tipsone = "手机号有误或被禁用，请输入其他手机号";
						}else {
							// 接口错误，短信发送失败
							that.tipsone = "短信发送失败";
						}
					});
				}else {
					this.bIsTipsone = true;
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