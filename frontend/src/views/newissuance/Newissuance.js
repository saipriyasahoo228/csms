
// // import React, { useState, useEffect } from 'react';
// // import Training4 from '../training1/Training4';
// // import { Box, Typography, TextField, FormControlLabel, FormControl, Card, CardContent, Divider, Grid, Checkbox, Button, Backdrop, CircularProgress } from '@mui/material';
// // import Imagecompression from '../imagecompression/Imagecompression';
// // import { useSelector } from 'react-redux';
// // import api from "src/api";

// // const Newissuance = () => {
// //     const userInfo = useSelector((state) => state.userInfo);
// //     const [issuedThings, setIssuedThings] = useState({ TOOLS: false, PPE: false, DRESS: false, });
// //     const [ppeDetails, setPpeDetails] = useState([]);
// //     const [toolDetails, setToolDetails] = useState([]);
// //     const [dressDetails, setDressDetails] = useState([]);
// //     const [issuance_date, setDate] = useState(new Date().toISOString().split('T')[0]);
// //     const [issuance_id, setReferenceNumber] = useState('');
// //     const [white_level_id, setDropdownValue] = useState(userInfo.whitelevel_id);
// //     const [compressedImageBase64, setCompressedImageBase64] = useState('');
// //     const [employees, setEmployees] = useState([]);
// //     const [errors, setErrors] = useState({});
// //     const [loading, setLoading] = useState(false);
// //     const [about_the_newissuance, setAboutTheNewIssuance] = useState('');
// //     const [items, setItems] = useState({ tools: [], ppes: [], dresses: [] });

// //     useEffect(() => {
// //         const fetchItems = async () => {
// //             try {
// //                 const response = await api.get('/item/getAll/');
// //                 const data = response.data;
// //                 // Parsing data based on item_type_name
// //                 const tools = data.filter(item_id => item_id.item_type.item_type_name === "Tool");
// //                 const ppes = data.filter(item_id => item_id.item_type.item_type_name === "PPE");
// //                 const dresses = data.filter(item_id => item_id.item_type.item_type_name === "Dress");
// //                 setItems({ tools, ppes, dresses });
// //             } catch (error) {
// //                 console.error('Error fetching items:', error);
// //             }
// //         };
// //         fetchItems();
// //     }, []);

// //     const handleTrainingTypeChange = (event) => {
// //         const { name, checked } = event.target;
// //         setIssuedThings((prev) => ({ ...prev, [name]: checked }));
// //     };

// //     const handleDetailsChange = (event, type) => {
// //         const { name, checked } = event.target;
// //         const updateDetails = (details, name, checked) => {
// //             if (checked) {
// //                 return [...details, { item: name }];
// //             } else {
// //                 return details.filter(detail => detail.item !== name);
// //             }
// //         };
// //         if (type === 'TOOLS') {
// //             setToolDetails((prev) => updateDetails(prev, name, checked));
// //         }
// //         if (type === 'PPE') {
// //             setPpeDetails((prev) => updateDetails(prev, name, checked));
// //         }
// //         if (type === 'DRESS') {
// //             setDressDetails((prev) => updateDetails(prev, name, checked));
// //         }
// //     };

// //     const handleDropdownChange = (event) => {
// //         // setDropdownValue(event.target.value);
// //     };

// //     const handleEmployeesChange = (employeeDetails) => {
// //         setEmployees(employeeDetails);
// //     };

// //     const handleReport = (e) => {
// //         setAboutTheNewIssuance(e.target.value);
// //     };



// //     const validateForm = () => {
// //         let formErrors = {};

// //         // Other validations...
// //         if (!issuance_date) formErrors.issuance_date = 'Issuance date is required';
// //         const referenceNumberPattern = /^[A-Za-z0-9/-]+$/; // Allows alphanumeric characters, hyphens, and slashes
// //         if (!issuance_id) {
// //             formErrors.issuance_id = 'Reference number is required';
// //         } else if (issuance_id.length < 3 || issuance_id.length > 21) {
// //             formErrors.issuance_id = 'Reference number must be between 3 and 21 characters';
// //         } else if (!referenceNumberPattern.test(issuance_id)) {
// //             formErrors.issuance_id = 'Reference number can only contain letters, numbers, hyphens, and slashes';
// //         }
// //         if (issuedThings.TOOLS && toolDetails.length === 0) formErrors.tools = 'At least one tool must be selected';
// //         if (issuedThings.PPE && ppeDetails.length === 0) formErrors.ppe = 'At least one PPE must be selected';
// //         if (issuedThings.DRESS && dressDetails.length === 0) formErrors.dress = 'At least one dress must be selected';
// //         if (employees.length === 0) {
// //             formErrors.employees = 'Employee details are required';
// //         } else {
// //             // Check if employee_name or employee_id is empty for any employee
// //             employees.forEach(({ employee_id, employee_name }, index) => {
// //                 if (!employee_id || !employee_name) {
// //                     formErrors.employees = `Employee ID and Name cannot be empty for entry #${index + 1}`;
// //                 }
// //             });
// //         }
// //         if (!issuedThings.TOOLS && !issuedThings.PPE && !issuedThings.DRESS) formErrors.items = 'At least one item category must be selected';

// //         setErrors(formErrors);
// //         return Object.keys(formErrors).length === 0;
// //     };

// //     const resetForm = () => {
// //         setIssuedThings({ TOOLS: false, PPE: false, DRESS: false });
// //         setPpeDetails([]);
// //         setToolDetails([]);
// //         setDressDetails([]);
// //         setDate(new Date().toISOString().split('T')[0]);
// //         setReferenceNumber('');
// //         setDropdownValue(userInfo.whitelevel_id);
// //         setCompressedImageBase64(''); // Reset image compression state
// //         setEmployees([]); // Ensure employee details are cleared
// //         setErrors({});
// //         setAboutTheNewIssuance('');


// //     };


// //     const handleSubmit = async () => {

// //         if (!validateForm()) {
// //             return;
// //         }
// //         setLoading(true);
// //         const issued_things = [
// //             ...toolDetails.map(tool => ({ item: tool.item })),
// //             ...ppeDetails.map(ppe => ({ item: ppe.item })),
// //             ...dressDetails.map(dress => ({ item: dress.item })),
// //         ];
// //         const formData = {
// //             issuance: {
// //                 issuance_id,
// //                 issuance_date,
// //                 white_level_id,
// //                 newissuance_image: compressedImageBase64,
// //                 about_the_newissuance
// //             },
// //             issued_things,
// //             employees: employees.map(({ employee_id, employee_name, whitelevel_id }) => ({ employee_id, employee_name, whitelevel_id })),
// //         };
// //         console.log('Submitting the following data:');
// //         console.log(JSON.stringify(formData, null, 2));


// //     try {
// //         const response = await api.post('/item/new/', formData);
// //         const result = response.data.message;
// //         console.log('Data submitted successfully:', result);
// //         alert('New Issuance Successfully submitted.');
// //         resetForm(formData);
// //     } catch (error) {
// //         if (error.response) {
// //             if (error.response.status === 400 && error.response.data.issuance_id) {
// //                 alert(`Error: ${error.response.data.issuance_id[0]}`);
// //             }
// //             else if (error.response.status === 400 && error.response.data.employee_id) {
// //                 alert('Error: Employee Id and Employee Name should not be empty')
// //             }
// //             else {
// //                 console.error(`HTTP error! status: ${error.response.status}`);
// //                 // alert(`Error:${error.response.data.detail || 'Unknown error'}`);
// //                 alert(`Error submitting data: ${error.response.data.detail || 'Unknown error'}`);
// //             }
// //         } else if (error.name === 'TypeError') {
// //             console.error('Network error: Please check if the server is running and accessible.');
// //             alert('Network error: Please check if the server is running and accessible.');
// //         } else {
// //             console.error('Error fetching data:', error);
// //             alert(`Error fetching data: ${error.message}`);
// //         }
// //     } finally {
// //         setLoading(false);
// //     }
// // };

