// import React, { useState, useEffect } from 'react';
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Fab, Box
// } from '@mui/material';
// import { Delete as DeleteIcon, Add as AddIcon, Check as CheckIcon } from '@mui/icons-material';
// import { API_BASE_URI } from 'src/constants/api';

// const Training = ({ onEmployeesChange }) => {
//   const [rows, setRows] = useState([]);
//   const [whitelevel_id, setWhitelevel_id] = useState('cttc1234');

//   const fetchEmployeeName = async (employee_id,whitelevel_id) => {
//     try {
//       const response = await fetch(`${API_BASE_URI}/employee/name/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ employee_id,whitelevel_id })
//       });

//       const data = await response.json();
//       return data.employee_name || '';
//     } catch (error) {
//       console.error('Error fetching employee name:', error);
//       return '';
//     }
//   };

//   useEffect(() => {
//     // Pass the employee data to the parent component whenever rows change
//     onEmployeesChange(rows.map(row => ({
//         trainer_id: row.employee_id,
//         trainer_name: row.employee_name ,
//         whitelevel_id,
//         employee: row.employee_id === '0' ? '' : row.employee_id,
//         employee_name: row.employee_name,
//     })));
//   }, [rows, onEmployeesChange]);

//   const handleAddRow = () => {
//     setRows([...rows, { employee_id: '',whitelevel_id:'', employee_name: '', error: false, manual: false }]);
//   };

//   const handleDeleteRow = (index) => {
//     const updatedRows = rows.filter((_, i) => i !== index);
//     setRows(updatedRows);
//   };

//   const handleInputChange = async (index, event) => {
//     const { name, value } = event.target;
//     const updatedRows = [...rows];
//     updatedRows[index][name] = value;

//     if (name === 'employee_id') {
//       if (value === '0') {
//         updatedRows[index].employee_name = '';
//         updatedRows[index].manual = true;
//         updatedRows[index].error = false;
//       } else {
//         const isDuplicate = updatedRows.some((row, i) => row.employee_id === value && i !== index);
//         updatedRows[index].error = isDuplicate;
//         if (!isDuplicate) {
//           // Fetch employee name only if it's not a duplicate and not '0'
//           const empName = await fetchEmployeeName(value);
//           updatedRows[index].employee_name = empName;
//           updatedRows[index].manual = false;
//         }
//       }
//     } else if (name === 'employee_name') {
//       updatedRows[index].manual = true; // Enable manual mode for employee_name
//     }

//     setRows(updatedRows);
//   };

//   const handleCheck = async (index) => {
//     const { employee_id } = rows[index];
//     const updatedRows = [...rows];

//     if (employee_id === '0') {
//       updatedRows[index].manual = true;
//     } else {
//       if (employee_id) {
//         const employee_name = await fetchEmployeeName(employee_id,whitelevel_id);
//         updatedRows[index].employee_name = employee_name;
//       }
//       updatedRows[index].manual = false;
//     }

//     setRows(updatedRows);
//   };

//   return (
//     <Box sx={{ position: 'relative' }}>
//       <TableContainer component={Paper} sx={{ border: '1px solid lightgrey', borderRadius: '8px', boxShadow: 'none' }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Sl. No</TableCell>
//               <TableCell>Employee ID</TableCell>
//               <TableCell>Employee Name</TableCell>
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
//                     error={row.error}
//                     helperText={
//                       row.error === 'duplicate'
//                         ? 'Duplicate employee ID'
//                         : row.error === 'invalid'
//                         ? 'Employee does not exist'
//                         : ''
//                     }
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <TextField
//                     variant="outlined"
//                     size="small"
//                     name="employee_name"
//                     value={row.employee_name}
//                     onChange={(event) => handleInputChange(index, event)}
//                     fullWidth
//                     disabled={!row.manual} // Disable if not in manual mode
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <IconButton onClick={() => handleDeleteRow(index)}>
//                     <DeleteIcon />
//                   </IconButton>
//                   <IconButton onClick={() => handleCheck(index)}>
//                     <CheckIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <Fab
//         color="primary"
//         aria-label="add"
//         onClick={handleAddRow}
//         size="small"
//         sx={{
//           position: 'absolute',
//           bottom: -18,
//           left: '47%',
//           transform: 'translateX(-50%)',
//           boxShadow: 'none',
//           zIndex: 1
//         }}
//       >
//         <AddIcon />
//       </Fab>
//     </Box>
//   );
// };

// export default Training;

import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Fab, Box
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Check as CheckIcon } from '@mui/icons-material';
import { API_BASE_URI } from 'src/constants/api';

const Training = ({ onEmployeesChange }) => {
  const [rows, setRows] = useState([]);
  const [whitelevel_id, setWhitelevel_id] = useState('cttc1234');

  const fetchEmployeeName = async (employee_id,whitelevel_id) => {
    try {
      const response = await fetch('${API_BASE_URI}/employee/name/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employee_id,whitelevel_id })
      });

      const data = await response.json();
      return data.employee_name || '';
    } catch (error) {
      console.error('Error fetching employee name:', error);
      return '';
    }
  };

  useEffect(() => {
    // Pass the employee data to the parent component whenever rows change
    onEmployeesChange(rows.map(row => ({
        trainer_id: row.employee_id,
        trainer_name: row.employee_name ,
        whitelevel_id,
        employee: row.employee_id === '0' ? '' : row.employee_id,
        employee_name: row.employee_name,
    })));
  }, [rows, onEmployeesChange]);

  const handleAddRow = () => {
    setRows([...rows, { employee_id: '',whitelevel_id:'', employee_name: '', error: false, manual: false }]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleInputChange = async (index, event) => {
    const { name, value } = event.target;
    const updatedRows = [...rows];
    updatedRows[index][name] = value;

    if (name === 'employee_id') {
      if (value === '0') {
        updatedRows[index].employee_name = '';
        updatedRows[index].manual = true;
        updatedRows[index].error = false;
      } else {
        const isDuplicate = updatedRows.some((row, i) => row.employee_id === value && i !== index);
        updatedRows[index].error = isDuplicate;
        if (!isDuplicate) {
          // Fetch employee name only if it's not a duplicate and not '0'
          const empName = await fetchEmployeeName(value);
          updatedRows[index].employee_name = empName;
          updatedRows[index].manual = false;
        }
      }
    } else if (name === 'employee_name') {
      updatedRows[index].manual = true; // Enable manual mode for employee_name
    }

    setRows(updatedRows);
  };

  const handleCheck = async (index) => {
    const { employee_id } = rows[index];
    const updatedRows = [...rows];

    if (employee_id === '0') {
      updatedRows[index].manual = true;
    } else {
      if (employee_id) {
        const employee_name = await fetchEmployeeName(employee_id,whitelevel_id);
        updatedRows[index].employee_name = employee_name;
      }
      updatedRows[index].manual = false;
    }

    setRows(updatedRows);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <TableContainer component={Paper} sx={{ border: '1px solid lightgrey', borderRadius: '8px', boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sl. No</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Employee Name</TableCell>
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
                    error={row.error}
                    helperText={row.error ? 'Duplicate employee ID' : ''}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    name="employee_name"
                    value={row.employee_name}
                    onChange={(event) => handleInputChange(index, event)}
                    fullWidth
                    disabled={!row.manual} // Disable if not in manual mode
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteRow(index)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handleCheck(index)}>
                    <CheckIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddRow}
        size="small"
        sx={{
          position: 'absolute',
          bottom: -18,
          left: '47%',
          transform: 'translateX(-50%)',
          boxShadow: 'none',
          zIndex: 1
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default Training;