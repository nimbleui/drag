import type { RouteRecordRaw } from "vue-router";

const modules = import.meta.glob("../views/**/*.(page|npage).(vue|tsx)");
const moduleLayout = import.meta.glob("../views/**/*.module.(vue|tsx)");

const routeNameReg = /.*\/(.*)\.(page|npage)\.(tsx|vue)$/;
const modulesNameReg = /.*\/(.*).modules\/.*/;
const moduleTestReg = /(.*).module.(vue|tsx)$/;
const keys = Object.keys(modules);
const moduleKeys = Object.keys(moduleLayout);

// npage代码不需要权限
const isAuthReg = /.*\.npage\.(tsx|vue)$/;

const routerModules = keys.reduce(
  (acc, key) => {
    const modulesName = key.match(modulesNameReg)?.[1];

    if (modulesName && !acc[modulesName]) {
      const check = moduleKeys.find((key) => moduleTestReg.test(key)) as string;
      const routers: RouteRecordRaw[] = [];
      if (check) {
        routers.push({
          path: `/${modulesName}/`,
          name: modulesName,
          component: moduleLayout[check]
        });
      }

      acc[modulesName] = {
        isModel: !!check,
        moduleName: modulesName,
        routers: routers
      };
    }

    const routeName = key.match(routeNameReg)?.[1];
    if (!routeName) return acc;

    if (modulesName && acc[modulesName]) {
      const { isModel, moduleName, routers } = acc[modulesName];
      if (isModel) {
        const route = {
          path: `${routeName}`,
          name: routeName,
          component: modules[key]
        };
        if (!routers[0].children) {
          routers[0].children = [route];
        } else {
          routers[0].children.push(route);
        }
      } else {
        routers.push({
          path: `/${moduleName}/${routeName}`,
          name: routeName,
          component: modules[key],
          meta: {
            isNoAuth: isAuthReg.test(key)
          }
        });
      }
    } else {
      acc[routeName] = {
        routers: [
          {
            path: `/${routeName}`,
            name: routeName,
            component: modules[key],
            meta: {
              isNoAuth: isAuthReg.test(key)
            }
          }
        ]
      };
    }

    return acc;
  },
  {} as { [key: string]: { isModel?: boolean; moduleName?: string; routers: RouteRecordRaw[] } }
);

const routers = Object.keys(routerModules).reduce((acc, key) => {
  const routers = routerModules[key].routers;

  if (routers) {
    acc.push(...routers);
  }

  return acc;
}, [] as RouteRecordRaw[]);
console.log("路由列表", routers);
export default [
  {
    path: "/",
    redirect: "/index"
  },
  ...routers
];
