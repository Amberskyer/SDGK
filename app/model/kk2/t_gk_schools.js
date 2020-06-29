/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('t_gk_schools', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    xue_xiao_ming_cheng: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sou_suo_zhi_shu: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rank_type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bie_ming: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    yuan_xiao_di_qu: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    suo_zai_sheng_fen: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    suo_zai_sheng_fen_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    suo_zai_cheng_shi: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    yuan_xiao_lei_xing: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    yuan_xiao_lei_xing_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    xue_li_ceng_ci: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    zhu_guan_bu_men: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ban_xue_xing_zhi: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    shi_985: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    shi_211: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    shuang_yi_liu: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    jian_xiao_shi_jian: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    yan_jiu_sheng_yuan: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    yan_jiu_sheng_tui_mian: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    zhao_sheng_wang_zhan: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    guan_fang_wang_zhan: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    di_zhi: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
    zhao_sheng_zhang_cheng: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    xue_sheng: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    yuan_shi: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bo_shi_dian: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    shuo_shi_dian: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    shuo_shi_xue_wei_hpsj: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    guo_zhong_yi_ke: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    guo_zhong_er_ke: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    guo_zhong_pei_ke: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    xue_xiao_jian_jie: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    zhong_guo_ke_xue_yuan_shi: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    zhong_guo_gong_cheng_yuan_shi: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ke_ji_bu_chuang_xin_ren_cai: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    si_ge_yi_pi__ren_cai: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    guo_jia_ji_jin_wei_fu_ze_ren: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    chuang_xin_tuan_dui_fu_ze_ren: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    zhong_guo_ke_xie_qing_nian_ren_cai: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bo_shi_hou_chuang_xin_ren_cai: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    si_xiang_zheng_zhi_jiao_yu_ren_cai: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    xue_ke_ping_yi_zu: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    jiao_xue_zhi_dao_wei_yuan: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ke_ji_wei_he_xue_bu_wen_yuan: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    xin_shi_ji_you_xiu_ren_cai: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    qin_qian: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    you_qin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    jie_qin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bai_qian_wan_ren_cai: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    guo_jia_ji_jiao_xue_ming_shi: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    guo_jia_ji_jiao_xue_tuan_dui: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    guo_jia_shi_yan_shi: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    yan_jiu_zhong_xin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    gong_cheng_shi_yan_shi: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    gong_cheng_yan_jiu_zhong_xin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    gong_xin_bu_shi_yan_shi: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    shi_111_ji_di: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    gong_cheng_ji_shu_zhong_xin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lin_chuang_yi_xue_zhong_xin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    guo_jia_zhong_xian_shi_yan_shi: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    guo_jia_guo_ji_ji_di: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    shi_211_zhong_xin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    wen_wu_ke_yan_ji_di: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    gao_duan_zhi_ku: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    guo_jia_di_fang_shi_yan_zhong_xin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    jiao_yu_bu_guo_ji_shi_yan_shi: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ren_wen_she_ke_ji_di: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    zhong_guo_zhuan_li_jiang: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    he_liang_he_li_jiang: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    chen_jia_geng_ke_xue_jiang: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    guo_jia_ke_xue_ji_shu_jiang: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ke_xue_ji_shu_jiang: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    guo_tu_zi_yuan_ke_xue_ji_shu_jiang: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    huan_jing_bao_hu_ke_xue_ji_shu_jiang: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    shi_da_ke_ji_jin_bu_jiang: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    gui_hua_jiao_cai: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    jing_pin_ke: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    jiao_yu_ke_xue_gui_hua_ke_ti: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    jiao_xue_cheng_guo_jiang: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    jing_pin_gong_xiang_ke: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    jing_pin_zai_xian_ke: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    jing_pin_gong_kai_ke: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    xin_gong_ke_yan_jiu_xiang_mu: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    guo_jia_ji_shi_yan_jiao_xue_zhong_xin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    xu_ni_shi_yan_jiao_xue_zhong_xin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    xiao_wai_shi_jian_ji_di: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    hu_lian_wang_da_sai: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bai_pian_bo_shi_lun_wen: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tiao_zhan_bei: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    guo_jia_zhong_dian_yan_fa_ji_hua: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    guo_jia_zi_ran_ke_xue_ji_jin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    guo_jia_she_hui_ke_xue_ji_jin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ke_ji_ji_chu_gong_zuo_zx: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bo_shi_hou_ke_xue_ji_jin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bo_shi_dian_ji_jin_li_xiang: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ren_wen_yan_jiu_xiang_mu: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    973_he_zhong_da_ji_hua: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    the_pm: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    qs_pm: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    wu_shu_lian_pm: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    zhong_guo_xiao_you_hui_pm: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    usnews_pm: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    arwu_pm: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ruan_ke_zhong_guo_pm: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    zhong_guo_da_xue_pm: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    major_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    major: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 't_gk_schools'
  });

  Model.associate = function() {

  }

  return Model;
};
