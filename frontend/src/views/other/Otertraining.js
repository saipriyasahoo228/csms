import React, {useState,useEffect} from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import {  Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { visuallyHidden } from '@mui/utils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import api from "src/api";
import { format } from 'date-fns'; 

function createData(id, slno, othertraining, date, trainername, refrno) {
  return { id, slno, othertraining, date, trainername, refrno };
}

const rows = [
//   createData(1, '21mmca60', 'Hammer', '5/3/2024', 'John Doe', '32135'),
  // additional rows...
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'slno', numeric: false, disablePadding: true, label: 'SL NO.' },
  { id: 'othertraining', numeric: true, disablePadding: false, label: 'OTHER TRAINING' },
  { id: 'date', numeric: true, disablePadding: false, label: 'DATE' },
  { id: 'trainername', numeric: true, disablePadding: false, label: 'TRAINER NAME' },
  { id: 'refrno', numeric: true, disablePadding: false, label: 'REFERENCE NUMBER' },
  { id: 'training_image', numeric: true, disablePadding: false, label: 'IMAGE' },
  { id: 'description', numeric: true, disablePadding: false, label: 'DESCRIPTION' },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, onPdfDownload } = props;

  return (
    <Toolbar>

        <Typography sx={{ flex: '1 1 100%', textAlign: 'center' }} variant="h6" id="tableTitle" component="div">
          Other Training
        </Typography>


      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>

          <>
            <Tooltip title="Download PDF">
              <IconButton onClick={onPdfDownload}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>

          </>

      </Box>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onPdfDownload: PropTypes.func.isRequired,
};

export default function Othertraining(props) {
  const employee_id=props.employee_id;
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('slno');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const [rows, setRows] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/reports/employee/training/?filter=others&employeeId=${employee_id}`,
        );

        const data = response.data.data['OTHERS'];
        console.log('result:', data);
        const formattedData = data.map((training, index) => ({
          slno: index + 1,
          othertraining: training.training_name || "NA",
          
          date:training.training_date? format(new Date(training.training_date), 'dd/MM/yyyy') : 'N/A',
          trainername: training.trainers.map(trainer => trainer.trainer_name).join(', '),
          refrno: training.training_id,
          training_image:training.training_image,
          description:training.about_the_training

        }));
        setRows(formattedData);
      } catch (error) {
        if (error.isAxiosError && error.response) {
          // Handle API response errors
          console.error(`HTTP error! status: ${error}`);
          const errorData = JSON.stringify(error.response.data); // Parse the error response
          console.error('Response body:', errorData);
          alert(`Error: ${errorData}`);
        }
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedImage('');
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>{
      return stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    },[order, orderBy, page,rows, rowsPerPage]
  )
  // const visibleRows = React.useMemo(() => {
  //   return stableSort(rows, getComparator(order, orderBy)).slice(
  //     page * rowsPerPage,
  //     page * rowsPerPage + rowsPerPage,
  //   );
  // }, [order, orderBy, page, rows, rowsPerPage])

  // Function to handle PDF download
  const handlePdfDownload = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['SL NO.', 'OTHER TRAINING', 'DATE', 'TRAINER NAME', 'REFERENCE NUMBER','DESCRIPTION']],
      body: rows.map((row) => [row.slno, row.othertraining, row.date, row.trainername, row.refrno,row.description]),
    });
    doc.save('Other_Training_Report.pdf');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, padding: 5 }}>
        <EnhancedTableToolbar numSelected={selected.length} onPdfDownload={handlePdfDownload} />
        <TableContainer>
          <Table sx={{ minWidth: 730 }} aria-labelledby="tableTitle">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      {row.slno}
                    </TableCell>
                    <TableCell align="right">{row.othertraining}</TableCell>
                    <TableCell align="right">{row.date}</TableCell>
                    <TableCell align="right">{row.trainername}</TableCell>
                    <TableCell align="right">{row.refrno}</TableCell>
                    <TableCell align="right">
                        <img
                          src={`data:image/png;base64,${row.training_image}`}
                           alt="Image Not Found "
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '5px',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleImageClick(`data:image/png;base64,${row.training_image}`)}
                          onError={(e) => {
                            e.target.onerror = null; // Prevent infinite loop
                            // e.target.src = 'https://via.placeholder.com/80'; // Fallback image
                          }}
                />
              </TableCell>
              <TableCell align="right">{row.description}</TableCell>
              
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={headCells.length} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Image Preview</DialogTitle>
        <DialogContent>
          <img
            src={selectedImage}
            alt="Preview"
            style={{ width: '400px', height: '300px', objectFit: 'cover' }}
          />
        </DialogContent>
        <DialogActions>
          <button onClick={handleDialogClose} style={{ padding: '10px' }}>Close</button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
