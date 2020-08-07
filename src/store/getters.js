const getters = {
  token: state => state.user.token,
  projectId: state => state.project.projectId,
  projectName: state => state.project.projectName,
  userName: state => state.user.userName,
  userId: state => state.user.userId,
  telephone: state => state.user.telephone,
  mobile: state => state.user.mobile,
  roleTexts: state => state.user.roleTexts,
  departmentList: state => state.project.departmentList,
  departmentTreeList: state => state.project.departmentTreeList,
  longitude: state => state.geolocation.longitude,
  latitude: state => state.geolocation.latitude
}

export default getters
