
// import React, { useState, useEffect } from 'react';
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Fab, Box
// } from '@mui/material';
// import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
// import { useSelector } from 'react-redux';
// import api from 'src/api';

// const Training = ({ onChange,initialData  }) => {
//   const [rows, setRows] = useState([]);
//   const [suggestions, setSuggestions] = useState([]);
//   const [selectedIndex, setSelectedIndex] = useState(null);
//   const [activeRowIndex, setActiveRowIndex] = useState(null);
//   const userInfo = useSelector((state) => state.userInfo);
//   const [whitelevel_id, setWhitelevel] = useState(userInfo.whitelevel_id);

//   // useEffect(() => {
//   //     if (initialData && initialData.length > 0 && rows.length === 0) {
//   //       const updatedRows = initialData.map((row) => ({
//   //         ...row, // Keep all the existing properties intact
//   //       }));
//   //       setRows(updatedRows); // Only update rows if initialData is provided and rows are empty
//   //     }
//   //   }, [initialData, rows]);
//   // useEffect(() => {
//   //   if (initialData && initialData.length > 0 && rows.length === 0) {
//   //     console.log("initialData in useEffect 4:", initialData);
//   //     const updatedRows = initialData.map((row) => ({
//   //       ...row, // Keep all the existing properties intact
//   //     }));
//   //     setRows(updatedRows); // Update rows whenever initialData changes
//   //   }
//   // }, [initialData]);
//   useEffect(() => {
//     if (
//       Array.isArray(initialData) &&
//       initialData.length > 0 &&
//       rows.length === 0
//     ) {
//       console.log('initialData :', initialData);
//       const updatedRows = initialData.map((row) => ({ ...row }));
//       setRows((prevRows) => {
//         if (JSON.stringify(prevRows) === JSON.stringify(updatedRows)) {
//           return prevRows; // Prevent unnecessary re-renders
//         }
//         return updatedRows;
//       });
//     }
//   }, [initialData]);
  
  

//     // console.log(initialData); // Corrected spelling

//   const fetchEmployeeName = async (employee_id) => {
//     try {
//       const response = await api.post(`/employee/name/`, {
//         employee_id, whitelevel_id
//       });
//       return response.data.employee_name || '';
//     } catch (error) {
//       console.error('Error fetching employee name:', error);
//       return '';
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

//   useEffect(() => {
//     onChange(rows.map(row => ({
//       employee: row.employee_id,
//       employee_id: row.employee_id,
//       employee_name: row.employee_name,
//       whitelevel_id: whitelevel_id,
//       trainee_id: row.employee_id,
//       trainee_name: row.employee_name,
//     })));
//   }, [rows, onChange]);

//   const handleAddRow = () => {
//     const hasEmptyFields = rows.some(row => row.employee_id.trim() === '' || row.employee_name.trim() === '');

//     if (hasEmptyFields) {
//       alert('Please fill in all the fields before adding a new row.');
//       const updatedRows = rows.map(row => ({
//         ...row,
//         error: row.employee_id.trim() === '' || row.employee_name.trim() === '' ? 'empty_field' : row.error
//       }));
//       setRows(updatedRows);
//       return;
//     }

//     const updatedRows = [...rows, { employee_id: '', whitelevel_id, employee_name: '', error: null, disableNameField: false }];
//     setRows(updatedRows);
//   };

//   const handleDeleteRow = (index) => {
//     const updatedRows = rows.filter((_, i) => i !== index);
//     setRows(updatedRows);
//   };

//   const handleInputChange = async (index, event) => {
//     const { name, value } = event.target;
//     const updatedRows = [...rows];
//     updatedRows[index][name] = value.trim();

//     if (name === 'employee_id') {
//         const isDuplicateID = updatedRows.some((row, i) => row.employee_id === value && i !== index);

//         if (isDuplicateID) {
//             updatedRows[index].error = 'duplicate';
//             updatedRows[index].employee_name = ''; // Clear the employee name field
//             updatedRows[index].disableNameField = true; // Disable the employee name field
//         } else if (value.trim() !== '') {
//             const employee_name = await fetchEmployeeName(value);
//             if (employee_name) {
//                 updatedRows[index].employee_name = employee_name;
//                 updatedRows[index].error = null;
//                 updatedRows[index].disableNameField = true; // Disable the employee name field
//             } else {
//                 updatedRows[index].employee_name = '';
//                 updatedRows[index].error = 'invalid';
//                 updatedRows[index].disableNameField = true; // Disable the employee name field when employee does not exist
//             }
//         } else {
//             updatedRows[index].employee_name = '';
//             updatedRows[index].error = null;
//             updatedRows[index].disableNameField = false; // Enable the employee name field
//         }
//     }

