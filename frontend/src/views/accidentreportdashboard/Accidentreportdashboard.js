
import React, { useEffect, useState } from 'react';
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

import DownloadIcon from '@mui/icons-material/Download';
import { visuallyHidden } from '@mui/utils';
import TextField from '@mui/material/TextField';

import 'jspdf-autotable';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import api from 'src/api';
import { useSelector } from 'react-redux';
import ExcelJS from 'exceljs';
import { format } from 'date-fns';



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
  { id: 'accident_report_date', numeric: false, disablePadding: true, label: 'Report Date' },
  { id: 'accident_type', numeric: true, disablePadding: false, label: 'Accident Type' },
  { id: 'severity', numeric: true, disablePadding: false, label: 'Severity' },
  { id: 'accident_id', numeric: false, disablePadding: false, label: 'Accident ID' },
  { id: 'permit_status_id', numeric: true, disablePadding: false, label: 'Permit Status' },
  { id: 'ppe_status_id', numeric: true, disablePadding: false, label: 'PPE Status' },
  { id: 'toolbox_reference_number_id', numeric: true, disablePadding: false, label: 'Tool Box Train' },
  { id: 'workmen_count', numeric: true, disablePadding: false, label: 'Workmen Involved' },
  { id: 'workmen_names', numeric: false, disablePadding: false, label: 'Workmen Names' },
  { id: 'reportedby_count', numeric: true, disablePadding: false, label: 'Reported By' },
  { id: 'reportedby_names', numeric: false, disablePadding: false, label: 'ReportedBy Names' },
  { id: 'supervisor_count', numeric: true, disablePadding: false, label: 'Supervisor Involved' },
  { id: 'supervisor_names', numeric: false, disablePadding: false, label: 'Supervisor Names' },
  { id: 'about_the_accident', numeric: false, disablePadding: false, label: 'Description' },
  { id: 'accident_image', numeric: false, disablePadding: false, label: 'Accident Image' },
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
          headCell.id !== 'whitelevel_id' && (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? '4' : 'normal'}
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
          )
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, onDownload, searchQuery, onSearchChange } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
        ACCIDENT REPORTS
      </Typography>
      <TextField
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search..."
        sx={{ mr: 2 }}
      />
      <Tooltip title="Download">
        <IconButton onClick={onDownload}>
          <DownloadIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onDownload: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};




