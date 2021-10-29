<template>
    <el-card shadow="never"
             class="aui-card--fill">
        <div class="content">
            <div style="margin: 20px;">
                <h1>{{pageTitle}}</h1>
            </div>
            <el-form :rules="rules"
                     :label-position="labelPosition"
                     label-width="150px"
                     :model="formLabelAlign">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="名称:"
                                      prop="name">
                            <el-input v-model="formLabelAlign.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="分类:"
                                      prop="category">
                            <el-select v-model="formLabelAlign.category"
                                       style="height: 30px"
                                       @change="handleCurrentChange()">
                                <el-option v-for="item in categoryList"
                                           :key="item.id"
                                           :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="类型:"
                                      prop="type">
                            <el-select v-model="formLabelAlign.type"
                                       style="height: 30px"
                                       @change="changeType(formLabelAlign.type,)">
                                <el-option v-for="item in typeList"
                                           :key="item.id"
                                           :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="排序:"
                                      prop="sort">
                            <el-input type="number"
                                      v-model="formLabelAlign.sort"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item v-if="typeId === 1 && formLabelAlign.appLink ==''"
                                      label="小程序appid:">
                            <el-input v-model="formLabelAlign.appId"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="typeId === 1 && formLabelAlign.appLink ==''"
                                      label="页面路径:">
                            <el-input v-model="formLabelAlign.pageUrl"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item v-if="typeId === 1"
                                      @change="changeAppLink(formLabelAlign.appLink)"
                                      label="小程序链接:">
                            <el-input v-model="formLabelAlign.appLink"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="说明:">
                            <el-input type="textarea"
                                      maxlength="50"
                                      v-model="formLabelAlign.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="是否实名认证:"
                                      prop="type">
                            <el-select v-model="formLabelAlign.isrealName"
                                       style="height: 30px">
                                <el-option v-for="item in realNameList"
                                           :key="item.id"
                                           :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否自动发布签署  :"
                                      prop="type">
                            <el-select v-model="formLabelAlign.autoPublish"
                                       style="height: 30px"
                                       @change="changePublish(formLabelAlign.autoPublish,)">
                                <el-option v-for="item in autoPublishList"
                                           :key="item.id"
                                           :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="签署模板:"
                                      v-if="formLabelAlign.autoPublish ===1">
                            <el-select v-model="formLabelAlign.signTemplate"
                                       style="height: 30px"
                                       @change="changePublish(formLabelAlign.signTemplate)">
                                <el-option v-for="item in signTemplateList"
                                           :key="item.id"
                                           :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="图标:">
                            <el-upload class="avatar-uploader"
                                       action="https://jsonplaceholder.typicode.com/posts/"
                                       :show-file-list="false"
                                       :on-success="handleAvatarSuccess"
                                       :before-upload="beforeAvatarUpload">
                                <img v-if="imageUrl"
                                     :src="imageUrl"
                                     class="avatar">
                                <i v-else
                                   class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item>
                    <el-button type="primary"
                               style="margin-left:40%;width:120px;margin-top:50px"
                               @click="submit()">确 定</el-button>
                </el-form-item>

            </el-form>
        </div>
    </el-card>
</template>
<script>
export default {
    data() {
        return {
            //  labelz对齐方式
            labelPosition: "right",
            pageTitle: "",
            typeId: 1,
            //上传
            imageUrl: "",
            //表单验证规则
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入名称",
                        trigger: "blur",
                    },
                    {
                        min: 3,
                        max: 5,
                        message: "长度在 3 到 5 个字符",
                        trigger: "blur",
                    },
                ],
                category: [
                    {
                        required: true,
                        message: "请选择分类",
                        trigger: "change",
                    },
                ],
                sort: [
                    {
                        required: true,
                        message: "请输入排序",
                        trigger: "change",
                    },
                ],
                type: [
                    {
                        required: true,
                        message: "请选择类型",
                        trigger: "change",
                    },
                ],
            },
            //表单数据
            formLabelAlign: {
                name: "",
                region: "",
                type: "",
                category: "",
                type: 1,
                sort: "",
                appLink: "",
                remark: "",
                isrealName: 2,
                autoPublish: 2,
                signTemplate: "",
            },
            //表单分类列表
            categoryList: [
                { id: 1, label: "公证核心圈", value: 1 },
                { id: 2, label: "公证服务圈", value: 2 },
                { id: 3, label: "公证特色圈", value: 3 },
            ],
            //应用类型列表
            typeList: [
                { id: 1, label: "跳转", value: 1 },
                { id: 2, label: "表单", value: 2 },
                { id: 3, label: "其他", value: 3 },
            ],
            //是否实名认证
            realNameList: [
                { id: 1, label: "是", value: 1 },
                { id: 2, label: "否", value: 2 },
            ],
            //是否自动发布签署
            autoPublishList: [
                { id: 1, label: "是", value: 1 },
                { id: 2, label: "否", value: 2 },
            ],
            //签署模板
            signTemplateList: [
                { id: 1, label: "签署模板一", value: 1 },
                { id: 2, label: "签署模板二", value: 2 },
                { id: 3, label: "签署模板三", value: 3 },
            ],
        };
    },
    activated() {
        console.log("activated调用了");
        console.log(this.$route.query.id);
        let query = this.$route.query;
        if (query.id) {
            console.log("编辑", query.id);
            this.pageTitle = "编辑应用";
        } else {
            console.log("新增");
            this.pageTitle = "新增应用";
        }
    },
    created() {},
    mounted() {},
    methods: {
        //切换表单类型
        changeType(type) {
            console.log("切换表单类型", type);
            this.typeId = type;
        },
        //如果有小程序链接  其他两项可为空
        changeAppLink(link) {
            console.log("小程序链接", link);
            this.formLabelAlign.appLink = link;
        },
        //是否自动发布签署
        changePublish(status) {
            console.log("是否自动发布签署", status);
            this.formLabelAlign.autoPublish = status;
        },
        //上传
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            // const isJPG = file.type === "image/jpeg";
            // const isLt2M = file.size / 1024 / 1024 < 2;
            // if (!isJPG) {
            //     this.$message.error("上传头像图片只能是 JPG 格式!");
            // }
            // if (!isLt2M) {
            //     this.$message.error("上传头像图片大小不能超过 2MB!");
            // }
            // return isJPG && isLt2M;
        },
        //确定
        submit(){
            console.log('确定');
        }
    },
};
</script>
<style scoped>
.content {
    width: 60%;
}
.avatar-uploader .el-upload {
    border: 1px dashed #fff;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #dcdfe6;
    border-radius: 5px;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
