import * as React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function EditForm({ open, handleClose, handleSave, currentRow, setCurrentRow }) {
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
          label="Training ID"
          type="text"
          fullWidth
          variant="standard"
          value={currentRow ? currentRow.training_id : ''}
          onChange={(e) =>
            setCurrentRow({ ...currentRow, training_id: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Start Date"
          type="text"
          fullWidth
          variant="standard"
          value={currentRow ? currentRow.start_date : ''}
          onChange={(e) =>
            setCurrentRow({ ...currentRow, start_date: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="End Date"
          type="text"
          fullWidth
          variant="standard"
          value={currentRow ? currentRow.end_date : ''}
          onChange={(e) =>
            setCurrentRow({ ...currentRow, end_date: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Trainers"
          type="text"
          fullWidth
          variant="standard"
          value={currentRow ? currentRow.trainers : ''}
          onChange={(e) =>
            setCurrentRow({ ...currentRow, trainers: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Trainees"
          type="text"
          fullWidth
          variant="standard"
          value={currentRow ? currentRow.tranees : ''}
          onChange={(e) =>
            setCurrentRow({ ...currentRow, tranees: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Subject"
          type="text"
          fullWidth
          variant="standard"
          value={currentRow ? currentRow.subject : ''}
          onChange={(e) =>
            setCurrentRow({ ...currentRow, subject: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Whitelevel ID"
          type="text"
          fullWidth
          variant="standard"
          value={currentRow ? currentRow.whitelevel_id : ''}
          onChange={(e) =>
            setCurrentRow({ ...currentRow, whitelevel_id: e.target.value })
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

EditForm.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  currentRow: PropTypes.object,
  setCurrentRow: PropTypes.func.isRequired,
};

export default EditForm;
