<template>
	<el-container>
		<!-- <Left/> -->
		<el-container>
			<el-main style="padding: 10px;">
				<Head/>
				<!-- 统计图 -->
				<!-- <dv-border-box-8 :dur="5"> -->
				<div class="EchartsPage" style="background: url(../../assets/110420cf.png) center/cover no-repeat;">
					<div id="digital-flop">
						<div class="digital-flop-item" v-for="(tab, index) in headertitle" :key="index">
							<div class="digital-flop-title">{{tab.title}}</div>
							<div class="digital-flop">
								<div class="dv-digital-flop" :style="{color: tab.color}">{{tab.num}}</div>
								<div class="unit">{{tab.unit}}</div>
							</div>
						</div>
					</div>
					<dv-decoration-10 style="height:5px;margin: 2px 0;" />
					<div>
						<el-row>
							<el-col :span="4">
								<dv-decoration-3 style="height:30px;position: relative;top: 5px;" />
								<div class="ranking-board-title">设备运行总数</div>
								<dv-capsule-chart :config="config1" />
								<div class="ranking-board-title">巡查上报记录数量</div>
								<dv-scroll-ranking-board :config="config" />
							</el-col>
							<el-col :span="20">
								<div id="chartBox">
									<v-chart :options="option3" style="top: 13px;" />
									<v-chart :options="option4" style="top: 13px;" />
									<v-chart :options="option2" style="top: 13px;left: 43px;" />
									<v-chart :options="option" style="top: 13px;" />
								</div>
							</el-col>
						</el-row>
				
					</div>
				</div>
				<!-- </dv-border-box-8> -->
			</el-main>
		</el-container>
	</el-container>
	

</template>

