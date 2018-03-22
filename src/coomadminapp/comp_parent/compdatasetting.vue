<template>
	<div class="main">
		<div class="setting">
			<div class="comppic clearfix" @click='changeCompIcon'>
				<div class="title">
					<p>社区头像</p>
				</div>

				<div class="changepic clearfix">
					<img :src='icon' alt="" @click='click2Preview'>
					<span class="icon iconfont">&#xe656;</span>
				</div>
			</div>

			<div class="compname clearfix" @click='changeCompName'>
				<div class="title">
					<p>社区名称</p>
				</div>

				<div class="name">
					<p>{{compName}}</p>
					<span class="icon iconfont">&#xe656;</span>
				</div>
			</div>

			<div id="compintro" class="compintro clearfix" @click='changeCompInfo'>
				<div class="title">
					<p>社区简介</p>
				</div>

				<div id="intro" class="intro">
					<p>{{compInfo}}</p>
					<span class="icon iconfont">&#xe656;</span>
				</div>
			</div>

			<div class="footer hide">
				<input type="button" name="photography" value="拍照">
				<input type="button" name="picture" value="从相册上传">
				<input type="button" name="cancel" value="取消">
			</div>

			<changeName :text='compName' v-show='bIsChangeName' @changeOk='changeNameOkCallback' @changeCancel="changeNameCancelCallback"></changeName>
			<changeInfo :text='compInfo' v-show='bIsChangeInfo' @changeOk='changeInfoOkCallback' @changeCancel="changeInfoCancelCallback"></changeInfo>
			<updateheadpic v-if='bIsChangIcon' :pic='pic' @hide='hideUpdatePic' @postForPic='post4SelfPic'></updateheadpic>
		</div>
	</div>
