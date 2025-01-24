// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Box } from '@mui/material';
// import {
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CFormInput,
//   CFormLabel,
//   CFormFloating,
//   CButton,
//   CRow,
//   CFormSelect,
//   CSpinner,
// } from '@coreui/react';
// import { API_BASE_URI } from 'src/constants/api';
// import api from "src/api";
// import { jwtDecode } from "jwt-decode";
// import { getToken } from "src/auth";
// import { useSelector } from 'react-redux';

// const EmployeeRegister = () => {
//   const navigate = useNavigate();
//   const userInfo = useSelector((state) => state.userInfo);

//   // State variables for form fields and their validation
//   const [whitelevel_id, setWhiteLevelId] = useState(userInfo.whitelevel_id);
//   const [employee_id, setEmployeeId] = useState('');
//   const [employee_name, setEmployeeName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phonenumber, setPhoneNumber] = useState('');
//   const [address, setAddress] = useState('');
//   const [role, setRole] = useState('1');

//   // State variables for field validation errors
//   const [whiteLevelIdError, setWhiteLevelIdError] = useState('');
//   const [employeeIdError, setEmployeeIdError] = useState('');
//   const [employeeNameError, setEmployeeNameError] = useState('');
//   const [emailError, setEmailError] = useState('');
//   const [phoneNumberError, setPhoneNumberError] = useState('');
//   const [addressError, setAddressError] = useState('');

//   // State variable for loading
//   const [loading, setLoading] = useState(false);

//   // Regular expressions for validation
//   const employeeIdPattern = /^[A-Za-z0-9_]{1,15}$/;
//   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   const phonePattern = /^[0-9]{10}$/;
//   const addressPattern = /^[A-Za-z0-9\, -]{10,}$/;
//   const namePattern = /^[a-zA-Z\s.]+$/;

//   // Event handlers for input changes
//   const handleWhiteLevelIdChange = (e) => {
//     setWhiteLevelId(e.target.value);
//   };

//   const handleEmployeeIdChange = (e) => {
//     setEmployeeId(e.target.value);
//   };

//   const handleEmployeeNameChange = (e) => {
//     setEmployeeName(e.target.value);
//   };

//   const handleEmailChange = (e) => {
//     setEmail(e.target.value);
//   };

//   const handlePhoneNumberChange = (e) => {
//     setPhoneNumber(e.target.value);
//   };

//   const handleAddressChange = (e) => {
//     setAddress(e.target.value);
//   };

//   const handleRoleChange = (e) => {
//     setRole(e.target.value);
//   };

//   // Validation functions
//   const validateWhiteLevelId = () => {
//     return true;
//   };

//   const validateEmployeeId = () => {
//     if (!employee_id) {
//       setEmployeeIdError('Employee ID is required');
//       return false;
//     } else if (!employeeIdPattern.test(employee_id)) {
//       setEmployeeIdError('Employee ID can only contain alphanumeric characters and underscores,dot with a maximum of 15 characters');
//       return false;
//     }
//     setEmployeeIdError('');
//     return true;
//   };
  

//   const validateEmployeeName = () => {
//     if (!employee_name) {
//       setEmployeeNameError('Employee Name is required');
//       return false;
//     } else if (!namePattern.test(employee_name)) {
//       setEmployeeNameError('Employee Name can only contain letters,dot and spaces');
//       return false;
//     }
//     setEmployeeNameError('');
//     return true;
//   };

//   const validateEmail = () => {
//     if (email && !emailPattern.test(email)) {
//       setEmailError('Enter a valid email address');
//       return false;
//     }
//     setEmailError('');
//     return true;
//   };

//   const validatePhoneNumber = () => {
//     if (!phonenumber) {
//       setPhoneNumberError('Phone Number is required');
//       return false;
//     } else if (!phonePattern.test(phonenumber)) {
//       setPhoneNumberError('Enter a valid 10-digit phone number');
//       return false;
//     }
//     setPhoneNumberError('');
//     return true;
//   };