<script>
	import Left from '@/components/Left.vue'
	import Head from '@/components/Head.vue'
	import ECharts from 'vue-echarts'
	import 'echarts/lib/chart/line'
	import 'echarts/lib/component/polar'
	import "echarts/lib/chart/bar";
	import "echarts/lib/chart/pie";
	import "echarts/lib/component/tooltip";
	import "echarts/lib/component/legend";
	import "echarts/lib/component/markPoint";
	import "echarts/lib/component/markLine";
	import "echarts/lib/component/graphic";

	export default {
		name: 'EchartsPage',
		components: {
			'v-chart': ECharts, Left, Head
		},
		data() {
			return {
				headertitle: [{
						title: '数据1',
						num: 1234,
						unit: '个',
						color: '#4d99fc'
					},
					{
						title: '数据2',
						num: 1234,
						unit: '个',
						color: '#f46827'
					},
					{
						title: '数据3',
						num: 1234,
						unit: '个',
						color: '#40faee'
					},
					{
						title: '数据4',
						num: 1234,
						unit: '个',
						color: '#4d99fc'
					},
					{
						title: '数据5',
						num: 1234,
						unit: '个',
						color: '#f46827'
					},
					{
						title: '数据6',
						num: 1234,
						unit: '个',
						color: '#40faee'
					},
					{
						title: '数据7',
						num: 1234,
						unit: '个',
						color: '#4d99fc'
					},
					{
						title: '数据8',
						num: 1234,
						unit: '个',
						color: '#f46827'
					},
					{
						title: '数据9',
						num: 1234,
						unit: '个',
						color: '#40faee'
					},
				],
				option: {
					title: {
						text: 'ECharts 入门示例',
					},
					tooltip: {},
					legend: {
						top: 10,
						data: ['动力手臂'],
						textStyle: {
							color: '#e0e0e0'
						},
					},
					xAxis: {
						data: ["数据1", "数据2", "数据3", "数据4", "数据5", "数据6"],
						axisLine: {
							lineStyle: {
								color: '#eee'
							}
						}
					},
					yAxis: {
						axisLine: {
							lineStyle: {
								color: '#eee'
							}
						}
					},
					series: [{
						name: '动力手臂',
						right: 'right',
						type: 'bar',
						data: [5, 20, 36, 10, 10, 20]
					}]
				},
				option2: {
					title: {
						text: '动力手臂',
						subtext: '动力手臂',
						left: 'center'
					},
					tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b} : {c} ({d}%)'
					},
					legend: {
						orient: 'vertical',
						left: 'left',
						top: 13,
						data: ['数据1', '数据2', '数据3', '数据4', '数据5'],
						textStyle: {
							color: '#e0e0e0'
						}
					},
					series: [{
						name: '动力手臂',
						type: 'pie',
						radius: '55%',
						center: ['50%', '60%'],
						data: [{
								value: 335,
								name: '数据1'
							},
							{
								value: 310,
								name: '数据2'
							},
							{
								value: 234,
								name: '数据3'
							},
							{
								value: 135,
								name: '数据4'
							},
							{
								value: 1548,
								name: '数据5'
							}
						],
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}]
				},
				option3: {
					title: {
						text: '堆叠区域图'
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							label: {
								backgroundColor: '#6a7985'
							}
						}
					},
					legend: {
						top: 12,
						data: ['数据1', '数据2', '数据3', '数据4', '数据5'],
						textStyle: {
							color: '#e0e0e0'
						}
					},
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						boundaryGap: false,
						data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
						axisLine: {
							lineStyle: {
								color: '#eee'
							}
						}
					}],
					yAxis: [{
						type: 'value',
						axisLine: {
							lineStyle: {
								color: '#eee'
							}
						}
					}],
					series: [{
							name: '数据1',
							type: 'line',
							stack: '总量',
							areaStyle: {},
							data: [120, 132, 101, 134, 90, 230, 210]
						},
						{
							name: '数据2',
							type: 'line',
							stack: '总量',
							areaStyle: {},
							data: [220, 182, 191, 234, 290, 330, 310]
						},
						{
							name: '数据3',
							type: 'line',
							stack: '总量',
							areaStyle: {},
							data: [150, 232, 201, 154, 190, 330, 410]
						},
						{
							name: '数据4',
							type: 'line',
							stack: '总量',
							areaStyle: {},
							data: [320, 332, 301, 334, 390, 330, 320]
						},
						{
							name: '数据5',
							type: 'line',
							stack: '总量',
							label: {
								normal: {
									show: true,
									position: 'top'
								}
							},
							areaStyle: {},
							data: [820, 932, 901, 934, 1290, 1330, 1320]
						}
					]
				},
				option4: {
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					legend: {
						data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎', '百度', '谷歌', '必应', '其他'],
						textStyle: {
							color: '#e0e0e0'
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
						axisLine: {
							lineStyle: {
								color: '#eee'
							}
						}
					}],
					yAxis: [{
						type: 'value',
						axisLine: {
							lineStyle: {
								color: '#eee'
							}
						}
					}],
					series: [{
							name: '直接访问',
							type: 'bar',
							data: [320, 332, 301, 334, 390, 330, 320]
						},
						{
							name: '邮件营销',
							type: 'bar',
							stack: '广告',
							data: [120, 132, 101, 134, 90, 230, 210]
						},
						{
							name: '联盟广告',
							type: 'bar',
							stack: '广告',
							data: [220, 182, 191, 234, 290, 330, 310]
						},
						{
							name: '视频广告',
							type: 'bar',
							stack: '广告',
							data: [150, 232, 201, 154, 190, 330, 410]
						},
						{
							name: '搜索引擎',
							type: 'bar',
							data: [862, 1018, 964, 1026, 1679, 1600, 1570],
							markLine: {
								lineStyle: {
									type: 'dashed'
								},
								data: [
									[{
										type: 'min'
									}, {
										type: 'max'
									}]
								]
							}
						},
						{
							name: '百度',
							type: 'bar',
							barWidth: 5,
							stack: '搜索引擎',
							data: [620, 732, 701, 734, 1090, 1130, 1120]
						},
						{
							name: '谷歌',
							type: 'bar',
							stack: '搜索引擎',
							data: [120, 132, 101, 134, 290, 230, 220]
						},
						{
							name: '必应',
							type: 'bar',
							stack: '搜索引擎',
							data: [60, 72, 71, 74, 190, 130, 110]
						},
						{
							name: '其他',
							type: 'bar',
							stack: '搜索引擎',
							data: [62, 82, 91, 84, 109, 110, 120]
						}
					]
				},
				config: {
					data: [{
							name: '数据1',
							value: 55
						},
						{
							name: '数据2',
							value: 150
						},
						{
							name: '数据3',
							value: 78
						},
						{
							name: '数据4',
							value: 66
						},
						{
							name: '数据5',
							value: 80
						},
						{
							name: '数据6',
							value: 66
						},
						{
							name: '数据7',
							value: 80
						},
						{
							name: '数据8',
							value: 45
						},
						{
							name: '数据9',
							value: 29
						},
						{
							name: '数据10',
							value: 19
						},
						{
							name: '数据11',
							value: 2
						},
					],
					rowNum: 11
				},
				config1: {
					data: [{
							name: '数据1',
							value: 55
						},
						{
							name: '数据2',
							value: 150
						},
						{
							name: '数据3',
							value: 80
						},
						{
							name: '数据4',
							value: 45
						},
						{
							name: '数据5',
							value: 19
						},
						{
							name: '数据6',
							value: 20
						},
					],
					// unit: 13
				},
			}
		},
		created() {
			let that = this;
			const loading = that.$loading({
				lock: true,
				text: 'Loading',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.5)'
			});
			setTimeout(() => {
				loading.close();
			}, 1000);
		},
		methods: {}
	}