//     setRows(updatedRows);
// };


//   const handleNameInputChange = async (index, event) => {
//     const value = event.target.value;
//     const updatedRows = [...rows];

//     // Regular expression to allow only letters, spaces, and dots
//     const validNameRegex = /^[a-zA-Z\s.]*$/;

//     if (validNameRegex.test(value)) {
//       updatedRows[index].employee_name = value;

//       if (value.trim() !== '') {
//         const isDuplicateName = updatedRows.some((row, i) => row.employee_name === value && i !== index);

//         if (isDuplicateName) {
//           updatedRows[index].error = 'duplicate_name';
//           updatedRows[index].disableIDField = true; // Disable the Employee ID field
//         } else {
//           const suggestions = await fetchEmployeeSuggestions(value);
//           setSuggestions(suggestions);
//           setActiveRowIndex(index);
//           updatedRows[index].disableIDField = false; // Enable the Employee ID field
//         }
//       } else {
//         setSuggestions([]);
//         setActiveRowIndex(null);
//         updatedRows[index].disableIDField = false; // Enable the Employee ID field
//       }

//       // Check if the name matches the employee ID
//       const correctName = await fetchEmployeeName(updatedRows[index].employee_id);
//       if (value.trim() !== correctName) {
//         updatedRows[index].error = 'name_mismatch';
//       } else {
//         updatedRows[index].error = null;
//       }
//     } else {
//       updatedRows[index].error = 'invalid_name';
//     }

//     setRows(updatedRows);
//   };

//   const handleSuggestionClick = (index, suggestion) => {
//     const updatedRows = [...rows];
//     const isDuplicateID = updatedRows.some(
//       (row) => row.employee_id === suggestion.employee_id && row !== updatedRows[index]
//     );

//     if (isDuplicateID) {
//       updatedRows[index].error = 'duplicate';
//       updatedRows[index].disableNameField = true; // Disable the Employee Name field
//     } else {
//       updatedRows[index].employee_id = suggestion.employee_id;
//       updatedRows[index].employee_name = suggestion.employee_name;
//       updatedRows[index].error = null;
//       updatedRows[index].disableNameField = true; // Disable the Employee Name field
//     }

//     setRows(updatedRows);
//     setSuggestions([]);
//     setActiveRowIndex(null);
//   };

//   const handleSuggestionMouseEnter = (idx) => {
//     setSelectedIndex(idx);
//   };

//   const handleSuggestionMouseLeave = () => {
//     setSelectedIndex(null);
//   };

//   return (
//     <Box sx={{ position: 'relative', backgroundColor: '#FAF9F6' }}>
//       <TableContainer component={Paper} sx={{ border: '1px solid lightgrey', borderRadius: '8px', boxShadow: 'none' }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Sl. No</TableCell>
//               <TableCell sx={{ pl: 12 }}>Employee ID</TableCell>
//               <TableCell sx={{ pl: 12 }}>Employee Name</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows.map((row, index) => (
//               <TableRow key={index}>
//                 <TableCell>{index + 1}</TableCell>
//                 <TableCell>
//                   <TextField
//                     variant="outlined"
//                     size="small"
//                     name="employee_id"
//                     value={row.employee_id}
//                     onChange={(event) => handleInputChange(index, event)}
//                     fullWidth
//                     required
//                     error={Boolean(row.error)}
//                     helperText={
//                       row.error === 'duplicate'
//                         ? 'Duplicate employee ID'
//                         : row.error === 'invalid'
//                         ? 'Employee does not exist'
//                         : row.error === 'empty_field'
//                         ? 'Employee ID should not be empty'
//                         : ''
//                     }
//                     disabled={row.disableIDField} // Disable based on the error state
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <TextField
//                     variant="outlined"
//                     size="small"
//                     name="employee_name"
//                     value={row.employee_name}
//                     onChange={(event) => handleNameInputChange(index, event)}
//                     fullWidth
//                     required
//                     error={Boolean(row.error)}
//                     helperText={
//                       row.error === 'invalid_name'
//                         ? 'Invalid characters. Only letters, spaces, and dots are allowed.'
//                         : row.error === 'name_mismatch'
//                         ? 'Incorrect name for the given Employee ID'
//                         : row.error === 'duplicate_name'
//                         ? 'Duplicate employee name'
//                         : row.error === 'empty_field'
//                         ? 'Employee Name should not be empty'
//                         : ''
//                     }
//                     disabled={row.disableNameField} // Disable based on the error state
//                   />

