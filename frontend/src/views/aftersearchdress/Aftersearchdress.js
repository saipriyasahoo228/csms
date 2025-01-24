import React,{useEffect,useState} from 'react';
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
import {  Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import api from "src/api";
import { format } from 'date-fns'; 

function createData(id, slno, dresslist, issuedate, nextissue) {
  return { id, slno, dresslist, issuedate, nextissue };
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
  { id: 'issuance_id', numeric: false, disablePadding: true, label: 'REF NO.' },
  { id: 'dresslist', numeric: true, disablePadding: false, label: 'DRESS LIST' },
  { id: 'issuedate', numeric: true, disablePadding: false, label: 'ISSUED DATE' },
  { id: 'nextissue', numeric: true, disablePadding: false, label: 'NEXT ISSUANCE' },
  { id: 'newIssuance_image', numeric: true, disablePadding: false, label: 'IMAGE' },
  { id: 'description', numeric: true, disablePadding: false, label: 'DESCRIPTION' },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
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
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, onPdfDownload } = props;

  return (
    <Toolbar>

        <Typography sx={{ flex: '1 1 100%' ,textAlign:'center'}} variant="h6" id="tableTitle" component="div">
          DRESS
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
  onPdfDownload: PropTypes.func.isRequired, // Add this line
};

export default function Aftersearchdress(props) {
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
        // Fetch your data (make sure to adapt the endpoint)
        const response = await api.get(`/item/issued/?filter=Dress&employeeId=${employee_id}`);
        console.log(response.data);

        // Flatten the items array to create individual rows for each tool
        const itemsData = response.data.data.flatMap((employee, index) =>
          employee.items.map((item, itemIndex) => ({
            id: `${index}-${itemIndex}`,
            slno: itemIndex + 1,
            issuance_id:item.issuance_id,
            dresslist: item.item_name,
            issuedate: format(new Date(item.issue_date), 'dd/MM/yyyy'),  // Formatted date using date-fns
            nextissue: format(new Date(item.expiry_date), 'dd/MM/yyyy'),
            newIssuance_image:item.newIssuance_image,
            about_the_newissuance:item.about_the_newissuance
          }))
        );

        setRows(itemsData);
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
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedImage('');
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(() => {
    return stableSort(rows, getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [order, orderBy, page, rows, rowsPerPage])
  // Function to handle PDF download
  const handlePdfDownload = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['SL NO.', 'REFNO.','DRESS LIST', 'ISSUED DATE', 'NEXT ISSUANCE','IMAGE','DESCRIPTION']],
      body: rows.map((row) => [row.slno,row.issuance_id, row.dresslist, row.issuedate, row.nextissue,row.image,row.about_the_newissuance]),
    });
    doc.save('Dress_Report.pdf');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, padding: 5 }}>
        <EnhancedTableToolbar numSelected={selected.length} onPdfDownload={handlePdfDownload} />
        <TableContainer>
          <Table sx={{ minWidth: 730 }} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
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
                    <TableCell align="left">{row.issuance_id}</TableCell>
                    <TableCell align="right">{row.dresslist}</TableCell>
                    <TableCell align="right">{row.issuedate}</TableCell>
                    <TableCell align="right">{row.nextissue}</TableCell>
                    <TableCell align="right">
                        <img
                          src={`data:image/png;base64,${row.newIssuance_image}`}
                           alt="Image Not Found "
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '5px',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleImageClick(`data:image/png;base64,${row.newIssuance_image}`)}
                          onError={(e) => {
                            e.target.onerror = null; // Prevent infinite loop
                            // e.target.src = 'https://via.placeholder.com/80'; // Fallback image
                          }}
                />
              </TableCell>
              <TableCell align="right">{row.about_the_newissuance}</TableCell>
              
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
