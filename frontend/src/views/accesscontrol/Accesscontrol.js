

// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import {
//   CCard,
//   CCardBody,
//   CCol,
//   CFormInput,
//   CFormLabel,
//   CFormFloating,
//   CButton,
//   CRow,
//   CFormSelect,
//   CModal,
//   CModalBody,
//   CModalFooter,
//   CModalHeader,
//   CModalTitle,
// } from '@coreui/react';
// import api from 'src/api';

// const Accesscontrol = () => {
//   const [employee_id, setEmployeeId] = useState('');
//   const [employee_name, setEmployeeName] = useState('');
//   const [accessControl, setAccessControl] = useState('admin');
//   const [dateField1, setDateField1] = useState('');
//   const [dateField2, setDateField2] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [errors, setErrors] = useState({});
//   const whitelevel_id = useSelector((state) => state.userInfo.whitelevel_id);

//   const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
//   const [phoneNumber, setPhoneNumber] = useState(''); // Phone number state
//   const [password, setPassword] = useState(''); // Password state

//   useEffect(() => {
//     // Set today's date for date fields
//     const today = new Date().toISOString().split('T')[0];
//     setDateField1(today);
//     setDateField2(today);
//   }, []);

//   const fetchEmployeeName = async (employee_id) => {
//     try {
//       const response = await api.post('/employee/name/', { employee_id, whitelevel_id });
//       const data = response.data || {};
      
//       if (data.employee_name) {
//         setEmployeeName(data.employee_name);
//         setErrors((prevErrors) => ({ ...prevErrors, employee_id: '' }));
//       } else {
//         setEmployeeName('');
//         setErrors((prevErrors) => ({ ...prevErrors, employee_id: 'Employee does not exist' }));
//       }
//     } catch (error) {
//       console.error('Error fetching employee name:', error);
//       setEmployeeName('');
//       setErrors((prevErrors) => ({ ...prevErrors, employee_id: ' Employee does not exist' }));
//     }
//   };

//   const fetchEmployeeSuggestions = async (nameQuery) => {
//     try {
//       const response = await api.get(`/employee/search/?nameQuery=${nameQuery}`);
//       return response.data || [];
//     } catch (error) {
//       console.error('Error fetching employee suggestions:', error);
//       return [];
//     }
//   };

//   const handleEmployeeIdChange = async (event) => {
//     const value = event.target.value;
//     setEmployeeId(value);

//     if (value.trim() !== '') {
//       await fetchEmployeeName(value);
//     } else {
//       setEmployeeName('');
//       setErrors((prevErrors) => ({ ...prevErrors, employee_id: '' }));
//     }
//   };

//   const handleEmployeeNameChange = async (event) => {
//     const value = event.target.value;
//     setEmployeeName(value);

//     if (/^[a-zA-Z\s]*$/.test(value)) {
//       setErrors((prevErrors) => ({ ...prevErrors, employee_name: '' }));
//       if (value.trim() !== '') {
//         const suggestions = await fetchEmployeeSuggestions(value);
//         setSuggestions(suggestions);
//       } else {
//         setSuggestions([]);
//       }
//     } else {
//       setErrors((prevErrors) => ({ ...prevErrors, employee_name: 'Only letters and spaces are allowed' }));
//     }
//   };

//   const handleSuggestionClick = (suggestion) => {
//     setEmployeeName(suggestion.employee_name);
//     setEmployeeId(suggestion.employee_id);
//     setSuggestions([]);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const newErrors = {};
  
//     if (employee_id.trim() === '') {
//       newErrors.employee_id = 'Employee ID is required';
//     }
  
//     if (employee_name.trim() === '') {
//       newErrors.employee_name = 'Employee Name is required';
//     }
  
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//     } else {
//       try {
//         // Replace '/submit-form' with your actual API endpoint
//         await api.post('/submit-form', {
//           employee_id,
//           employee_name,
//           accessControl,
//           dateField1,
//           dateField2,
//         });
  
//         // Reset form fields
//         setEmployeeId('');
//         setEmployeeName('');
//         setAccessControl('');
//         setDateField1(new Date().toISOString().split('T')[0]);
//         setDateField2(new Date().toISOString().split('T')[0]);
//         setErrors({});
//         setSuggestions([]);
  
//         console.log('Form submitted successfully');
//       } catch (error) {
//         console.error('Error submitting form:', error);
//         // Handle error
//       }
//     }
//   };

//   const handleOptionClick = () => {
//     setModalVisible(true); // Show the modal when an option is clicked
//   };

