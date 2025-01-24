import React, { useState ,useEffect} from 'react';
import {
  Container,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Backdrop,
  Checkbox 
} from '@mui/material';
import Imagecompression from '../imagecompression/Imagecompression';
// import Training1 from '../training1/Training1';
import Training2 from '../training1/Training2';
import api from "src/api";
import {useSelector} from "react-redux";
import Training from '../training1/Training4';

const Accident = () => {
  const userInfo = useSelector((state) => state.userInfo)
  const [whitelevel, setWhitelevel] = useState(userInfo.whitelevel_id);
  const [accident_type, setAccidentType] = useState('');
  const [toolbox_train, setToolboxTrain] = useState('false');
  const [toolbox_reference_number, setToolboxReferenceNumber] = useState('');
  const [accident_report_date, setAccidentReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [accident_id, setAccidentId] = useState('');
  const [severity, setSeverity] = useState('');
  const [permit_status, setPermitStatus] = useState('');
  const [ppe_status, setPpeStatus] = useState('');
  const [supervisors, setSupervisors] = useState([]);
  const [workmen, setWorkmen] = useState([]);
  const [reported_by, setReportedBy] = useState([]);
  const [about_the_accident, setAboutTheAccident] = useState('');
  const [compressedImageBase64, setCompressedImageBase64] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [accidentData, setAccidentData] = useState(null);
  const [state, setState] = useState({
    option1: false,
  });

  const [errors, setErrors] = useState({
     accident_report_date: '',
     accident_id: ''
  });

  const handleReport = (e) => {
    setAboutTheAccident(e.target.value);
  };

  
  const handleChange = async (event) => {
    const { name, checked } = event.target;
  
    // Update checkbox state
    // setState({
    //   ...state,
    //   [name]: checked,
    // });
  
    if (!accident_id) return;
  
    // if (!checked) {
    //   // If checkbox is unchecked, reset accident data
    //   resetForm();
    //   return;
    // }
  
    setIsLoading(true);
    try {
      const response = await api.post("/accident/accident-detail-get/", {
        accident_id: accident_id,
        whitelevel_id: whitelevel,
      });
      const data = response.data;
      setAccidentData(data);
  
      if (data) {
        // Update state with fetched data
        setAccidentReportDate(data.date_of_accident || new Date().toISOString().split('T')[0]);
        setAccidentType(data.incident_type || '');
        setPermitStatus(data.permit_status || '');
        setPpeStatus(data.ppe_status || '');
        setSeverity(data.severity || '');
        setToolboxTrain(data.toolbox_train || 'false');
        setToolboxReferenceNumber(data.toolbox_refno || '');
        setReportedBy(data.reported_by || []);
        setWorkmen(data.workmen || []);
        setSupervisors(data.supervisors || []);
        setAboutTheAccident(data.about || '');
        setCompressedImageBase64(data.accident_image);
  
        setWorkmen(
          data.workmen.map((workman) => ({
            employee_id: workman.employee_id || "0",
            employee_name: workman.employee_name || "Others",
          }))
        );
  
        setSupervisors(
          data.supervisors.map((supervisor) => ({
            employee_id: supervisor.employee_id || "0",
            employee_name: supervisor.employee_name || "Others",
          }))
        );
  
        setReportedBy(
          data.reported_by.map((reported) => ({
            employee_id: reported.employee_id || "0",
            employee_name: reported.employee_name || "Others",
          }))
        );
      } else {
        // If no data is found
        alert('No accident data found. Please check the reference number.');
      }
  
      console.log("Fetched data:", response.data);
    } catch (error) {
      console.error("Error fetching accident data:", error);
      setErrors({ fetch: "Failed to fetch accident data. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const handleInputChange = (role, updatedRows) => {
    if (role === 'supervisors') setSupervisors(updatedRows);
    if (role === 'workmen') setWorkmen(updatedRows);
    if (role === 'reported_by') setReportedBy(updatedRows);
  };

  const handleReportTypeChange = (event) => {
    setAccidentType(event.target.value);
  };

  const handleToolBoxTalkChange = (event) => {
    setToolboxTrain(event.target.value);
  };

  const handleDateChange = (event) => {
    setAccidentReportDate(event.target.value);
  };

  const handleReferenceNumberChange = (event) => {
    setAccidentId(event.target.value);
  };

  const handleSeverityChange = (event) => {
    setSeverity(event.target.value);
  };

  const handlePermitStatusChange = (event) => {
    setPermitStatus(event.target.value);
  };

  const handlePpeStatusChange = (event) => {
    setPpeStatus(event.target.value);
  };

  const handleReference = (event) => {
    setToolboxReferenceNumber(event.target.value);
  };

const validateForm = () => {
  const newErrors = {};

  if (!accident_report_date) newErrors.accident_report_date = 'Date is required';

  if (!accident_id) {
    newErrors.accident_id = 'Reference Number is required';
  } else {
    if (accident_id.length < 3 || accident_id.length > 21) {
      newErrors.accident_id = 'Reference Number length must be between 3 and 21 characters';
    } else if (!/^[a-zA-Z0-9/-]+$/.test(accident_id)) {
      newErrors.accident_id = 'Reference Number can only contain letters, numbers, hyphens (-), and forward slashes (/)';
    } else if (!accident_id.startsWith('Acc')) {
      newErrors.accident_id = 'Reference Number must start with "Acc"';
    }
  }

  if (!accident_type) {
    newErrors.accident_type = 'Incident Type is required';
  }

  if (accident_type === '2') {
    if (!severity) newErrors.severity = 'Severity is required';
    if (!permit_status) newErrors.permit_status = 'Permit Status is required';
    if (!ppe_status) newErrors.ppe_status = 'PPE Status is required';

    if (toolbox_train === 'true' && !toolbox_reference_number) {
      newErrors.toolbox_reference_number = 'ToolBox Reference Number is required when Tool Box Talk is Yes';
    } else if (toolbox_reference_number) {
      if (toolbox_reference_number.length < 3 || toolbox_reference_number.length > 21) {
        newErrors.toolbox_reference_number = 'ToolBox Reference Number length must be between 3 and 21 characters';
      } else if (!/^[a-zA-Z0-9/-]+$/.test(toolbox_reference_number)) {
        newErrors.toolbox_reference_number = 'ToolBox Reference Number can only contain letters, numbers, hyphens (-), and forward slashes (/)';
      }
    }
  }

  // No validation for reported_by and supervisors

  const validateEmployeeDetails = (role, employees) => {
    if (employees.length === 0) {
      // Optionally, add a warning message instead of an error
      newErrors[role] = `${role.replace('_', ' ')} is empty`;
    } else {
      employees.forEach((employee, index) => {
        const employeeErrors = {};

        if (employee.employee === 0 || employee.employee === '0') {
          // '0' is treated as valid, so no error is added.
        } else if (!employee.employee || employee.employee.trim() === '') {
          employeeErrors.employee_id = 'Employee ID is required';
        }

        if (!employee.employee_name || employee.employee_name.trim() === '') {
          employeeErrors.employee_name = 'Employee Name is required';
        }

        if (Object.keys(employeeErrors).length > 0) {
          if (!newErrors[role]) {
            newErrors[role] = [];
          }
          newErrors[role][index] = employeeErrors;
        }
      });
    }
  };

  if (workmen.length === 0) newErrors.workmen = 'Workmen Involved is required';
  // Validate only if employees are present
  if (reported_by.length > 0) validateEmployeeDetails('reported_by', reported_by);
  if (workmen.length > 0) validateEmployeeDetails('workmen', workmen);
  if (supervisors.length > 0) validateEmployeeDetails('supervisors', supervisors);

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


const resetForm = () => {
  setWhitelevel(userInfo.whitelevel_id);
  setAccidentType('');
  setToolboxTrain('false');
  setToolboxReferenceNumber('');
  setAccidentReportDate(new Date().toISOString().split('T')[0]);
  setAccidentId('');
  setSeverity('');
  setPermitStatus('');
  setPpeStatus('');
  setSupervisors([]);

  setWorkmen([]);
 
  setReportedBy([]);
  
  setAboutTheAccident('');
  setCompressedImageBase64('');
};


const handleSubmit = async (event) => {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  setIsLoading(true);
  // Proceed with form submission or API call


   

    const formData = {
      accident_reporting_date: accident_report_date,
      accident_id,
      accident_type: parseInt(accident_type, 10),
      severity: parseInt(severity, 10),
      permit_status: parseInt(permit_status, 10),
      ppe_status: parseInt(ppe_status, 10),
      toolbox_train: toolbox_train === 'true',
      toolbox_reference_number,
      accident_image: compressedImageBase64,
      about_the_accident,
      whitelevel,
      reported_by: reported_by.map(({ employee, employee_name, whitelevel_id }) => ({
        employee,
        employee_name,
        whitelevel_id
      })),
      workmen: workmen.map(({ employee, employee_name, whitelevel_id }) => ({
        employee,
        employee_name,
        whitelevel_id
      })),
      supervisors: supervisors.map(({ employee, employee_name, whitelevel_id }) => ({
        employee,
        employee_name,
        whitelevel_id
      })),
    };

    console.log('Submitting the following data:');
    console.log(JSON.stringify(formData, null, 2));

    try {
        const response = await api.post('/accident/create/',
          formData
        );
        console.log('Success:', response.data);
        window.alert('Accident Form submitted successfully!');
        resetForm(formData);

    } catch (error) {
      if (error.isAxiosError && error.response) {
          // Handle API response errors
          console.error(`HTTP error! status: ${error}`);
          const errorData = JSON.stringify(error.response.data); // Parse the error response
          console.error('Response body:', errorData);
          alert(`Error: ${errorData}`);
      }
      else if (error.name === 'TypeError') {
        console.error('Network error: Please check if the server is running and accessible.');
        alert('Network error: Please check if the server is running and accessible.');
      } else {
        // Handle network errors
        console.error('Error fetching data:', error);
        alert(`Error fetching data: ${error.message}`);
      }
      console.error('Error in handleSubmit:', error.message);

      // Show error alert
      window.alert('Error submitting form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    // setErrors(null);
    const formData = {
      date_of_accident: accident_report_date,
      accident_id,
      accident_type: parseInt(accident_type, 10),
      severity: parseInt(severity, 10),
      permit_status: parseInt(permit_status, 10),
      ppe_status: parseInt(ppe_status, 10),
      toolbox_train: toolbox_train === 'true',
      toolbox_reference_number,
      accident_image: compressedImageBase64,
      about_the_accident,
      whitelevel_id:whitelevel,
      reported_by: reported_by.map(({ employee, employee_name, whitelevel_id }) => ({
        employee_id:employee,
        // employee:accidentData.reported_by.employee,
        employee_name,
        whitelevel_id
      })),
      workmen: workmen.map(({ employee, employee_name, whitelevel_id }) => ({
        employee_id:employee,
        // employee:workman.employee,
        employee_name,
        whitelevel_id
      })),
      supervisors: supervisors.map(({ employee, employee_name, whitelevel_id }) => ({
        employee_id:employee,
        // employee:accidentData.supervisors.employee,
        employee_name,
        whitelevel_id
      })),
    };

    try {
      const response = await api.put("accident/accident-details-update/", formData);
      console.log('Updated Accident:', response.data);
      alert('Updated Accident:', response.data);
      // Handle success for updating the accident
    } catch (err) {
      console.error('Error:', err);
      setErrors('An error occurred while updating the accident.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Box className="section" sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
        <form onSubmit={handleSubmit}>
          <Card sx={{ maxwidth: '100%', padding: 3, boxShadow: 3 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={5.5}>
                  <TextField
                    label="Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      max: new Date().toISOString().split('T')[0]
                    }}
                    value={accident_report_date}
                    onChange={handleDateChange}
                    error={!!errors.accident_report_date}
                    helperText={errors.accident_report_date}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={5.5}>
                  <TextField
                    label="Reference Number"
                    fullWidth
                    onChange={handleReferenceNumberChange}
                    value={accident_id}
                    error={!!errors.accident_id}
                    helperText={errors.accident_id}
                    required
                  />
                  
                </Grid>
                <Grid item xs={12} sm={1}   sx={{marginTop:'10px'}} >
                 {/* <Grid sx={{display:'flex',justifyContent:"center"}}  > */}
                  <Button
                   variant="contained"
                      
                   color="secondary"
                  onClick={handleChange}
                  fullWidth
                 disabled={isLoading}
                                 
                             
                 >
                 ok 
                   </Button>
                   {/* </Grid> */}
                  </Grid>

               
              </Grid>
              <Divider sx={{ marginY: 3 }} />
              <FormControl component="fieldset" margin="normal" error={!!errors.accident_type}>
                <FormLabel component="legend">Incident Type*:</FormLabel>
                <RadioGroup row value={accident_type} onChange={handleReportTypeChange}>
                  <FormControlLabel value="2" control={<Radio />} label="Accident" />
                  <FormControlLabel value="1" control={<Radio />} label="Near Miss" />
                  <FormControlLabel value="3" control={<Radio />} label=" Safety Violation" />
                </RadioGroup>
                {errors.accident_type && <Typography color="error">{errors.accident_type}</Typography>}
              </FormControl>

              {accident_type && (
                <Grid container spacing={2}>
                  

<Grid item xs={12}>
  <Typography gutterBottom>Reported By: (Enter 0 in case of Others)</Typography>
  <Training2 onEmployeesChange={(updatedRows) => handleInputChange('reported_by', updatedRows)} initialWhitelevelId={whitelevel}  initialData={reported_by} />
  
  {/* Display errors for 'reported_by', if any */}
  {Array.isArray(errors.reported_by) && errors.reported_by.length > 0 && (
    <Box>
      {errors.reported_by.map((error, index) => (
        <Box key={index}>
          {error.employee_id && <Typography color="error">{`Employee ${index + 1} ID: ${error.employee_id}`}</Typography>}
          {error.employee_name && <Typography color="error">{`Employee ${index + 1} Name: ${error.employee_name}`}</Typography>}
        </Box>
      ))}
    </Box>
  )}
</Grid>

<Grid item xs={12}>
  <Typography gutterBottom>Workmen Involved*: (Enter 0 in case of Others)</Typography>
  <Training2 onEmployeesChange={(updatedRows) => handleInputChange('workmen', updatedRows)} initialWhitelevelId={whitelevel}  initialData={workmen}  />
  {errors.workmen && typeof errors.workmen === 'string' && (
    <Box>
      <Typography color="error">{errors.workmen}</Typography>
    </Box>
  )}
  {/* Display errors for 'workmen', if any */}
  {Array.isArray(errors.workmen) && errors.workmen.length > 0 && (
    <Box>
      {errors.workmen.map((error, index) => (
        <Box key={index}>
          {error.employee_id && <Typography color="error">{`Employee ${index + 1} ID: ${error.employee_id}`}</Typography>}
          {error.employee_name && <Typography color="error">{`Employee ${index + 1} Name: ${error.employee_name}`}</Typography>}
        </Box>
      ))}
    </Box>
  )}
</Grid>

<Grid item xs={12}>
  <Typography gutterBottom>Supervisor:</Typography>
  <Training onChange={(updatedRows) => handleInputChange('supervisors', updatedRows)} initialWhitelevelId={whitelevel}  initialData={supervisors} />
  
  {/* Display errors for 'supervisors', if any */}
  {Array.isArray(errors.supervisors) && errors.supervisors.length > 0 && (
    <Box>
      {errors.supervisors.map((error, index) => (
        <Box key={index}>
          {error.employee_id && <Typography color="error">{`Supervisor ${index + 1} ID: ${error.employee_id}`}</Typography>}
          {error.employee_name && <Typography color="error">{`Supervisor ${index + 1} Name: ${error.employee_name}`}</Typography>}
        </Box>
      ))}
    </Box>
  )}
</Grid>

  {accident_type === '2' && (
    <>
     <Grid item xs={12}>
       <FormControl component="fieldset" error={!!errors.severity}>
       <FormLabel component="legend">Severity*</FormLabel>
       <RadioGroup row value={severity} onChange={handleSeverityChange}>
       <FormControlLabel value="1" control={<Radio />} label="1" />
       <FormControlLabel value="2" control={<Radio />} label="2" />
       <FormControlLabel value="3" control={<Radio />} label="3" />
       <FormControlLabel value="4" control={<Radio />} label="4" />
       <FormControlLabel value="5" control={<Radio />} label="5" />
       </RadioGroup>
       {errors.severity && <Typography color="error">{errors.severity}</Typography>}
       </FormControl>
        </Grid>
      <Grid item xs={12}>
        <FormControl component="fieldset" error={!!errors.permit_status}>
        <FormLabel component="legend">Permit Status*</FormLabel>
        <RadioGroup row value={permit_status} onChange={handlePermitStatusChange}>
        <FormControlLabel value="4" control={<Radio />} label="Valid" />
        <FormControlLabel value="3" control={<Radio />} label="Not Required" />
        <FormControlLabel value="2" control={<Radio />} label="No Permit" />
        <FormControlLabel value="1" control={<Radio />} label="Expired" />
        </RadioGroup>
        {errors.permit_status && <Typography color="error">{errors.permit_status}</Typography>}
        </FormControl>
          </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl component="fieldset" error={!!errors.ppe_status}>
                          <FormLabel component="legend">PPE Status*</FormLabel>
                          <RadioGroup row value={ppe_status} onChange={handlePpeStatusChange}>
                            <FormControlLabel value="2" control={<Radio />} label="OK" />
                            <FormControlLabel value="1" control={<Radio />} label="Faulty" />
                          </RadioGroup>
                          {errors.ppe_status && <Typography color="error">{errors.ppe_status}</Typography>}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl component="fieldset">
                          <FormLabel component="legend">Tool Box Talk*</FormLabel>
                          <RadioGroup row value={toolbox_train} onChange={handleToolBoxTalkChange}>
                            <FormControlLabel value="true" control={<Radio />} label="Yes" />
                            <FormControlLabel value="false" control={<Radio />} label="No" />
                          </RadioGroup>
                        </FormControl>
                        {toolbox_train === 'true' && (
                          <TextField
                            label="ToolBox Reference Number"
                            fullWidth
                            onChange={handleReference}
                            value={toolbox_reference_number}
                            sx={{ marginTop: 2 }}
                            error={!!errors.toolbox_reference_number}
                            helperText={errors.toolbox_reference_number}
                          />
                        )}
                      </Grid>

                    </>
                  )}

                      <Grid item xs={12}>
                        <FormControl fullWidth margin="normal">
                          <TextField
                            label="Description...."
                            multiline
                            rows={4}
                            value={about_the_accident}
                            onChange={handleReport}
                            // error={!!errors.about_the_accident}
                            // helperText={errors.about_the_accident}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                <Imagecompression
                  setCompressedImageBase64={setCompressedImageBase64}
                  compressedImageBase64={compressedImageBase64} // Pass the value here
                />
              </Grid>
                </Grid>
              )}
            <Grid container spacing={2} sx={{marginTop:'20px'}}>
              <Grid item xs={12} md={6}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                >
                  Submit Accident
                </Button>
              </Grid>

              {/* {accident_id && ( */}
                <Grid item xs={12} md={6}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleUpdate}
                    fullWidth
                    disabled={isLoading}
                  >
                    Update Accident
                  </Button>
                </Grid>
              {/* )} */}
            </Grid>

            </CardContent>
          </Card>
        </form>
      </Box>

      <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default Accident;
