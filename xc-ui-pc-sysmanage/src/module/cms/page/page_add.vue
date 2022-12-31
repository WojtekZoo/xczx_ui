<template>
  <div>
    <!--编写页面静态部分，即view部分-->
    <el-form :model="pageForm" ref="pageForm" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="站点" prop="siteId">
            <el-select placeholder="请选择站点" v-model="pageForm.siteId">
              <el-option v-for="item in siteList"
                         v-bind:label="item.siteName"
                         :key="item.siteId"
                         :value="item.siteId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="模板" prop="templateId">
            <el-select placeholder="请选择模板" v-model="pageForm.templateId">
              <el-option v-for="item in templateList"
                         :label="item.templateName"
                         :key="item.templateId"
                         :value="item.templateId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="页面名称" prop="pageName">
            <!-- 在不想使用缓存的input中添加 autocomplete=”off”-->
            <el-input auto-complete="off" v-model="pageForm.pageName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="别名" prop="pageAliase">
            <el-input auto-complete="off" v-model="pageForm.pageAliase"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="访问路径" prop="pageWebPath">
        <el-input v-model="pageForm.pageWebPath" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="物理路径" prop="pagePhysicalPath">
        <el-input v-model="pageForm.pagePhysicalPath" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="数据获取地址" prop="pagePhysicalPath">
        <el-input v-model="pageForm.dataUrl" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="pageForm.pageType">
          <el-radio label="0">静态</el-radio>
          <el-radio label="1">动态</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker type="datetime" placeholder="选择时间" v-model="pageForm.pageCreateTime"></el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog‐footer">
      <el-button type="primary" @click="addSubmit">提交</el-button>
      <el-button type="info" @click="resetForm('pageForm')">重置</el-button>
      <el-button @click="go_back">关闭</el-button>
    </div>
  </div>
</template>
<script>
    /*编写页面静态部分，即model及vm部分。*/
    import * as cmsApi from '../api/cms'

    export default {
        methods: {
            getConditionValue() {//获取查询条件下拉选项
                cmsApi.siteConditionValue().then((res) => {
                    this.siteList = res.queryResult.list;
                });
                cmsApi.templateConditionValue().then((res) => {
                    this.templateList = res.queryResult.list;
                })
            },
            addSubmit() {
                this.$refs.pageForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确定提交?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            // type: 'warning'
                        }).then(() => {
                            cmsApi.page_add(this.pageForm).then((res) => {
                                if (res.success) {
                                    this.$message.success("提交成功");
                                    this.resetForm('pageForm');
                                } else if (res.message) {
                                    this.$message.error(res.message)
                                } else {
                                    this.$message.error("提交失败")
                                }
                            })
                        })
                    } else {
                        return false;
                    }
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            go_back() {
                this.$router.push({
                    path: '/cms/page/list',
                    query: {
                        page: this.$route.query.page,
                        size: this.$route.query.size,
                        pageAliase: this.$route.query.pageAliase,
                        siteId: this.$route.query.siteId,
                        templateId: this.$route.query.templateId
                    }
                });
            }
        },

        mounted() {//vue 生命周期钩子函数 ， vue实例创建完成dom对象渲染时执行

        },

        created() {//vue 生命周期钩子函数 ， dom对象渲染完成后执行
            this.getConditionValue();
        },

        data() {
            return {
                siteList: [],
                templateList: [],
                tableData: [],
                total: 0,
                pageForm: {
                    siteId: '',
                    templateId: '',
                    pageAliase: '',
                    pageName: '',
                    pageWebPath: '',
                    pagePhysicalPath: '',
                    dataUrl: '',
                    pageType: '',
                    pageCreateTime: new Date()
                },
                rules: {
                    siteId: [
                        {required: true, message: '请选择站点', trigger: 'blur'}
                        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    templateId: [
                        {required: true, message: '请选择模版', trigger: 'blur'}
                    ],
                    pageName: [
                        {required: true, message: '请输入页面名称', trigger: 'blur'}
                    ],
                    pageWebPath: [
                        {required: true, message: '请输入访问路径', trigger: 'blur'}
                    ],
                    pagePhysicalPath: [
                        {required: true, message: '请输入物理路径', trigger: 'blur'}
                    ],
                    dataUrl: [
                        {required: true, message: '请输入数据获取地址', trigger: 'blur'}
                    ]
                }
            }
        }
    }
</script>
<style>
  /*编写页面样式，不是必须*/
</style>
