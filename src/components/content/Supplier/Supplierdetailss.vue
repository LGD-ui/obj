<template>
    <el-container>
        <Left />
        <el-container>
            <el-main style="padding: 10px;">
                <Head />
                <div class="Supplierdetail">
                    <el-row :gutter="20">
                        <!-- xs:<768px  sm:≥768px  md:≥992px  lg:≥1200px  xl:≥1920px -->
                        <el-col :xs="24" :sm="24" :md="24" :lg="10" :xl="10">
                            <div class="box bg-purple">
                                <div class="title">
                                    <el-divider>供应商</el-divider>
                                </div>
                                <el-form ref="form" :model="form" label-width="110px">
                                    <el-form-item label="名称：">
                                        <div>{{form.supplier_name}}</div>
                                    </el-form-item>
                                    <el-form-item label="负责人：">
                                        <div>{{form.supplier_person}}</div>
                                    </el-form-item>
                                    <el-form-item label="电话：">
                                        <div>{{form.supplier_telphone}}</div>
                                    </el-form-item>

                                    <el-form-item label="地址：">
                                        <div>{{form.supplier_address}}</div>
                                    </el-form-item>
                                    <el-form-item label="描述：">
                                        <div>{{form.describe}}</div>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                            <div class="box2 bg-purple">
                                <el-row :gutter="12">
                                    <el-col
                                        :span="8"
                                        v-for="(item, index) in dataMessage"
                                        :key="index"
                                        >
                                        <el-card shadow="hover" :body-style="{padding: '10px'}">
                                            <div class="wrap">
                                                <div class="title" v-text="item.num"></div>
                                                <div class="title-name" v-text="item.name"></div>
                                            </div>
                                        </el-card>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <!-- xs:<768px  sm:≥768px  md:≥992px  lg:≥1200px  xl:≥1920px -->
                        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
                            <div class="box3 bg-purple">
                                
                            </div>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
                            <div class="box4 bg-purple">
                                
                            </div>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
                            <div class="box5 bg-purple">
                                
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import Left from "@/components/Left.vue";
import Head from "@/components/Head.vue";
export default {
    name: "Supplierdetail",
    components: { Left, Head },
    computed: {
        ...mapState({
            url: state => state.url
        }),
        ...mapGetters({
            token: "getToken"
        })
    },
    data() {
        return {
            form: {},
            dataMessage: [
                { num: 342, name: "订单管理" },
                { num: 644, name: "生产计划" },
                { num: 154, name: "库存管理" },
                { num: 986, name: "物流管理" },
                { num: 654, name: "订单管理" },
                { num: 286, name: "生产计划" },
                { num: 762, name: "库存管理" },
                { num: 134, name: "物流管理" }
            ]
        };
    },
    created() {
        this.getSupplierdetail();
    },
    methods: {
        getSupplierdetail() {
            let that = this;
            that.axios({
                method: "GET",
                url: that.url + "/api/v1/supplier/detail",
                headers: {
                    "content-type": "application/json",
                    token: that.token
                }
            })
                .then(function(response) {
                    if (
                        response &&
                        response.data &&
                        response.data.data &&
                        response.data.code == 200
                    ) {
                        that.form = response.data.data;
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    }
};
</script>

<style lang="less" scoped>
@px: 10px;
.Supplierdetail {
    margin-top: @px;
    .el-row {
        .el-col {
            margin-bottom: 10px;
            .box {
                .title {
                    padding: 0 30px;
                }
                .el-form {
                    margin: 30px 0;
                }
            }
            .box2 {
                padding: @px;
                .el-row {
                    .el-col {
                        margin-bottom: 10px;
                        &:nth-child(7) {
                            margin-bottom: 0;
                        }
                        &:nth-child(8) {
                            margin-bottom: 0;
                        }
                        &:nth-child(9) {
                            margin-bottom: 0;
                        }
                        .wrap {
                            text-align: center;
                            height: 89px;
                            .title {
                                font-size: 35px;
                                font-weight: bold;
                                color: #676767;
                            }
                            .title-name {
                                font-size: 16px;
                            }
                        }
                    }
                }
            }
            .box3 {
                padding: @px;
            }
            .box4 {
                padding: @px;
            }
            .box5 {
                padding: @px;
            }
            .bg-purple {
                border-top: 1px solid transparent;
                border-radius: 5px;
                background-color: #ffffff;
                overflow: hidden;
            }
        }
    }
}
/deep/ .el-divider__text {
    font-size: x-large;
}
</style>