// import React, { useState, useEffect } from 'react';
// import { TextField, Button, Box, Paper, Typography, Grid, CircularProgress,Checkbox } from '@mui/material';
// import Imagecompression from '../imagecompression/Imagecompression';
// import Training from '../training1/Training4';
// import api from "src/api";
// import { useSelector } from 'react-redux';

// export default function EmployeeForm() {

//   const userInfo = useSelector((state) => state.userInfo);
//   const [whitelevel_id, setWhitelevel_id] = useState(userInfo.whitelevel_id);
//   const [employees, setEmployees] = useState([]);
//   const [date1, setDate1] = useState('');
//   const [date2, setDate2] = useState('');
//   const [compressedImageBase64, setCompressedImageBase64] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [date1Error, setDate1Error] = useState('');
//   const [date2Error, setDate2Error] = useState('');
//   const [employeesError, setEmployeesError] = useState('');
//   const [imageError, setImageError] = useState('');
//   const [state, setState] = useState({
//         option1: false,
//       });


//   useEffect(() => {
//     const currentDate = new Date();
//     const formattedDate = currentDate.toISOString().split('T')[0];
//     setDate1(formattedDate); // Set the date to current date on component mount
//   }, []);

//   useEffect(() => {
//     if (date1) {
//       const newDate2 = addOneYear(date1);
//       setDate2(newDate2);
//     }
//     // fetchAccidentData(date1,date1);
   
//   }, [date1]);

//   // useEffect(() => {
//   //     fetchAccidentData(training_id);
//   //   }, [training_id]);

//     // const fetchAccidentData = async (date1,date2) => {
//     //     if (!date1) return;
//     //     if (!date2) return;
//     //     setLoading(true);
//     //     try {
//     //       const response = await api.post("/medical/medical-details/", {
//     //         start_date: date1,
//     //         end_date:date2,
//     //         whitelevel_id: whitelevel_id,
//     //       });
//     //       const data = response.data;
      
//     //       if (data) {
//     //         // Update state with fetched data
           
//     //         setEmployees(
//     //           data.employees.map((employees) => ({
//     //           employee_id: employees.employee_id,
//     //           employee_name: employees.trainer_name,
              
//     //        }))
//     //      );
//     //      setCompressedImageBase64(
//     //       data.employees.map((employees) => ({
          
//     //       //  employees.i,
//     //       imageCompression:employees.image
          
//     //    }))
//     //  );

//     //       } else {
//     //         // If data is not found, handle it
//     //         alert('No SafetyTraining data found. Please check the reference number.');
//     //       }
      
//     //       console.log("Fetched data:", response.data);
//     //     } catch (error) {
//     //       console.error("Error fetching accident data:", error);
//     //       setErrors({ fetch: "Failed to fetch accident data. Please try again." });
//     //     } finally {
//     //       setLoading(false);
//     //     }
//     //   };

//       const handleChange = async (event) => {
//             const { name, checked } = event.target;
          
//             // Update checkbox state
//             // setState({
//             //   ...state,
//             //   [name]: checked,
//             // });
          
//             if (!date1) return;
//             if (!date2) return;
            
//             // if (!checked) {
//             //   // If checkbox is unchecked, reset accident data
//             //   resetForm();
//             //   return;
//             // }
          
//             setLoading(true);
//             // setIsLoading(true);
            
//             setLoading(true);
//             try {
//               const response = await api.post("/medical/medical-details/", {
//                 start_date: date1,
//                 end_date:date2,
//                 whitelevel_id: whitelevel_id,
//               });
//               const data = response.data;
          
//               if (data) {
//                 // Update state with fetched data
               
//                 setEmployees(
//                   data.employees.map((employees) => ({
//                   employee_id: employees.employee_id,
//                   employee_name: employees.employee_name,
                  
//                }))
//              );
//              setCompressedImageBase64(
//              data.employees.image
//          );
    
//               } else {
//                 // If data is not found, handle it
//                 alert('No SafetyTraining data found. Please check the reference number.');
//               }
          