//   const validateAddress = () => {
//     if (address && !addressPattern.test(address)) {
//       setAddressError('Enter a valid address (at least 10 characters, numbers, commas,back  slash and hyphens are allowed)');
//       return false;
//     }
//     setAddressError('');
//     return true;
//   };

  


//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default form submission behavior
  
//     const isWhiteLevelIdValid = validateWhiteLevelId();
//     const isEmployeeIdValid = validateEmployeeId();
//     const isEmployeeNameValid = validateEmployeeName();
//     const isEmailValid = validateEmail();
//     const isPhoneNumberValid = validatePhoneNumber();
//     const isAddressValid = validateAddress();
  
//     if (
//       isWhiteLevelIdValid &&
//       isEmployeeIdValid &&
//       isEmployeeNameValid &&
//       isEmailValid &&
//       isPhoneNumberValid &&
//       isAddressValid
//     ) {
//       setLoading(true); // Show loader
  
//       const formData = {
//         employee_id,
//         employee_name,
//         email,
//         phonenumber,
//         address,
//         whitelevel_id,
//         role,
//       };
  
//       console.log('formData:', formData);
  
//       try {
//         const response = await api.post('/employee/register/', formData);
//         console.log(response.data);
//         alert('Registration successful!');
  
//         // Reset form fields after successful submission
//         setWhiteLevelId(userInfo.whitelevel_id);
//         setEmployeeId('');
//         setEmployeeName('');
//         setEmail('');
//         setPhoneNumber('');
//         setAddress('');
//         setRole('1');
//       } catch (error) {
//         if (error.isAxiosError && error.response) {
//           const errorData = error.response.data; // Get the error response data
  
//           // Check for the unique constraint violation
//           if (
//             errorData.non_field_errors &&
//             errorData.non_field_errors[0].includes('employee_id, whitelevel_id must make a unique set')
//           ) {
//             alert('Error: Employee already exists.');
//           } else if (errorData.employee_id) {
//             alert(`Error: Employee ID "${employee_id}" already exists.`);
//           } else {
//             alert(`Error: ${JSON.stringify(errorData)}`);
//           }
//         } else if (error.name === 'TypeError') {
//           console.error('Network error: Please check if the server is running and accessible.');
//           alert('Network error: Please check if the server is running and accessible.');
//         } else {
//           console.error('Error fetching data:', error);
//           alert(`Error fetching data: ${error.message}`);
//         }
//       } finally {
//         setLoading(false); // Hide loader
//       }
//     }
//   };
  
//   return (
//     <form onSubmit={handleSubmit}>
//       <CRow className="justify-content-center">
//         <CCol>
//           <CCard className="mb-4"
//            style={{
//             backgroundColor: '',
            
           
//           }}
//            >
//             <CCardHeader>
//               <strong>Employee Registration Form</strong>
//             </CCardHeader>
//             <CCardBody>
//               <CFormFloating className="mb-3">
//                 <CFormSelect
//                   id="whiteLevelId"
//                   value={whitelevel_id}
//                   onChange={handleWhiteLevelIdChange}
//                   onBlur={validateWhiteLevelId}
//                   invalid={!!whiteLevelIdError}
//                   style={{display:'none'}}
//                 >
//                   <option value={userInfo.whitelevel_id}>{userInfo.whitelevel_id}</option>
//                 </CFormSelect>
//                 <CFormLabel htmlFor="whiteLevelId" style={{display:'none'}}>Company Registration Number</CFormLabel>
//                 <div className="invalid-feedback">{whiteLevelIdError}</div>
//               </CFormFloating>
//               <CFormFloating className="mb-3">
//                 <CFormInput
//                   type="text"
//                   id="employeeId"
//                   placeholder="Enter Employee Id "
//                   value={employee_id}
//                   onChange={handleEmployeeIdChange}
//                   onBlur={validateEmployeeId}
//                   invalid={!!employeeIdError}
                  
//                 />
//                 <CFormLabel htmlFor="employeeId"  >Enter Employee Id *</CFormLabel>
//                 <div className="invalid-feedback">{employeeIdError}</div>
//               </CFormFloating>
//               <CFormFloating className="mb-3">
//                 <CFormInput
//                   type="text"
//                   id="employeeName"
//                   placeholder="Enter Employee Name"
//                   value={employee_name}
//                   onChange={handleEmployeeNameChange}
//                   onBlur={validateEmployeeName}
//                   invalid={!!employeeNameError}
                  
