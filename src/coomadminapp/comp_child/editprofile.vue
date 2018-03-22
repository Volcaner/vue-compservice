<template>
	<div class="profile">
		<div class="proReturn">
			<div class="return2Me" @click='return2Me'>
				<span class="icon iconfont">&#xe601;</span><p>返回个人资料</p>
			</div>
		</div>

		<div class="fileChange">
			<div class="proPic" @click='changeCompIcon'>
				<div class="proTitle">
					<p>个人头像</p>
				</div>
				<div class="proValue">
					<img :src='proFile.avatarimg' alt=""><span class="icon iconfont">&#xe656;</span>
				</div>
			</div>

			<div class="proName">
				<div class="proTitle">
					<p>用户名</p>
				</div>
				<div class="proValue">
					<p>{{proFile.username}}</p>
				</div>
			</div>

			<!-- <div class="proAlias">
				<div class="proTitle">
					<p>昵称</p>
				</div>
				<div class="proValue">
					<b>morning_922</b><span class="icon iconfont">&#xe656;</span>
				</div>
			</div> -->
		</div>

		<div class="fileHandle">
			<div class="proTel" @click='click2ChangeTel'>
				<div class="proTitle">
					<p>登录手机换绑</p>
				</div>
				<div class="proValue">
					<b>{{proFile.tel}}</b><span class="icon iconfont">&#xe656;</span>
				</div>
			</div>
		</div>

		<div v-show='bIsChangeTel' class="dialog_layout">
			<div class="dialog">
				<div class="title">
					<p>登录手机换绑</p>
					<span class="icon iconfont" @click='hideDialog'>&#xe603;</span>
				</div>

				<div class="validate">
					<div class="tel">
						<label>
							<span class="icon iconfont">&#xe600;</span>
							<input type="text" name="telinput" placeholder="请输入手机号" size="10" maxlength="11" v-model='telVal' :value="telVal.trim()" @focus='afterInputFocus("telinput")' @blur='afterInputBlur("telinput")'>
						</label>
						<span class="getidcode" v-show='!bIsGetCode' @click='post4IdCode'>获取验证码</span>
						<span class="countdown" v-show='bIsGetCode'>倒计时<b>60</b>秒</span>
						<p class="tipsone" v-show='bIsTipOne'>{{tipsone}}</p>
					</div>
					<div class="idcode">
						<label>
							<span class="icon iconfont">&#xe6dd;</span>
							<input type="text" name="idcode" placeholder="请输入验证码" size="20" maxlength="10" v-model='idcodeVal' :value="idcodeVal.trim()" @focus='afterInputFocus("idcode")' @blur='afterInputBlur("idcode")'>
						</label>
						<p class="tipstwo" v-show='bIsTipTwo'>{{tipstwo}}</p>
					</div>	
				</div>	

				<div class="comfirm">
					<input type="button" name="confirm" value="确定" @click='submit2ChangeTel'>
				</div>
			</div>
		</div>

		<updateheadpic v-if='bIsChangIcon' :pic='pic' @hide='hideUpdatePic' @postForPic='post4SelfPic'></updateheadpic>
	</div>
</template>
<script type="text/javascript" charset="utf-8" async defer>
	import Mock from 'mockjs';
	import css from './../less/editprofile.less';
	import UpdateHeadpic from './../comp_child/updateHeadpic.vue';
	export default({
		data() {
			return {
				uid: '',
				bIsChangeTel: false,
				bIsTipOne: false,
				bIsTipTwo: false,
				tipsone: '',
				tipstwo: '',
				telVal: '',
				idcodeVal: '',
				bIsGetCode: false,
				countDownTimer: null,
				bIsTelUsable: false,
				bIsChangIcon: false,
			}
		},
		props: ['data'],
		computed: {
			proFile: function() {
				if(this.data != undefined && this.data != null && this.data != "") {
					return JSON.parse(this.data);
				}
			},
		},
		mounted() {
			this.uid = this.LocalStorage.getItem("uid");
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
			return2Me: function() {
				this.$emit('return2Me', false);
			},
			click2ChangeTel: function() {
				let that = this;
				this.bIsChangeTel = true;
				this.bIsTelUsable = false;
				setTimeout(function() {
					document.querySelector("input[name='telinput']").focus(); 
					that.idcodeVal = '';
					that.telVal = '';
				}, 10);
			},
			hideDialog: function() {
				this.bIsChangeTel = false;

				clearInterval(this.countDownTimer);
				this.bIsGetCode = false;
				let countDownEl = document.querySelector('span.countdown').childNodes.item(1);
				countDownEl.innerHTML = 60;
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
							countDownEl.innerHTML = 60;
						}
					}, 1000);

					// post , {emulateJSON:true}
					let url = window.publicPath + '/get_verify.php';
					let params = {
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
						else if(-6 == parseInt(result)) {
							// 手机号已绑定账号
							that.tipsone = "手机号已绑定账号";
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
			submit2ChangeTel: function() {
				let that = this;
				let telPattern = /^1(3|4|5|7|8)\d{9}$/;
				let bIsNull = /^\s*$/g;

				if(telPattern.test(this.telVal) && !bIsNull.test(this.idcodeVal) && this.bIsTelUsable) {
					let url = window.publicPath + '/home.php';
					let params = {
						op: "change_tel",
						tel: this.telVal,
						code: this.idcodeVal,
					};
					let template = 1;
					this.mock(url, template);
					this.ajax(url, params, function(res) {
						let result = res.body;
						if(result) {
							if(result.res) {
								if(parseInt(result.res) > 0) {
									// hide dialog
									that.hideDialog();
									
									that.proFile.tel = result.res;
								}
								else if(parseInt(result.res) == 0) {
									alert("改绑失败");
								}
								else if(parseInt(result.res) == -1) {
									alert("手机号已更改");
								}
								else if(parseInt(result.res) == -4) {
									alert("没有权限");
								}
								else if(parseInt(result.res) == -5) {
									alert("验证码错误");
								}
								else if(parseInt(result.res) == -8) {
									alert("验证码过期");
								}
								else if(parseInt(result.res) == -99) {
									alert("未发送短信");
								}
							}
							else {
								alert("改绑失败");
							}
						}
					});
				}
				else {
					// this.bIsTipTwo = true;
					// this.tipstwo = "手机号码或验证码请输入有误";
				}
			},
			changeCompIcon: function() {
				this.bIsChangIcon = true;
			},
			hideUpdatePic: function(bool) {
				this.bIsChangIcon = bool;
			},
			changeIcon: function(src) {
				this.proFile.avatarimg = src;
				this.$emit('changeIcon', src);
			},
			post4SelfPic: function(src) {
				let that = this;
				let url = window.publicPath2 + '/uc_server/avatar_wechat.php';
				let params = {
					img: src,
					uid: that.uid,
				};
				this.ajax(url, params, function(res) {
					var res = parseInt(res.body.res);
 					if(res > 0) {
 						that.changeIcon(src);
 						that.hideUpdatePic(false);
 					}
 					else if(res == -1) {
 						alert("图片为空");
 					}
 					else if(res == -2) {
 						alert("图片过大（限制2M）");
 					}
 					else if(res == -3) {
 						alert("图片格式错误（'jpg', 'jpeg', 'gif', 'png', 'bmp'）");
 					}
				});
			},
		},
		components: {
			'updateheadpic': UpdateHeadpic,
		},
		watch: {
			'telVal': function(newVal, oldVal) {
				this.telVal = newVal.replace(/\D/g, "");
			},
		},
	});
</script>
<style lang="less" scoped></style>