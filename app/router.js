'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const {router, controller} = app;

    /*   (important:)   页面相关   */
    router.get('/', controller.home.index);//主页=>index
    router.get('/school-heat', controller.home.schoolHeat);//主页=>学校搜索指数
    router.get('/major-heat', controller.home.majorHeat);//主页=>专业搜索指数

    router.get('/search', controller.search.index);//主页=>搜索结果
    router.get('/vip', controller.vip.index);//主页=>开通VIP


    router.get('/colleges', controller.college.index);//挑大学=>index
    router.get('/college/:id', controller.college.info);//挑大学=>大学基本信息
    router.get('/college/:id/evaluation', controller.college.evaluation);//挑大学=>大学录取数据
    router.get('/college/:id/major/evaluation', controller.college.majorEvaluation);//挑大学=>大学专业录取数据
    router.get('/college/:id/admission-plan', controller.college.admissionPlan);//挑大学=>大学招生计划
    router.get('/college/:id/admission-info', controller.college.admissionInfo);//挑大学=>大学招生章程
    router.get('/college/:id/prospect', controller.college.prospect);//挑大学=>大学就业前景

    router.get('/majors', controller.major.index);//挑专业=>index
    router.get('/major/:id', controller.major.info);//挑专业=>专业基本信息
    router.get('/major/:id/evaluation/:type', controller.major.evaluation);//挑专业=>专业录取数据
    // router.get('/major/:id/evaluationByBatch', controller.major.evaluationByBatch);//挑专业=>专业录取数据(按批次)
    // router.get('/major/:id/evaluationByRank', controller.major.evaluationByRank);//挑专业=>专业录取数据(按排名)
    // router.get('/major/:id/evaluationByScore', controller.major.evaluationByScore);//挑专业=>专业录取数据(按分数)
    router.get('/major/:id/admission-plan', controller.major.admissionPlan);//挑专业=>专业招生计划
    router.get('/major/:id/prospect', controller.major.prospect);//挑专业=>专业就业前景


    router.get('/jobs', controller.job.index);//挑职业=>index
    router.get('/job/:id', controller.job.info);//挑职业=>职业基本信息
    router.get('/job/:id/major', controller.job.major);//挑职业=>职业对口专业
    router.get('/job/:id/prospect', controller.job.prospect);//挑职业=>职业就业前景


    router.get('/rank', controller.infoQuery.rank);//信息查询=>查位次
    router.get('/batch-line', controller.infoQuery.batchLine);//信息查询=>批次线
    router.get('/college-bang', controller.infoQuery.collegeBang);//信息查询=>院校榜


    router.get('/test-evaluation', controller.testEvaluation.index);//录取测试=>录取概率测试
    router.get('/job-for-you', controller.testEvaluation.jobForYou);//录取测试=>职业性格测试
    router.get('/compare/:type', controller.testEvaluation.compare);//录取测试=>院校对比
    // router.get('/school-comparison', controller.testEvaluation.schoolComparison);//录取测试=>院校对比
    // router.get('/major-comparison', controller.testEvaluation.majorComparison);//录取测试=>专业对比

    router.get('/smart-simulate', controller.preference.smartSimulate);//志愿填报=>智能模拟填报
    router.get('/about-enroll', controller.preference.aboutEnroll);//志愿填报=>录取相关查询
    router.get('/admission-plan', controller.preference.admissionPlan);//志愿填报=>招生计划查询


    router.get('/news', controller.news.index);//高考咨询=>高招资讯
    router.get('/news/:type', controller.news.index);//高考咨询=>高招资讯
    // router.get('/news', controller.news.index);//高考咨询=>高招资讯
    // router.get('/news/college', controller.news.collegeNews);//高考咨询=>高校资讯
    // router.get('/news/major', controller.news.majorNews);//高考咨询=>专业资讯


    router.get('/userinfo', controller.mine.userinfo);//我的=>基本信息
    router.get('/reset-psw', controller.mine.resetPSW);//我的=>修改密码
    router.get('/my-preference', controller.mine.myPreference);//我的=>我的资源表
    router.get('/preference-detail', controller.mine.preferenceDetail);//我的=>查看志愿表
    router.get('/favorite/college', controller.mine.favoriteCollege);//我的=>我关注的学校
    router.get('/favorite/major', controller.mine.favoriteMajor);//我的=>我关注的专业
    router.get('/favorite/article', controller.mine.favoriteArticle);//我的=>我关注的文章


    router.get('/api/v1/captcha', controller.captcha.captcha);//我的=>我关注的文章
    router.get('/api/v1/verify', controller.captcha.captcha);//我的=>我关注的文章

    /*   (important:)   API相关   */
    router.resources('college', '/api/v1/college', controller.api.v1.college);
    router.resources('college-info', '/api/v1/college-info', controller.api.v1.collegeInfo);


};
