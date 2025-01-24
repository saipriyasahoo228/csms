import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Fab, Box
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Check as CheckIcon } from '@mui/icons-material';
import { API_BASE_URI } from 'src/constants/api';

const Training = ({ onEmployeesChange }) => {
  const [rows, setRows] = useState([]);

  const fetchEmployeeName = async (employee_id) => {
    try {
      const response = await fetch(`${API_BASE_URI}/employee/name/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employee_id })
      });

      const data = await response.json();
      return data.employee_name || '';
    } catch (error) {
      console.error('Error fetching employee name:', error);
      return '';
    }
  };

  useEffect(() => {
    // Fetch initial data if necessary
    const fetchData = async () => {
      // Add any initial fetch logic here if needed
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Pass the employee data to the parent component whenever rows change
    onEmployeesChange(rows.map(row => ({
      employee_id: row.employee_id,
      employee_name: row.empName,
    })));
  }, [rows, onEmployeesChange]);

  const handleAddRow = () => {
    setRows([...rows, { employee_id: '', empName: '', error: false }]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedRows = [...rows];
    updatedRows[index][name] = value;

    // Check for duplicates
    if (name === 'employee_id') {
      const isDuplicate = updatedRows.some((row, i) => row.employee_id === value && i !== index && value !== '0');
      updatedRows[index].error = isDuplicate;
    }

    setRows(updatedRows);
  };

  const handleCheck = async (index) => {
    const { employee_id } = rows[index];
    if (employee_id) {
      const empName = await fetchEmployeeName(employee_id);
      if (empName === '') {
        alert('User does not exist');
      } else {
        const updatedRows = [...rows];
        updatedRows[index].empName = empName;
        setRows(updatedRows);
      }
    }
  };

  return (
    <Box sx={{ position: 'relative', paddingBottom: '40px' }}>
      <TableContainer component={Paper} sx={{ border: '1px solid lightgrey', borderRadius: '8px', boxShadow: 'none', marginBottom: '20px' }}>
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
                    name="empName"
                    value={row.empName}
                    fullWidth
                    disabled
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
          bottom: 30,
          left: '50%',
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
