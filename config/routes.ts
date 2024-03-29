﻿export default [
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
    path: '/groups',
    name: 'Agrupaciones',
    icon: 'AppstoreAddOutlined',
    component: './Groups',
  },
  {
    path: '/groups/:id',
    component: './Groups/Subgroups',
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
        component: './Reports/SalesCustomer',
      },

      {
        path: '/reports/salesProduct',
        name: 'Ventas x artículo',
        component: './Reports/SalesProduct',
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
];
