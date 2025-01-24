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
import DownloadIcon from '@mui/icons-material/Download';
import { visuallyHidden } from '@mui/utils';
import jsPDF from 'jspdf';
import {  Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';
import api from "src/api";
import { format } from 'date-fns'; 

function createData(id, slno, refrno, date) {
  return { id, slno, refrno, date };
}



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
  { id: 'reference_number', numeric: true, disablePadding: false, label: 'REFERENCE NUMBER' },
  { id: 'date', numeric: true, disablePadding: false, label: 'DATE' },
  { id: 'permit_status', numeric: true, disablePadding: false, label: 'PermitStatus' },
  { id: 'ppe_status', numeric: true, disablePadding: false, label: 'PPE Status' },
  { id: 'severity_id', numeric: true, disablePadding: false, label: 'Severity Id' },
  { id: 'severity', numeric: true, disablePadding: false, label: 'Severity' },
 
 
  { id: 'toolbox_training', numeric: true, disablePadding: false, label: 'ToolBoxTalk' },
  { id: 'toolbox_training_reference_number', numeric: true, disablePadding: false, label: 'ToolBoxTalkRefNo.' },
  { id: 'accident_image', numeric: true, disablePadding: false, label: 'Accident Image' },
  { id: 'about', numeric: true, disablePadding: false, label: 'About' },
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
  const { numSelected, onExcellDownload } = props;

  return (
    <Toolbar>

        <Typography sx={{ flex: '1 1 100%', textAlign: 'center' }} variant="h6" id="tableTitle" component="div">
          Accident Report
        </Typography>


      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>

          <>
            <Tooltip title="Download Excell">
              <IconButton onClick={onExcellDownload}>
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

export default function Aftersearchaccident(props) {
  const employee_id=props.employee_id;
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('slno');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/reports/employee/accident/?filter=accident&employeeId=${employee_id}`);
        const data = response.data.data;
        const formattedData = data.map((item, index) => ({
          id: index + 1,
          slno: index + 1,
          reference_number: item.reference_number,
          // date: format( new Date(item.date),'dd/mm/yyyy') ,
          date:item.date? format(new Date(item.date), 'dd/MM/yyyy') : 'N/A',
          permit_status:item.permit_status,
          ppe_status:item.ppe_status,
          severity:item.severity,
          severity_id:item.severity_id,
          accident_image:item.accident_image,
          
          toolbox_training:item.toolbox_training,
          toolbox_training_reference_number:item.toolbox_training_reference_number,
          about:item.about,
        }));
        setRows(formattedData);
      } catch (error) {
        if (error.isAxiosError && error.response) {
          console.error(`HTTP error! status: ${error}`);
          const errorData = JSON.stringify(error.response.data);
          console.error('Response body:', errorData);
          alert(`Error: ${errorData}`);
        }
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedImage('');
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>{
      return stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    },[order, orderBy, page,rows, rowsPerPage]
  )

  // Function to handle PDF download
  // const handlePdfDownload = () => {
  //   const doc = new jsPDF();
  //   doc.autoTable({
  //     head: [['SL NO.', 'REFERENCE NUMBER', 'DATE','Permit Status','PPE Status','Severity_Id','Severity','About','ToolBoxTalk','ToolBoxRef']],
  //     body: rows.map((row) => [row.slno, row.reference_number, row.date,row.permit_status,row.ppe_status,row.severity_id,row.severity,row.about,row.toolbox_training,row.toolbox_training_reference_number]),
  //   });
  //   doc.save('Employee_Wise_Accident_Report.pdf');
  // };

  const handleExcelDownload = async () => {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Employee_Wise_Accident_Report');
  
    // Define the Excel column headers
    const headers = [
      'SL NO.',
      'REFERENCE NUMBER',
      'DATE',
      'Permit Status',
      'PPE Status',
      'Severity_Id',
      'Severity',
      'About',
      'ToolBoxTalk',
      'ToolBoxRef',
    ];
  
    // Add headers to the worksheet
    worksheet.addRow(headers);
  
    // Add data rows to the worksheet
    rows.forEach((row) => {
      worksheet.addRow([
        row.slno,
        row.reference_number,
        row.date,
        row.permit_status,
        row.ppe_status,
        row.severity_id,
        row.severity,
        row.about,
        row.toolbox_training,
        row.toolbox_training_reference_number,
      ]);
    });
  
    // Adjust column widths (optional)
    worksheet.columns.forEach((column) => {
      column.width = column.header ? column.header.length + 5 : 10; // Dynamic width adjustment
    });
  
    // Generate the Excel file and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Employee_Wise_Accident_Report.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, padding: 5 }}>
        <EnhancedTableToolbar numSelected={selected.length} onExcellDownload={handleExcelDownload} />
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
                    <TableCell align="right">{row.reference_number}</TableCell>
                    <TableCell align="right">{row.date}</TableCell>
                    <TableCell align="right">{row.permit_status}</TableCell>
                    <TableCell align="right">{row.ppe_status}</TableCell>
                    <TableCell align="right">{row.severity_id}</TableCell>
                    <TableCell align="right">{row.severity}</TableCell>
                  
                   <TableCell align='right'>{row.toolbox_training}</TableCell>
                   <TableCell align='right'>{row.toolbox_training_reference_number}</TableCell>
                    <TableCell align="right">
                        <img
                          src={`data:image/png;base64,${row.accident_image}`}
                          alt="Image Not Found "
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '5px',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleImageClick(`data:image/png;base64,${row.accident_image}`)}
                          onError={(e) => {
                            e.target.onerror = null; // Prevent infinite loop
                            // e.target.src = 'image not found'; // Fallback image
                          }}

                />
              </TableCell>
              <TableCell align='right'>{row.about}</TableCell>
             

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
