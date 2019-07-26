//
// 全局配置
//
define([], function() {
  const config = {
    isRelease: true,
    isEncrypt: true, // 是否开启数据加密
    // 【PRO：//staticv3.youzy.cn/ToC.PC】
    // 【PRE：//staticv3-pre.youzy.cn/ToC.PC】
    // 【QA：''】
    staticUrl: '//staticv3-pre.youzy.cn/ToC.PC/scripts-pro/06232251/static/',
    apiToC: '/ToC/',
    apiToCUsers: '/ToCUsers/',
    apiData: '/Data/',
  };

  config.getToCApi = function(apiUrl) {
    const soaHost = config.apiToC;
    value = (soaHost.endsWith('/') ? soaHost : soaHost + '/') +
            (apiUrl.startsWith('/') ? apiUrl.substring(1, apiUrl.length) : apiUrl);
    return value;
  };

  config.getToCUsersApi = function(apiUrl) {
    const soaHost = config.apiToCUsers;
    value = (soaHost.endsWith('/') ? soaHost : soaHost + '/') +
            (apiUrl.startsWith('/') ? apiUrl.substring(1, apiUrl.length) : apiUrl);
    return value;
  };

  config.getDataApi = function(apiUrl) {
    const soaHost = config.apiData;
    value = (soaHost.endsWith('/') ? soaHost : soaHost + '/') +
            (apiUrl.startsWith('/') ? apiUrl.substring(1, apiUrl.length) : apiUrl);

    return value;
  };

  return config;

});
