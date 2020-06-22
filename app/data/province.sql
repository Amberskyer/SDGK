/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80018
 Source Host           : localhost:3306
 Source Schema         : kk

 Target Server Type    : MySQL
 Target Server Version : 80018
 File Encoding         : 65001

 Date: 22/06/2020 08:37:59
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for province
-- ----------------------------
DROP TABLE IF EXISTS `province`;
CREATE TABLE `province`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `province_id` int(11) DEFAULT NULL,
  `province_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pin_yin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pin_yin_two` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` int(11) DEFAULT -1,
  `province_id_two` int(11) DEFAULT NULL,
  `r_province_id` int(11) DEFAULT NULL,
  `r_province_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of province
-- ----------------------------
INSERT INTO `province` VALUES (1, NULL, '安徽', 'an_hui', 'AnHui', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (2, NULL, '北京', 'bei_jing', 'BeiJing', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (3, NULL, '重庆', 'chong_qing', 'ChongQin', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (4, NULL, '福建', 'fu_jian', 'FuJian ', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (5, NULL, '甘肃', 'gan_su', 'GanSu', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (6, NULL, '广东', 'guang_dong', 'GuangDong', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (7, NULL, '广西', 'guang_xi', 'GuangXi', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (8, NULL, '贵州', 'gui_zhou', 'GuiZhou', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (9, NULL, '海南', 'hai_nan', 'HaiNan', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (10, NULL, '黑龙江', 'hei_long_jiang', 'HeiLongJiang', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (11, NULL, '河北', 'he_bei', 'HeBei', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (12, NULL, '河南', 'he_nan', 'HeNan', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (13, NULL, '湖北', 'hu_bei', 'HuBei', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (14, NULL, '湖南', 'hu_nan', 'HuNan', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (15, NULL, '吉林', 'ji_lin', 'JiLin', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (16, NULL, '江苏', 'jiang_su', 'JiangSu', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (17, NULL, '江西', 'jiang_xi', 'JiangXi', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (18, NULL, '辽宁', 'liao_ning', 'LaingNing', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (19, NULL, '内蒙古', 'nei_meng_gu', 'NeiMengGu', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (20, NULL, '宁夏', 'ning_xia', 'NingXia', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (21, NULL, '青海', 'qing_hai', 'QingHai', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (22, NULL, '山东', 'shan_dong', 'ShanDong', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (23, NULL, '山西', 'shan_xi', 'ShanXi', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (24, NULL, '陕西', 'shan_xi_two', 'ShanXiTwo', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (25, NULL, '上海', 'shang_hai', 'ShangHai', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (26, NULL, '四川', 'si_chuan', 'SiChuan', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (27, NULL, '天津', 'tian_jin', 'TianJin', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (28, NULL, '西藏', 'xi_zang', 'XiZang', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (29, NULL, '新疆', 'xin_jiang', 'XinJiang', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (30, NULL, '云南', 'yun_nan', 'YunNan', -1, NULL, NULL, NULL);
INSERT INTO `province` VALUES (31, NULL, '浙江', 'zhe_jiang', 'ZheJiang', -1, NULL, NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;
