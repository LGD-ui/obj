<template>
	<div class="echarts_data" style="">
		<v-chart :options="option" style="" />
	</div>
</template>

<script>
	import ECharts from 'vue-echarts'
	import 'echarts/lib/chart/line'

	export default {
		name: 'echarts_data',
		components: {
			'v-chart': ECharts
		},
		data() {
			return {
				option: {
					// backgroundColor: 'transparent',
					itemStyle: {
						color: '#0000ff'
					},
					xAxis: {
						type: 'category',
						data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
						axisLine: {
							lineStyle: {
								color: '#7ae677'
							}
						},

					},
					yAxis: {
						type: 'value',
						axisLine: {
							lineStyle: {
								color: '#ff0033'
							}
						},
					},
					series: [{
						data: [120, 200, 150, 80, 70, 110, 130],
						type: 'bar'
					}]
				}

			}
		}
	}
</script>

<style scoped>
	.echarts_data {
		width: 100%;
		height: 100vh;
		/* background-color: #000000; */
		background-image: url(../../../assets/110420cf.png);
		/* color: transparent; */
	}
</style>