// //     return (
// //         <Box className="section" sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
// //             <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
// //                 <CircularProgress color="inherit" />
// //             </Backdrop>
// //             <Card sx={{ width: '100%', padding: 3}}>
// //                 <CardContent>
// //                     <Grid container spacing={2} marginBottom={3}>
// //                         <Grid item xs={12} sm={6}>
// //                             <TextField
// //                                 label="Date*"
// //                                 type="date"
// //                                 fullWidth
// //                                 InputLabelProps={{ shrink: true, }}
// //                                 inputProps={{ max: new Date().toISOString().split('T')[0] }}
// //                                 value={issuance_date}
// //                                 onChange={(e) => setDate(e.target.value)}
// //                                 error={!!errors.issuance_date}
// //                                 helperText={errors.issuance_date}
// //                             />
// //                         </Grid>
// //                         <Grid item xs={12} sm={6}>
// //                             <TextField
// //                                 label="Reference Number*"
// //                                 fullWidth
// //                                 value={issuance_id}
// //                                 onChange={(e) => setReferenceNumber(e.target.value)}
// //                                 error={!!errors.issuance_id}
// //                                 helperText={errors.issuance_id}
// //                             />
// //                         </Grid>
// //                     </Grid>
// //                     <Divider sx={{ marginBottom: 3 }} />
// //                     <Typography variant="h6">Items*:</Typography>
// //                     {errors.items && <Typography color="error">{errors.items}</Typography>}

// //                     <FormControlLabel
// //                         control={
// //                             <Checkbox
// //                                 checked={issuedThings.TOOLS}
// //                                 onChange={handleTrainingTypeChange}
// //                                 name="TOOLS"
// //                             />
// //                         }
// //                         label="TOOLS"
// //                     />
// //                     <FormControlLabel
// //                         control={
// //                             <Checkbox
// //                                 checked={issuedThings.PPE}
// //                                 onChange={handleTrainingTypeChange}
// //                                 name="PPE"
// //                             />
// //                         }
// //                         label="PPE"
// //                     />
// //                     <FormControlLabel
// //                         control={
// //                             <Checkbox
// //                                 checked={issuedThings.DRESS}
// //                                 onChange={handleTrainingTypeChange}
// //                                 name="DRESS"
// //                             />
// //                         }
// //                         label="DRESS"
// //                     />

// // {issuedThings.TOOLS && (
// //     <Box marginBottom={3}>
// //         <FormControl component="fieldset">
// //             <Typography variant="h6">TOOLS</Typography>
// //             {items.tools.length > 0 ? (
// //                 <Box display="flex" justifyContent="space-between">
// //                     {[...Array(4)].map((_, chunkIndex) => (
// //                         <Box
// //                             key={chunkIndex}
// //                             display="flex"
// //                             flexDirection="column"
// //                             flex="1 0 22%" // Adjusted to ensure four sections fit in one line
// //                             marginRight={chunkIndex < 3 ? 2 : 0} // No margin on the last section
// //                             marginBottom={2}
// //                         >
// //                             {items.tools.slice(chunkIndex * 10, (chunkIndex + 1) * 10).map(tool => (
// //                                 <FormControlLabel
// //                                     key={tool.item_id}
// //                                     control={
// //                                         <Checkbox
// //                                             onChange={(e) => handleDetailsChange(e, 'TOOLS')}
// //                                             name={tool.item_id}
// //                                         />
// //                                     }
// //                                     label={tool.item_name}
// //                                 />
// //                             ))}
// //                         </Box>
// //                     ))}
// //                 </Box>
// //             ) : (
// //                 <Typography>Loading tools...</Typography>
// //             )}
// //         </FormControl>
// //         {errors.tools && <Typography color="error">{errors.tools}</Typography>}
// //     </Box>
// // )}



// // {issuedThings.PPE && (
// //     <Box marginBottom={3}>
// //         <FormControl component="fieldset">
// //             <Typography variant="h6">PPE</Typography>
// //             {items.ppes.length > 0 ? (
// //                 <Box display="flex" justifyContent="space-between">
// //                     {[...Array(4)].map((_, chunkIndex) => (
// //                         <Box
// //                             key={chunkIndex}
// //                             display="flex"
// //                             flexDirection="column"
// //                             flex="1 0 22%" // Adjusted to ensure four sections fit in one line
// //                             marginRight={chunkIndex < 3 ? 2 : 0} // No margin on the last section
// //                             marginBottom={2}
// //                         >
// //                             {items.ppes.slice(chunkIndex * 10, (chunkIndex + 1) * 10).map(ppe => (
// //                                 <FormControlLabel
// //                                     key={ppe.item_id}
// //                                     control={
// //                                         <Checkbox
// //                                             onChange={(e) => handleDetailsChange(e, 'PPE')}
// //                                             name={ppe.item_id}
// //                                         />
// //                                     }
// //                                     label={ppe.item_name}
// //                                 />
// //                             ))}
// //                         </Box>
// //                     ))}
// //                 </Box>
// //             ) : (
// //                 <Typography>Loading PPE...</Typography>
// //             )}
// //         </FormControl>
// //         {errors.ppe && <Typography color="error">{errors.ppe}</Typography>}
// //     </Box>
// // )}




// // {issuedThings.DRESS && (
// //     <Box marginBottom={3}>
// //         <FormControl component="fieldset">
// //             <Typography variant="h6">DRESS</Typography>
// //             {items.dresses.length > 0 ? (
// //                 <Box display="flex" justifyContent="space-between">
// //                     {[...Array(4)].map((_, chunkIndex) => (
// //                         <Box
// //                             key={chunkIndex}
// //                             display="flex"
// //                             flexDirection="column"
// //                             flex="1 0 22%" // Adjusted to ensure four sections fit in one line
// //                             marginRight={chunkIndex < 3 ? 2 : 0} // No margin on the last section
// //                             marginBottom={2}
// //                         >
// //                             {items.dresses.slice(chunkIndex * 10, (chunkIndex + 1) * 10).map(dress => (
// //                                 <FormControlLabel
// //                                     key={dress.item_id}
// //                                     control={
// //                                         <Checkbox
// //                                             onChange={(e) => handleDetailsChange(e, 'DRESS')}
// //                                             name={dress.item_id}
// //                                         />
// //                                     }
// //                                     label={dress.item_name}
// //                                 />
// //                             ))}
// //                         </Box>
// //                     ))}
// //                 </Box>
// //             ) : (
// //                 <Typography>Loading dresses...</Typography>
// //             )}
// //         </FormControl>
// //         {errors.dress && <Typography color="error">{errors.dress}</Typography>}
// //     </Box>
// // )}

// //                     <Divider sx={{ marginBottom: 3 }} />
// //                     <Box marginBottom={3}>
// //                         <Typography variant="h6">EMPLOYEE DETAILS*:</Typography>
// //                         <Training4 onChange={handleEmployeesChange} />
// //                         {errors.employees && <Typography color="error">{errors.employees}</Typography>}
// //                     </Box>
// //                     <Grid item xs={12}>
// //                         <FormControl fullWidth margin="normal">
// //                             <TextField
// //                                 label="Description...."
// //                                 multiline
// //                                 rows={4}
// //                                 value={about_the_newissuance}
// //                                 onChange={handleReport}
// //                             />
// //                         </FormControl>
// //                     </Grid>
// //                     <Imagecompression setCompressedImageBase64={setCompressedImageBase64} />
// //                     <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
// //                         <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
// //                     </Box>
// //                 </CardContent>
// //             </Card>
// //         </Box>
// //     );
// // };

