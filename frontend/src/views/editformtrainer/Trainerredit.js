import * as React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function Trainerredit({ open, handleClose, handleSave, currentRow, setCurrentRow }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Row</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Edit the details of the selected row.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Trainer ID"
          type="text"
          fullWidth
          variant="standard"
          value={currentRow ? currentRow.trainer_id : ''}
          onChange={(e) =>
            setCurrentRow({ ...currentRow, trainer_id: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Company"
          type="text"
          fullWidth
          variant="standard"
          value={currentRow ? currentRow.company : ''}
          onChange={(e) =>
            setCurrentRow({ ...currentRow, company: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Trainer Name"
          type="text"
          fullWidth
          variant="standard"
          value={currentRow ? currentRow.trainer_name : ''}
          onChange={(e) =>
            setCurrentRow({ ...currentRow, trainer_name: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Email"
          type="text"
          fullWidth
          variant="standard"
          value={currentRow ? currentRow.email : ''}
          onChange={(e) =>
            setCurrentRow({ ...currentRow, email: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Phone Number"
          type="text"
          fullWidth
          variant="standard"
          value={currentRow ? currentRow.phonenumber : ''}
          onChange={(e) =>
            setCurrentRow({ ...currentRow, phonenumber: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Address"
          type="text"
          fullWidth
          variant="standard"
          value={currentRow ? currentRow.address : ''}
          onChange={(e) =>
            setCurrentRow({ ...currentRow, address: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Joining Date"
          type="text"
          fullWidth
          variant="standard"
          value={currentRow ? currentRow.joining_date : ''}
          onChange={(e) =>
            setCurrentRow({ ...currentRow, joining_date: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Salary"
          type="text"
          fullWidth
          variant="standard"
          value={currentRow ? currentRow.salary : ''}
          onChange={(e) =>
            setCurrentRow({ ...currentRow, salary: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Is Active"
          type="text"
          fullWidth
          variant="standard"
          value={currentRow ? currentRow.is_active : ''}
          onChange={(e) =>
            setCurrentRow({ ...currentRow, is_active: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Profile Photo"
          type="text"
          fullWidth
          variant="standard"
          value={currentRow ? currentRow.profile_photo : ''}
          onChange={(e) =>
            setCurrentRow({ ...currentRow, profile_photo: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Job Title"
          type="text"
          fullWidth
          variant="standard"
          value={currentRow ? currentRow.job_title : ''}
          onChange={(e) =>
            setCurrentRow({ ...currentRow, job_title: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Specification"
          type="text"
          fullWidth
          variant="standard"
          value={currentRow ? currentRow.specification : ''}
          onChange={(e) =>
            setCurrentRow({ ...currentRow, specification: e.target.value })
          }
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

Trainerredit.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  currentRow: PropTypes.object,
  setCurrentRow: PropTypes.func.isRequired,
};

export default Trainerredit;
