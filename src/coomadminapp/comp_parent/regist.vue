<template>
	<div class="main">
		<div class="header clearfix">
			<img src="./../images/icon_0.png" alt="header">
		</div>

		<div class="validate">
			<div class="tel">
				<label>
					<span class="icon iconfont">&#xe63a;</span>
					<input type="text" name="userinput" placeholder="用户名" size="20" @focus='afterInputFocus("userinput")' @blur='afterInputBlur("userinput")' v-model='userVal' :value="userVal.trim()">
				</label>
				<p class="tipsone" v-show='bIsTipOne'>{{tipsone}}</p>
			</div>
			<div class="idcode">
				<label>
					<span class="icon iconfont">&#xe604;</span>
					<input type="password" name="password" placeholder="登录密码" size="20" @blur='afterInputBlur("password")' v-model='passwordVal' :value="passwordVal.trim()">
				</label>
				<p class="tipstwo" v-show='bIsTipTwo'>{{tipstwo}}</p>
			</div>
		</div>

		<div class="nextstap" @click='post4Regist'>登录</div>
	</div>
</template>
<script type="text/javascript" charset="utf-8" async defer>
	import Mock from 'mockjs';
	export default({
		data() {
			return {
				userVal: '',
				passwordVal: '',
				bIsTipOne: false,
				bIsTipTwo: false,
				tipsone: '',
				tipstwo: '',
			}
		},
		mounted() {
			// title
			document.title = window.serviceName;
		},
		methods: {
			ajax: function(url, params, successCallback) {
				let that = this;
				this.$http.post(url, params, {emulateJSON: true}).then(function(res) {
					// console.log(res);
					setTimeout(function() {
						successCallback(res);
					}, 1000);
				}, function(error) {
					// console.log(error);
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
					case "userinput": {
						this.bIsTipOne = false;
						break;
					}
					case "password": {
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
					case "userinput": {
						let url = window.publicPath1 + '/wechat_member.php';
						let params = {
							action: 'check_username', 
							username: this.userVal,
						};
						// this.mock(url, template);
						this.ajax(url, params, function(res) {
							let result = res.body;
							that.bIsTipOne = true;
							switch(parseInt(result.result)) {
								case 1: {
									// 可用
									that.bIsTipOne = false;
									break;
								}
								case -1: {
									// 格式错误
									that.tipsone = "格式错误";
									break;
								}
								case -2: {
									// 包含系统屏蔽字符(用户名可包含中英文，数字，—，-)
									that.tipsone = "包含系统屏蔽字符(用户名可包含中英文，数字，-，_)";
									break;
								}
								case -3: {
									// 已存在
									// that.tipsone = "用户名已存在！";
									that.bIsTipOne = false;
									break;
								}
							}
						});
						break;
					}
					case "password": {
						break;
					}
				}
			},
			post4Regist: function() {
				let that = this;
				let bIsNull = /^\s*$/g;
				if(!bIsNull.test(this.userVal) && !bIsNull.test(this.passwordVal)) {
					let url = window.publicPath1 + '/wechat_member.php';
					let params = {
						action: 'wechat_reg', 
						username: this.userVal, 
						password: this.passwordVal,
					};
					// this.mock(url, template);
					this.ajax(url, params, function(res) {
						if(res && res.body) {
							let result = res.body;
							switch(parseInt(result.result)) {
								case 1: {
									// 成功并跳转主界面
									window.location.href = window.publicPath + "/dist/compswitch/compswitch.html"; 
									break;
								}
								case 0: {
									// 信息添加错误
									alert("信息添加错误");
									break;
								}
								case -1: {
									// 用户名格式错误
									alert("用户名格式错误");
									break;
								}
								case -2: {
									// 用户名包含系统屏蔽字符
									alert("用户名包含系统屏蔽字符");
									break;
								}
								case -3: {
									// 用户名已存在
									alert("用户名已存在");
									break;
								}
								case -5: {
									// 密码长度小于6
									alert("密码长度小于6");
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
		},
		watch: {
			'userVal': function(newVal, oldVal) {
				this.userVal = newVal.replace(/\s+/g,'');
			},
			'passwordVal': function(newVal, oldVal) {
				this.passwordVal = newVal.replace(/\s+/g,'');
			},
		}
	});
</script>
<style lang="less" scoped></style>