//                   {index === activeRowIndex && suggestions.length > 0 && (
//                     <div
//                       style={{
//                         position: 'absolute',
//                         zIndex: 1000,
//                         width: '100%',
//                         backgroundColor: '#fff',
//                         border: '1px solid lightgrey',
//                         borderRadius: '4px',
//                         boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
//                         marginTop: '4px',
//                       }}
//                     >
//                       {suggestions.map((suggestion, idx) => (
//                         <div
//                           key={suggestion.employee_id}
//                           style={{
//                             padding: '8px',
//                             backgroundColor: selectedIndex === idx ? '#f0f0f0' : '#fff',
//                             cursor: 'pointer',
//                           }}
//                           onMouseEnter={() => handleSuggestionMouseEnter(idx)}
//                           onMouseLeave={handleSuggestionMouseLeave}
//                           onClick={() => handleSuggestionClick(index, suggestion)}
//                         >
//                           {suggestion.employee_name}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </TableCell>
//                 <TableCell>
//                   <IconButton aria-label="delete" onClick={() => handleDeleteRow(index)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <Box mt={2}>
//         <Fab
//           size="small"
//           color="primary"
//           aria-label="add"
//           onClick={handleAddRow}
          
//           sx={{ 
            
//             position: 'absolute',
//           bottom: -18,
//            left: '49%',
//            transform: 'translateX(-50%)',
//           boxShadow: 'none',
//           zIndex: 1
//           }}
//         >
//           <AddIcon />
//         </Fab>
//       </Box>
//     </Box>
//   );
// };

// export default Training;


import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Fab,
  Box,
} from '@mui/material'
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import api from 'src/api'
import PropTypes from 'prop-types'

const Training4 = ({ onChange, initialData }) => {
  const [rows, setRows] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [activeRowIndex, setActiveRowIndex] = useState(null)
  const userInfo = useSelector((state) => state.userInfo)
  const [whitelevel_id, setWhitelevel] = useState(userInfo.whitelevel_id)

  // useEffect(() => {
  //   if (initialData && initialData.length > 0 && rows.length === 0) {
  //     const updatedRows = initialData.map((row) => ({
  //       ...row, // Keep all the existing properties intact
  //     }))
  //     setRows(updatedRows) // Update rows whenever initialData changes
  //     console.log('Updated rows after initialData change:', updatedRows); // Log the updated rows
  //   }
  // }, [initialData]);
  useEffect(() => {
      if (
        Array.isArray(initialData) &&
        initialData.length > 0 &&
        rows.length === 0
      ) {
        console.log('initialData :', initialData); // Log the incoming data
    
        const updatedRows = initialData.map((row) => ({
          ...row,
          employee_id: row.trainee_id || row.employee_id,  // Convert trainer_id to employee_id
          employee_name: row.trainee_name || row.employee_name,
          // employee_id:row.employee_id,
          // employee_name:row.employee_name// Convert trainer_name to employee_name
        }));
    
        console.log("Updated Rows:", updatedRows); // Log the updated rows before setting them
    
        setRows(updatedRows);  // Directly update rows with the new data
      }
    }, [initialData]); 

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

  useEffect(() => {
    onChange(
      rows.map((row) => ({
        employee: row.employee_id,
        employee_id: row.employee_id,
        employee_name: row.employee_name,
        whitelevel_id: whitelevel_id,
        trainee_id: row.employee_id,
        trainee_name: row.employee_name,
      })),
    )
  }, [rows, onChange])

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
      console.log('Updated rows after adding a row with empty fields:', updatedRows); // Log the updated rows
      return
    }

    const updatedRows = [
      ...rows,
      { employee_id: '', whitelevel_id, employee_name: '', error: null, disableNameField: false },
    ]
    setRows(updatedRows)
    console.log('Updated rows after adding a new row:', updatedRows); // Log the updated rows
  }

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index)
    setRows(updatedRows)
    console.log('Updated rows after deleting a row:', updatedRows); // Log the updated rows
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
    console.log('Updated rows after employee_id input change:', updatedRows); // Log the updated rows
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
    console.log('Updated rows after employee_name input change:', updatedRows); // Log the updated rows
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
    console.log('Updated rows after suggestion click:', updatedRows); // Log the updated rows
  }

  const handleSuggestionMouseEnter = (idx) => {
    setSelectedIndex(idx)
  }

  const handleSuggestionMouseLeave = () => {
    setSelectedIndex(null)
  }

  return (
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
  )
}

Training4.propTypes = {
  onChange: PropTypes.func.isRequired, // Function type and required
  initialData: PropTypes.arrayOf(PropTypes.object).isRequired, // Array of objects and required
}

export default Training4
