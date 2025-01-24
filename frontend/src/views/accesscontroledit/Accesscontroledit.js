import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function Accesscontroledit({ open, handleClose, handleSave, currentRow, setCurrentRow }) {
  
  // Handle changes to form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentRow((prevRow) => ({
      ...prevRow,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Trainer Details</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="employee_id"
          label="Employee ID"
          type="text"
          fullWidth
          value={currentRow?.employee_id || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="employee_name"
          label="Employee Name"
          type="text"
          fullWidth
          value={currentRow?.employee_name || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="valid_from"
          label="Valid From"
          type="date"
          fullWidth
          value={currentRow?.valid_from || ''}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          margin="dense"
          name="valid_to"
          label="Valid To"
          type="date"
          fullWidth
          value={currentRow?.valid_to || ''}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          margin="dense"
          name="access_control"
          label="Access Control"
          type="text"
          fullWidth
          value={currentRow?.access_control || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="phone_number"
          label="Phone Number"
          type="text"
          fullWidth
          value={currentRow?.phone_number || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="password"
          label="Password"
          type="password"
          fullWidth
          value={currentRow?.password || ''}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
