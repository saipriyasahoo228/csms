// routesConfig.js

import routes from './routes';
import Accident from './views/accidentform/Accident';
import Dashboard from './views/dashboard/Dashboard';
import Newissuance from './views/newissuance/Newissuance';
import Safetytraining from './views/safetytraining/Safetytraining';


const ADMIN_ROLE = 'admin';
const OPERATOR_ROLE = 'operator';

const adminRoutes = [
  { path: '/', exact: true, name: 'Home', element: <Dashboard />  },
  { path: '/dashboard', name: 'Dashboard', element: <Dashboard /> },
  { path: '/safety', name: 'Safety', element: <Safetytraining />, exact: true },
  // Add more admin-specific routes as needed
];

const operatorRoutes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/newissuance', name: 'newissuance', element: <Newissuance /> },
  { path: '/safetytraining', name: 'safetytraining', element: <Safetytraining /> },
  { path: '/accidentform', name: 'accidentform', element: <Accident /> },
  // Add more operator-specific routes as needed
];

const getRoutes = (role) => {
  switch (role) {
    case ADMIN_ROLE:
      return adminRoutes;
    case OPERATOR_ROLE:
      return operatorRoutes;
    default:
      return [];
  }
};

export { getRoutes };