// // export default Newissuance;






// import React, { useState, useEffect } from 'react';
// import Training4 from '../training1/Training4';
// import { Box, Typography, TextField, FormControlLabel, FormControl, Card, CardContent, Divider, Grid, Checkbox, Button, Backdrop, CircularProgress } from '@mui/material';
// import Imagecompression from '../imagecompression/Imagecompression';
// import { useSelector } from 'react-redux';
// import api from "src/api";

// const Newissuance = () => {
//     const userInfo = useSelector((state) => state.userInfo);
//     const [issuedThings, setIssuedThings] = useState({ TOOLS: false, PPE: false, DRESS: false, });
//     const [ppeDetails, setPpeDetails] = useState([]);
//     const [toolDetails, setToolDetails] = useState([]);
//     const [dressDetails, setDressDetails] = useState([]);
//     const [issuance_date, setDate] = useState(new Date().toISOString().split('T')[0]);
//     const [issuance_id, setReferenceNumber] = useState('');
//     const [white_level_id, setDropdownValue] = useState(userInfo.whitelevel_id);
//     const [compressedImageBase64, setCompressedImageBase64] = useState('');
//     const [employees, setEmployees] = useState([]);
//     const [errors, setErrors] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [about_the_newissuance, setAboutTheNewIssuance] = useState('');
//     const [items, setItems] = useState({ tools: [], ppes: [], dresses: [] });
//      const [state, setState] = useState({
//         option1: false,
//       });
//     const [checkedItems, setCheckedItems] = useState({});



//     useEffect(() => {
//         const fetchItems = async () => {
//             try {
//                 const response = await api.get('/item/getAll/');
//                 const data = response.data;
//                 // Parsing data based on item_type_name
//                 const tools = data.filter(item_id => item_id.item_type.item_type_name === "Tool");
//                 const ppes = data.filter(item_id => item_id.item_type.item_type_name === "PPE");
//                 const dresses = data.filter(item_id => item_id.item_type.item_type_name === "Dress");
//                 setItems({ tools, ppes, dresses });
//             } catch (error) {
//                 console.error('Error fetching items:', error);
//             }
//         };

//         // fetchAccidentData(issuance_id);
//         fetchItems();
//         // fetchAccidentData();
//     }, []);

//     const handleChange = async (event) => {
//         const { name, checked } = event.target;
    
//         // Update checkbox state
//         // setState({
//         //     ...state,
//         //     [name]: checked,
//         // });
    
//         if (!issuance_id) {
//             alert("Issuance ID is required to fetch details.");
//             return;
//         }
    
//         // if (!checked) {
//         //     // If checkbox is unchecked, reset accident data
//         //     resetForm();
//         //     return;
//         // }
    
//         try {
//             const response = await api.post("/item/get-details/", {
//                 issue_id: issuance_id,
//                 whitelevel_id: white_level_id,
//             });
//             const data = response.data;
    
//             if (data) {
//                 // Set issuance date
//                 setDate(data.new_issuance.issuance_date);
    
//                 // Set issued items
//                // Update issuedThings state
//                 const updatedIssuedThings = {
//                     TOOLS: data.issued_things.some(item => item.item_type_id === "1"),
//                     PPE: data.issued_things.some(item => item.item_type_id === "2"),
//                     DRESS: data.issued_things.some(item => item.item_type_id === "3"),
//                 };
//                 setIssuedThings(updatedIssuedThings);

//                 // Categorize items
//                 const tools = data.issued_things.filter(item => item.item_type_id === "1");
//                 const ppes = data.issued_things.filter(item => item.item_type_id === "2");
//                 const dresses = data.issued_things.filter(item => item.item_type_id === "3");

//                 // Set categorized items in state
//                 setItems({ tools, ppes, dresses });

//                 // Set checked state for checkboxes based on fetched data
//                 // const checkedItems = data.issued_things.reduce((acc, item) => {
//                 //     acc[item.item] = true; // Mark item_id as checked
//                 //     return acc;
//                 // }, {});
//                 // setCheckedItems(checkedItems);

                
    
//                 // Set employees to whom items were issued
//                 setEmployees(
//                     data.issued_to_employees.map((employee) => ({
//                         employee_id: employee.employee,
//                         employee_name: employee.employee_name,
//                     }))
//                 );
    
//                 // Set compressed image
//                 setCompressedImageBase64(data.new_issuance.newIssuance_image);
//                 setAboutTheNewIssuance(data.new_issuance.about_the_newissuance)
//             } else {
//                 alert("No issuance data found. Please check the reference number.");
//             }
//         } catch (error) {
//             console.error("Error fetching issuance data:", error);
//             setErrors({ fetch: "Failed to fetch issuance data. Please try again." });
//         }
//     };

//     const handleUpdate = async (event) => {
//         event.preventDefault();
//         setLoading(true);
//         const issued_things = [
//             ...toolDetails.map(tool => ({ item: tool.item})),
//             ...ppeDetails.map(ppe => ({ item: ppe.item })),
//             ...dressDetails.map(dress => ({ item: dress.item })),
//         ];
//         // setErrors(null);
//        const formData ={
//         issuance_id,
//         whitelevel_id :white_level_id,
//         issuance_date,
//         newIssuance_image:compressedImageBase64,
//         about_the_newissuance,
//          issued_things,
//         issued_to_employees:employees.map(({ employee_id }) => ({
//             employee:employee_id,
           
//         })),

//        }

//         try {
//           const response = await api.put("item/newissuance-update/", formData);
//           console.log('Updated NewIssuance:', response.data);
//           alert('Updated NewIssuance:', response.data);
//           // Handle success for updating the accident
//         } catch (err) {
//           console.error('Error:', err);
//           setErrors('An error occurred while updating the accident.');
//         } finally {
//           setLoading(false);
//         }
//       };


//     const handleTrainingTypeChange = (event) => {
//         const { name, checked } = event.target;
//         setIssuedThings((prev) => ({ ...prev, [name]: checked }));
//     };

//     const handleDetailsChange = (event, type) => {
//         const { name, checked } = event.target;
//         const updateDetails = (details, name, checked) => {
//             if (checked) {
//                 return [...details, { item: name }];
//             } else {
//                 return details.filter(detail => detail.item !== name);
//             }
//         };
//         if (type === 'TOOLS') {
//             setToolDetails((prev) => updateDetails(prev, name, checked));
//         }
//         if (type === 'PPE') {
//             setPpeDetails((prev) => updateDetails(prev, name, checked));
//         }
//         if (type === 'DRESS') {
//             setDressDetails((prev) => updateDetails(prev, name, checked));
//         }
//         // setCheckedItems(prevState => ({
//         //     ...prevState,
//         //     [itemId]: !prevState[itemId] // Toggle the checked state
//         // }));
//     };

//     const handleDropdownChange = (event) => {
//         // setDropdownValue(event.target.value);
//     };

//     const handleEmployeesChange = (employeeDetails) => {
//         setEmployees(employeeDetails);
//     };

//     const handleReport = (e) => {
//         setAboutTheNewIssuance(e.target.value);
//     };


//     const validateForm = () => {
//         let formErrors = {};