//               console.log("Fetched data:", response.data);
//             } catch (error) {
//               console.error("Error fetching accident data:", error);
//               setErrors({ fetch: "Failed to fetch accident data. Please try again." });
//             } finally {
//               setLoading(false);
//             }
//           };



//   const handleEmployeesChange = (employeeDetails) => {
//     setEmployees(employeeDetails);
//   };

//   const validateFields = () => {
//     let valid = true;

//     if (!date1) {
//       setDate1Error('Checkup Date is required.');
//       valid = false;
//     } else {
//       setDate1Error('');
//     }

//     if (!date2) {
//       setDate2Error('Next Checkup Date is required.');
//       valid = false;
//     } else {
//       setDate2Error('');
//     }

    

//     if (!employees.length) {
//       setEmployeesError('Employees are required.');
//       valid = false;
//     } else {
//       let hasEmptyFields = false;
    
//       employees.forEach((employee, index) => {
//         if (!employee.employee_id || !employee.employee_name) {
//           setEmployeesError(`Employee ${index + 1} has empty fields.`);
//           hasEmptyFields = true;
//           valid = false;
//         }
//       });
    
//       if (!hasEmptyFields) {
//         setEmployeesError('');
//       }
//     }
//      return valid;
//   };



// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);

//   if (!validateFields()) {
//     setLoading(false);
//     return;
//   }

//   const formData = {
//     checkUpDate: date1,
//     nextCheckUpDate: date2,
//     employees: employees,
//     image: compressedImageBase64,
//   };

//   try {
//     const response = await api.post('/medical/create/', formData);
//     const responseData = response.data;

//     // Convert employees array to a dictionary with employee_id as the key for quick lookup
//     const employeeMap = employees.reduce((map, employee) => {
//       map[employee.employee_id] = employee;
//       return map;
//     }, {});

//     // Iterate over the response data to handle success or error
//     Object.entries(responseData).forEach(([employeeId, result]) => {
//       const employee = employeeMap[employeeId];
//       if (employee) {
//         if (result.result === "success") {
//           alert(`Medical checkup saved successfully for ${employee.employee_name} (ID: ${employee.employee_id})`);
//         } else if (result.result === "error") {
//           alert(`Error for ${employee.employee_name} (ID: ${employee.employee_id}): ${result.message}`);
//         }
//       } else {
//         console.error(`Employee with ID ${employeeId} not found in the employees list.`);
//       }
//     });

//     resetForm(); // Reset form after submission

//   } catch (error) {
//     if (error.isAxiosError && error.response) {
//       console.error(`HTTP error! status: ${error.response.status}`);
//       const errorData = JSON.stringify(error.response.data);
//       console.error('Response body:', errorData);
//       alert(`Error: ${errorData}`);
//     } else if (error.name === 'TypeError') {
//       console.error('Network error: Please check if the server is running and accessible.');
//       alert('Network error: Please check if the server is running and accessible.');
//     } else {
//       console.error('Error fetching data:', error);
//       alert(`Error fetching data: ${error.message}`);
//     }
//   } finally {
//     setLoading(false);
//   }
// };

// const handleUpdate = async (event) => {
//     event.preventDefault();
//     setLoading(true);
//     // setErrors(null);
//     const formData = {
//       checkup_date:date1,
//       next_checkup_date:date2,
//       whitelevel_id:whitelevel_id,
//       employees: employees,
//       image: compressedImageBase64

//     };

//     try {
//       const response = await api.put("/medical/medical-update/", formData);
//       console.log('Updated Accident:', response.data);
//       alert('Updated Accident:', response.data);
//       // Handle success for updating the accident
//     } catch (err) {
//       console.error('Error:', err);
//       setErrors('An error occurred while updating the accident.');
//     } finally {
//       setLoading(false);
//     }
//   };



//   const addOneYear = (date) => {
//     const newDate = new Date(date);
//     newDate.setFullYear(newDate.getFullYear() + 1);
//     return newDate.toISOString().split('T')[0];
//   };