//   const handleModalOk = () => {
//     console.log('Phone Number:', phoneNumber);
//     console.log('Password:', password);
//     setModalVisible(false); // Close the modal when OK is clicked
//   };

//   return (
//     <>
//       <CRow className="justify-content-center" style={{ display: 'flex', justifyContent: 'center', height: '70%' }}>
//         <CCol xs={9}>
//           <CCard className="mb-4">
//             <CCardBody>
//               <form onSubmit={handleSubmit}>
//                 {/* Date Fields First */}
//                 <CFormFloating className="mb-3">
//                   <CFormInput
//                     type="date"
//                     id="floatingDate1"
//                     value={dateField1}
//                     onChange={(e) => setDateField1(e.target.value)}
//                   />
//                   <CFormLabel htmlFor="floatingDate1">Valid From*</CFormLabel>
//                 </CFormFloating>
//                 <CFormFloating className="mb-3">
//                   <CFormInput
//                     type="date"
//                     id="floatingDate2"
//                     value={dateField2}
//                     onChange={(e) => setDateField2(e.target.value)}
//                   />
//                   <CFormLabel htmlFor="floatingDate2">Valid To*</CFormLabel>
//                 </CFormFloating>

//                 {/* Employee Code Field */}
//                 <CFormFloating className="mb-3">
//                   <CFormInput
//                     type="text"
//                     id="floatingInput"
//                     placeholder="Enter Code"
//                     value={employee_id}
//                     onChange={handleEmployeeIdChange}
//                     style={{ borderColor: errors.employee_id ? 'red' : undefined }}
//                   />
//                   <CFormLabel htmlFor="floatingInput">Enter Employee Code*</CFormLabel>
//                   {errors.employee_id && <div className="text-danger">{errors.employee_id}</div>}
//                 </CFormFloating>

//                 {/* Employee Name Field */}
//                 <CFormFloating className="mb-3" style={{ position: 'relative' }}>
//                   <CFormInput
//                     type="text"
//                     id="floatingName"
//                     placeholder="Enter Name"
//                     value={employee_name}
//                     onChange={handleEmployeeNameChange}
//                     style={{ borderColor: errors.employee_name ? 'red' : undefined }}
//                   />
//                   <CFormLabel htmlFor="floatingName">Enter Employee Name*</CFormLabel>
//                   {errors.employee_name && <div className="text-danger">{errors.employee_name}</div>}
//                   {suggestions.length > 0 && (
//                     <div
//                       style={{
//                         display: 'block',
//                         position: 'absolute',
//                         zIndex: 1000,
//                         width: '100%',
//                         border: '1px solid #ccc',
//                         backgroundColor: '#fff',
//                         borderRadius: '0.25rem',
//                         boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
//                         maxHeight: '200px',
//                         overflowY: 'auto',
//                         color: 'blue'
//                       }}
//                     >
//                       {suggestions.map((suggestion, index) => (
//                         <div
//                           key={index}
//                           onClick={() => handleSuggestionClick(suggestion)}
//                           style={{
//                             padding: '8px',
//                             cursor: 'pointer',
//                             borderBottom: index !== suggestions.length - 1 ? '1px solid #ccc' : 'none',
//                             backgroundColor: '#f8f9fa',
//                           }}
//                         >
//                           {suggestion.employee_name}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </CFormFloating>

//                 {/* Access Control Select */}
//                 <CFormFloating className="mb-3">
//                   <CFormSelect
//                     id="floatingAccessControl"
//                     value={accessControl}
//                     onChange={(e) => {
//                       setAccessControl(e.target.value);
//                       handleOptionClick(); // Open the modal on option click
//                     }}
//                   >
                    
//                     <option value="admin">Admin</option>
//                     <option value="operator">Operator</option>
//                     <option value="viewer">Viewer</option>
                    
//                   </CFormSelect>
//                   <CFormLabel htmlFor="floatingAccessControl">Select Access Control*</CFormLabel>
//                 </CFormFloating>

//                 {/* Submit Button */}
//                 <div style={{ display: 'flex', justifyContent: 'center' }}>
//             <CButton type="submit"  style={{backgroundColor: '#1976d2',color:'#fff'}}>
//               Submit
//             </CButton>
//           </div>
//               </form>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>

//       {/* Modal for Phone Number and Password */}
//       <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
//         <CModalHeader onClose={() => setModalVisible(false)}>
//           <CModalTitle>Enter Phone Number and Password</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <CFormFloating className="mb-3">
//             <CFormInput
//               type="number"
//               id="phoneNumber"
//               placeholder="Phone Number"
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value)}
              
