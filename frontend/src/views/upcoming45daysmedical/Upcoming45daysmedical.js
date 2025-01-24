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
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DownloadIcon from '@mui/icons-material/Download';
import { visuallyHidden } from '@mui/utils';
import jsPDF from 'jspdf';
import { Typography, TextField } from '@mui/material';
import 'jspdf-autotable';
import api from "src/api";
import { format } from 'date-fns';

const headCells = [
  { id: 'slno', numeric: false, disablePadding: true, label: 'SL NO' },
  { id: 'employee_id', numeric: true, disablePadding: false, label: 'Employee Code' },
  { id: 'employee_name', numeric: true, disablePadding: false, label: 'Employee Name' },
  { id: 'checkup_date', numeric: true, disablePadding: false, label: 'Checkup Date' },
  // { id: 'checkup_image', numeric: true, disablePadding: false, label: 'Checkup Image' },
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
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

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

export default function Upcoming45daysmedical() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('employee_id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Add search query state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/medical/upcoming/45/');
        const data = response.data.data;
        const formattedData = data.map((item, index) => ({
          id: index + 1,
          slno: index + 1,
          employee_id: item.employee_id,
          employee_name: item.employee_name,
          checkup_date:item.checkup_date? format(new Date(item.checkup_date), 'dd/MM/yyyy') : 'N/A',
          // checkup_image:item.checkup_image,
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePdfDownload = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['SL NO', 'Employee Code', 'Employee Name', 'Checkup Date',]],
      body: rows.map(row => [row.slno, row.employee_id, row.employee_name, row.checkup_date,]),
    });
    doc.save('Upcoming 45 days medical-checkup-reports.pdf');
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filterRows = rows.filter(row =>
    row.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.checkup_date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filterRows.length) : 0;

  const visibleRows = stableSort(filterRows, getComparator(order, orderBy)).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <Paper sx={{ width: '100%', mb: 2, padding: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" id="tableTitle" component="div">
            Medical Checkup Report
          </Typography>
          <Box>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ marginRight: 2 }}
            />
            <Tooltip title="Download PDF">
              <IconButton onClick={handlePdfDownload}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 730 }} aria-labelledby="tableTitle">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.map((row) => (
                <TableRow
                  hover
                  key={row.id}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell component="th" scope="row" padding="none">
                    {row.slno}
                  </TableCell>
                  <TableCell align="right">{row.employee_id}</TableCell>
                  <TableCell align="right">{row.employee_name}</TableCell>
                  <TableCell align="right">{row.checkup_date}</TableCell>
                  s
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={5} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filterRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
