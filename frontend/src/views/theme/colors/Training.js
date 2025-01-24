import React, { useState } from 'react';
import './Training.css';

const Training = () => {
  const [rows, setRows] = useState([{ empCode: '', empName: '' }]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedRows = [...rows];
    updatedRows[index][name] = value;

    // If user enters 'Others' in empCode, clear empName
    if (name === 'empCode' && value.toLowerCase() === 'others') {
      updatedRows[index]['empCode'] = 'Others';
      updatedRows[index]['empName'] = ''; // Clear empName if 'Others' is entered
    } else if (name === 'empCode') {
      const empCode = value;
      // Simulate fetching empName based on empCode (replace with actual logic)
      const empName = getEmployeeName(empCode);
      updatedRows[index]['empName'] = empName;
    }

    setRows(updatedRows);
  };

  const getEmployeeName = (empCode) => {
    // Replace with your actual data fetching logic
    const employeeDatabase = {
      '001': 'John Doe',
      '002': 'Jane Smith',
      // Add more mappings as needed
    };

    return employeeDatabase[empCode] || ''; // Return empty string if empCode not found
  };

  const handleAddRow = () => {
    setRows([...rows, { empCode: '', empName: '' }]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  return (
    <div>
      
      <table>
        <thead>
          <tr>
            <th>Sl. No</th>
            <th>Employee Code</th>
            <th>Employee Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="text"
                  name="empCode"
                  value={row.empCode}
                  onChange={(event) => handleInputChange(index, event)}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="empName"
                  value={row.empName}
                  onChange={(event) => handleInputChange(index, event)}
                />
              </td>
              <td>
                <button onClick={() => handleDeleteRow(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAddRow}>Add Row</button>
    </div>
  );
};

export default Training;
