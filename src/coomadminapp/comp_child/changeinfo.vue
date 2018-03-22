<template>
	<div class="compo">
		<div class="inputbox clearfix">
			<textarea v-model='strText' :placeholder='text' name="" cols="" rows=""></textarea>
			<p class="hide"><b>{{strText.length}}</b>/20</p>
		</div>

		<div class="footer_btn clearfix">
			<input type="button" name="submit" value="提交" @click='click2Submit'>
			<input type="button" name="cancel" value="取消" @click='click2Cancel'>
		</div>
	</div>
</template>
<script type="text/javascript" charset="utf-8" async defer>
	import css from './../less/changeinfo.less';
	import Mock from 'mockjs';
	export default({
		data() {
			return {
				strText: '',
			}
		},
		props: ['text'],
		mounted() {
			// console.log(this.text);
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
			click2Submit: function() {
				let that = this;
				let url = window.publicPath + '/home.php';
				let params = {
					op: 'group_des',
					newdes: this.strText,
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
						else if(-11 == Number(result)) {
							alert("简介太短或太长");
						}
					}
				});
			},
			click2Cancel: function() {
				this.$emit('changeCancel', {})
			},
		},
	});
</script>
<style lang="less" scoped></style>