//                 />
//                 <CFormLabel htmlFor="employeeName">Enter Employee Name *</CFormLabel>
//                 <div className="invalid-feedback">{employeeNameError}</div>
//               </CFormFloating>
//               <CFormFloating className="mb-3">
//                 <CFormInput
//                   type="text"
//                   id="employeeEmail"
//                   placeholder="Enter Employee Email"
//                   value={email}
//                   onChange={handleEmailChange}
//                   onBlur={validateEmail}
//                   invalid={!!emailError}
//                 />
//                 <CFormLabel htmlFor="employeeEmail">Enter Employee Email </CFormLabel>
//                 <div className="invalid-feedback">{emailError}</div>
//               </CFormFloating>
//               <CFormFloating className="mb-3">
//                 <CFormInput
//                   type="text"
//                   id="phoneNumber"
//                   placeholder="Enter Phone Number"
//                   value={phonenumber}
//                   onChange={handlePhoneNumberChange}
//                   onBlur={validatePhoneNumber}
//                   invalid={!!phoneNumberError}
//                 />
//                 <CFormLabel htmlFor="phoneNumber">Enter Phone Number *</CFormLabel>
//                 <div className="invalid-feedback">{phoneNumberError}</div>
//               </CFormFloating>
//               <CFormFloating className="mb-3">
//                 <CFormInput
//                   type="text"
//                   id="address"
//                   placeholder="Enter Address"
//                   value={address}
//                   onChange={handleAddressChange}
//                   onBlur={validateAddress}
//                   invalid={!!addressError}
//                 />
//                 <CFormLabel htmlFor="address">Enter Address </CFormLabel>
//                 <div className="invalid-feedback">{addressError}</div>
//               </CFormFloating>
//               <CFormFloating className="mb-3">
//                 <CFormSelect
//                   id="role"
//                   value={role}
//                   onChange={handleRoleChange}
//                 >
//                   <option value="1">Employee</option>
//                   <option value="2">Supervisor</option>
//                   <option value="3">Office Staff</option>
//                 </CFormSelect>
//                 <CFormLabel htmlFor="role">Role *</CFormLabel>
//               </CFormFloating>
//               <Box display="flex" justifyContent="center" alignItems="center">
//                 <CButton  type="submit" disabled={loading} style={{backgroundColor: '#1976d2',color:'#fff'}} >
//                   {loading ? (
//                     <>
//                       <CSpinner size="sm" />
//                       &nbsp;Submitting...
//                     </>
//                   ) : (
//                     'Submit'
//                   )}
//                 </CButton>
//               </Box>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
//     </form>
//   );
// };

// export default EmployeeRegister;

// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Box } from '@mui/material';
// import {
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CFormInput,
//   CFormLabel,
//   CFormFloating,
//   CButton,
//   CRow,
//   CFormSelect,
//   CSpinner,
// } from '@coreui/react';
// import api from "src/api";
// import { useSelector } from 'react-redux';

// const EmployeeRegister = () => {
//   const navigate = useNavigate();
//   const { employeeIdParam } = useParams(); // Get employee ID from URL
//   const userInfo = useSelector((state) => state.userInfo);

//   // State variables
//   const [whitelevel_id, setWhiteLevelId] = useState(userInfo.whitelevel_id);
//   const [employee_id, setEmployeeId] = useState('');
//   const [employee_name, setEmployeeName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phonenumber, setPhoneNumber] = useState('');
//   const [address, setAddress] = useState('');
//   const [role, setRole] = useState('1');
//   const [loading, setLoading] = useState(false);
//   const [isUpdateMode, setIsUpdateMode] = useState(false);

//   useEffect(() => {
//     if (employee_id) {
//       setIsUpdateMode(true);
//       setEmployeeId(employee_id);
//       fetchEmployeeDetails(employee_id);  // Call fetchEmployeeDetails with employeeId from URL
//     }
//   }, [employee_id]);

