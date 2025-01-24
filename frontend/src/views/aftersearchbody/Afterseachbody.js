// import React from "react";
// import { CContainer, CRow, CCol } from '@coreui/react';
// import Aftersearchdress from "../aftersearchdress/Aftersearchdress";
// import Aftersearchppe from "../aftersearchppe/Aftersearchppe";
// import Aftersearchtool from "../aftersearchtool/Aftersearchtool";
// import Toolboxtraining from "../toolboxtraining/Toolboxtraining";
// import Jobsafetytraining from "../jobsafetytraining/Jobsafetytraining";
// import Behavioraltraining from "../behavioraltraning/Behavioraltraining";
// import Othertraining from "../other/Otertraining";
// import Nearmissreport from "../nearmissreport/Nearmissreport";
// import Accidentreport from "../accidentreport/Accidentreport";
// import Aftersearchviolation from "../aftersearchaviolation/AftersearchViolation";
// import Aftersearchaccident from "../aftersearchaccident/AftersearchAccident";
// import { useSearchParams } from 'react-router-dom';

// //import { AppHeader, AppSidebar } from "../../components";

// export default function Aftersearchbody() {
//   const [searchParams] = useSearchParams();
//   const employee_id = searchParams.get('employeeid');

//   return (
//     <>
//       <CRow>
//         <CCol className="text-center">
//           <h2>ITEM-DETAILS</h2>
//         </CCol>
//       </CRow>
//       <Aftersearchtool employee_id={employee_id} />
//       <Aftersearchppe employee_id={employee_id}/>
//       <Aftersearchdress employee_id={employee_id} />
//       <hr />
//       <CRow>
//         <CCol className="text-center">
//           <h2>Safety Training Details</h2>
//         </CCol>
//       </CRow>
//       <Toolboxtraining employee_id={employee_id}/>
//       <Jobsafetytraining  employee_id={employee_id}/>
//       <Behavioraltraining employee_id={employee_id}/>
//       <Othertraining employee_id={employee_id} />
//       <hr />
//       <CRow>
//         <CCol className="text-center">
//           <h2>Nearmiss Report</h2>
//         </CCol>
//       </CRow>
//       <Nearmissreport  employee_id={employee_id}/>
//       <hr />
//       <CRow>
//         <CCol className="text-center">
//           <h2>Accident Report</h2>
//         </CCol>
//       </CRow>
//       <Aftersearchaccident employee_id={employee_id}/>
//       <hr />
//       <CRow>
//         <CCol className="text-center">
//           <h2>Violation Report</h2>
//         </CCol>
//       </CRow>
//       <Aftersearchviolation  employee_id={employee_id}/>
//     </>
//   );
// }



import React from "react";
import { CContainer, CRow, CCol, CButton } from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilArrowLeft } from '@coreui/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Aftersearchdress from "../aftersearchdress/Aftersearchdress";
import Aftersearchppe from "../aftersearchppe/Aftersearchppe";
import Aftersearchtool from "../aftersearchtool/Aftersearchtool";
import Toolboxtraining from "../toolboxtraining/Toolboxtraining";
import Jobsafetytraining from "../jobsafetytraining/Jobsafetytraining";
import Behavioraltraining from "../behavioraltraning/Behavioraltraining";
import Othertraining from "../other/Otertraining";
import Nearmissreport from "../nearmissreport/Nearmissreport";
import Accidentreport from "../accidentreport/Accidentreport";
import Aftersearchviolation from "../aftersearchaviolation/AftersearchViolation";
import Aftersearchaccident from "../aftersearchaccident/Aftersearchaccident";
import Aftersearchcheckup from "../aftersearchcheckup/Aftersearchcheckup";

export default function Aftersearchbody() {
  const [searchParams] = useSearchParams();
  const employee_id = searchParams.get('employeeid');
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <>
      <CRow className="align-items-center">
        <CCol xs="auto">
          <CButton color="link" onClick={handleBackClick}>
            <CIcon icon={cilArrowLeft} size="xl"/>
          </CButton>
        </CCol>
        <CCol className="text-center">
          <h2 style={{color:'whitesmoke'}}>ITEM-DETAILS</h2>
        </CCol>
        <CCol xs="auto" className="text-end">
          <h5 style={{ color: 'white', fontWeight: 'bold', margin: 0, fontSize: '1.25rem' }}>
            Employee_Id {employee_id}</h5> {/* Displaying the welcome message with employee_id */}
        </CCol>
      </CRow>
      <Aftersearchtool employee_id={employee_id} />
      <Aftersearchppe employee_id={employee_id}/>
      <Aftersearchdress employee_id={employee_id} />
      <hr />
      <CRow>
        <CCol className="text-center">
          <h2 style={{color:'whitesmoke'}}>Safety Training Details</h2>
        </CCol>
      </CRow>
      <Toolboxtraining employee_id={employee_id}/>
      <Jobsafetytraining  employee_id={employee_id}/>
      <Behavioraltraining employee_id={employee_id}/>
      <Othertraining employee_id={employee_id} />
      <hr />
      <CRow>
        <CCol className="text-center">
          <h2 style={{color:'whitesmoke'}}>Nearmiss Report</h2>
        </CCol>
      </CRow>
      <Nearmissreport  employee_id={employee_id}/>
      <hr />
      <CRow>
        <CCol className="text-center">
          <h2 style={{color:'whitesmoke'}}>Accident Report</h2>
        </CCol>
      </CRow>
      <Aftersearchaccident employee_id={employee_id}/>
      <hr />
      <CRow>
        <CCol className="text-center">
          <h2 style={{color:'whitesmoke'}}>Violation Report</h2>
        </CCol>
      </CRow>
      <Aftersearchviolation  employee_id={employee_id}/>
      <CRow>
        <CCol className="text-center">
          <h2 style={{color:'whitesmoke'}}>Medical Checkup Report</h2>
        </CCol>
      </CRow>
      <Aftersearchcheckup employee_id={employee_id}/>
    </>
  );
}
