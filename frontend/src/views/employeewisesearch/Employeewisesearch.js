
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@coreui/react';
import api from 'src/api';

const Employeewisesearch = () => {
  const navigate = useNavigate();
  const [employee_id, setEmployeeId] = useState('');
  const [employee_name, setEmployeeName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [errors, setErrors] = useState({});
  const whitelevel_id = useSelector((state) => state.userInfo.whitelevel_id); // Assuming you have userInfo in your redux state

  const fetchEmployeeName = async (employee_id) => {
    try {
      const response = await api.post('/employee/name/', {
        employee_id, whitelevel_id
      });
      if (response.data.employee_name) {
        setErrors((prevErrors) => ({ ...prevErrors, employee_id: '' }));
        return response.data.employee_name;
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, employee_id: 'Employee does not exist' }));
        return '';
      }
    } catch (error) {
      console.error('Error fetching employee name:', error);
      setErrors((prevErrors) => ({ ...prevErrors, employee_id: 'Error fetching employee name' }));
      return '';
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
      const name = await fetchEmployeeName(value);
      setEmployeeName(name);
    } else {
      setEmployeeName('');
    }
  };

  const handleEmployeeNameChange = async (event) => {
    const value = event.target.value;
    setEmployeeName(value);

    if (/^[a-zA-Z\s.]*$/.test(value)) {
      setErrors((prevErrors) => ({ ...prevErrors, employee_name: '' }));
      if (value.trim() !== '') {
        const suggestions = await fetchEmployeeSuggestions(value);
        console.log('Fetched suggestions:', suggestions); // Log suggestions here
        setSuggestions(suggestions);
      } else {
        setSuggestions([]);
      }
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, employee_name: 'Only letters and spaces and dots are allowed' }));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setEmployeeName(suggestion.employee_name);
    setEmployeeId(suggestion.employee_id);
    setSuggestions([]);
  };

  const handleSearch = () => {
    let validationErrors = {};
    if (!employee_id) validationErrors.employee_id = 'Employee code is required';
    if (!employee_name) validationErrors.employee_name = 'Employee name is required';
    if (employee_name === '') validationErrors.employee_id = 'Employee does not exist';
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      navigate('/aftersearch?employeeid=' + employee_id);
    }
  };

  return (
    <CRow className="justify-content-center" style={{ display: 'flex', justifyContent: 'center', height: '70%' }}>
      <CCol xs={9}>
        <CCard className="mb-4">
          <CCardBody>
            <CFormFloating className="mb-3">
              <CFormInput
                type="text"
                id="floatingInput"
                // placeholder="Enter Code"
                value={employee_id}
                onChange={handleEmployeeIdChange}
                style={{ borderColor: errors.employee_id ? 'red' : undefined }}
              />
              <CFormLabel htmlFor="floatingInput">Enter Employee Code</CFormLabel>
              {errors.employee_id && <div className="text-danger">{errors.employee_id}</div>}
            </CFormFloating>
            <CFormFloating className="mb-3" style={{ position: 'relative' }}>
              <CFormInput
                type="text"
                id="floatingName"
                // placeholder="Enter Name"
                value={employee_name}
                onChange={handleEmployeeNameChange}
                style={{ borderColor: errors.employee_name ? 'red' : undefined }}
              />
              <CFormLabel htmlFor="floatingName">Enter Your Name</CFormLabel>
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
                    maxHeight: '200px',
                    overflowY: 'auto',
                    color: 'blue',
                  }}
                >
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      style={{
                        padding: '8px',
                        cursor: 'pointer',
                        borderBottom: index !== suggestions.length - 1 ? '1px solid #ccc' : 'none',
                        backgroundColor: '#f8f9fa',
                        hover: { backgroundColor: '#e9ecef' },
                      }}
                    >
                      {suggestion.employee_name}
                    </div>
                  ))}
                </div>
              )}
            </CFormFloating>
            <div style={{ textAlign: 'center' }}>
              <CButton   onClick={handleSearch} style={{backgroundColor: '#1976d2',color:'#fff'}} >Search</CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Employeewisesearch;
