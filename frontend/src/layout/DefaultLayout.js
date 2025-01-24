
import React from 'react';
import { useLocation } from 'react-router-dom';
import { AppContent, AppSidebar, AppSidebar1,AppSidebar2, AppFooter, AppHeader } from '../components/index';
import { useSelector } from 'react-redux';
import {isUserAuthenticated, logout} from "src/auth";

const DefaultLayout = () => {

  if(! isUserAuthenticated()){
    logout();
  }
  const location = useLocation();
  const userRole = useSelector((state) => state.role);
  console.log('Current user role:', userRole);
  // Define the paths common for both admin and operator
  const commonPaths = [
    '/safetytraining',
    '/accidentform',
    '/newissuance',
    '/medicalcheckup'
  ];

  // Define the paths specific to admin
  const adminPaths = [
    '/dashboard',
    '/itemwisetools',
    '/itemwiseppe',
    '/itemwisedress',
    '/employeewisesearch',
    '/aftersearch',
    '/organizationalreportbody',
    '/trainingdetails',
    '/trainerdetails',
    '/empregister',
    '/medicalcheckup',
    '/accesscontrol',
    '/upcomimgmedicalcheckup'
  ];

  // Determine if the current path is common
  const isCommonPath = commonPaths.some(path => location.pathname.includes(path));

  // Determine if the current path is admin specific
  const isAdminPath = adminPaths.some(path => location.pathname.includes(path));

  const isAdmin = userRole === 'Admin' ;
  const isOperator = userRole === 'Operator' ;
  // Render the appropriate sidebar
  return (
    <div>
      {isAdmin ? (
        <AppSidebar />
      ) :isOperator ? (
        <AppSidebar1 />
      ):(<AppSidebar2 />

      )}
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  );
}

export default DefaultLayout;
