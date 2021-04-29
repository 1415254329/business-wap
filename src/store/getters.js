const getters = {
  logo: state => state.user.userInfo.logo,
  storeName: state => state.user.userInfo.store_name,
  userType: state => state.user.userType,
  userInfo: state => state.user.userInfo,
  countBoughtUseList: state => state.business.countBoughtUseList,
  printSetting: state => state.print.setting
}
export default getters
