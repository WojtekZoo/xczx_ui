import http from './../../../base/api/public'
import querystring from 'querystring'

let sysConfig = require('@/../config/sysConfig');
let apiUrl = sysConfig.xcApiUrlPre;

//页面查询
export const page_list = (page, size, params) => {
  let queryString = querystring.stringify(params);
  //请求服务端的页面查询接口
  return http.requestQuickGet(apiUrl + '/cms/page/list/' + page + '/' + size + '?' + queryString);
};

//页面新增
export const page_add = params => {
  return http.requestPost(apiUrl + '/cms/page/add', params)
};

//根据编号查询页面详情
export const page_findById = params => {
  return http.requestQuickGet(apiUrl + '/cms/page/findById/' + params)
};

//根据编号修改页面
export const page_editById = (pageId, params) => {
  return http.requestPut(apiUrl + '/cms/page/editById/' + pageId, params)
};

//根据编号删除页面
export const page_delById = pageId => {
  return http.requestDelete(apiUrl + '/cms/page/delById/' + pageId)
};

//根据编号发布页面
export const page_postById = pageId => {
  return http.requestPost(apiUrl + '/cms/page/post/' + pageId)
};

//获取页面查询条件下拉选项
export const siteConditionValue = () => {
  //请求服务端的cms查询站点名称编号接口
  return http.requestQuickGet(apiUrl + '/cms/site/listIdName');
};

export const templateConditionValue = () => {
  //请求服务端的cms查询模板名称编号接口
  return http.requestQuickGet(apiUrl + '/cms/template/listIdName');
};