//   const handleDate1Change = (e) => {
//     const newDate1 = e.target.value;
//     setDate1(newDate1);
//   };

//   const resetForm = () => {
//     const currentDate = new Date().toISOString().split('T')[0];
//     setDate1(currentDate);
//     setDate2(addOneYear(currentDate));
//     setEmployees([]);
//     setCompressedImageBase64('');
//     setDate1Error('');
//     setDate2Error('');
//     setEmployeesError('');
//     setImageError('');
//   };

//   return (
//     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//       <form onSubmit={handleSubmit}>
//         <Paper sx={{ padding: 4, width: '100%'}}>
//           <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Medical Checkup Form
//             </Typography>
//           </Box>
//           <Grid container spacing={2}>
//             <Grid item xs={5.5}>
//               <TextField
//                 label="Checkup Date*"
//                 type="date"
//                 value={date1}
//                 fullWidth
//                 InputLabelProps={{
//                   shrink: true,
//                 }}
//                 inputProps={{
//                   max: new Date().toISOString().split('T')[0],
//                 }}
//                 onChange={handleDate1Change}
//                 error={!!date1Error}
//                 helperText={date1Error}
//               />
//             </Grid>
//             <Grid item xs={5.5}>
//               <TextField
//                 label="Next Checkup Date*"
//                 type="date"
//                 value={date2}
//                 fullWidth
//                 InputLabelProps={{
//                   shrink: true,
//                 }}
//                 inputProps={{
//                   min: date1,
//                 }}
//                 onChange={(e) => setDate2(e.target.value)}
//                 error={!!date2Error}
//                 helperText={date2Error}
//               />
//             </Grid>
//             <Grid item xs={1}>
//             {/* <Checkbox
//               checked={state.option1}
//               onChange={handleChange}
//                name="option1"
//                label="ok"
//              /> */}
//              <Button
//               variant="contained"
//               color="secondary"
//               onClick={handleChange}
//               fullWidth
//               disabled={loading}
//              >
//              ok 
//              </Button>
             
//              </Grid>
//             <Grid item xs={12} sx={{ marginBottom: 2 }}>
//               Employees*
//               <Training onChange={handleEmployeesChange}  initialData={employees} />
//               {employeesError && (
//                 <Typography color="error" variant="body2">
//                   {employeesError}
//                 </Typography>
//               )}
//             </Grid>
//             <Grid item xs={12}>
//               <Imagecompression setCompressedImageBase64={setCompressedImageBase64} />
//               {/* {imageError && (
//                 <Typography color="error" variant="body2">
//                   {imageError}
//                 </Typography>
//               )} */}
//             </Grid>
//              <Grid container spacing={2} sx={{marginTop:'20px'}}>
//                           <Grid item xs={12} md={6}>
//                             <Button
//                               variant="contained"
//                               color="primary"
//                               type="submit"
//                               fullWidth
//                               disabled={loading}
//                             >
//                               Submit Accident
//                             </Button>
//                           </Grid>
            
//                           {/* {accident_id && ( */}
//                             <Grid item xs={12} md={6}>
//                               <Button
//                                 variant="contained"
//                                 color="secondary"
//                                 onClick={handleUpdate}
//                                 fullWidth
//                                 disabled={loading}
//                               >
//                                 Update Accident
//                               </Button>
//                             </Grid>
//                           {/* )} */}
//                         </Grid>

//           </Grid>
//         </Paper>
//       </form>
//     </Box>
//   );
// }
import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Paper, Typography, Grid, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableHead,TableBody, TableCell, TableContainer, TableRow, Paper as TablePaper } from '@mui/material';
import Imagecompression from '../imagecompression/Imagecompression';
import Training from '../training1/Training4';
import api from "src/api";
import { useSelector } from 'react-redux';

