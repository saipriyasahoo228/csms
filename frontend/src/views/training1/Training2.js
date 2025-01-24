

import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Fab, Box, List, ListItem
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import api from "src/api";

const Training = ({ onEmployeesChange,initialData  }) => {
  const userInfo = useSelector((state) => state.userInfo);
  const [rows, setRows] = useState(initialData || []);

  const [whitelevel_id, setWhitelevel] = useState(userInfo.whitelevel_id);
  const [suggestions, setSuggestions] = useState({});
  const [showSuggestions, setShowSuggestions] = useState({});

  // useEffect(() => {
  //   if (initialData && initialData.length > 0 && rows.length === 0) {
  //     const updatedRows = initialData.map((row) => ({
  //       ...row, // Keep all the existing properties intact
  //     }));
  //     setRows(updatedRows); // Only update rows if initialData is provided and rows are empty
  //   }
  // }, [initialData, rows]);
  
  // useEffect(() => {
  //     if (initialData && initialData.length > 0 && rows.length === 0) {
  //       console.log("initialData in useEffect 2:", initialData);
  //       const updatedRows = initialData.map((row) => ({
  //         ...row, // Keep all the existing properties intact
  //       }));
  //       setRows(updatedRows); // Update rows whenever initialData changes
  //     }
  //   }, [initialData]);
  useEffect(() => {
    if (
      Array.isArray(initialData) &&
      initialData.length > 0 &&
      rows.length === 0
    ) {
      console.log('initialData :', initialData); // Log the incoming data
  
      const updatedRows = initialData.map((row) => ({
        ...row,
        employee_id: row.trainer_id,  // Convert trainer_id to employee_id
        employee_name: row.trainer_name,  // Convert trainer_name to employee_name
      }));
  
      console.log("Updated Rows:", updatedRows); // Log the updated rows before setting them
  
      setRows(updatedRows);  // Directly update rows with the new data
    }
  }, [initialData]);  // Only run when initialData changes
  

  const fetchEmployeeName = async (employee_id, whitelevel_id) => {
    try {
      const response = await api.post('/employee/name/', { employee_id, whitelevel_id });
      return response.data.employee_name || '';
    } catch (error) {
      console.error('Error fetching employee name:', error);
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

  useEffect(() => {
    onEmployeesChange(rows.map(row => ({
      employee: row.employee_id,
      whitelevel_id,
      employee_id: row.employee_id === '0' ? '' : row.employee_id,
      employee_name: row.employee_id === '0' ? row.name : row.employee_name,
      trainer_id: row.employee_id,
      trainer_name: row.employee_id === '0' ? row.name : row.employee_name,
      trainee_id: row.employee_id === '0' ? '' : row.employee_id,
      trainee_name: row.employee_id === '0' ? '' : row.employee_name,
    })));
  }, [rows, onEmployeesChange]);

  const validateEmployeeName = (name) => /^[a-zA-Z\s.]*$/.test(name);

  const handleAddRow = () => {
    const isLastRowFilled = rows.length === 0 || (rows[rows.length - 1].employee_id && (rows[rows.length - 1].employee_name || rows[rows.length - 1].name));

    if (isLastRowFilled) {
      setRows([...rows, { employee_id: '', whitelevel_id, employee_name: '', name: '', error: '', manual: false, employee_id_error: false, employee_name_error: false, disableNameField: false, invalidCharacterError: false }]);
    } else {
      const updatedRows = [...rows];
      if (!rows[rows.length - 1].employee_id) {
        updatedRows[rows.length - 1].employee_id_error = true;
      }
      if (!(rows[rows.length - 1].employee_name || rows[rows.length - 1].name)) {
        updatedRows[rows.length - 1].employee_name_error = true;
      }
      setRows(updatedRows);
    }
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleInputChange = async (index, event) => {
    const { name, value } = event.target;
    const updatedRows = [...rows];
    
    // Check for invalid characters
    if (name === 'employee_name' || name === 'name') {
      if (!validateEmployeeName(value)) {
        updatedRows[index].invalidCharacterError = true;
        setRows(updatedRows);
        return;
      } else {
        updatedRows[index].invalidCharacterError = false;
      }
    }

    updatedRows[index][name] = value;

    if (name === 'employee_id') {
      updatedRows[index].employee_id_error = false;
      updatedRows[index].error = '';

      if (value === '0') {
        updatedRows[index].employee_name = '';
        updatedRows[index].manual = true;
        updatedRows[index].disableNameField = false;
      } else {
        const isDuplicate = updatedRows.some((row, i) => row.employee_id === value && i !== index);
        updatedRows[index].error = isDuplicate ? 'duplicate' : '';
        if (isDuplicate) {
          updatedRows[index].disableNameField = true;
        } else {
          const empName = await fetchEmployeeName(value, whitelevel_id);
          if (empName) {
            updatedRows[index].employee_name = empName;
            updatedRows[index].manual = false;
            updatedRows[index].disableNameField = true;
          } else {
            updatedRows[index].error = 'invalid';
            updatedRows[index].employee_name = '';
            updatedRows[index].disableNameField = true;
          }
        }
      }
    } else if (name === 'employee_name') {
      if (value.length > 0) {
        const isDuplicate = updatedRows.some((row, i) => row.employee_name === value && i !== index);
        if (isDuplicate) {
          updatedRows[index].error = 'duplicate';
          updatedRows[index].disableIDField = true;
        } else {
          const suggestionsData = await fetchEmployeeSuggestions(value);
          setSuggestions(prev => ({ ...prev, [index]: suggestionsData }));
          setShowSuggestions(prev => ({ ...prev, [index]: true }));
          updatedRows[index].disableIDField = false;
        }
      } else {
        setSuggestions(prev => ({ ...prev, [index]: [] }));
        setShowSuggestions(prev => ({ ...prev, [index]: false }));
      }
    } else {
      updatedRows[index].employee_name_error = false;
      if (name === 'name' && rows[index].employee_id === '0') {
        updatedRows[index].employee_name_error = false;
        updatedRows[index].error = '';
      }
    }
    setRows(updatedRows);
  };

  const handleSuggestionClick = (index, suggestion) => {
    const updatedRows = [...rows];

    const isDuplicate = updatedRows.some((row, i) => row.employee_name === suggestion.employee_name && i !== index);

    if (isDuplicate) {
      updatedRows[index].error = 'duplicate';
      updatedRows[index].employee_id_error = true;
      updatedRows[index].employee_name = suggestion.employee_name;
      updatedRows[index].employee_id = '';
      updatedRows[index].disableIDField = true;
    } else {
      updatedRows[index].employee_name = suggestion.employee_name;
      updatedRows[index].employee_id = suggestion.employee_id;
      updatedRows[index].manual = false;
      updatedRows[index].error = '';
      updatedRows[index].employee_id_error = false;
      updatedRows[index].disableIDField = false;
    }

    setSuggestions(prev => ({ ...prev, [index]: [] }));
    setShowSuggestions(prev => ({ ...prev, [index]: false }));
    setRows(updatedRows);
  };

  const handleBlur = (index) => {
    setTimeout(() => {
      setShowSuggestions(prev => ({ ...prev, [index]: false }));
    }, 200);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <TableContainer component={Paper} sx={{ border: '1px solid lightgrey', borderRadius: '8px', boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sl. No</TableCell>
              <TableCell sx={{ pl: 12 }}>Employee ID</TableCell>
              <TableCell sx={{ pl: 12 }}>Employee Name</TableCell>
              <TableCell sx={{ pl: 2 }}>Actions</TableCell>
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
                    error={!!row.error || row.employee_id_error}
                    helperText={
                      row.error === 'duplicate'
                        ? 'Duplicate employee ID'
                        : row.error === 'invalid'
                        ? 'Employee does not exist'
                        : row.employee_id_error
                        ? 'Employee ID is required'
                        : ''
                    }
                    disabled={row.disableIDField}
                    onFocus={() => setShowSuggestions(prev => ({ ...prev, [index]: false }))}
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    name={row.manual ? 'name' : 'employee_name'}
                    value={row.manual ? row.name : row.employee_name}
                    onChange={(event) => handleInputChange(index, event)}
                    onBlur={() => handleBlur(index)}
                    fullWidth
                    required
                    disabled={row.disableNameField}
                    error={row.employee_name_error || row.invalidCharacterError}
                    helperText={
                      row.invalidCharacterError
                        ? 'Invalid characters in employee name'
                        : row.employee_name_error
                        ? 'Employee name is required'
                        : ''
                    }
                  />
                  {showSuggestions[index] && suggestions[index] && (
                    <Paper sx={{ position: 'absolute', zIndex: 1, maxWidth: '300px' }}>
                      <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                        {suggestions[index].map((suggestion, idx) => (
                          <ListItem
                            key={idx}
                            button
                            onClick={() => handleSuggestionClick(index, suggestion)}
                          >
                            {`${suggestion.employee_name}`}
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  )}
                </TableCell>

                <TableCell>
                  <IconButton color="primary" onClick={() => handleDeleteRow(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Fab
        color="primary"
        size="small"
        onClick={handleAddRow}
        sx={{
          position: 'absolute',
          bottom: -18,
           left: '49%',
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









