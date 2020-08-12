<template>
	<!-- 库存记录 -->
	<div class="List">
		<div class="input_flex">
			<div class="search">
				<div class="demo-input-suffix">
					<el-input suffix-icon="el-icon-search" style="width: 30.625rem;" v-model.trim="search_name"
						autofocus  placeholder="搜索" @input="searchChange" @keyup.enter.native="jsearchChange">
						<el-button slot="append" type="primary" @click="searchChange">搜索</el-button>
					</el-input>
					<el-button type="info" plain @click="jumpAll">全部</el-button>
				</div>
			</div>
		</div>
		<el-table :data="tableDatas" style="width: 100%;margin-top:1rem;margin-bottom:1rem;" :header-cell-style="tableheader">
			
			<el-table-column label="序号" width="100">
				<template slot-scope="scope">
					<span style="">{{ scope.row.id }}</span>
				</template>
			</el-table-column>
			<el-table-column label="图片" prop="image" width="120">
				<template slot-scope="scope">
					<el-popover placement="right" title="" trigger="click">
						<img :src="scope.row.img" style="height: 400px;">
						<img slot="reference" :src="scope.row.img" alt="" style="height: 50px;width: 50px">
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column label="名称" prop="name">
				<template slot-scope="scope">
					<span style="">{{ scope.row.name }}</span>
				</template>
			</el-table-column>
			<el-table-column label="代号" prop="item_">
				<template slot-scope="scope">
					<span style="">{{ scope.row.item_ }}</span>
				</template>
			</el-table-column>
			<el-table-column label="型号规格" prop="specs_">
				<template slot-scope="scope">
					<span style="">{{ scope.row.specs_ }}</span>
				</template>
			</el-table-column>
			<!--      <el-table-column label="零件编码" prop="parts_number">
				<template slot-scope="scope">
					<span style="">{{ scope.row.parts_number }}</span>
				</template>
			</el-table-column> -->
			<el-table-column label="材料" prop="material_">
				<template slot-scope="scope">
					<span style="">{{ scope.row.material_ }}</span>
				</template>
			</el-table-column>
			<el-table-column label="数量" prop="number">
				<template slot-scope="scope">
					<span style="">{{ scope.row.number }}</span>
				</template>
			</el-table-column>
			<el-table-column label="创建时间" prop="createTime">
				<template slot-scope="scope">
					<span style="">{{ scope.row.createTime}}</span>
				</template>
			</el-table-column>
			<el-table-column label="备注" prop="remark">
				<template slot-scope="scope">
					<span style="">{{ scope.row.remark }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="type" label="记录来源" width="130" align="center">
				<template slot-scope="scope">
					<el-link :underline="false" type="primary">{{scope.row.type_}}</el-link>
				</template>
			</el-table-column>
			<!-- <el-table-column label="详情" width="100" align="center">
				<template slot-scope="scope">
					<el-link :underline="false" type="primary" v-if="scope.row.product_type==2 && scope.row.type==1" @click="submitdetail(scope.row)" >查看</el-link>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="100" align="center">
				<template slot-scope="scope">
					<el-link :underline="false" type="primary" @click="submit(scope.$index,scope.row)" v-if="scope.row.product_type==2 && scope.row.type==1" >导出</el-link>
				</template>
			</el-table-column> -->
		</el-table>
		<div class="block">
			<el-pagination
				@current-change="handleCurrentChange" 
				:page-size="pagesize" 
				layout="prev, pager, next, jumper"
				:total="total">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from "vuex"
	// import Editor from '@tinymce/tinymce-vue'
	export default {
		name: 'List',
		components: {
			// Editor
		},
		data() {
			return {
				search_name: '',
				search_material: '',
				search_item: '',
				search_specs: '',
				go_num: '',
				pagesize: 15,
				currpage: 1,
				// currentPage3: 1,
				tableDatas: [],
				total: 0
			}
		},
		computed: {
			...mapGetters({
				url: "geturl",
				token: "getToken"
			})
		},
		created() {
			this.jump();
		},
		directives: { //input获取焦点
			focus: {
				inserted: function(el) {
					el.querySelector('input').focus()
				}
			}
		},
		methods: {

			handleDelete(index, row) {},
			tableheader({ row, column, rowIndex, columnIndex }) {
				if (rowIndex === 0) {
					return 'height:40px;background:#e5e5e5'
				}
			},
			filterTag(value, row) {
				var that = this;
				return row.type === value;
				// that.jump(value);

			},
			handleCurrentChange(cpage) {
				this.currpage = cpage;
				this.jump();
			},
			jump() {
				let that = this;
				Date.prototype.toLocaleString = function() {
					return this.getFullYear() + "/" + ((this.getMonth() + 1) < 10 ? '0' + (this.getMonth() + 1) : (this.getMonth() +
						1)) + "/" + (this.getDate() < 10 ? '0' + this.getDate() : this.getDate()) + " " + (this.getHours() < 10 ?
						'0' + (this.getHours()) : this.getHours()) + ":" + (this.getMinutes() < 10 ? ('0' + this.getMinutes()) :
						this.getMinutes()) + ":" + (this.getSeconds() < 10 ? '0' + this.getSeconds() : this.getSeconds())
				};
				that.axios.get(that.url + '/api/v1/out/list', {
						headers: {
							'content-type': 'application/x-www-form-urlencoded',
							"token": that.token
						},
						params: {
							page: that.currpage,
							size: that.pagesize,
							type: 0,
							name: that.search_name
						},
					})
					.then(function(res) {
						var data = res.data.data.list;
						that.tableDatas = res.data.data.list;
						that.total = res.data.data.count.total;
						for (var i = 0; i < data.length; i++) {
							data[i].type_ = data[i].type == 1 ? '入库' : data[i].type == 2 ? '托盘出库' : '出库';
							if (data[i].type == 4) data[i].type_ = '发货';
							data[i].createTime = new Date(data[i].created_at * 1000).toLocaleString().slice(0, -3);
							// data[i].type_=data[i].type;

							var img_ = data[i].image;
							if (img_ == "" || img_ == undefined) {
								data[i].img = "http://zrui.e7vr.com/image/arm/default.gif";
							} else {
								data[i].img = data[i].image;
							}

							var specs_s = data[i].specs;
							if (specs_s == "" || specs_s == undefined || specs_s == null) {
								data[i].specs_ = "-- --";
							} else {
								data[i].specs_ = data[i].specs;
							}


							var material_s = data[i].material;
							if (material_s == "" || material_s == undefined || material_s == null) {
								data[i].material_ = "-- --";
							} else {
								data[i].material_ = data[i].material;
							}

							var item_s = data[i].item;
							if (item_s == "" || item_s == undefined || item_s == null) {
								data[i].item_ = "-- --";
							} else {
								data[i].item_ = data[i].item;
							}
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			/* 搜索 */
			searchChange() {
				this.currpage = 1;
				if (!this.search_name) this.search_name = '';
				this.jump();
			},
			jumpAll() {
				this.search_name = '';
				this.currpage = 1;
				this.jump();
			},
			submit(c, d) { //单个导出
				var id = d.id;
				location.href = this.url + "/api/v1/out/export?id=" + id;
			},
			submitdetail(row) {
				this.$router.push({
					path: '/recorddetail',
					query: {
						id: row.id,
					}
				})
			},

		},
		
	}
</script>

<style lang="less" scoped="">
	.search {
	    > div {
	        display: flex;
	        > .el-button {
	            width: 80px;
	            margin-left: 10px;
	        }
	    }
	}
	.List {
		margin-top: 10px;
		background: #FFFFFF;
		padding: 10px 10px 10px;
	}

	.title {
		font-size: 0.9375rem;
		margin-bottom: 0.3125rem;
	}

	.input_flex {
		display: flex;
		justify-content: space-between;
	}

	.input_flex .fl {
		display: flex;

	}
	.el-input-number {
		width: 100%;
	}

	.el-pagination {
		padding: 2px 0px;
	}

	.img_div {
		width: 50px;
		height: 50px;
	}

	.img_div .lab_img {
		width: 100%;
		height: 100%;
	}

	.el-tag {
		background-color: #FFFFFF !important;
		border-style: none !important;
	}
</style>
