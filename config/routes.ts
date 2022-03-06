export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'AreaChartOutlined',
    component: './Dashboard',
  },
  {
    path: '/slider',
    name: 'Carrusel',
    icon: 'TableOutlined',
    component: './Slider',
  },
  {
    path: '/products',
    name: 'Productos',
    icon: 'ShoppingCartOutlined',
    component: './Products',
  },
  {
    path: '/orders',
    name: 'Pedidos',
    icon: 'DollarCircleOutlined',
    component: './Orders',
  },
  {
    path: '/recipes',
    name: 'Recetas',
    icon: 'FileProtectOutlined',
    component: './RecipesSection',
  },
  {
    path: '/reports',
    name: 'Reportes',
    icon: 'StockOutlined',
    routes: [
      {
        path: '/reports/salesCustomer',
        name: 'Ventas x cliente',
        component: './reports/salescustomer',
      },

      {
        path: '/reports/salesProduct',
        name: 'Ventas x artículo',
        component: './reports/salesproduct',
      },
    ],
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    component: './404',
  },
]
