define([ 'app/helper/jquery', 'services/config' ], function($, config) {

  const service = {};

  // 原生 单参数形式get请求
  service.baseGet = function(url) {
    const promise = $.ajax({
      type: 'get',
      url,
    });
    return promise;
  };

  // 原生 body形式get请求
  service.baseGetFromBody = function(url, input) {
    input = JSON.stringify(input);
    const promise = $.ajax({
      contentType: 'application/json',
      dataType: 'json',
      type: 'get',
      data: input,
      url,
    });
    return promise;
  };

  // 原生 单参数形式post请求
  service.basePost = function(url) {
    const promise = $.ajax({
      type: 'post',
      url,
    });
    return promise;
  };

  // 原生 body形式post请求
  service.basePostFromBody = function(url, input) {
    input = JSON.stringify(input);
    const promise = $.ajax({
      contentType: 'application/json',
      dataType: 'json',
      type: 'post',
      data: input,
      url,
    });
    return promise;
  };

  // Data数据端 单参数形式post请求
  service.dataPost = function(url) {
    const promise = $.ajax({
      type: 'post',
      url: config.getDataApi(url),
    });
    return promise;
  };

  // Data数据端 input形式post请求
  service.dataPostFromBody = function(url, input) {
    input = JSON.stringify(input);
    const promise = $.ajax({
      contentType: 'application/json',
      dataType: 'json',
      type: 'post',
      data: input,
      url: config.getDataApi(url),
    });
    return promise;
  };

  // ToB业务端 单参数形式post请求
  service.post = function(url) {
    const promise = $.ajax({
      type: 'post',
      url: config.getToBApi(url),
    });
    return promise;
  };

  // ToB业务端 input形式post请求
  service.postFromBody = function(url, input) {
    input = JSON.stringify(input);
    const promise = $.ajax({
      contentType: 'application/json',
      dataType: 'json',
      type: 'post',
      data: input,
      url: config.getToBApi(url),
    });
    return promise;
  };

  // ToC业务端 单参数形式post请求
  service.postToC = function(url) {
    const promise = $.ajax({
      type: 'post',
      url: config.getToCApi(url),
    });
    return promise;
  };

  // ToC业务端 input形式post请求
  service.postFromBodyToC = function(url, input) {
    input = JSON.stringify(input);
    const promise = $.ajax({
      contentType: 'application/json',
      dataType: 'json',
      type: 'post',
      data: input,
      url: config.getToCApi(url),
    });
    return promise;
  };

  // ToC业务端 单参数形式post请求
  service.postToCUsers = function(url) {
    const promise = $.ajax({
      type: 'post',
      url: config.getToCUsersApi(url),
    });
    return promise;
  };

  // ToC业务端 input形式post请求
  service.postFromBodyToCUsers = function(url, input) {
    input = JSON.stringify(input);
    const promise = $.ajax({
      contentType: 'application/json',
      dataType: 'json',
      type: 'post',
      data: input,
      url: config.getToCUsersApi(url),
    });
    return promise;
  };

  // Career业务端 单参数形式post请求
  service.postToCareer = function(url) {
    const promise = $.ajax({
      type: 'post',
      url: config.getToCareerApi(url),
    });
    return promise;
  };

  // Career业务端 input形式post请求
  service.postFromBodyToCareer = function(url, input) {
    input = JSON.stringify(input);
    const promise = $.ajax({
      contentType: 'application/json',
      dataType: 'json',
      type: 'post',
      data: input,
      url: config.getToCareerApi(url),
    });
    return promise;
  };

  return service;

});