//         // Other validations...
//         if (!issuance_date) formErrors.issuance_date = 'Issuance date is required';
//         const referenceNumberPattern = /^[A-Za-z0-9/-]+$/; // Allows alphanumeric characters, hyphens, and slashes
//         if (!issuance_id) {
//             formErrors.issuance_id = 'Reference number is required';
//         } else if (issuance_id.length < 3 || issuance_id.length > 21) {
//             formErrors.issuance_id = 'Reference number must be between 3 and 21 characters';
//         } else if (!referenceNumberPattern.test(issuance_id)) {
//             formErrors.issuance_id = 'Reference number can only contain letters, numbers, hyphens, and slashes';
//         }
//         if (issuedThings.TOOLS && toolDetails.length === 0) formErrors.tools = 'At least one tool must be selected';
//         if (issuedThings.PPE && ppeDetails.length === 0) formErrors.ppe = 'At least one PPE must be selected';
//         if (issuedThings.DRESS && dressDetails.length === 0) formErrors.dress = 'At least one dress must be selected';
//         if (employees.length === 0) {
//             formErrors.employees = 'Employee details are required';
//         } else {
//             // Check if employee_name or employee_id is empty for any employee
//             employees.forEach(({ employee_id, employee_name }, index) => {
//                 if (!employee_id || !employee_name) {
//                     formErrors.employees = `Employee ID and Name cannot be empty for entry #${index + 1}`;
//                 }
//             });
//         }
//         if (!issuedThings.TOOLS && !issuedThings.PPE && !issuedThings.DRESS) formErrors.items = 'At least one item category must be selected';

//         setErrors(formErrors);
//         return Object.keys(formErrors).length === 0;
//     };

//     const resetForm = () => {
//         setIssuedThings({ TOOLS: false, PPE: false, DRESS: false }); // Reset issued categories
//         setPpeDetails([]); // Reset PPE details
//         setToolDetails([]); // Reset Tool details
//         setDressDetails([]); // Reset Dress details
//         setDate(new Date().toISOString().split('T')[0]); // Reset issuance date to today's date
//         setReferenceNumber(''); // Reset reference number
//         setCompressedImageBase64(''); // Clear the compressed image base64
//         setErrors({}); // Clear errors
//         setAboutTheNewIssuance(''); // Clear issuance description

//         // Preserve these fields
//          setEmployees([]);
//         //  <-- Comment this line if you want to preserve employee details-->
//         // setDropdownValue(userInfo.whitelevel_id); <-- Comment this if dropdown should not reset
        
//     };
// const handleSubmit = async () => {
//     if (!validateForm()) {
//         return;
//     }
//     setLoading(true);

//     const issued_things = [
//         ...toolDetails.map(tool => ({ item: tool.item })),
//         ...ppeDetails.map(ppe => ({ item: ppe.item  })),
//         ...dressDetails.map(dress => ({ item: dress.item })),
//     ];
//     const formData = {
//         issuance: {
//             issuance_id,
//             white_level_id,
//             issuance_date,
//             newIssuance_image: compressedImageBase64 || null,
//             about_the_newissuance,
//         },
        
//         issued_things,
//         employees: employees.map(({ employee_id, employee_name, whitelevel_id }) => ({
//             employee_id,
//             employee_name,
//             whitelevel_id,
//         })),
//     }; 
//     console.log('Submitting the following data:');
//     console.log(JSON.stringify(formData, null, 2));

//     try {
//         const response = await api.post('/item/new/', formData);
//         const result = response.data.message;
//         console.log('Data submitted successfully:', result);
//         alert('New Issuance Successfully submitted.');

//         resetForm(); // Call resetForm after submission
//     } catch (error) {
//         // Error handling logic
//         console.error('Error submitting data:', error);
//         alert(`Error submitting data: ${error.message}`);
//     } finally {
//         setLoading(false);
//     }
// };

//     return (
//         <Box className="section" sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
//             <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
//                 <CircularProgress color="inherit" />
//             </Backdrop>
//             <Card sx={{ width: '100%', padding: 3}}>
//                 <CardContent>
//                     <Grid container spacing={2} marginBottom={3}>
//                         <Grid item xs={12} sm={5.5}>
//                             <TextField
//                                 label="Date*"
//                                 type="date"
//                                 fullWidth
//                                 InputLabelProps={{ shrink: true, }}
//                                 inputProps={{ max: new Date().toISOString().split('T')[0] }}
//                                 value={issuance_date}
//                                 onChange={(e) => setDate(e.target.value)}
//                                 error={!!errors.issuance_date}
//                                 helperText={errors.issuance_date}
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={5.5}>
//                             <TextField
//                                 label="Reference Number*"
//                                 fullWidth
//                                 value={issuance_id}
//                                 onChange={(e) => setReferenceNumber(e.target.value)}
//                                 error={!!errors.issuance_id}
//                                 helperText={errors.issuance_id}
//                             />
//                              {/* <FormControlLabel
//                               control={
//                               <Checkbox
//                                checked={state.option1}
//                                onChange={handleChange}
//                                name="option1"
//                              />
//                             }
//                                                 // label="Option 1"
//                          /> */}
//                         </Grid>
//                         <Grid item xs={12} sm={1} sx={{marginTop:'10px'}}kk>
//                             <Button
//                          variant="contained"
                                                             
//                             color="secondary"
//                         onClick={handleChange}
//                         fullWidth
//                         disabled={loading}
                                                               
                                                            
//                         >
//                          ok 
//                         </Button>

//                         </Grid>
//                     </Grid>
//                     <Divider sx={{ marginBottom: 3 }} />
//                     <Typography variant="h6">Items*:</Typography>
//                     {errors.items && <Typography color="error">{errors.items}</Typography>}

//                     <FormControlLabel
//                         control={
//                             <Checkbox
//                                 checked={issuedThings.TOOLS}
//                                 onChange={handleTrainingTypeChange}
//                                 name="TOOLS"
//                             />
//                         }
//                         label="TOOLS"
//                     />
//                     <FormControlLabel
//                         control={
//                             <Checkbox
//                                 checked={issuedThings.PPE}
//                                 onChange={handleTrainingTypeChange}
//                                 name="PPE"
//                             />
//                         }
//                         label="PPE"
//                     />
//                     <FormControlLabel
//                         control={
//                             <Checkbox
//                                 checked={issuedThings.DRESS}
//                                 onChange={handleTrainingTypeChange}
//                                 name="DRESS"
//                             />
//                         }
//                         label="DRESS"
//                     />

// {issuedThings.TOOLS && (
//     <Box marginBottom={3}>
//         <FormControl component="fieldset">
//             <Typography variant="h6">TOOLS</Typography>
//             {(items?.tools ?? []).length > 0 ? (
//                 <Box display="flex" justifyContent="space-between">
//                     {[...Array(4)].map((_, chunkIndex) => (
//                         <Box
//                             key={chunkIndex}
//                             display="flex"
//                             flexDirection="column"
//                             flex="1 0 22%" // Adjusted to ensure four sections fit in one line
//                             marginRight={chunkIndex < 3 ? 2 : 0} // No margin on the last section
//                             marginBottom={2}
//                         >
//                             {items.tools.slice(chunkIndex * 10, (chunkIndex + 1) * 10).map(tool => (
//                                 <FormControlLabel
//                                     key={tool.item_id}
//                                     control={
//                                         <Checkbox
//                                         //   checked={!!checkedItems[tool.item]} 
//                                             onChange={(e) => handleDetailsChange(e, 'TOOLS')}
//                                             name={tool.item_id}
//                                             // value={tool.item_id}
//                                         />
//                                     }
//                                     label={tool.item_name}
//                                 />
//                             ))}
//                         </Box>
//                     ))}
//                 </Box>
//             ) : (
//                 <Typography>Loading tools...</Typography>
//             )}
//         </FormControl>
//         {errors.tools && <Typography color="error">{errors.tools}</Typography>}
//     </Box>
// )}



