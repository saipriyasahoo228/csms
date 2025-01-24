// import React, {useState,useEffect} from 'react';
// import PropTypes from 'prop-types';
// import { alpha } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
// import TableRow from '@mui/material/TableRow';
// import TableSortLabel from '@mui/material/TableSortLabel';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import Paper from '@mui/material/Paper';
// import IconButton from '@mui/material/IconButton';
// import Tooltip from '@mui/material/Tooltip';
// import DeleteIcon from '@mui/icons-material/Delete';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import DownloadIcon from '@mui/icons-material/Download'; // Import DownloadIcon
// import { visuallyHidden } from '@mui/utils';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import api from "src/api";



// function descendingComparator(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function getComparator(order, orderBy) {
//   return order === 'desc'
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

// function stableSort(array, comparator) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) {
//       return order;
//     }
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// }

// const headCells = [
//   { id: 'name', numeric: false, disablePadding: true, label: 'Training Name' },
//   { id: 'number', numeric: true, disablePadding: false, label: 'Number' },
// ];

// function EnhancedTableHead(props) {
//   const { order, orderBy, onRequestSort } = props;
//   const createSortHandler = (property) => (event) => {
//     onRequestSort(event, property);
//   };

//   return (
//     <TableHead>
//       <TableRow>
//         {headCells.map((headCell) => (
//           <TableCell
//             key={headCell.id}
//             align={headCell.numeric ? 'right' : 'left'}
//             padding={headCell.disablePadding ? '4' : 'normal'}
//             sortDirection={orderBy === headCell.id ? order : false}
//           >
//             <TableSortLabel
//               active={orderBy === headCell.id}
//               direction={orderBy === headCell.id ? order : 'asc'}
//               onClick={createSortHandler(headCell.id)}
//             >
//               {headCell.label}
//               {orderBy === headCell.id ? (
//                 <Box component="span" sx={visuallyHidden}>
//                   {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
//                 </Box>
//               ) : null}
//             </TableSortLabel>
//           </TableCell>
//         ))}
//       </TableRow>
//     </TableHead>
//   );
// }

// EnhancedTableHead.propTypes = {
//   onRequestSort: PropTypes.func.isRequired,
//   order: PropTypes.oneOf(['asc', 'desc']).isRequired,
//   orderBy: PropTypes.string.isRequired,
// };

// function EnhancedTableToolbar(props) {
//   const { numSelected, onDownload } = props;

//   return (
//     <Toolbar
//       sx={{
//         pl: { sm: 2 },
//         pr: { xs: 1, sm: 1 },
//         ...(numSelected > 0 && {
//           bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
//         }),
//       }}
//     >
//       {numSelected > 0 ? (
//         <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
//           {numSelected} selected
//         </Typography>
//       ) : (
//         <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
//           TRAININGS
//         </Typography>
//       )}

//       {numSelected > 0 ? (
//         <Tooltip title="Delete">
//           <IconButton>
//             <DeleteIcon />
//           </IconButton>
//         </Tooltip>
//       ) : (
//         <>
//           <Tooltip title="Filter list">
//             <IconButton>
//               <FilterListIcon />
//             </IconButton>
//           </Tooltip>
//           <Tooltip title="Download">
//             <IconButton onClick={onDownload}>
//               <DownloadIcon />
//             </IconButton>
//           </Tooltip>
//         </>
//       )}
//     </Toolbar>
//   );
// }

// EnhancedTableToolbar.propTypes = {
//   numSelected: PropTypes.number.isRequired,
//   onDownload: PropTypes.func.isRequired,
// };

// export default function Trainingreport() {
//   const [order, setOrder] = React.useState('asc');
//   const [orderBy, setOrderBy] = React.useState('name');
//   const [selected, setSelected] = React.useState([]);
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(5);
//   const [rows, setRows] = useState([]);
  

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await api.get('/reports/organization/trainings');
//         const data = response.data.data;
//         const formattedData = Object.entries(data).map(([name, number], index) => ({
//           id: index + 1,
//           name,
//           number,
//         }));
//         setRows(formattedData);
//       }  catch (error) {
//         if (error.isAxiosError && error.response) {
//           // Handle API response errors
//           console.error(`HTTP error! status: ${error}`);
//           const errorData = JSON.stringify(error.response.data); // Parse the error response
//           console.error('Response body:', errorData);
//           alert(`Error: ${errorData}`);
//         }
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);


