'use strict';
module.exports = {

  formatParamsType(oObj) {
    const keyArr = [
      'school_id', 'major_id', 'batch_id',
      'score', 'rank', 'province_id', 'phone', 'username',
      'year', 'gaokaoRegionId', 'vcode' ];
    if (!oObj) {
      return null;
    }
    Object.keys(oObj).forEach(key => {
      if ((key === 'province_id' || key === 'subject_type') && oObj[key] === 'all') {
        oObj[key] = null;
      }
      if (key === 'school_id' && (oObj[key] === '' || oObj[key] === '0' || oObj[key] === 0)) {
        oObj[key] = null;
      }
      if (keyArr.includes(key) && oObj[key]) {
        oObj[key] = parseInt(oObj[key]);
      }
    });
    console.log(oObj);
    return oObj;
  },

};