</template>
<script type="text/javascript" charset="utf-8" async defer>
	import changeName from './../comp_child/changename.vue';
	import changeInfo from './../comp_child/changeinfo.vue';
	import UpdateHeadpic from './../comp_child/updateHeadpic.vue';
	import Mock from 'mockjs';
	import wx from 'weixin-js-sdk';
	import sha1 from 'sha1';
	export default({
		data() {
			return {
				uid: '',
				fid: '',
				compName: '宝鸡有一群怀揣着梦想的少年相信在牛大叔的带领下会创造生命的奇迹网络科技有限公司',
				compInfo: '社区简介社区简介社区简介社区简介社区简介社区简介社区简介社区简介',
				icon: 'http://www.damai186.com/uc_server/avatar.php?uid=0&size=middle',
				bIsChangeName: false,
				bIsChangeInfo: false,
				pic: '',
				bIsChangIcon: false,
			}
		},
		beforeCreate() {
			this.DomLoading.show(1);
		},
		mounted() {
			let that = this;

			// title
			this.compName = this.LocalStorage.getItem("comp_name");
			this.uid = this.LocalStorage.getItem("uid");
			this.fid = this.LocalStorage.getItem("fid");
			this.compInfo = this.LocalStorage.getItem("comp_info");
			this.icon = this.LocalStorage.getItem("icon");
			document.title = this.compName;

			document.body.onload = function() {
				let WindowHeight = document.body.clientHeight?document.body.clientHeight:document.body.offsetHeight;
				let HtmlFontSize = parseFloat(document.getElementsByTagName('html')[0].style.fontSize);
				let comppicH = document.querySelector('.comppic').offsetHeight;
				let compnameH = document.querySelector('.compname').offsetHeight;
				let comIntroPaddingTop = parseFloat(that.getStyle(document.getElementById('compintro'), 'padding-top'));
				document.getElementById('compintro').style.maxHeight = (WindowHeight - comppicH - compnameH)/HtmlFontSize + "rem";
				document.getElementById('intro').children.item(0).style.maxHeight = (WindowHeight - comppicH - compnameH - 2*comIntroPaddingTop)/HtmlFontSize + "rem";
			};

			this.DomLoading.hide(1);
		},
		created() {
			// 配置微信JS-SDK
			this.getWxConfig();
		},
		updated() {
			// console.log(this.compName);
			let WindowHeight = document.body.clientHeight?document.body.clientHeight:document.body.offsetHeight;
			let HtmlFontSize = parseFloat(document.getElementsByTagName('html')[0].style.fontSize);
			let comppicH = document.querySelector('.comppic').offsetHeight;
			let compnameH = document.querySelector('.compname').offsetHeight;
			let comIntroPaddingTop = parseFloat(this.getStyle(document.getElementById('compintro'), 'padding-top'));
			document.getElementById('compintro').style.maxHeight = (WindowHeight - comppicH - compnameH)/HtmlFontSize + "rem";
			document.getElementById('intro').children.item(0).style.maxHeight = (WindowHeight - comppicH - compnameH - 2*comIntroPaddingTop)/HtmlFontSize + "rem";
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
			changeCompIcon: function() {
				let that = this;
				// console.log("change community icon");

				this.bIsChangIcon = true;

				// wx.chooseImage({
				//     count: 1, // 默认9
				//     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				//     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				//     success: function (res) {
				//         // var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
				        
				//         // todo
				//         // that.pic = res.localIds[0];
				//         // that.bIsChangIcon = true;
				        
				//         let imgel = document.createElement('img');
				//         imgel.src = res.localIds[0];
				//         alert("1" + imgel.src);
				//         imgel.onload = function() {
				//         	alert("2" + imgel.src);
				//         	document.body.appendChild(imgel);
				//         };
				//     }
				// });


			},
			click2Preview: function() {
				// wx.previewImage({
			 //      	current: 'http://img5.douban.com/view/photo/photo/public/p1353993776.jpg',
			 //      	urls: [
			 //        	'http://img3.douban.com/view/photo/photo/public/p2152117150.jpg',
			 //       	 	'http://img5.douban.com/view/photo/photo/public/p1353993776.jpg',
			 //        	'http://img3.douban.com/view/photo/photo/public/p2152134700.jpg'
			 //      	]
			 //    });
			},
			changeCompName: function() {
				// console.log("change community name");
				this.bIsChangeName = true;
			},
			changeNameOkCallback: function(obj) {
				this.bIsChangeName = false;
				this.compName = obj.strText;
			},
			changeNameCancelCallback: function() {
				this.bIsChangeName = false;
			},
			changeCompInfo: function() {
				// console.log("change community info");
				this.bIsChangeInfo = true;
			},
			changeInfoOkCallback: function(obj) {
				this.bIsChangeInfo = false;
				this.compInfo = obj.strText;
			},
			changeInfoCancelCallback: function() {
				this.bIsChangeInfo = false;
			},
			getWxConfig: function() {
				// let that = this;
				let url = window.publicPath1 + '/wechat_member.php'; 

				this.$http.post(url, {action: 'getticket'}, {emulateJSON: true}).then(function(res) {
					if(res && res.body) {
						let result = res.body;
						if(-4 == Number(result.ticket)) {
							alert("未获取token");
						}
						else if(-3 == Number(result.ticket)) {
							alert("未获取ticket");
						}
						else {
							// console.log(result);
							let ticket = result.ticket;
							let timestamp = parseInt(new Date().getTime() / 1000);
							let noncestr = sha1(new Date());
							let url = location.href.split('#')[0];
							let string = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url;
							let signature = sha1(string);

							//接口入住权限验证配置
							wx.config({
								debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
								appId: result.appid, // 必填，公众号的唯一标识 
								timestamp: timestamp, // 必填，生成签名的时间戳 
								nonceStr: noncestr, // 必填，生成签名的随机串 
								signature: signature, // 必填，签名，见附录1 
								jsApiList: [
									'previewImage',
									'chooseImage',
								],
							});
						}
					}
				}, function(error) {
					// console.log(error);
				});
			},
			getStyle: function(el, type) {
				if(window.getComputedStyle) { 
				    return window.getComputedStyle(el, null)[type]; 
				}else{ 
				    return el.currentStyle[type]; 
				} 
			},
			hideUpdatePic: function(bool) {
				this.bIsChangIcon = bool;
			},
			changeIcon: function(src) {
				this.icon = src;
			},
			post4SelfPic: function(src) {
				let that = this;
				let url = window.publicPath + '/group_icon.php';
				let params = {
					img: src,
				};
				this.ajax(url, params, function(res) {
					var res = parseInt(res.body.res);
 					if(res > 0) {
 						that.changeIcon(src);
 						that.hideUpdatePic(false);
 					}
 					else if(res == 0) {
 						alert("图片未识别");
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
 					else if(res == -4) {
 						alert("用户没有权限");
 					}
 					else {
 					}
				});
			},
		},
		watch: {
			'compName': function(newVal, oldVal) {
				if(newVal == undefined || newVal == null || newVal == "" || newVal == "请填写") {
					this.compName = "请填写";
					document.querySelector('.name p').style.color = "#757575";
				}
				else {
					document.querySelector('.name p').style.color = "#212121";
				}
			},
			'compInfo': function(newVal, oldVal) {
				if(newVal == undefined || newVal == null || newVal == "" || newVal == "请填写") {
					this.compInfo = "请填写";
					document.querySelector('.intro p').style.color = "#757575";
				}
				else {
					document.querySelector('.intro p').style.color = "#212121";
				}
			},
		},
		components: {
			'changeName': changeName,
			'changeInfo': changeInfo,
			'updateheadpic': UpdateHeadpic,
		},
	});
</script>
<style lang="less" scoped></style>