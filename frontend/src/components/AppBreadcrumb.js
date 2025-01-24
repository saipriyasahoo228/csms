
// import React from 'react';
// import { useLocation, Link } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react';
// import routes from '../routes';

// const AppBreadcrumb = () => {
//   const currentLocation = useLocation().pathname;
//   const userRole = useSelector((state) => state.role);// Get user from Redux store

//   const getRouteName = (pathname, routes) => {
//     const currentRoute = routes.find((route) => route.path === pathname);
//     return currentRoute ? currentRoute.name : false;
//   };

//   const getBreadcrumbs = (location) => {
//     const breadcrumbs = [];
//     location.split('/').reduce((prev, curr, index, array) => {
//       const currentPathname = `${prev}/${curr}`;
//       const routeName = getRouteName(currentPathname, routes);
//       if (routeName) {
//         const filteredRoute = routeName.roles ? routeName.roles.includes(user?.role) : true;
//         if (filteredRoute) {
//           breadcrumbs.push({
//             pathname: currentPathname,
//             name: routeName.name,
//             active: index + 1 === array.length,
//           });
//         }
//       }
//       return currentPathname;
//     });
//     return breadcrumbs;
//   };

//   const breadcrumbs = getBreadcrumbs(currentLocation);

//   // Define home routes based on roles
//   const homeRoutes = {
//     Admin: '/dashboard',
//     Operator: '/safetytraining', // Adjust these routes as needed
//     Viewer: '/reports', // Adjust these routes as needed
//   };

//   // Default home route if role is not recognized or not set
//   const defaultHomeRoute = '/';

//   // Determine home link based on user role or default route
//   const homeLink = userRole && homeRoutes[userRole] ? homeRoutes[userRole] : defaultHomeRoute;
//   console.log('User role:', userRole?.role);
//   console.log('user role',userRole)
//   console.log('Home link:', homeLink);

//   return (
//     <CBreadcrumb className="my-0">
//       <CBreadcrumbItem> 
//         <Link to={homeLink} style={{ textDecoration: 'none' }}>
//           Home
//         </Link>
//       </CBreadcrumbItem>
//       {breadcrumbs.map((breadcrumb, index) => (
//         <CBreadcrumbItem
//           {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
//           key={index}
//         >
//           {breadcrumb.name}
//         </CBreadcrumbItem>
//       ))}
//     </CBreadcrumb>
//   );
// };

// export default React.memo(AppBreadcrumb);



import React from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux';

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { Link } from 'react-router-dom'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname
  const userRole = useSelector((state) => state.role);// Get user from Redux store

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        })
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)
  console.log('breadcrumbs',breadcrumbs);


  // Define home routes based on roles
  const homeRoutes = {
    Admin: '/dashboard',
    Operator: '/safetytraining', // Adjust these routes as needed
    Viewer: '/reports', // Adjust these routes as needed
  };

  // Default home route if role is not recognized or not set
  const defaultHomeRoute = '/';

  // Determine home link based on user role or default route
  const homeLink = userRole && homeRoutes[userRole] ? homeRoutes[userRole] : defaultHomeRoute;
  console.log('User role:', userRole?.role);
  console.log('user role',userRole)
  console.log('Home link:', homeLink);

  return (
    <CBreadcrumb className="my-0">
       <CBreadcrumbItem> 
        <Link to={homeLink} style={{ textDecoration: 'none' }}>
          Home
       </Link>
             </CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)