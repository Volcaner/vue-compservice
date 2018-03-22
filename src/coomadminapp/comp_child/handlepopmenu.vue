<template>
	<div class="pop" @click='click2Hide'>
		<div class="menu">
			<div v-if='bIsUp' class="handle_up">
				<div class="img_up">
					<img src="./../images/arrow_0.png" height="12" width="24" alt="">
				</div>
				
				<p v-for='(item, index) in objData.items' @click='click2Handle(item)' :class="{active: item.bIsAble}">
					{{item.btnName}}
				</p>


			</div>

			<div v-if='!bIsUp' class="handle_down">
				<div class="img_down">
					<img src="./../images/arrow_0.png" height="12" width="24" alt="">
				</div>

				<p v-for='(item, index) in objData.items' @click='click2Handle(item)' :class="{active: item.bIsAble}">
					{{item.btnName}}
				</p>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript" charset="utf-8" async defer>
	import css from './../less/handlepopmenu.less';
	export default({
		data() {
			return {
				bIsUp: false,
			}
		},
		props: ['data'],
		computed: {
			objData: function() {
				if(this.data != undefined && this.data != null && this.data != "") {
					return JSON.parse(this.data);
				}
			},
		},
		mounted() {
			let that = this;
			// console.log(this.objData);

			// position
			let x = this.objData.position.x;
			let y = this.objData.position.y;
			let targetEl = document.querySelector('.menu');
			let handleEl = document.querySelector('.handle');
			let targetH = targetEl.offsetHeight;
			let handleW = handleEl.offsetWidth;
			let WindowH = document.body.offsetHeight;
			let HtmlFontSize = parseFloat(document.getElementsByTagName('html')[0].style.fontSize);
			if(y+targetH < WindowH) {
				targetEl.style.top = y/HtmlFontSize + "rem";
				targetEl.style.left = (x - targetEl.offsetWidth + handleW*2/3)/HtmlFontSize + "rem";  // + handleW*2/3
				that.bIsUp = false;
			}
			else {
				targetEl.style.top = (y-targetH)/HtmlFontSize + "rem";
				targetEl.style.left = (x - targetEl.offsetWidth + handleW*2/3)/HtmlFontSize + "rem";  // + handleW*2/3
				that.bIsUp = true;
			}
		},
		methods: {
			click2Handle: function(item) {
				this.$emit('event', item);
			},
			click2Hide: function(e) {
				if(e.currentTarget == e.target) {
					this.$emit('event', "hide");
				}
				else {
					// do nothing
				}
			},
		},
	});
</script>
<style lang="less" scoped></style>