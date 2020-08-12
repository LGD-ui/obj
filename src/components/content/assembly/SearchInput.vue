<template>
	<div class="SearchInput">
		<el-input placeholder="请输入您要搜索的内容" v-model.trim="input" style="width: 30.625rem;margin-left: 10px;">
			<el-button slot="append" icon="el-icon-search" @click="again">搜索</el-button>
		</el-input>
		<el-button type="info" plain class="clearBtn" @click="clearInput">清 空</el-button>
	</div>
</template>

<script>
	export default {
		name: 'SearchInput',
		data() {
			return {
				input: ''
			}
		},
		methods: {
			again() {
				this.$emit("onceAgain", this.input);
			},
			clearInput() {
				this.input = '';
				this.again();
			}
		}
	}
</script>

<style lang="less" scoped>
	.SearchInput {
		margin-top: 10px;
		.clearBtn {
			margin-left: 10px;
		}
	}
</style>
