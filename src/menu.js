var menus = [
  {
    action: "home",
    title: "首页",
    path:"/index",
    items: [{ title: "统计", path: "/dashboard" }]
  },
  {
    action: "apps",
    title: "商品管理",
    path:"/item",
    items: [
      { title: "分类管理", path: "/category" },
      { title: "商品列表", path: "/myGoods" },
      { title: "求购列表", path: "/want" },
    ]
  },
  {
    action: "apps",
    title: "订单管理",
    path:"/order",
    items: [
      { title: "订单详情", path: "/order" },
    ]
  },
  {
    action: "apps",
    title: "地址管理",
    path:"/address",
    items: [
      { title: "地址详情", path: "/address" },
    ]
  },
  {
    action: "settings",
    title: "权限管理",
    path:"/authority",
    items: [
      { title: "角色管理", path: "/role" },
    ]
  }
]

export default menus;
