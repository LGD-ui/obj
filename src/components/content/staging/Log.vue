<template>
	<div class="log">
		<div class="title">消息日志</div>
		<template>
			<el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
				<el-table-column prop="date" label="日期" width="180"></el-table-column>
				<el-table-column prop="name" label="信息来源" width="180"></el-table-column>
				<el-table-column prop="address" label="名称"></el-table-column>
			</el-table>
		</template>
	</div>
</template>

<script>
	export default {
		methods: {
			tableRowClassName({ row, rowIndex }) {
				if (rowIndex === 1) {
					return 'warning-row';
				} else if (rowIndex === 3) {
					return 'success-row';
				}
				return '';
			}
		},
		data() {
			return {
				tableData: [{
					date: '2019-12-30 12:30:22',
					name: '入库',
					address: '上臂走线盖 ',
				}, {
					date: '2019-12-30 14:30:22',
					name: '出库',
					address: '上臂走线盖 '
				}, {
					date: '2019-12-30 16:30:22',
					name: '装配',
					address: '上臂走线盖',
				}, {
					date: '2019-12-30 18:30:22',
					name: '入库',
					address: '上臂走线盖'
				}]
			}
		}
	}
</script>

<style scoped="">
	.log {
		width: 100%;
		/* border: 1px solid; */
		margin-top: 10px;
	}

	.log .title {
		background: #FFFFFF;
		padding: 10px;
	}

	.el-table .warning-row {
		background: oldlace;
	}

	.el-table .success-row {
		background: #f0f9eb;
	}
</style>
