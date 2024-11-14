
import store from '../../store'

export default () => {
  const menuRoute = store.getters.menuRoute
  let newArr = menuRoute.map((item:any) => {
    item.titles = [item.title]
    return item
  })

  menuRoute.forEach((item:any) => {
    if (item.children.length) {
      // 代表有二级路由
      item.children.forEach((child:any) => {
        child.titles = item.titles.concat(child.title)
      })
      newArr.push(...item.children)
    }
  })

  return newArr
}




// { path: '/student', title: '学员', icon: 'introduce' titles: ['学员'] }

// { path: '/student/import', title: '导入学员', icon: 'introduce' titles: ['学员', '导入学员'] }  >