export default function AccidentReportDashboard() {
  const userInfo = useSelector((state) => state.userInfo);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('accident_report_date');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = React.useState(false); // State for first dialog
  const [openImageDialog, setOpenImageDialog] = React.useState(false); // State for image preview dialog
  const [selectedRow, setSelectedRow] = React.useState(null); // State for selected row
  const [selectedImage, setSelectedImage] = React.useState(null); // State for selected image
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.post('/reports/accident/');
        console.log(response.data);

        const data = response.data;
        const formattedData = data.results.map((item, index) => ({
          id: index + 1,
          accident_report_date: item.accident_report_date 
          ? format(new Date(item.accident_report_date), 'dd/MM/yyyy') : 'N/A',
          whitelevel_id: item.whitelevel_id || "N/A",
          accident_type: item.accident_type || "N/A",
          severity: item.severity || "N/A",
          permit_status_id:item.permit_status_id || "N/A",
          ppe_status_id:item.ppe_status_id || "N/A",
          toolbox_reference_number_id:item.toolbox_reference_number_id|| "N/A",
          about_the_accident:item.about_the_accident || "N/A",
          accident_image: item.accident_image ||"N/A",
          accident_id: item.accident_id ||"N/A",
          workmen_count: item.workmen_involved?.count ?? 0,
          workmen_names: item.workmen_involved?.names?.map(name => name.employee_name).join(', ') || "N/A",
          supervisor_count: item.supervisors_involved?.count ?? 0,
          supervisor_names: item.supervisors_involved?.names?.map(name => name.supervisor_name).join(', ') || "N/A",

          reportedby_count: item.reported_by?.count ?? 0,
          reportedby_names: item.reported_by?.names?.map(name => name.employee_name).join(', ')|| "N/A",
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
        selected.slice(selectedIndex + 1),
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleRowClick = (row) => {
    setSelectedRow(row); // Set the selected row details
    setOpenDialog(true); // Open the first dialog
  };

  const handleDialogClose = () => {
    setOpenDialog(false); // Close the first dialog
  };

  const handleImageClick = (image) => {
    setSelectedImage(image); // Set the selected image
    setOpenImageDialog(true); // Open the image dialog
  };

  const handleImageDialogClose = () => {
    setOpenImageDialog(false); // Close the image dialog
  };

  const handleRowInteraction = (event, row) => {
    handleClick(event, row.id); // For selection
    handleRowClick(row);       // For preview and download
  };




  const filteredRows = rows.filter((row) => {
    return Object.keys(row).some((key) =>
      String(row[key]).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const visibleRows = React.useMemo(
    () =>
      stableSort(filteredRows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, filteredRows],
  );


  const handleDownload = async () => {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Accident Reports');
  
    // Define the sheet header
    worksheet.columns = [
      { header: 'Accident Report Date', key: 'accident_report_date' },
      { header: 'Accident Type', key: 'accident_type' },
      { header: 'Severity', key: 'severity' },
      { header: 'Accident ID', key: 'accident_id' },
      { header: 'Workmen Count', key: 'workmen_count' },
      { header: 'Workmen Names', key: 'workmen_names' },
      { header: 'ReportedBy Count', key: 'reportedby_count' },
      { header: 'ReportedBy Names', key: 'reportedby_names' },
      { header: 'Supervisor Count', key: 'supervisor_count' },
      { header: 'Supervisor Names', key: 'supervisor_names' },
      { header: 'Permit Status', key: 'permit_status' },
      { header: 'PPE Status', key: 'ppe_status' },
      { header: 'Description', key: 'about_the_accident' },
    ];
  
    // Add data rows
    filteredRows.forEach((row) => {
      worksheet.addRow({
        accident_report_date: row.accident_report_date,
        accident_type: row.accident_type === 1 ? 'Near Miss' :
          row.accident_type === 2 ? 'Accident' :
          row.accident_type === 3 ? 'Violation' : 'Unknown',
        severity: row.severity,
        accident_id: row.accident_id,
        workmen_count: row.workmen_count,
        workmen_names: row.workmen_names,
        reportedby_count: row.reportedby_count,
        reportedby_names: row.reportedby_names,
        supervisor_count: row.supervisor_count,
        supervisor_names: row.supervisor_names,
        permit_status: row.permit_status_id === 1 ? 'Valid' :
          row.permit_status_id === 2 ? 'Not Required' :
          row.permit_status_id === 3 ? 'No Permit' :
          row.permit_status_id === 4 ? 'Expired' : 'Unknown',
        ppe_status: row.ppe_status_id === 1 ? 'OK' :
          row.ppe_status_id === 2 ? 'Faulty' : 'Unknown',
        about_the_accident: row.about_the_accident,
      });
    });
  
    // Generate the Excel file and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'accident_report.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSingleRow = () => {
    if (!selectedRow) return;

    const workbook = XLSX.utils.book_new();
    const worksheetData = [
      ['Field', 'Value'],
      ['Accident Report Date', selectedRow.accident_report_date],
      ['Accident Type',
        selectedRow.accident_type === 1 ? 'Near Miss' :
        selectedRow.accident_type === 2 ? 'Accident' :
        selectedRow.accident_type === 3 ? 'Violation' : 'Unknown'],
      ['Severity', selectedRow.severity],
      ['Accident ID', selectedRow.accident_id],
      ['Workmen Count', selectedRow.workmen_count],
      ['Workmen Names', selectedRow.workmen_names],
      ['ReportedBy Count', selectedRow.reportedby_count],
      ['ReportedBy Names', selectedRow.reportedby_names],
      ['Supervisor Count', selectedRow.supervisor_count],
      ['Supervisor Names', selectedRow.supervisor_names],
      ['Permit Status',
        selectedRow.permit_status_id === 1 ? 'Valid' :
        selectedRow.permit_status_id === 2 ? 'Not Required' :
        selectedRow.permit_status_id === 3 ? 'No Permit' :
        selectedRow.permit_status_id === 4 ? 'Expired' : 'Unknown'],
      ['PPE Status',
        selectedRow.ppe_status_id === 1 ? 'OK' :
        selectedRow.ppe_status_id === 2 ? 'Faulty' : 'Unknown'],
      ['Description', selectedRow.about_the_accident],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Selected Row Data');
    XLSX.writeFile(workbook, `accident_report_${selectedRow.accident_id}.xlsx`);
  };






 return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 1 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          onDownload={handleDownload}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleRowInteraction(event, row)} // Call combined function

                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    <TableCell component="th" id={labelId} scope="row" padding="normal">
                      {row.accident_report_date}
                    </TableCell>
                    <TableCell align="right">
                    {row.accident_type === 1 ? 'Near Miss' : row.accident_type === 2 ? 'Accident' : row.accident_type === 3 ? 'Violation' : 'Unknown'}
                    </TableCell>

                    <TableCell align="right">{row.severity}</TableCell>
                    <TableCell align="left">{row.accident_id}</TableCell>
                    <TableCell align="right">
                    {row.permit_status_id === 1 ? 'Valid' :
                    row.permit_status_id === 2 ? 'Not Required' :
                    row.permit_status_id === 3 ? 'No Permit' :
                    row.permit_status_id === 4 ? 'Expired' :
                    'Unknown'}
                  </TableCell>

                    <TableCell align="right">
                      {row.ppe_status_id ===1?'OK':
                      row.ppe_status_id==2?'Faulty':
                      'Unknown' }
                    </TableCell>

                    <TableCell align="left">{row.toolbox_reference_number_id}</TableCell>
                    <TableCell align="right">{row.workmen_count}</TableCell>
                    <TableCell align="left">{row.workmen_names}</TableCell>
                    <TableCell align="right">{row.reportedby_count}</TableCell>
                    <TableCell align="left">{row.reportedby_names}</TableCell>
                    <TableCell align="right">{row.supervisor_count}</TableCell>
                    <TableCell align="left">{row.supervisor_names}</TableCell>
                    
                    <TableCell align="left">{row.about_the_accident}</TableCell>
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
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={openDialog} onClose={handleDialogClose}>
  <DialogTitle>Row Details</DialogTitle>
  <DialogContent>
    {selectedRow && (
      <Box >
        <Typography variant="body1"><strong>Accident ID:</strong> {selectedRow.accident_id}</Typography>
        <Typography variant="body1"><strong>Report Date:</strong> {selectedRow.accident_report_date}</Typography>
        <Typography variant="body1"><strong>Severity:</strong> {selectedRow.severity}</Typography>
        <Typography variant="body1"><strong>Description:</strong> {selectedRow.about_the_accident}</Typography>
        <Typography variant="body1"><strong>ReportedBy Names:</strong> {selectedRow.reportedby_names}</Typography>
        <Typography variant="body1"><strong>Workmen Names:</strong> {selectedRow.workmen_names}</Typography>
        <Typography variant="body1"><strong>Supervisor Names:</strong> {selectedRow.supervisor_names}</Typography>
        {/* Add more fields as required */}
        <img
          src={`data:image/png;base64,${selectedRow.accident_image}`}
          alt="Accident Image"
          style={{ width: '50%', height: 'auto', marginTop: '10px' }}
          onClick={(event) => {
            event.stopPropagation(); // Prevent row click event
            handleImageClick(`data:image/png;base64,${selectedRow.accident_image}`);
          }}
        />

      </Box>
    )}
  </DialogContent>
  <DialogActions>
    <button onClick={handleDialogClose} style={{ padding: '10px' }}>Close</button>
    <button onClick={handleDownloadSingleRow} style={{ padding: '10px' }}>Download</button>
  </DialogActions>
</Dialog>

      <Dialog open={openImageDialog} onClose={handleImageDialogClose}>
        <DialogTitle>Image Preview</DialogTitle>
        <DialogContent>
          <img
            src={selectedImage}
            alt="Preview"
            style={{ width: '400px', height: '300px', objectFit: 'cover' }}
          />
        </DialogContent>
        <DialogActions>
          <button onClick={handleImageDialogClose} style={{ padding: '10px' }}>Close</button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