//             />
//             <CFormLabel htmlFor="phoneNumber">Phone Number*</CFormLabel>
//           </CFormFloating>
//           <CFormFloating className="mb-3">
//             <CFormInput
//               type="password"
//               id="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <CFormLabel htmlFor="password">Password*</CFormLabel>
//           </CFormFloating>
//         </CModalBody>
//         <CModalFooter>
//           <CButton style={{backgroundColor: '#1976d2',color:'#fff'}} onClick={handleModalOk}>
//             OK
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </>
//   );
// };

// export default Accesscontrol;




import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  CCard,
  CCardBody,
  CCol,
  CFormInput,
  CFormLabel,
  CFormFloating,
  CButton,
  CRow,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react';
import api from 'src/api';

const Accesscontrol = () => {
  const [employee_id, setEmployeeId] = useState('');
  const [employee_name, setEmployeeName] = useState('');
  const [accessControl, setAccessControl] = useState('');
  const [dateField1, setDateField1] = useState('');
  const [dateField2, setDateField2] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [errors, setErrors] = useState({});
  const whitelevel_id = useSelector((state) => state.userInfo.whitelevel_id);

  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [phoneNumber, setPhoneNumber] = useState(''); // Phone number state
  const [password, setPassword] = useState(''); // Password state

  useEffect(() => {
    // Set today's date for date fields
    const today = new Date().toISOString().split('T')[0];
    setDateField1(today);
    setDateField2(today);
  }, []);

  const fetchEmployeeName = async (employee_id) => {
    try {
      const response = await api.post('/employee/name/', { employee_id, whitelevel_id });
      const data = response.data || {};
      
      if (data.employee_name) {
        setEmployeeName(data.employee_name);
        setErrors((prevErrors) => ({ ...prevErrors, employee_id: '' }));
      } else {
        setEmployeeName('');
        setErrors((prevErrors) => ({ ...prevErrors, employee_id: 'Employee does not exist' }));
      }
    } catch (error) {
      console.error('Error fetching employee name:', error);
      setEmployeeName('');
      setErrors((prevErrors) => ({ ...prevErrors, employee_id: ' Employee does not exist' }));
    }
  };

  const fetchEmployeeSuggestions = async (nameQuery) => {
    try {
      const response = await api.get(`/employee/search/?nameQuery=${nameQuery}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching employee suggestions:', error);
      return [];
    }
  };

  const handleEmployeeIdChange = async (event) => {
    const value = event.target.value;
    setEmployeeId(value);

    if (value.trim() !== '') {
      await fetchEmployeeName(value);
    } else {
      setEmployeeName('');
      setErrors((prevErrors) => ({ ...prevErrors, employee_id: '' }));
    }
  };

  const handleEmployeeNameChange = async (event) => {
    const value = event.target.value;
    setEmployeeName(value);

    if (/^[a-zA-Z\s]*$/.test(value)) {
      setErrors((prevErrors) => ({ ...prevErrors, employee_name: '' }));
      if (value.trim() !== '') {
        const suggestions = await fetchEmployeeSuggestions(value);
        setSuggestions(suggestions);
      } else {
        setSuggestions([]);
      }
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, employee_name: 'Only letters and spaces are allowed' }));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setEmployeeName(suggestion.employee_name);
    setEmployeeId(suggestion.employee_id);
    setSuggestions([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};
  
    if (employee_id.trim() === '') {
      newErrors.employee_id = 'Employee ID is required';
    }
  
    if (employee_name.trim() === '') {
      newErrors.employee_name = 'Employee Name is required';
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        // Replace '/submit-form' with your actual API endpoint
        await api.post('/submit-form', {
          employee_id,
          employee_name,
          accessControl,
          dateField1,
          dateField2,
        });
  
        // Reset form fields
        setEmployeeId('');
        setEmployeeName('');
        setAccessControl('');
        setDateField1(new Date().toISOString().split('T')[0]);
        setDateField2(new Date().toISOString().split('T')[0]);
        setErrors({});
        setSuggestions([]);
  
        console.log('Form submitted successfully');
      } catch (error) {
        console.error('Error submitting form:', error);
        // Handle error
      }
    }
  };

  const handleOptionClick = () => {
    setModalVisible(true); // Show the modal when an option is clicked
  };

  const handleModalOk = () => {
    console.log('Phone Number:', phoneNumber);
    console.log('Password:', password);
    setModalVisible(false); // Close the modal when OK is clicked
  };

  return (
    <>
      <CRow className="justify-content-center" style={{ display: 'flex', justifyContent: 'center', height: '70%' }}>
        <CCol xs={9}>
          <CCard className="mb-4">
            <CCardBody>
              <form onSubmit={handleSubmit}>
                {/* Date Fields First */}
                <CFormFloating className="mb-3">
                  <CFormInput
                    type="date"
                    id="floatingDate1"
                    value={dateField1}
                    onChange={(e) => setDateField1(e.target.value)}
                  />
                  <CFormLabel htmlFor="floatingDate1">Valid From*</CFormLabel>
                </CFormFloating>
                <CFormFloating className="mb-3">
                  <CFormInput
                    type="date"
                    id="floatingDate2"
                    value={dateField2}
                    onChange={(e) => setDateField2(e.target.value)}
                  />
                  <CFormLabel htmlFor="floatingDate2">Valid To*</CFormLabel>
                </CFormFloating>

                {/* Employee Code Field */}
                <CFormFloating className="mb-3">
                  <CFormInput
                    type="text"
                    id="floatingInput"
                    placeholder="Enter Code"
                    value={employee_id}
                    onChange={handleEmployeeIdChange}
                    style={{ borderColor: errors.employee_id ? 'red' : undefined }}
                  />
                  <CFormLabel htmlFor="floatingInput">Enter Employee Code*</CFormLabel>
                  {errors.employee_id && <div className="text-danger">{errors.employee_id}</div>}
                </CFormFloating>

                {/* Employee Name Field */}
                <CFormFloating className="mb-3" style={{ position: 'relative' }}>
                  <CFormInput
                    type="text"
                    id="floatingName"
                    placeholder="Enter Name"
                    value={employee_name}
                    onChange={handleEmployeeNameChange}
                    style={{ borderColor: errors.employee_name ? 'red' : undefined }}
                  />
                  <CFormLabel htmlFor="floatingName">Enter Employee Name*</CFormLabel>
                  {errors.employee_name && <div className="text-danger">{errors.employee_name}</div>}
                  {suggestions.length > 0 && (
                    <div
                      style={{
                        display: 'block',
                        position: 'absolute',
                        zIndex: 1000,
                        width: '100%',
                        border: '1px solid #ccc',
                        backgroundColor: '#fff',
                        borderRadius: '0.25rem',
                        boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
                        maxHeight: '150px',
                        overflowY: 'auto',
                      }}
                    >
                      {suggestions.map((suggestion) => (
                        <div
                          key={suggestion.employee_id}
                          onClick={() => handleSuggestionClick(suggestion)}
                          style={{
                            padding: '0.5rem 1rem',
                            cursor: 'pointer',
                            borderBottom: '1px solid #ddd',
                          }}
                        >
                          {suggestion.employee_name} ({suggestion.employee_id})
                        </div>
                      ))}
                    </div>
                  )}
                </CFormFloating>

                {/* Access Control */}
                <CFormFloating className="mb-3">
                  <CFormSelect
                    id="floatingAccessControl"
                    value={accessControl}
                    onChange={(e) => {
                      setAccessControl(e.target.value);
                      handleOptionClick(); // Open the modal on option click
                    }}
                  >
                    <option value="">Role</option> {/* Placeholder option */}
                    <option value="admin">Admin</option>
                    <option value="operator">Operator</option>
                    <option value="viewer">Viewer</option>
                  </CFormSelect>
                  <CFormLabel htmlFor="floatingAccessControl">Select Access Control*</CFormLabel>
                </CFormFloating>

                {/* Submit Button */}
                <div className="text-center">
                  <CButton type="submit" style={{backgroundColor: '#1976d2',color:'#fff'}}>
                    Submit
                  </CButton>
                </div>
              </form>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modal */}
      <CModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Enter Phone Number and Password Here...</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormFloating className="mb-3">
            <CFormInput
              type="number"
              id="floatingPhoneNumber"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <CFormLabel htmlFor="floatingPhoneNumber">Phone Number</CFormLabel>
          </CFormFloating>
          <CFormFloating className="mb-3">
            <CFormInput
              type="password"
              id="floatingPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <CFormLabel htmlFor="floatingPassword">Password</CFormLabel>
          </CFormFloating>
        </CModalBody>
        <CModalFooter>
          
          <CButton style={{backgroundColor: '#1976d2',color:'#fff'}} onClick={handleModalOk}>
            OK
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Accesscontrol;
