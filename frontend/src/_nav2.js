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
  cilStar,
  cilBriefcase,
  cilNoteAdd,
  cilUser,
  cilFactory,
  cilMedicalCross,
  cilCalendar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav2 = [
  // {
  //   component: CNavItem,
  //   name: 'CSMS',
  //   to: '/dashboard',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },
 
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
        icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" />,
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
    ],
  },
 
  {
    component: CNavItem,
    name: 'Upcoming Checkup ',
    to: '/upcomingmedical',
    icon: <CIcon icon={cilMedicalCross} customClassName="nav-icon" />,
    
  },

 ]

export default _nav2