//   const fetchEmployeeDetails = async (id) => {
//     console.log('Attempting to fetch details for ID:', id);  // Debugging log
//     setLoading(true);
//     try {
//       const response = await api.post('/employee/employee_details/', {
//         employee_id, whitelevel_id
//       });
//       console.log('API Response:', response);  // Log the API response
//       const data = response.data;
//       setEmployeeId(data.employee_id);
//       setEmployeeName(data.employee_name);
//       setEmail(data.email || '');
//       setPhoneNumber(data.phonenumber || '');
//       setAddress(data.address || '');
//       setRole(data.role || '1');
//     } catch (error) {
//       console.error('Error fetching employee details:', error);
//       alert('Failed to fetch employee details.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setEmployeeId("");
//     setEmployeeName("");
//     setEmail("");
//     setPhoneNumber("");
//     setAddress("");
//     setIsUpdateMode(false);
//   };

//   const handleCreateNew = () => {
//     resetForm();
//   };

//   const handleEdit = (employee) => {
//     setIsUpdateMode(true);
//     setEmployeeId(employee.employee_id);
//     setEmployeeName(employee.employee_name);
//     setEmail(employee.email);
//     setPhoneNumber(employee.phonenumber);
//     setAddress(employee.address);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       if (isUpdateMode) {
//         // Update employee details
//         const response = await api.put("/employee/employee_details/", {
//           employee_id: employee_id,
//           employee_name: employee_name,
//           email,
//           whitelevel_id,
//           phonenumber: phonenumber,
//           address,
//         });
//         console.log("Update Response:", response.data);
//         alert("Employee details updated successfully!");
//       } else {
//         // Create new employee
//         const formData = {
//           employee_id: employee_id,
//           employee_name: employee_name,
//           email,
//           phonenumber: phonenumber,
//           address,
//           whitelevel_id,
//         };
//         const response = await api.post("/employee/register/", formData);
//         console.log("Create Response:", response.data);
//         alert("Employee registered successfully!");
//       }
//       handleCreateNew(); // Reset form after successful operation
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert("Error occurred while saving the data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <CRow className="justify-content-center">
//         <CCol>
//           <CCard className="mb-4">
//             <CCardHeader>
//               <strong>{isUpdateMode ? 'Update' : 'Register'} Employee</strong>
//             </CCardHeader>
//             <CCardBody>
//               <CFormFloating className="mb-3">
//                 <CFormInput
//                   type="text"
//                   id="employeeId"
//                   placeholder="Enter Employee ID"
//                   value={employee_id}
//                   onChange={(e) => setEmployeeId(e.target.value)}
//                   disabled={isUpdateMode} // Disable in update mode
//                 />
//                 <CFormLabel htmlFor="employeeId">Employee ID *</CFormLabel>
//               </CFormFloating>
//               <CFormFloating className="mb-3">
//                 <CFormInput
//                   type="text"
//                   id="employeeName"
//                   placeholder="Enter Employee Name"
//                   value={employee_name}
//                   onChange={(e) => setEmployeeName(e.target.value)}
//                 />
//                 <CFormLabel htmlFor="employeeName">Employee Name *</CFormLabel>
//               </CFormFloating>
//               <CFormFloating className="mb-3">
//                 <CFormInput
//                   type="text"
//                   id="employeeEmail"
//                   placeholder="Enter Email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <CFormLabel htmlFor="employeeEmail">Email</CFormLabel>
//               </CFormFloating>
//               <CFormFloating className="mb-3">
//                 <CFormInput
//                   type="text"
//                   id="phoneNumber"
//                   placeholder="Enter Phone Number"
//                   value={phonenumber}
//                   onChange={(e) => setPhoneNumber(e.target.value)}
//                 />
//                 <CFormLabel htmlFor="phoneNumber">Phone Number *</CFormLabel>
//               </CFormFloating>
//               <CFormFloating className="mb-3">
//                 <CFormInput
//                   type="text"
//                   id="address"
//                   placeholder="Enter Address"
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                 />
//                 <CFormLabel htmlFor="address">Address</CFormLabel>
//               </CFormFloating>
//               <CFormFloating className="mb-3">
//                 <CFormSelect
//                   id="role"
//                   value={role}
//                   onChange={(e) => setRole(e.target.value)}
//                 >
//                   <option value="1">Employee</option>
//                   <option value="2">Supervisor</option>
//                   <option value="3">Office Staff</option>
//                 </CFormSelect>
//                 <CFormLabel htmlFor="role">Role *</CFormLabel>
//               </CFormFloating>
//               <Box display="flex" justifyContent="center" alignItems="center" gap="10px" mt={2}>
//         {/* Submit/Update Button */}
//         <CButton
//           type="submit"
//           disabled={loading}
//           style={{
//             backgroundColor: isUpdateMode ? "#ffa000" : "#1976d2",
//             color: "white",
//             padding: "10px 20px",
//           }}
//         >
//           {loading ? <CSpinner size="sm" /> : isUpdateMode ? "Update" : "Submit"}
//         </CButton>

//         {/* Cancel Button (Visible in Update Mode) */}
//         {isUpdateMode && (
//           <CButton
//             type="button"
//             style={{
//               backgroundColor: "#d32f2f",
//               color: "white",
//               padding: "10px 20px",
//             }}
//             onClick={resetForm}
//           >
//             Cancel
//           </CButton>
//         )}
//       </Box>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
//     </form>
//   );
// };

// export default EmployeeRegister;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CFormFloating,
  CButton,
  CRow,
  CFormSelect,
  CSpinner,
} from '@coreui/react';
import api from "src/api";
import { useSelector } from 'react-redux';

