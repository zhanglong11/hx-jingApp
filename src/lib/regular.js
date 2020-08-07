/*
 * @Description:公共正则
 * @Version:
 * @Autor:
 * @Date: 2020-02-17 11:26:48
 * @LastEditTime: 2020-02-21 14:22:31
 */
const publicRegular = {
  businessLicenseNo: /^([159Y]{1})([1239]{1})([0-9ABCDEFGHJKLMNPQRTUWXY]{16})$|^\d{15}$/,
  // 手机+座机号 座机格式:0379-60667773
  phone: /^((0\d{2,3}-\d{7,8})|(1[0-9]{10}))$/,
  // 座机
  Tel: /^(0\d{2,3}-\d{7,8})$/,
  // 手机号
  telephone: /^1[0-9]{10}$/,
  // 纳税人识别码（社会统一代码）
  taxNo: /^(^[A-Z0-9]{15}$)|(^[A-Z0-9]{17}$)|(^[A-Z0-9]{18}$)|(^[A-Z0-9]{20}$)$/,
  // 身份证号
  idCardNo: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  // 中文姓名:1~30位
  chineseName: /^([\u4e00-\u9fa5·]{1,30})$/,
  // 车牌号
  carLicense: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
  // 车架号(vehicle identification number)
  VIN: /^[\d\w]{17}$/,
  // 密码
  password: /^.{8,20}$/
}
export default publicRegular