export default function EmployeeForm() {
  const [employees, setEmployees] = useState([]);
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [compressedImageBase64, setCompressedImageBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const [date1Error, setDate1Error] = useState('');
  const [date2Error, setDate2Error] = useState('');
  const [employeesError, setEmployeesError] = useState('');
  const [imageError, setImageError] = useState('');
  const [openModal, setOpenModal] = useState(false); // Modal state for "Update" button
  const [modalData, setModalData] = useState(null); // Data for the modal
  const userInfo = useSelector((state) => state.userInfo);
  const [whitelevel, setWhitelevel] = useState(userInfo.whitelevel_id);

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    setDate1(formattedDate); // Set the date to current date on component mount
  }, []);

  useEffect(() => {
    if (date1) {
      const newDate2 = addOneYear(date1);
      setDate2(newDate2);
    }
  }, [date1]);

  const handleEmployeesChange = (employeeDetails) => {
    setEmployees(employeeDetails);
  };

  const validateFields = () => {
    let valid = true;

    if (!date1) {
      setDate1Error('Checkup Date is required.');
      valid = false;
    } else {
      setDate1Error('');
    }

    if (!date2) {
      setDate2Error('Next Checkup Date is required.');
      valid = false;
    } else {
      setDate2Error('');
    }

    if (!employees.length) {
      setEmployeesError('Employees are required.');
      valid = false;
    } else {
      let hasEmptyFields = false;

      employees.forEach((employee, index) => {
        if (!employee.employee_id || !employee.employee_name) {
          setEmployeesError(`Employee ${index + 1} has empty fields.`);
          hasEmptyFields = true;
          valid = false;
        }
      });

      if (!hasEmptyFields) {
        setEmployeesError('');
      }
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateFields()) {
      setLoading(false);
      return;
    }

    const formData = {
      checkUpDate: date1,
      nextCheckUpDate: date2,
      employees: employees,
      image: compressedImageBase64,
      whitelevelId: whitelevel,
    };

    try {
      const response = await api.post('/medical/create/', formData);
      const responseData = response.data;

      // Convert employees array to a dictionary with employee_id as the key for quick lookup
      const employeeMap = employees.reduce((map, employee) => {
        map[employee.employee_id] = employee;
        return map;
      }, {});

      // Iterate over the response data to handle success or error
      Object.entries(responseData).forEach(([employeeId, result]) => {
        const employee = employeeMap[employeeId];
        if (employee) {
          if (result.result === "success") {
            alert(`Medical checkup saved successfully for ${employee.employee_name} (ID: ${employee.employee_id})`);
          } else if (result.result === "error") {
            alert(`Error for ${employee.employee_name} (ID: ${employee.employee_id}): ${result.message}`);
          }
        } else {
          console.error(`Employee with ID ${employeeId} not found in the employees list.`);
        }
      });

      resetForm(); // Reset form after submission

    } 
    catch (error) {
      if (error.isAxiosError && error.response) {
        console.error(`HTTP error! status: ${error.response.status}`);
        const errorData = JSON.stringify(error.response.data);
        console.error('Response body:', errorData);
        alert(`Error: ${errorData}`);
      } else if (error.name === 'TypeError') {
        console.error('Network error: Please check if the server is running and accessible.');
        alert('Network error: Please check if the server is running and accessible.');
      } else {
        console.error('Error fetching data:', error);
        alert(`Error fetching data: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const addOneYear = (date) => {
    const newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear() + 1);
    return newDate.toISOString().split('T')[0];
  };

  const handleDate1Change = (e) => {
    const newDate1 = e.target.value;
    setDate1(newDate1);
  };

  const resetForm = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    setDate1(currentDate);
    setDate2(addOneYear(currentDate));
    setEmployees([]);
    setCompressedImageBase64('');
    setDate1Error('');
    setDate2Error('');
    setEmployeesError('');
    setImageError('');
  };

  const handleOpenModal = async () => {
    setLoading(true);
    // Fetch data based on checkup_date, next_checkup_date, and whitelevel_id
    try {
      const response = await api.post('/medical/medical-details/', {
        start_date: date1,
        end_date: date2,
        whitelevel_id: whitelevel, // Use whitelevel_id
      });

      if (response.data && response.data.message) {
        // Check for the specific message in the response
        if (response.data.message === "No medical checkups found for the given criteria.") {
          setModalData(null); // No data to display
          alert('No records found for the selected checkup dates.'); // Show the message in an alert
        } else {
          setModalData(response.data); // Set modal data for valid response
        }
      } else {
        setModalData(response.data); // Set modal data if no specific message found
      }

      setOpenModal(true);
    } catch (error) {
      console.error('Error fetching modal data:', error);
      alert('Error fetching modal data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleSubmit}>
        <Paper sx={{ padding: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
            <Typography variant="h6" gutterBottom>
              Medical Checkup Form
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Checkup Date*"
                type="date"
                value={date1}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: new Date().toISOString().split('T')[0],
                }}
                onChange={handleDate1Change}
                error={!!date1Error}
                helperText={date1Error}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Next Checkup Date*"
                type="date"
                value={date2}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: date1,
                }}
                onChange={(e) => setDate2(e.target.value)}
                error={!!date2Error}
                helperText={date2Error}
              />
            </Grid>
            <Grid item xs={12} sx={{ marginBottom: 2 }}>
              Employees*
              <Training onChange={handleEmployeesChange} />
              {employeesError && (
                <Typography color="error" variant="body2">
                  {employeesError}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Imagecompression setCompressedImageBase64={setCompressedImageBase64} />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : 'Submit'}
                </Button>
              </Box>
            </Grid>
            {/* Update Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleOpenModal}
                >
                  Search
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </form>

      {/* Modal Popup */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="lg">
  <DialogTitle>Medical Checkup Details</DialogTitle>
  <DialogContent>
    {loading ? (
      <CircularProgress />
    ) : (
      <>
        {!modalData || !modalData.employees || modalData.employees.length === 0 ? (
          <>
            <Typography variant="body2" color="error">
              No records found for the selected checkup dates.
            </Typography>
          </>
        ) : (
          <>
            {/* Display Checkup Dates as Date Fields */}
            <Box sx={{ margin: 2 }}>
  <Grid container spacing={2}>
    <Grid item xs={12} sm={6}>
      <TextField
        label="Checkup Date"
        type="date"
        value={modalData?.checkup_date || ""}
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        label="Next Checkup Date"
        type="date"
        value={modalData?.next_checkup_date || ""}
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Grid>
  </Grid>
</Box>

            {/* Employee Table */}
            <TableContainer component={TablePaper} sx={{ marginTop: 2 }}>
  <Table>
    {/* Table Head with headers */}
    <TableHead>
      <TableRow>
        <TableCell sx={{ fontWeight: 'bold', padding: 2, textAlign: 'center' }}>Employee ID</TableCell>
        <TableCell sx={{ fontWeight: 'bold', padding: 2, textAlign: 'center' }}>Employee Name</TableCell>
        <TableCell sx={{ fontWeight: 'bold', padding: 2, textAlign: 'center' }}>Image</TableCell>
      </TableRow>
    </TableHead>

    {/* Table Body with employee data */}
    <TableBody>
      {modalData?.employees?.map((employee, index) => (
        <TableRow key={index}>
          {/* Employee ID */}
          <TableCell sx={{ padding: 2, textAlign: 'center' }}>
            <Typography variant="body2">{employee.employee_id}</Typography>
          </TableCell>

          {/* Employee Name */}
          <TableCell sx={{ padding: 2, textAlign: 'center' }}>
            <Typography variant="body2">{employee.employee_name}</Typography>
          </TableCell>

          {/* Display Image */}
          <TableCell sx={{ padding: 2, textAlign: 'center' }}>
            {employee.image ? (
              <img
                src={`data:image/jpeg;base64,${employee.image}`}
                alt={`Medical Checkup for ${employee.employee_name}`}
                width="100"
                style={{ borderRadius: '8px', border: '1px solid #ccc' }}
              />
            ) : (
              <Typography variant="body2" color="error">
                No image available
              </Typography>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

          </>
        )}
      </>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseModal} color="primary">Close</Button>
  </DialogActions>
</Dialog>
    </Box>
  );
}