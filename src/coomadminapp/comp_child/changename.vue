<template>
	<div class="compo">
		<div class="inputbox clearfix">
			<textarea v-model='strText' @value='strText.trim()' :placeholder='text' name="" cols="" rows=""></textarea>
			<p><b>{{strText.length}}</b>/60</p>
		</div>

		<div class="footer_btn clearfix">
			<input type="button" name="submit" value="提交" @click='click2Submit'>
			<input type="button" name="cancel" value="取消" @click='click2Cancel'>
		</div>

		<div class="tips hide">
			<p>{{strTips}}</p>
		</div>
	</div>
</template>
<script type="text/javascript" charset="utf-8" async defer>
	import css from './../less/changename.less';
	import Mock from 'mockjs';
	export default({
		data() {
			return {
				strText: '',
				strTips: '社区名称已存在，请重新输入！',
			}
		},
		props: ['text'],
		mounted() {
			// console.log(this.text);
		},
		watch: {
			strText: function(newVal, oldVal) {
				newVal = newVal.replace(/\s+/g, "");
				if(newVal!=null && newVal!=undefined && newVal!="") {
					// newVal = newVal.substring(0, 60);
					newVal = this.getStrByLen(newVal, 60);
				}
				this.strText = newVal;
			},
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
			click2Submit: function() {
				let that = this;

				if(!this.isNullOrEmpty(this.strText)) {
					let url = window.publicPath + '/home.php';
					let params = {
						op: 'group_name',
						newname: this.strText,
					};
					let template = 1;
					this.mock(url, template);
					this.ajax(url, params, function(res) {
						let result = res.body;
						if(result !== null && result !== undefined && result !== "") {
							if(0 < Number(result)) {
								// alert("修改成功");

								let obj = {
									strText: that.strText,
								};
								that.$emit('changeOk', obj)
							}
							else if(-4 == Number(result)) {
								alert("没有操作权限");
							}
							else if(0 == Number(result)) {
								alert("修改失败");
							}
							else if(-3 == Number(result)) {
								alert("该名称已存在");
							}
							else if(-11 == Number(result)) {
								alert("名称太短或太长");
							}
						}
					});
				}
			},
			click2Cancel: function() {
				this.$emit('changeCancel', {})
			},
			isNullOrEmpty: function(str) {
				if(str == undefined || str == null || str == "") {
					return true;
				}
				else {
					return false;
				}
			},
			getStrLen: function(val) {
				let len = 0;
	            for (let i = 0; i < val.length; i++) {
	                let a = val.charAt(i);
	                if (a.match(/[^\x00-\xff]/ig) != null) {
	                    len += 3;
	                }
	                else {
	                    len += 1;
	                }
	            }
	            return len;
			},
			getStrByLen: function(val, limit) {
				let arr = val.split('');
				let strLen = 0;

				for (let i = 0; i < arr.length; i++) {
	                let item = arr[i];
	                if (item.match(/[^\x00-\xff]/ig) != null) {
	                    strLen += 3;
	                }
	                else {
	                    strLen += 1;
	                }

	                if(strLen > limit) {
	                	arr.splice(i, arr.length);
	                	return arr.join('');
	                }
	            }

	            return val;
			},
		},
	});
</script>
<style lang="less" scoped></style>