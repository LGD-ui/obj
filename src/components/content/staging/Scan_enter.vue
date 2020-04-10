<template>
	<div class="scan_enter">
		<div style="height: 720px;background: #FFFFFF;">
			<div style="margin-top:5rem">
				<el-input suffix-icon="el-icon-full-screen" placeholder="" style="width: auto" v-model.trim="barcode_val" @input="barcode_Data" />
			</div>
			<div>

			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'scan_enter',
		components: {

		},
		data() {
			return {
				barcode_val: ''
			}
		},
		methods: {
			barcode_Data() {

			}
		}
	}
</script>

<style scoped="">
	.scan_enter {
		width: 80%;
		border: 1px dashed #ddd;
		margin: 1.875rem auto;
		height: 80%;
		background: #FFFFFF;
		text-align: center;
		text-align: -moz-center;
		text-align: -webkit-center;
	}
</style>