// {issuedThings.PPE && (
//     <Box marginBottom={3}>
//         <FormControl component="fieldset">
//             <Typography variant="h6">PPE</Typography>
//             {(items?.ppes ?? []).length > 0 ? (
//                 <Box display="flex" justifyContent="space-between">
//                     {[...Array(4)].map((_, chunkIndex) => (
//                         <Box
//                             key={chunkIndex}
//                             display="flex"
//                             flexDirection="column"
//                             flex="1 0 22%" // Adjusted to ensure four sections fit in one line
//                             marginRight={chunkIndex < 3 ? 2 : 0} // No margin on the last section
//                             marginBottom={2}
//                         >
//                             {items.ppes.slice(chunkIndex * 10, (chunkIndex + 1) * 10).map(ppe => (
//                                 <FormControlLabel
//                                     key={ppe.item}
//                                     control={
//                                         <Checkbox
//                                         // checked={!!checkedItems[ppe.item]} 
//                                             onChange={(e) => handleDetailsChange(e, 'PPE')}
//                                             name={ppe.item_id}
//                                             // value={ppe.item_id}
//                                         />
//                                     }
//                                     label={ppe.item_name}
//                                 />
//                             ))}
//                         </Box>
//                     ))}
//                 </Box>
//             ) : (
//                 <Typography>Loading PPE...</Typography>
//             )}
//         </FormControl>
//         {errors.ppe && <Typography color="error">{errors.ppe}</Typography>}
//     </Box>
// )}




// {issuedThings.DRESS && (
//     <Box marginBottom={3}>
//         <FormControl component="fieldset">
//             <Typography variant="h6">DRESS</Typography>
//             {(items?.dresses ?? []).length > 0 ? (
//                 <Box display="flex" justifyContent="space-between">
//                     {[...Array(4)].map((_, chunkIndex) => (
//                         <Box
//                             key={chunkIndex}
//                             display="flex"
//                             flexDirection="column"
//                             flex="1 0 22%" // Adjusted to ensure four sections fit in one line
//                             marginRight={chunkIndex < 3 ? 2 : 0} // No margin on the last section
//                             marginBottom={2}
//                         >
//                             {items.dresses.slice(chunkIndex * 10, (chunkIndex + 1) * 10).map(dress => (
//                                 <FormControlLabel
//                                     key={dress.item}
//                                     control={
//                                         <Checkbox
//                                         //   checked={!!checkedItems[dress.item]} 
//                                             onChange={(e) => handleDetailsChange(e, 'DRESS')}
//                                             name={dress.item_id}
//                                         />
//                                     }
//                                     label={dress.item_name}
//                                 />
//                             ))}
//                         </Box>
//                     ))}
//                 </Box>
//             ) : (
//                 <Typography>Loading dresses...</Typography>
//             )}
//         </FormControl>
//         {errors.dress && <Typography color="error">{errors.dress}</Typography>}
//     </Box>
// )}

//                     <Divider sx={{ marginBottom: 3 }} />
//                     <Box marginBottom={3}>
//                         <Typography variant="h6">EMPLOYEE DETAILS*:</Typography>
//                         <Training4 onChange={handleEmployeesChange}  initialData={employees} />
//                         {errors.employees && <Typography color="error">{errors.employees}</Typography>}
//                     </Box>
//                     <Grid item xs={12}>
//                         <FormControl fullWidth margin="normal">
//                             <TextField
//                                 label="Description...."
//                                 multiline
//                                 rows={4}
//                                 value={about_the_newissuance}
//                                 onChange={handleReport}
                               
//                             />
//                         </FormControl>
//                     </Grid>
//                     <Grid item xs={12}>
//                 <Imagecompression
//                   setCompressedImageBase64={setCompressedImageBase64}
//                   compressedImageBase64={compressedImageBase64} // Pass the value here
//                 />
//               </Grid>
//                     {/* <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
//                         <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
//                     </Box> */}
//                      <Grid container spacing={2} sx={{marginTop:'20px'}}>
//                                   <Grid item xs={12} md={6}>
//                                     <Button
//                                       variant="contained"
//                                       color="primary"
//                                       type="submit"
//                                       fullWidth
//                                       disabled={loading}
//                                       onClick={handleSubmit}
//                                     >
//                                       Submit 
//                                     </Button>
//                                   </Grid>
                    
//                                   {/* {accident_id && ( */}
//                                     <Grid item xs={12} md={6}>
//                                       <Button
//                                         variant="contained"
//                                         color="secondary"
//                                         onClick={handleUpdate}
//                                         fullWidth
//                                         disabled={loading}
//                                       >
//                                         Update NewIssuance
//                                       </Button>
//                                     </Grid>
//                                   {/* )} */}
//                                 </Grid>
                    

//                 </CardContent>
//             </Card>
//         </Box>
//     );
// };

// export default Newissuance;
 import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  FormControl,
  Card,
  CardContent,
  Divider,
  Grid,
  Checkbox,
  Button,
  Backdrop,
  CircularProgress,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Fab,
  IconButton,
} from '@mui/material'
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import Imagecompression from '../imagecompression/Imagecompression'
import { useSelector } from 'react-redux'
import api from 'src/api'