</script>

<style scoped>
	.EchartsPage {
		padding: 10px;
		flex-direction: column;
	}

	/* /deep/.echarts, /deep/.echarts>div, /deep/ canvas {
    width: 20rem!important;
    height: 10rem!important;
  } */
	.ranking-board-title {
		font-weight: bold;
		height: 50px;
		display: flex;
		align-items: center;
		font-size: 20px;
		color: #FFFFFF;
	}

	.dv-capsule-chart {
		padding: 0;
	}

	/deep/.dv-scroll-ranking-board {
		/* color: #2c3e50; */
	}

	/deep/ .dv-scroll-ranking-board .row-item {
		height: 40px !important;
	}

	#chartBox {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	#chartBox>div {
		/* margin-bottom: 10px; */
	}

	#chartBox .dv-border-box-1,
	#chartBox .dv-border-box-12,
	#chartBox .dv-border-box-4,
	.dv-border-box-8 {
		width: auto;
		height: auto;
	}

	#digital-flop {
		position: relative;
		height: 15%;
		-ms-flex-negative: 0;
		flex-shrink: 0;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-pack: justify;
		-ms-flex-pack: justify;
		justify-content: space-between;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		/* background-color: rgba(6,30,93,.5); */
	}

	#digital-flop .digital-flop-item {
		width: 11%;
		height: 80%;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-ms-flex-direction: column;
		flex-direction: column;
		-webkit-box-pack: center;
		-ms-flex-pack: center;
		justify-content: center;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		border-left: 3px solid #061e5d;
		border-right: 3px solid #061e5d;
	}

	#digital-flop .digital-flop-title {
		font-size: 18px;
		font-weight: bold;
		margin: 10px 0;
		color: #FFFFFF;
	}

	#digital-flop .digital-flop {
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
	}

	#digital-flop .dv-digital-flop {
		width: 100px;
		height: 35px;
		text-align: right;
		font-size: 26px;
	}

	#digital-flop .unit {
		color: #FFFFFF;
		margin-left: 10px;
		-webkit-box-align: end;
		-ms-flex-align: end;
		align-items: flex-end;
		/* padding-bottom: 13px; */
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}
</style>
