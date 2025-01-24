import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilMedicalCross,
  cilCalendar,
  cilNoteAdd,
  cilStar,
  cilFactory,
  cilGrid,
  cilUser,
  cilBuilding,
  cilBriefcase,
  cilUserPlus,
} from '@coreui/icons'
import HandymanIcon from '@mui/icons-material/Handyman';

import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'Access Control',
  //   to: '/accesscontrolbody',
  //   icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
  // },
  {
    component: CNavTitle,
    name: 'FORM SECTION',
  },
  {
    component: CNavItem,
    name: 'Employee Registration',
    to: '/empregister',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Safety Training',
    to: '/safetytrainingsafety',
    icon: <CIcon icon={cilGrid} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Accident Reporting',
    to: '/accidentform',
    icon: <CIcon icon={cilNoteAdd} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'New Issuance ',
    to: '/newissuance',
    icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Medical Check Up ',
    to: '/medicalCheckUp',
    icon: <CIcon icon={cilMedicalCross} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'REPORT SECTION',
  },
  {
    component: CNavGroup,
    name: 'Upcoming Issuance',
    to: '/base',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: '15 days',
        to: '/upcoming15daysbody',
      },
      {
        component: CNavItem,
        name: '30 days',
        to: '/upcoming30daysbody',
      },
      {
        component: CNavItem,
        name: '45 days',
        to: '/upcoming45daysbody',
      },
      // {
      //   component: CNavItem,
      //   name: 'Carousel',
      //   to: '/base/carousels',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Collapse',
      //   to: '/base/collapses',
      // },
      // {
      //   component: CNavItem,
      //   name: 'List group',
      //   to: '/base/list-groups',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Navs & Tabs',
      //   to: '/base/navs',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Pagination',
      //   to: '/base/paginations',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Placeholders',
      //   to: '/base/placeholders',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Popovers',
      //   to: '/base/popovers',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Progress',
      //   to: '/base/progress',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Spinners',
      //   to: '/base/spinners',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Tables',
      //   to: '/base/tables',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Tabs',
      //   to: '/base/tabs',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Tooltips',
      //   to: '/base/tooltips',
      // },
    ],
  },
 
  
  {
    component: CNavGroup,
    name: 'Reports',
    to: '/buttons',
    icon: <CIcon icon={cilNoteAdd} customClassName="nav-icon" />,
    items: [
      {
        component: CNavGroup,
        name: 'Item Wise',
        to: '/buttons/buttons',
        icon: <CIcon icon={cilFactory} customClassName="nav-icon" />,
        items:[
          {
              component: CNavItem,
              name: 'Tools',
              to: '/itemwisetools',
          },
          {
            component: CNavItem,
            name: 'PPE',
            to: '/itemwiseppe',
        },
        {
          component: CNavItem,
          name: 'Dress',
          to: '/itemwisedress',
      }
        ]
      },
      {
        component: CNavItem,
        name: 'Employee Wise',
        to: '/employeewisesearch',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
        
      },
      {
        component: CNavItem,
        name: 'Organization Wise',
        to: '/organizationalreportbody',
        icon: <CIcon icon={cilFactory} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Employee Details',
        to: '/employeeregisterreport',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
        
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Upcoming Checkup ',
    to: '/upcomingmedical',
    icon: <CIcon icon={cilMedicalCross} customClassName="nav-icon" />,
    
  },
  // {
  //   component: CNavItem,
  //   name: 'Trainer Details',
  //   to: '/trainerdetails',
  //   icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Emp Registration',
  //   to: '/empregister',
  //   icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Forms',
  //   icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Form Control',
  //       to: '/forms/form-control',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Select',
  //       to: '/forms/select',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Checks & Radios',
  //       to: '/forms/checks-radios',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Range',
  //       to: '/forms/range',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Input Group',
  //       to: '/forms/input-group',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Floating Labels',
  //       to: '/forms/floating-labels',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Layout',
  //       to: '/forms/layout',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Validation',
  //       to: '/forms/validation',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Charts',
  //   to: '/charts',
  //   icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Icons',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Free',
  //       to: '/icons/coreui-icons',
  //       badge: {
  //         color: 'success',
  //         text: 'NEW',
  //       },
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Flags',
  //       to: '/icons/flags',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Brands',
  //       to: '/icons/brands',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Notifications',
  //   icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Alerts',
  //       to: '/notifications/alerts',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Badges',
  //       to: '/notifications/badges',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Modal',
  //       to: '/notifications/modals',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Toasts',
  //       to: '/notifications/toasts',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Widgets',
  //   to: '/widgets',
  //   icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },
  // {
  //   component: CNavTitle,
  //   name: 'Extras',
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Pages',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Login',
  //       to: '/login',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Register',
  //       to: '/register',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 404',
  //       to: '/404',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 500',
  //       to: '/500',
  //     },
  //   ],
  // },
//   {
//     component: CNavItem,
//     name: 'Docs',
//     href: 'https://coreui.io/react/docs/templates/installation/',
//     icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
//   },
 ]

export default _nav