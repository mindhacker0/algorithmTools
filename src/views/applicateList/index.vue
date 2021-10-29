<template>
    <el-card shadow="never"
             class="aui-card--fill">
        <div>
            <el-form>
                <el-form-item>
                    <el-button type="primary"
                               @click="editApplicate()">新增</el-button>
                </el-form-item>
            </el-form>
            <!-- 表格 -->
            <el-table :data="tableData"
                      style="width: 100%;margin-bottom: 20px;"
                      row-key="id"
                      border
                      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column prop="name"
                                 label="应用名称"
                                 width="230">
                </el-table-column>
                <el-table-column prop="name"
                                 label="应用图标"
                                 width="180">
                </el-table-column>
                <el-table-column prop="sort"
                                 label="排序">
                </el-table-column>
                <el-table-column prop="appType"
                                 label="类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.appType == 0"></span>
                        <span v-else-if="scope.row.appType == 1">跳转</span>
                        <span v-else>表单</span>
                    </template>
                </el-table-column>
                <el-table-column prop="isCertification"
                                 label="是否实名认证">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isCertification == 0">是</span>
                        <span v-else-if="scope.row.isCertification == 1">否</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作"
                                 fixed="right"
                                 header-align="center"
                                 align="center"
                                 width="250">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   @click="editApplicate(scope.row.id)"
                                   size="small">编辑</el-button>
                        <el-button type="text"
                                   @click="addMaterial(scope.row.id)"
                                   v-if="scope.row.appType == 2"
                                   size="small">添加关联材料</el-button>
                        <el-button type="text"
                                   @click="addquestion(scope.row.id)"
                                   v-if="scope.row.appType == 2"
                                   size="small">表单编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination :current-page="page"
                           :page-sizes="[10, 20, 50, 100]"
                           :page-size="20"
                           :total="100"
                           layout="total, sizes, prev, pager, next, jumper"
                           @size-change="pageSizeChangeHandle"
                           @current-change="pageCurrentChangeHandle">
            </el-pagination>

        </div>
    </el-card>
</template>


<script>
export default {
    data() {
        return {
            tableData: [
                {
                    id: 1,
                    name: "公证核心圈",
                    sort: 1,
                    appType: 0,
                    isCertification: 0,
                    children: [
                        {
                            id: 11,
                            name: "视频公证",
                            sort: 1,
                            appType: 1,
                            isCertification: 0,
                        },
                        {
                            id: 12,
                            name: "安心养老",
                            sort: 2,
                            appType: 1,
                            isCertification: 1,
                        },
                        {
                            id: 13,
                            name: "和信查",
                            sort: 3,
                            appType: 2,
                            isCertification: 1,
                        },
                    ],
                },
                {
                    id: 2,
                    name: "公证服务圈",
                    sort: 2,
                    appType: 0,
                    isCertification: 1,
                    children: [
                        {
                            id: 21,
                            name: "视频公证",
                            sort: 1,
                            appType: 1,
                            isCertification: 1,
                        },
                        {
                            id: 22,
                            name: "安心养老",
                            sort: 2,
                            appType: 2,
                            isCertification: 1,
                        },
                    ],
                },
                {
                    id: 3,
                    name: "公证特色圈",
                    sort: 3,
                    appType: 0,
                    isCertification: 0,
                    children: [
                        {
                            id: 31,
                            name: "视频公证",
                            sort: 1,
                            appType: 1,
                            isCertification: 0,
                        },
                        {
                            id: 32,
                            name: "安心养老",
                            sort: 2,
                            appType: 2,
                            isCertification: 0,
                        },
                    ],
                },
                {
                    id: 4,
                    name: "其他",
                    sort: 4,
                    appType: 0,
                    isCertification: 1,
                },
            ],

            page: 1,

            //路由接口返回的数组
            arr: [
                {
                    children: [
                        {
                            name: "应用管理",
                            url: "applicate/applicateList",
                            children: [
                                {
                                    name: "新增",
                                    url: "applicate/addApplicate",
                                },
                                {
                                    name: "编辑",
                                    url: "applicate/editApplicate",
                                },
                            ],
                        },
                        {
                            name: "表单编辑",
                            url: "",
                            children: [],
                        },
                    ],
                    name: "应用管理",
                    url: "",
                },
            ],
        };
    },
    methods: {
        //分页
        pageSizeChangeHandle(val) {
            console.log(val);
        },
        pageCurrentChangeHandle(val) {
            console.log(val);
        },
        //编辑
        editApplicate(id) {
            console.log("编辑:", id);
            this.$router.push({
                path: "、applicate-applicateList-edit",
                query: { id: id },
                // 多个参数{id:1,name:2}
            });
        },
        //添加关联材料
        addMaterial(id) {
            console.log("id:", id);
            this.$router.push({
                path: "/applicate-applicateList-material",
                query: { id: id },
                // 多个参数{id:1,name:2}
            });
        },
        //表单编辑
        addquestion(id) {
            console.log("id:", id);
            this.$router.push({
                path: "/applicate-applicateList-question",
                query: { id: id },
                // 多个参数{id:1,name:2}
            });
        },
    },
};
</script>