//   const handleRequestSort = (event, property) => {
//     const isAsc = orderBy === property && order === 'asc';
//     setOrder(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };

//   const handleClick = (event, id) => {
//     const selectedIndex = selected.indexOf(id);
//     let newSelected = [];

//     if (selectedIndex === -1) {
//       newSelected = newSelected.concat(selected, id);
//     } else if (selectedIndex === 0) {
//       newSelected = newSelected.concat(selected.slice(1));
//     } else if (selectedIndex === selected.length - 1) {
//       newSelected = newSelected.concat(selected.slice(0, -1));
//     } else if (selectedIndex > 0) {
//       newSelected = newSelected.concat(
//         selected.slice(0, selectedIndex),
//         selected.slice(selectedIndex + 1),
//       );
//     }
//     setSelected(newSelected);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const isSelected = (id) => selected.indexOf(id) !== -1;

//   // Avoid a layout jump when reaching the last page with empty rows.
//   const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

//   const visibleRows = React.useMemo(() => {
//     return stableSort(rows, getComparator(order, orderBy)).slice(
//       page * rowsPerPage,
//       page * rowsPerPage + rowsPerPage,
//     );
//   }, [order, orderBy, page, rows, rowsPerPage])


//   const handleDownload = () => {
//     const doc = new jsPDF();
//     doc.text('Training Report', 10, 10);
//     doc.autoTable({
//       head: [['Training Name', 'Number']],
//       body: rows.map(row => [row.name, row.number]),
//     });
//     doc.save('TrainingReport.pdf');
//   };

//   return (
//     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh'}}>
//       <Paper sx={{ width: '100%', mb: 2 }}>
//         <EnhancedTableToolbar numSelected={selected.length} onDownload={handleDownload} />
//         <TableContainer>
//           <Table aria-labelledby="tableTitle" size="medium">
//             <EnhancedTableHead
//               order={order}
//               orderBy={orderBy}
//               onRequestSort={handleRequestSort}
//             />
//             <TableBody>
//               {visibleRows.map((row, index) => (
//                 <TableRow
//                   hover
//                   onClick={(event) => handleClick(event, row.id)}
//                   role="checkbox"
//                   aria-checked={isSelected(row.id)}
//                   tabIndex={-1}
//                   key={row.id}
//                   selected={isSelected(row.id)}
//                   sx={{ cursor: 'pointer' }}
//                 >
//                   <TableCell component="th" scope="row" padding="4">
//                     {row.name}
//                   </TableCell>
//                   <TableCell align="right">{row.number}</TableCell>
//                 </TableRow>
//               ))}
//               {emptyRows > 0 && (
//                 <TableRow style={{ height: 53 * emptyRows }}>
//                   <TableCell colSpan={2} />
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={rows.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>
//     </Box>
//   );
// }




import React, { useState, useEffect } from 'react';
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
import TextField from '@mui/material/TextField';
import { visuallyHidden } from '@mui/utils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import api from "src/api";

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
  { id: 'name', numeric: false, disablePadding: true, label: 'Training Name' },
  { id: 'number', numeric: true, disablePadding: false, label: 'Number' },
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
  const { numSelected, onDownload, searchQuery, onSearch } = props;

  return (
    <Toolbar>
      
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          TRAININGS
        </Typography>
      

      <Box sx={{ flex: '1 1 100%', display: 'flex', justifyContent: 'flex-end' }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          sx={{ marginRight: 2 }}
        />
        
          <>
            
            <Tooltip title="Download">
              <IconButton onClick={onDownload}>
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
  onDownload: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default function Trainingreport() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/reports/organization/trainings');
        const data = response.data.data;
        const formattedData = Object.entries(data).map(([name, number], index) => ({
          id: index + 1,
          name,
          number,
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

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredRows = rows.filter(row => 
    row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.number.toString().includes(searchQuery)
  );

  const visibleRows = React.useMemo(() => {
    return stableSort(filteredRows, getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredRows, order, orderBy, page, rowsPerPage]);

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Training Name', 'Number']],
      body: filteredRows.map(row => [row.name, row.number]),
    });
    doc.save('trainings.pdf');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          onDownload={handleDownload}
          searchQuery={searchQuery}
          onSearch={handleSearch}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.map((row) => {
                const isItemSelected = isSelected(row.id);
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    <TableCell component="th" scope="row" padding="5">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.number}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (53) * emptyRows }}>
                  <TableCell colSpan={headCells.length} />
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
    </Box>
  );
}