const Newissuance = () => {
  const userInfo = useSelector((state) => state.userInfo)
  const [issuedThings, setIssuedThings] = useState({ TOOLS: false, PPE: false, DRESS: false })
  const [ppeDetails, setPpeDetails] = useState([])
  const [toolDetails, setToolDetails] = useState([])
  const [dressDetails, setDressDetails] = useState([])
  const [issuance_date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [issuance_id, setReferenceNumber] = useState('')
  const [white_level_id, setDropdownValue] = useState(userInfo.whitelevel_id)
  const [compressedImageBase64, setCompressedImageBase64] = useState('')
  const [employees, setEmployees] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [about_the_newissuance, setAboutTheNewIssuance] = useState('')
  const [items, setItems] = useState({ tools: [], ppes: [], dresses: [] })
  const [state, setState] = useState({
    option1: false,
  })
  const [checkedItems, setCheckedItems] = useState({})
  const [employee_id, setEmployee_id] = useState({})
  const [employee_name, setEmployee_name] = useState({})

  const [rows, setRows] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [activeRowIndex, setActiveRowIndex] = useState(null)

  const [whitelevel_id, setWhitelevel] = useState(userInfo.whitelevel_id)

  //  useEffect(() => {
  //     if (initialData && initialData.length > 0 && rows.length === 0) {
  //       const updatedRows = initialData.map((row) => ({
  //         ...row, // Keep all the existing properties intact
  //       }));

  //       setRows(updatedRows); // Update rows whenever initialData changes

  //       // Log both initialData and updatedRows
  //       console.log('Initial data:', initialData);
  //       console.log('Updated rows after initialData change:', updatedRows);
  //     }
  //   }, [initialData]); // This effect runs whenever initialData changes

  const fetchEmployeeName = async (employee_id) => {
    try {
      const response = await api.post(`/employee/name/`, {
        employee_id,
        whitelevel_id,
      })
      return response.data.employee_name || ''
    } catch (error) {
      console.error('Error fetching employee name:', error)
      return ''
    }
  }

  const fetchEmployeeSuggestions = async (nameQuery) => {
    try {
      const response = await api.get(`/employee/search/?nameQuery=${nameQuery}`)
      return response.data || []
    } catch (error) {
      console.error('Error fetching employee suggestions:', error)
      return []
    }
  }

  // useEffect(() => {
  //   onChange(
  //     rows.map((row) => ({
  //       employee: row.employee_id,
  //       employee_id: row.employee_id,
  //       employee_name: row.employee_name,
  //       whitelevel_id: whitelevel_id,
  //       trainee_id: row.employee_id,
  //       trainee_name: row.employee_name,
  //     })),
  //   )
  // }, [rows, onChange])

  const handleAddRow = () => {
    const hasEmptyFields = rows.some(
      (row) => row.employee_id.trim() === '' || row.employee_name.trim() === '',
    )

    if (hasEmptyFields) {
      alert('Please fill in all the fields before adding a new row.')
      const updatedRows = rows.map((row) => ({
        ...row,
        error:
          row.employee_id.trim() === '' || row.employee_name.trim() === ''
            ? 'empty_field'
            : row.error,
      }))
      setRows(updatedRows)
      console.log('Updated rows after adding a row with empty fields:', updatedRows) // Log the updated rows
      return
    }

    const updatedRows = [
      ...rows,
      { employee_id: '', whitelevel_id, employee_name: '', error: null, disableNameField: false },
    ]
    setRows(updatedRows)
    console.log('Updated rows after adding a new row:', updatedRows) // Log the updated rows
  }

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index)
    setRows(updatedRows)
    console.log('Updated rows after deleting a row:', updatedRows) // Log the updated rows
  }

  const handleInputChange = async (index, event) => {
    const { name, value } = event.target
    const updatedRows = [...rows]
    updatedRows[index][name] = value.trim()

    if (name === 'employee_id') {
      const isDuplicateID = updatedRows.some((row, i) => row.employee_id === value && i !== index)

      if (isDuplicateID) {
        updatedRows[index].error = 'duplicate'
        updatedRows[index].employee_name = '' // Clear the employee name field
        updatedRows[index].disableNameField = true // Disable the employee name field
      } else if (value.trim() !== '') {
        const employee_name = await fetchEmployeeName(value)
        if (employee_name) {
          updatedRows[index].employee_name = employee_name
          updatedRows[index].error = null
          updatedRows[index].disableNameField = true // Disable the employee name field
        } else {
          updatedRows[index].employee_name = ''
          updatedRows[index].error = 'invalid'
          updatedRows[index].disableNameField = true // Disable the employee name field when employee does not exist
        }
      } else {
        updatedRows[index].employee_name = ''
        updatedRows[index].error = null
        updatedRows[index].disableNameField = false // Enable the employee name field
      }
    }

    setRows(updatedRows)
    console.log('Updated rows after employee_id input change:', updatedRows) // Log the updated rows
  }

  const handleNameInputChange = async (index, event) => {
    const value = event.target.value
    const updatedRows = [...rows]

    // Regular expression to allow only letters, spaces, and dots
    const validNameRegex = /^[a-zA-Z\s.]*$/

    if (validNameRegex.test(value)) {
      updatedRows[index].employee_name = value

      if (value.trim() !== '') {
        const isDuplicateName = updatedRows.some(
          (row, i) => row.employee_name === value && i !== index,
        )

        if (isDuplicateName) {
          updatedRows[index].error = 'duplicate_name'
          updatedRows[index].disableIDField = true // Disable the Employee ID field
        } else {
          const suggestions = await fetchEmployeeSuggestions(value)
          setSuggestions(suggestions)
          setActiveRowIndex(index)
          updatedRows[index].disableIDField = false // Enable the Employee ID field
        }
      } else {
        setSuggestions([])
        setActiveRowIndex(null)
        updatedRows[index].disableIDField = false // Enable the Employee ID field
      }

      // Check if the name matches the employee ID
      const correctName = await fetchEmployeeName(updatedRows[index].employee_id)
      if (value.trim() !== correctName) {
        updatedRows[index].error = 'name_mismatch'
      } else {
        updatedRows[index].error = null
      }
    } else {
      updatedRows[index].error = 'invalid_name'
    }

    setRows(updatedRows)
    console.log('Updated rows after employee_name input change:', updatedRows) // Log the updated rows
  }

  const handleSuggestionClick = (index, suggestion) => {
    const updatedRows = [...rows]
    const isDuplicateID = updatedRows.some(
      (row) => row.employee_id === suggestion.employee_id && row !== updatedRows[index],
    )

    if (isDuplicateID) {
      updatedRows[index].error = 'duplicate'
      updatedRows[index].disableNameField = true // Disable the Employee Name field
    } else {
      updatedRows[index].employee_id = suggestion.employee_id
      updatedRows[index].employee_name = suggestion.employee_name
      updatedRows[index].error = null
      updatedRows[index].disableNameField = true // Disable the Employee Name field
    }

    setRows(updatedRows)
    setSuggestions([])
    setActiveRowIndex(null)
    console.log('Updated rows after suggestion click:', updatedRows) // Log the updated rows
  }

  const handleSuggestionMouseEnter = (idx) => {
    setSelectedIndex(idx)
  }

  const handleSuggestionMouseLeave = () => {
    setSelectedIndex(null)
  }

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/item/getAll/')
        const data = response.data
        // Parsing data based on item_type_name
        const tools = data.filter((item_id) => item_id.item_type.item_type_name === 'Tool')
        const ppes = data.filter((item_id) => item_id.item_type.item_type_name === 'PPE')
        const dresses = data.filter((item_id) => item_id.item_type.item_type_name === 'Dress')
        setItems({ tools, ppes, dresses })
      } catch (error) {
        console.error('Error fetching items:', error)
      }
    }

    // fetchAccidentData(issuance_id);
    fetchItems()
    // fetchAccidentData();
  }, [])

  const handleChange = async (event) => {
    const { name, checked } = event.target

    // Update checkbox state
    // setState({
    //     ...state,
    //     [name]: checked,
    // });

    if (!issuance_id) {
      alert('Issuance ID is required to fetch details.')
      return
    }

    // if (!checked) {
    //     // If checkbox is unchecked, reset accident data
    //     resetForm();
    //     return;
    // }

    try {
      const response = await api.post('/item/get-details/', {
        issue_id: issuance_id,
        whitelevel_id: white_level_id,
      })
      const data = response.data

      if (data) {
        // Set issuance date
        setDate(data.new_issuance.issuance_date)

        // Set issued items
        // Update issuedThings state
        const updatedIssuedThings = {
          TOOLS: data.issued_things.some((item) => item.item_type_id === '1'),
          PPE: data.issued_things.some((item) => item.item_type_id === '2'),
          DRESS: data.issued_things.some((item) => item.item_type_id === '3'),
        }
        setIssuedThings(updatedIssuedThings)

        // Categorize items
        const tools = data.issued_things.filter((item) => item.item_type_id === '1')
        const ppes = data.issued_things.filter((item) => item.item_type_id === '2')
        const dresses = data.issued_things.filter((item) => item.item_type_id === '3')

        // Set categorized items in state
        setItems({ tools, ppes, dresses })

        // Set checked state for checkboxes based on fetched data
        // const checkedItems = data.issued_things.reduce((acc, item) => {
        //     acc[item.item] = true; // Mark item_id as checked
        //     return acc;
        // }, {});
        // setCheckedItems(checkedItems);

        // Set employees to whom items were issued
        setRows(
          data.issued_to_employees.map((employee) => ({
            employee_id: employee.employee,
            employee_name: employee.employee_name,
          })),
        )

        // Set compressed image
        setCompressedImageBase64(data.new_issuance.newIssuance_image)
        setAboutTheNewIssuance(data.new_issuance.about_the_newissuance)
      } else {
        alert('No issuance data found. Please check the reference number.')
      }
    } catch (error) {
      console.error('Error fetching issuance data:', error)
      setErrors({ fetch: 'Failed to fetch issuance data. Please try again.' })
    }
  }

  const handleUpdate = async (event) => {
    event.preventDefault()
    setLoading(true)
    const issued_things = [
      ...toolDetails.map((tool) => ({ item: tool.item })),
      ...ppeDetails.map((ppe) => ({ item: ppe.item })),
      ...dressDetails.map((dress) => ({ item: dress.item })),
    ]
    // setErrors(null);
    const formData = {
      issuance_id,
      whitelevel_id: white_level_id,
      issuance_date,
      newIssuance_image: compressedImageBase64,
      about_the_newissuance,
      issued_things,
      issued_to_employees: rows.map(({ employee_id }) => ({
        employee: employee_id,
      })),
    }

    try {
      const response = await api.put('item/newissuance-update/', formData)
      console.log('Updated NewIssuance SucessFully:', response.data)
      alert('Updated NewIssuance SucessFully:', response.data)
      resetForm();
      // Handle success for updating the accident
    } catch (err) {
      console.error('Error:', err)
      setErrors('An error occurred while updating the NewIssuance.')
    } finally {
      setLoading(false)
    }
  }

  const handleTrainingTypeChange = (event) => {
    const { name, checked } = event.target
    setIssuedThings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleDetailsChange = (event, type) => {
    const { name, checked } = event.target
    const updateDetails = (details, name, checked) => {
      if (checked) {
        return [...details, { item: name }]
      } else {
        return details.filter((detail) => detail.item !== name)
      }
    }
    if (type === 'TOOLS') {
      setToolDetails((prev) => updateDetails(prev, name, checked))
    }
    if (type === 'PPE') {
      setPpeDetails((prev) => updateDetails(prev, name, checked))
    }
    if (type === 'DRESS') {
      setDressDetails((prev) => updateDetails(prev, name, checked))
    }
    // setCheckedItems(prevState => ({
    //     ...prevState,
    //     [itemId]: !prevState[itemId] // Toggle the checked state
    // }));
  }

  const handleDropdownChange = (event) => {
    // setDropdownValue(event.target.value);
  }

  // const handleEmployeesChange = (employeeDetails) => {
  //   setEmployees(employeeDetails)
  // }

  const handleReport = (e) => {
    setAboutTheNewIssuance(e.target.value)
  }

  const validateForm = () => {
    let formErrors = {}

    // Other validations...
    if (!issuance_date) formErrors.issuance_date = 'Issuance date is required'
    const referenceNumberPattern = /^[A-Za-z0-9/-]+$/ // Allows alphanumeric characters, hyphens, and slashes
    if (!issuance_id) {
      formErrors.issuance_id = 'Reference number is required'
    } else if (issuance_id.length < 3 || issuance_id.length > 21) {
      formErrors.issuance_id = 'Reference number must be between 3 and 21 characters'
    } else if (!referenceNumberPattern.test(issuance_id)) {
      formErrors.issuance_id =
        'Reference number can only contain letters, numbers, hyphens, and slashes'
    }
    if (issuedThings.TOOLS && toolDetails.length === 0)
      formErrors.tools = 'At least one tool must be selected'
    if (issuedThings.PPE && ppeDetails.length === 0)
      formErrors.ppe = 'At least one PPE must be selected'
    if (issuedThings.DRESS && dressDetails.length === 0)
      formErrors.dress = 'At least one dress must be selected'
    if (rows.length === 0) {
      formErrors.rows = 'Employee details are required'
    } else {
      // Check if employee_name or employee_id is empty for any employee
      rows.forEach(({ employee_id, employee_name }, index) => {
        if (!employee_id || !employee_name) {
          formErrors.rows = `Employee ID and Name cannot be empty for entry #${index + 1}`
        }
      })
    }
    if (!issuedThings.TOOLS && !issuedThings.PPE && !issuedThings.DRESS)
      formErrors.items = 'At least one item category must be selected'

    setErrors(formErrors)
    return Object.keys(formErrors).length === 0
  }

  const resetForm = () => {
    setIssuedThings({ TOOLS: false, PPE: false, DRESS: false }) // Reset issued categories
    setPpeDetails([]) // Reset PPE details
    setToolDetails([]) // Reset Tool details
    setDressDetails([]) // Reset Dress details
    setDate(new Date().toISOString().split('T')[0]) // Reset issuance date to today's date
    setReferenceNumber('') // Reset reference number
    setCompressedImageBase64('') // Clear the compressed image base64
    setErrors({}) // Clear errors
    setAboutTheNewIssuance('') // Clear issuance description

    // Preserve these fields
    // setEmployees([])
    setRows([])
    //  <-- Comment this line if you want to preserve employee details-->
    // setDropdownValue(userInfo.whitelevel_id); <-- Comment this if dropdown should not reset
  }
  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }
    setLoading(true)

    const issued_things = [
      ...toolDetails.map((tool) => ({ item: tool.item })),
      ...ppeDetails.map((ppe) => ({ item: ppe.item })),
      ...dressDetails.map((dress) => ({ item: dress.item })),
    ]
    const formData = {
      issuance: {
        issuance_id,
        white_level_id,
        issuance_date,
        newIssuance_image: compressedImageBase64 || null,
        about_the_newissuance,
      },

      issued_things,
      employees: rows.map(({ employee_id, employee_name, whitelevel_id }) => ({
        employee_id,
        employee_name,
        whitelevel_id,
      })),
    }

    try {
      const response = await api.post('/item/new/', formData)

      const result = response.data.message
      console.log('Data submitted successfully:', result)
      alert('New Issuance Successfully submitted.')

      resetForm() // Call resetForm after submission
    } catch (error) {
      // Error handling logic
      console.error('Error submitting data:', error)
      alert(`Error submitting data: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box className="section" sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Card sx={{ width: '100%', padding: 3 }}>
        <CardContent>
          <Grid container spacing={2} marginBottom={3}>
            <Grid item xs={12} sm={5.5}>
              <TextField
                label="Date*"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: new Date().toISOString().split('T')[0] }}
                value={issuance_date}
                onChange={(e) => setDate(e.target.value)}
                error={!!errors.issuance_date}
                helperText={errors.issuance_date}
              />
            </Grid>
            <Grid item xs={12} sm={5.5}>
              <TextField
                label="Reference Number*"
                fullWidth
                value={issuance_id}
                onChange={(e) => setReferenceNumber(e.target.value)}
                error={!!errors.issuance_id}
                helperText={errors.issuance_id}
              />
              {/* <FormControlLabel
                              control={
                              <Checkbox
                               checked={state.option1}
                               onChange={handleChange}
                               name="option1"
                             />
                            }
                                                // label="Option 1"
                         /> */}
            </Grid>
            <Grid item xs={12} sm={1}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleChange}
                fullWidth
                disabled={loading}
              >
                ok
              </Button>
            </Grid>
          </Grid>
          <Divider sx={{ marginBottom: 3 }} />
          <Typography variant="h6">Items*:</Typography>
          {errors.items && <Typography color="error">{errors.items}</Typography>}

          <FormControlLabel
            control={
              <Checkbox
                checked={issuedThings.TOOLS}
                onChange={handleTrainingTypeChange}
                name="TOOLS"
              />
            }
            label="TOOLS"
          />
          <FormControlLabel
            control={
              <Checkbox checked={issuedThings.PPE} onChange={handleTrainingTypeChange} name="PPE" />
            }
            label="PPE"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={issuedThings.DRESS}
                onChange={handleTrainingTypeChange}
                name="DRESS"
              />
            }
            label="DRESS"
          />

          {issuedThings.TOOLS && (
            <Box marginBottom={3}>
              <FormControl component="fieldset">
                <Typography variant="h6">TOOLS</Typography>
                {(items?.tools ?? []).length > 0 ? (
                  <Box display="flex" justifyContent="space-between">
                    {[...Array(4)].map((_, chunkIndex) => (
                      <Box
                        key={chunkIndex}
                        display="flex"
                        flexDirection="column"
                        flex="1 0 22%" // Adjusted to ensure four sections fit in one line
                        marginRight={chunkIndex < 3 ? 2 : 0} // No margin on the last section
                        marginBottom={2}
                      >
                        {items.tools.slice(chunkIndex * 10, (chunkIndex + 1) * 10).map((tool) => (
                          <FormControlLabel
                            key={tool.item_id}
                            control={
                              <Checkbox
                                //   checked={!!checkedItems[tool.item]}
                                onChange={(e) => handleDetailsChange(e, 'TOOLS')}
                                name={tool.item_id}
                                // value={tool.item_id}
                              />
                            }
                            label={tool.item_name}
                          />
                        ))}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography>Loading tools...</Typography>
                )}
              </FormControl>
              {errors.tools && <Typography color="error">{errors.tools}</Typography>}
            </Box>
          )}

          {issuedThings.PPE && (
            <Box marginBottom={3}>
              <FormControl component="fieldset">
                <Typography variant="h6">PPE</Typography>
                {(items?.ppes ?? []).length > 0 ? (
                  <Box display="flex" justifyContent="space-between">
                    {[...Array(4)].map((_, chunkIndex) => (
                      <Box
                        key={chunkIndex}
                        display="flex"
                        flexDirection="column"
                        flex="1 0 22%" // Adjusted to ensure four sections fit in one line
                        marginRight={chunkIndex < 3 ? 2 : 0} // No margin on the last section
                        marginBottom={2}
                      >
                        {items.ppes.slice(chunkIndex * 10, (chunkIndex + 1) * 10).map((ppe) => (
                          <FormControlLabel
                            key={ppe.item}
                            control={
                              <Checkbox
                                // checked={!!checkedItems[ppe.item]}
                                onChange={(e) => handleDetailsChange(e, 'PPE')}
                                name={ppe.item_id}
                                // value={ppe.item_id}
                              />
                            }
                            label={ppe.item_name}
                          />
                        ))}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography>Loading PPE...</Typography>
                )}
              </FormControl>
              {errors.ppe && <Typography color="error">{errors.ppe}</Typography>}
            </Box>
          )}

          {issuedThings.DRESS && (
            <Box marginBottom={3}>
              <FormControl component="fieldset">
                <Typography variant="h6">DRESS</Typography>
                {(items?.dresses ?? []).length > 0 ? (
                  <Box display="flex" justifyContent="space-between">
                    {[...Array(4)].map((_, chunkIndex) => (
                      <Box
                        key={chunkIndex}
                        display="flex"
                        flexDirection="column"
                        flex="1 0 22%" // Adjusted to ensure four sections fit in one line
                        marginRight={chunkIndex < 3 ? 2 : 0} // No margin on the last section
                        marginBottom={2}
                      >
                        {items.dresses
                          .slice(chunkIndex * 10, (chunkIndex + 1) * 10)
                          .map((dress) => (
                            <FormControlLabel
                              key={dress.item}
                              control={
                                <Checkbox
                                  //   checked={!!checkedItems[dress.item]}
                                  onChange={(e) => handleDetailsChange(e, 'DRESS')}
                                  name={dress.item_id}
                                />
                              }
                              label={dress.item_name}
                            />
                          ))}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography>Loading dresses...</Typography>
                )}
              </FormControl>
              {errors.dress && <Typography color="error">{errors.dress}</Typography>}
            </Box>
          )}

          <Divider sx={{ marginBottom: 3 }} />
          {/* <Box marginBottom={3}>
            <Typography variant="h6">EMPLOYEE DETAILS*:</Typography>
            <Training4 onChange={handleEmployeesChange} initialData={employees} />
            
          </Box> */}

          <Box sx={{ position: 'relative', backgroundColor: '#FAF9F6' }}>
            <TableContainer
              component={Paper}
              sx={{ border: '1px solid lightgrey', borderRadius: '8px', boxShadow: 'none' }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sl. No</TableCell>
                    <TableCell sx={{ pl: 12 }}>Employee ID</TableCell>
                    <TableCell sx={{ pl: 12 }}>Employee Name</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {errors.rows && <Typography color="error">{errors.rows}</Typography>}
                  {rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <TextField
                          variant="outlined"
                          size="small"
                          name="employee_id"
                          value={row.employee_id}
                          onChange={(event) => handleInputChange(index, event)}
                          fullWidth
                          required
                          error={Boolean(row.error)}
                          helperText={
                            row.error === 'duplicate'
                              ? 'Duplicate employee ID'
                              : row.error === 'invalid'
                                ? 'Employee does not exist'
                                : row.error === 'empty_field'
                                  ? 'Employee ID should not be empty'
                                  : ''
                          }
                          disabled={row.disableIDField} // Disable based on the error state
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          variant="outlined"
                          size="small"
                          name="employee_name"
                          value={row.employee_name}
                          onChange={(event) => handleNameInputChange(index, event)}
                          fullWidth
                          required
                          error={Boolean(row.error)}
                          helperText={
                            row.error === 'invalid_name'
                              ? 'Invalid characters. Only letters, spaces, and dots are allowed.'
                              : row.error === 'name_mismatch'
                                ? 'Incorrect name for the given Employee ID'
                                : row.error === 'duplicate_name'
                                  ? 'Duplicate employee name'
                                  : row.error === 'empty_field'
                                    ? 'Employee Name should not be empty'
                                    : ''
                          }
                          disabled={row.disableNameField} // Disable based on the error state
                        />

                        {index === activeRowIndex && suggestions.length > 0 && (
                          <div
                            style={{
                              position: 'absolute',
                              zIndex: 1000,
                              width: '100%',
                              backgroundColor: '#fff',
                              border: '1px solid lightgrey',
                              borderRadius: '4px',
                              boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                              marginTop: '4px',
                            }}
                          >
                            {suggestions.map((suggestion, idx) => (
                              <div
                                key={suggestion.employee_id}
                                style={{
                                  padding: '8px',
                                  backgroundColor: selectedIndex === idx ? '#f0f0f0' : '#fff',
                                  cursor: 'pointer',
                                }}
                                onMouseEnter={() => handleSuggestionMouseEnter(idx)}
                                onMouseLeave={handleSuggestionMouseLeave}
                                onClick={() => handleSuggestionClick(index, suggestion)}
                              >
                                {suggestion.employee_name}
                              </div>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton aria-label="delete" onClick={() => handleDeleteRow(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box mt={2}>
              <Fab
                size="small"
                color="primary"
                aria-label="add"
                onClick={handleAddRow}
                sx={{
                  position: 'absolute',
                  bottom: -18,
                  left: '49%',
                  transform: 'translateX(-50%)',
                  boxShadow: 'none',
                  zIndex: 1,
                }}
              >
                <AddIcon />
              </Fab>
            </Box>
          </Box>

          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Description...."
                multiline
                rows={4}
                value={about_the_newissuance}
                onChange={handleReport}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Imagecompression
              setCompressedImageBase64={setCompressedImageBase64}
              compressedImageBase64={compressedImageBase64} // Pass the value here
            />
          </Grid>
          <Grid container spacing={2} sx={{ marginTop: '20px' }}>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                disabled={loading}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Grid>

            {/* {accident_id && ( */}
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleUpdate}
                fullWidth
                disabled={loading}
              >
                Update NewIssuance
              </Button>
            </Grid>
            {/* )} */}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Newissuance;








