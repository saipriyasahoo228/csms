import { element, exact } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Safety'))
const Itemwisetool=React.lazy(()=>import('./views/itemwisetools/Itemwisetools'))
const itemwiseppe =React.lazy(()=>import('./views/itemwiseppe/Itemwiseppe'))
const itemwisedress=React.lazy(()=>import('./views/itemwisedress/Itemwisedress'))
const employeewiseserach=React.lazy(()=>import('./views/employeewisesearch/Employeewisesearch'))
const aftersearchbody=React.lazy(()=>import('./views/aftersearchbody/Afterseachbody'))
const organizationalreportbody=React.lazy(()=>import('./views/organizationalreportbody/Organizationalreportbody'))
const AfterSearchBody = React.lazy(() => import('./views/aftersearchbody/Afterseachbody'))
const upcoming15daysbody=React.lazy(()=>import('./views/upcoming15daysbody/Upcoming15daysbody'))
const upcoming30daysbody=React.lazy(()=>import('./views/upcoming30daysbody/Upcoming30daysbody'))
const upcoming45daysbody=React.lazy(()=>import('./views/upcoming45daysbody/Upcoming45daysbody'))
const trainingdetails=React.lazy(()=>import('./views/trainingdetails/Trainingdetails'))
const trainerdetails=React.lazy(()=>import('./views/trainerdetails/Trainerdetails'))
const empregister=React.lazy(()=>import('./views/employeeregisterform/EmployeeRegister'))
const newissuance=React.lazy(()=>import('./views/newissuance/Newissuance'))
const safetytraining=React.lazy(()=>import('./views/safetytraining/Safetytraining'))
const accidentform=React.lazy(()=>import('./views/accidentform/Accident'))
const medicalCheckUp=React.lazy(()=> import('./views/medicalCheckup/MedicalCheckUp'))
// const Appsidebar2 =React.lazy(()=> import('./components/AppSidebar2'))
const accesscontrolbody=React.lazy(()=>import('./views/accesscontrolbody/Accesscontrolbody'))
const upcomingmedical=React.lazy(()=>import('./views/upcomingmedical/Upcomingmedical'))
const employeeregisterreport=React.lazy(()=>import('./views/EmployeeRegisterReport/EmployeRegisterReport'))


const routes = [
  { path: '/', exact: true, name: 'Home',element: Dashboard  },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  {path: '/itemwisetools',name:'ItemWise Tool',element:Itemwisetool},
  {path:'/itemwiseppe',name:'ItemWise PPE',element:itemwiseppe},
  {path:'/itemwisedress',name:'ItemWise Dress',element:itemwisedress},
  {path:'/employeewisesearch',name:'EmployeeWise Serach',element:employeewiseserach},
  {path:'/aftersearchbody',name:'After Search',element:aftersearchbody},
  {path:'/organizationalreportbody',name:'Organizational Report',element:organizationalreportbody},
  { path:"/aftersearch", name:'After Search',element:AfterSearchBody},
  {path:"/upcoming15daysbody",name:'Upcoming 15 Days',element:upcoming15daysbody},
  {path:"/upcoming30daysbody",name:'Upcoming 30 Days',element:upcoming30daysbody},
  {path:"/upcoming45daysbody",name:'Upcoming 45 Days',element:upcoming45daysbody},
  {path:"/trainingdetails",name:'trainingdetails',element:trainingdetails},
  {path:"/trainerdetails",name:'trainerdetails',element:trainerdetails},
  {path:"/empregister",name:'Employee Register',element:empregister},
  {path:"/newissuance",name:'NewIssuance',element:newissuance},
  {path:"/safetytraining",name:'Safety Training',element:safetytraining},
  {path:"/safetytrainingsafety",name:'Safety Training Safety',element:safetytraining},
  {path:"/accidentform",name:'Accident Report',element:accidentform},
  {path:"/medicalCheckUp",name:'Medical Check Up',element:medicalCheckUp},
  // {path:'/appsidebar2',element:Appsidebar2},
  {path:'/accesscontrolbody',element:accesscontrolbody},
  {path:'/upcomingmedical',name:'Upcoming MedicalCheckup',element:upcomingmedical},
  {path:'/employeeregisterreport',name:'Employee Register Details',element:employeeregisterreport}
 
]

export default routes