const EmployeeRegister = () => {
  const navigate = useNavigate();
  const { employeeIdParam } = useParams(); // Get employee ID from URL
  const userInfo = useSelector((state) => state.userInfo);

  // State variables
  const [whitelevel_id, setWhiteLevelId] = useState(userInfo.whitelevel_id);
  const [employee_id, setEmployeeId] = useState('');
  const [employee_name, setEmployeeName] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('1');
  const [loading, setLoading] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

    // State variables for field validation errors
    const [whiteLevelIdError, setWhiteLevelIdError] = useState('');
    const [employeeIdError, setEmployeeIdError] = useState('');
    const [employeeNameError, setEmployeeNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [addressError, setAddressError] = useState('');
  
    // State variable for loading
    // const [loading, setLoading] = useState(false);
  
    // Regular expressions for validation
    const employeeIdPattern = /^[A-Za-z0-9_]{1,15}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;
    const addressPattern = /^[A-Za-z0-9\, -]{10,}$/;
    const namePattern = /^[a-zA-Z\s.]+$/;
  
    // Event handlers for input changes
    const handleWhiteLevelIdChange = (e) => {
      setWhiteLevelId(e.target.value);
    };
  
    const handleEmployeeIdChange = (e) => {
      setEmployeeId(e.target.value);
    };
  
    const handleEmployeeNameChange = (e) => {
      setEmployeeName(e.target.value);
    };
  
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
  
    const handlePhoneNumberChange = (e) => {
      setPhoneNumber(e.target.value);
    };
  
    const handleAddressChange = (e) => {
      setAddress(e.target.value);
    };
  
    const handleRoleChange = (e) => {
      setRole(e.target.value);
    };
  
    // Validation functions
    const validateWhiteLevelId = () => {
      return true;
    };
  
    const validateEmployeeId = () => {
      if (!employee_id) {
        setEmployeeIdError('Employee ID is required');
        return false;
      } else if (!employeeIdPattern.test(employee_id)) {
        setEmployeeIdError('Employee ID can only contain alphanumeric characters and underscores,dot with a maximum of 15 characters');
        return false;
      }
      setEmployeeIdError('');
      return true;
    };
    
  
    const validateEmployeeName = () => {
      if (!employee_name) {
        setEmployeeNameError('Employee Name is required');
        return false;
      } else if (!namePattern.test(employee_name)) {
        setEmployeeNameError('Employee Name can only contain letters,dot and spaces');
        return false;
      }
      setEmployeeNameError('');
      return true;
    };
  
    const validateEmail = () => {
      if (email && !emailPattern.test(email)) {
        setEmailError('Enter a valid email address');
        return false;
      }
      setEmailError('');
      return true;
    };
  
    const validatePhoneNumber = () => {
      // if (!phonenumber) {
      //   setPhoneNumberError('Phone Number is required');
      //   return false;
      // } else 
       if (phonenumber && !phonePattern.test(phonenumber)) {
        setPhoneNumberError('Enter a valid 10-digit phone number');
        return false;
      }
      setPhoneNumberError('');
      return true;
    };
  
    const validateAddress = () => {
      if (address && !addressPattern.test(address)) {
        setAddressError('Enter a valid address (at least 10 characters, numbers, commas,back  slash and hyphens are allowed)');
        return false;
      }
      setAddressError('');
      return true;
    };
  
  

  // Effect to check if we're in update mode and the employee ID exists
  useEffect(() => {
    if (employeeIdParam) {
      setEmployeeId(employeeIdParam);  // Set employee ID from URL
      fetchEmployeeDetails(employeeIdParam);  // Fetch employee details from API
    } else {
      setEmployeeId('');
      setIsUpdateMode(false);  // If no employee ID param, allow new registration
    }
  }, [employeeIdParam]);

  const fetchEmployeeDetails = async (id) => {
    setLoading(true);
    try {
      const response = await api.post('/employee/employee_details/', {
        employee_id: id, whitelevel_id
      });
      const data = response.data;

      if (data) {
        setEmployeeId(data.employee_id);
        setEmployeeName(data.employee_name);
        setEmail(data.email || '');
        setPhoneNumber(data.phonenumber || '');
        setAddress(data.address || '');
        setRole(data.role || '1');
        setIsUpdateMode(true);  // Switch to update mode if employee exists
      } else {
        // If employee doesn't exist, reset form
        alert('Employee not found. You can register a new employee.');
        setIsUpdateMode(false);
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
      alert('Employee Not Found Register a new employee');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmployeeId('');
    setEmployeeName('');
    setEmail('');
    setPhoneNumber('');
    setAddress('');
    setRole('1');
    setIsUpdateMode(false);
  };

  const handleCreateNew = () => {
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    const isWhiteLevelIdValid = validateWhiteLevelId();
    const isEmployeeIdValid = validateEmployeeId();
    const isEmployeeNameValid = validateEmployeeName();
    const isEmailValid = validateEmail();
    const isPhoneNumberValid = validatePhoneNumber();
    const isAddressValid = validateAddress();
  
    if (
      isWhiteLevelIdValid &&
      isEmployeeIdValid &&
      isEmployeeNameValid &&
      isEmailValid &&
      isPhoneNumberValid &&
      isAddressValid
    ) {
      setLoading(true); // Show loader
  
      const formData = {
        employee_id,
        employee_name,
        email,
        phonenumber,
        address,
        whitelevel_id,
        role,
      };
  
      console.log('formData:', formData);
    e.preventDefault();
    setLoading(true);
    try {
      if (isUpdateMode) {
        // Update employee details
        const response = await api.put("/employee/employee_details/", {
          employee_id: employee_id,
          employee_name: employee_name,
          email,
          whitelevel_id,
          phonenumber: phonenumber,
          address,
        });
        console.log("Update Response:", response.data);
        alert("Employee details updated successfully!");
      } else {
        // Create new employee
        // const formData = {
        //   employee_id: employee_id,
        //   employee_name: employee_name,
        //   email,
        //   phonenumber: phonenumber,
        //   address,
        //   whitelevel_id,
        // };
        const response = await api.post("/employee/register/", formData);
        console.log("Create Response:", response.data);
        alert("Employee registered successfully!");
      }
      handleCreateNew(); // Reset form after successful operation
    }catch (error) {
      if (error.isAxiosError && error.response) {
        const errorData = error.response.data; // Get the error response data

        // Check for the unique constraint violation
        if (
          errorData.non_field_errors &&
          errorData.non_field_errors[0].includes('employee_id, whitelevel_id must make a unique set')
        ) {
          alert('Error: Employee already exists.');
        } else if (errorData.employee_id) {
          alert(`Error: Employee ID "${employee_id}" already exists.`);
        } else {
          alert(`Error: ${JSON.stringify(errorData)}`);
        }
      } else if (error.name === 'TypeError') {
        console.error('Network error: Please check if the server is running and accessible.');
        alert('Network error: Please check if the server is running and accessible.');
      } else {
        console.error('Error fetching data:', error);
        alert(`Error fetching data: ${error.message}`);
      }
    } finally {
      setLoading(false); // Hide loader
    }
  }
};




  return (
    <form onSubmit={handleSubmit}>
      <CRow className="justify-content-center">
        <CCol>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{isUpdateMode ? 'Update' : 'Register'} Employee</strong>
            </CCardHeader>
            <CCardBody>
              <CFormFloating className="mb-3">
                <CFormInput
                  type="text"
                  id="employeeId"
                  placeholder="Enter Employee ID"
                  value={employee_id}
                  onChange={(e) => setEmployeeId(e.target.value)} // Update onChange handler
                  onBlur={() => {
                    if (employee_id) {
                      fetchEmployeeDetails(employee_id);  // Fetch details if employee ID is entered
                    }
                  }}
                  invalid={!!employeeIdError}
                />
                <CFormLabel htmlFor="employeeId">Employee ID *</CFormLabel>
              </CFormFloating>

              <CFormFloating className="mb-3">
                <CFormInput
                  type="text"
                  id="employeeName"
                  placeholder="Enter Employee Name"
                  value={employee_name}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  
                  onBlur={validateEmployeeName}
                  invalid={!!employeeNameError}
                />
               <CFormLabel htmlFor="employeeName">Enter Employee Name *</CFormLabel>
                <div className="invalid-feedback">{employeeNameError}</div>

              </CFormFloating>
              <CFormFloating className="mb-3">
                <CFormInput
                  type="text"
                  id="employeeEmail"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={validateEmail}
                  invalid={!!emailError}
                />
                <CFormLabel htmlFor="employeeEmail">Enter Employee Email </CFormLabel>
                <div className="invalid-feedback">{emailError}</div>

              </CFormFloating>
              <CFormFloating className="mb-3">
                <CFormInput
                  type="text"
                  id="phoneNumber"
                  placeholder="Enter Phone Number"
                  value={phonenumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onBlur={validatePhoneNumber}
                  invalid={!!phoneNumberError}

                />
                 <CFormLabel htmlFor="phoneNumber">Enter Phone Number </CFormLabel>
                 <div className="invalid-feedback">{phoneNumberError}</div>

              </CFormFloating>
              <CFormFloating className="mb-3">
                <CFormInput
                  type="text"
                  id="address"
                  placeholder="Enter Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onBlur={validateAddress}
                  invalid={!!addressError}

                />
                 <CFormLabel htmlFor="address">Enter Address </CFormLabel>
                <div className="invalid-feedback">{addressError}</div>

              </CFormFloating>
              <CFormFloating className="mb-3">
                <CFormSelect
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="1">Employee</option>
                  <option value="2">Supervisor</option>
                  <option value="3">Office Staff</option>
                </CFormSelect>
                <CFormLabel htmlFor="role">Role *</CFormLabel>
              </CFormFloating>
              <Box display="flex" justifyContent="center" alignItems="center" gap="10px" mt={2}>
                {/* Submit/Update Button */}
                <CButton
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: isUpdateMode ? "#ffa000" : "#1976d2",
                    color: "white",
                    padding: "10px 20px",
                  }}
                >
                  {loading ? <CSpinner size="sm" /> : isUpdateMode ? "Update" : "Submit"}
                </CButton>

                {/* Cancel Button (Visible in Update Mode) */}
                {isUpdateMode && (
                  <CButton
                    type="button"
                    style={{
                      backgroundColor: "#d32f2f",
                      color: "white",
                      padding: "10px 20px",
                    }}
                    onClick={resetForm}
                  >
                    Cancel
                  </CButton>
                )}
              </Box>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </form>
  );
};

export default EmployeeRegister;
