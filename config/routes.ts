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
    path: '/',
    redirect: '/dashboard',
  },
  {
    component: './404',
  },
];
