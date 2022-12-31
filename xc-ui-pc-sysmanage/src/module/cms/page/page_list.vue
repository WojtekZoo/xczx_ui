<template>
  <div>
    <!--编写页面静态部分，即view部分-->
    <el-form :inline="true" :model="pageParams" class="demo-form-inline">
      <el-form-item label="页面别名">
        <el-input placeholder="页面别名" clearable v-model="pageParams.pageAliase"></el-input>
      </el-form-item>

      <el-form-item label="站点">
        <el-select placeholder="请选择站点" clearable v-model="pageParams.siteId">
          <el-option v-for="item in siteList"
                     v-bind:label="item.siteName"
                     :key="item.siteId"
                     :value="item.siteId"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="模板">
        <el-select placeholder="请选择模板" clearable v-model="pageParams.templateId">
          <el-option v-for="item in templateList"
                     :label="item.templateName"
                     :key="item.templateId"
                     :value="item.templateId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query">查询</el-button>
        <router-link class="mui-tab-item"
                     :to="{path:'/cms/page/add'
                         , query:{page:this.pageParams.page
                              , size:this.pageParams.size, pageAliase:this.pageParams.pageAliase
                              , siteId:this.pageParams.siteId, templateId:this.pageParams.templateId}}">
          <el-button type="primary">新增</el-button>
        </router-link>
      </el-form-item>
    </el-form>

    <!--    数据表格-->
    <!--  :data 指的是 v-bind:data  -->
    <el-table
      :data="tableData" stripe style="width: 100%" border>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="pageName" label="页面名称"></el-table-column>
      <el-table-column prop="pageAliase" label="别名" width="110px"></el-table-column>
      <el-table-column prop="pageType" label="页面类型" width="100px">
        <template slot-scope="scope">
          {{ scope.row.pageType === "0" ? "静态" : "动态" }}
        </template>
      </el-table-column>
      <el-table-column prop="pageWebPath" label="访问路径"></el-table-column>
      <el-table-column prop="pagePhysicalPath" label="物理路径"></el-table-column>
      <el-table-column prop="pageCreateTime" label="创建时间"></el-table-column>
      <el-table-column prop="dataUrl" label="数据获取地址"></el-table-column>
      <el-table-column fixed="right" label="操作" width="220px">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="editClick(scope.row.pageId)" type="text" size="small">编辑</el-button>
          <el-button @click="delClick(scope.row.pageId)" type="text" size="small">删除</el-button>
          <el-button @click="preview(scope.row.pageId)" type="text" size="small">预览</el-button>
          <el-button @click="postPage(scope.row.pageId)" type="text" size="small">发布</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    分页组件-->
    <el-pagination
      style="float:right; margin-top: 10px"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageParams.page"
      :page-sizes="[10,20,30,50]"
      :page-size="pageParams.size"
      layout="prev, pager, next, total, sizes"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
    /*编写页面静态部分，即model及vm部分。*/
    import * as cmsApi from '../api/cms'

    export default {
        methods: {
            handleClick(val) {//查看详情
                console.log(val)
            },

            editClick(val) {//编辑
                this.$router.push({
                    path: '/cms/page/edit/' + val,
                    query: {
                        page: this.pageParams.page,
                        size: this.pageParams.size,
                        pageAliase: this.pageParams.pageAliase,
                        siteId: this.pageParams.siteId,
                        templateId: this.pageParams.templateId
                    }
                })
            },

            delClick(val) {//删除
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    cmsApi.page_delById(val).then((res) => {
                        if (res.success) {
                            this.$message.success("操作成功");
                            this.query();
                        } else {
                            this.$message.error("操作失败")
                        }
                    })
                })
            },

            preview(pageId) {//预览
                //打开浏览器窗口
                window.open("http://www.xuecheng.com/cms/preview/"+pageId);
            },

            postPage(pageId) {//发布
                this.$confirm('确定发布?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    cmsApi.page_postById(pageId).then((res) => {
                        if (res.success) {
                            this.$message.success("操作成功");
                            this.query();
                        } else {
                            this.$message.error("操作失败")
                        }
                    })
                })
            },

            handleSizeChange(val) {
                this.pageParams.size = val;
                this.query();
            },

            handleCurrentChange(val) {
                this.pageParams.page = val;
                this.query();
            },

            query() {
                //.then 为向服务端发起调用成功后的回调方法
                cmsApi.page_list(this.pageParams.page, this.pageParams.size, this.pageParams).then((results) => {
                    // console.log(results)
                    this.tableData = results.queryResult.list;
                    this.total = results.queryResult.total;
                })
            },

            getConditionValue() {//获取查询条件下拉选项
                cmsApi.siteConditionValue().then((res) => {
                    this.siteList = res.queryResult.list;
                });
                cmsApi.templateConditionValue().then((res) => {
                    this.templateList = res.queryResult.list;
                })
            }
        },

        mounted() {//vue 生命周期钩子函数 ， dom对象渲染完成后执行
            this.query();
            this.getConditionValue();
        },

        created() {//vue 生命周期钩子函数 ， vue实例创建完成dom对象渲染时执行
            this.pageParams.page = Number.parseInt(this.$route.query.page || 1);
            this.pageParams.size = Number.parseInt(this.$route.query.size || 10);
            this.pageParams.pageAliase = this.$route.query.pageAliase || '';
            this.pageParams.siteId = this.$route.query.siteId || '';
            this.pageParams.templateId = this.$route.query.templateId || '';
        },

        data() {
            return {
                siteList: [],
                templateList: [],
                tableData: [],
                total: 0,
                pageParams: {
                    siteId: '',
                    templateId: '',
                    pageAliase: '',
                    page: 1,//当前页码
                    size: 10//每页显示记录数
                },
            }
        }
    }
</script>
<style>
  /*编写页面样式，不是必须*/
</style>
