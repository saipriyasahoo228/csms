
// import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import Box from '@mui/material/Box';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
// import TableRow from '@mui/material/TableRow';
// import TableSortLabel from '@mui/material/TableSortLabel';
// import Paper from '@mui/material/Paper';
// import IconButton from '@mui/material/IconButton';
// import Tooltip from '@mui/material/Tooltip';
// import DownloadIcon from '@mui/icons-material/Download';
// import { visuallyHidden } from '@mui/utils';
// import jsPDF from 'jspdf';
// import { Typography, TextField } from '@mui/material';
// import 'jspdf-autotable';
// import api from "src/api";


 
// // const [rows, setRows] = useState([]);





// EnhancedTableHead.propTypes = {
//   onRequestSort: PropTypes.func.isRequired,
//   order: PropTypes.oneOf(['asc', 'desc']).isRequired,
//   orderBy: PropTypes.string.isRequired,
// };

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

// export default function ItemWiseTool() {
//   const [order, setOrder] = useState('asc');
//   const [orderBy, setOrderBy] = useState('employee_code');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [rows, setRows] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
  
//   const [headCells, setHeadCells] = useState([
//     { id: 'employee_code', numeric: false, disablePadding: true, label: 'Employee Code' },
//     { id: 'employee_name', numeric: false, disablePadding: false, label: 'Employee Name' },
//   ]);
  

  
// useEffect(() => {
//   const fetchItems = async () => {
//     // Simulated API call for headCells data
//     const response = await get('/item/getAll/'); // Replace with your endpoint
//     const items = await response.json();

//     // Add dynamic headCells
//     const dynamicHeadCells = items.map((item) => ({
//       id: item.item_id, // e.g., 'clampmeter'
//       numeric: true,
//       disablePadding: false,
//       label: item.item_name, // e.g., 'Clamp Meter'
//     }));

//     setHeadCells((prev) => [...prev, ...dynamicHeadCells]);

//    };

//   fetchItems();
// }, []);

// function EnhancedTableHead(props) {
//   const { order, orderBy, onRequestSort } = props;
//   const createSortHandler = (property) => (event) => {
//     onRequestSort(event, property);
//   };

//   return (
//     <TableHead>
//       <TableRow>
//         {headCells.map((headCell) => (
//           // <TableCell
//           //   key={headCell.id}
//           //   align={headCell.numeric ? 'right' : 'left'}
//           //   padding={headCell.disablePadding ? 'none' : 'normal'}
//           //   sortDirection={orderBy === headCell.id ? order : false}
//           // >
//         <TableCell
//           key={headCell.id}
//           align={headCell.numeric ? 'right' : 'left'}
//           padding={headCell.disablePadding ? 'none' : 'normal'}
//           sortDirection={orderBy === headCell.id ? order : false}
//         >
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

//   useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const response = await api.get('/item/issued/?filter=Tool');
//       const data = response.data.data; // Adjust based on actual API response structure

//       const formattedData = data.map((item, index) => {
//         const itemsData = item.items.reduce((acc, curr) => {
//           acc[curr.item_name] = curr.issue_date || 'N/A';
//           return acc;
//         }, {});

//         return {
//           id: index + 1,
//           employee_code: item.employee_id,
//           employee_name: item.employee_name,
//           image: item.image,
//           ...itemsData, // Dynamically add item fields
//         };
//       });

//       setRows(formattedData);
//     } catch (error) {
//       if (error.isAxiosError && error.response) {
//         console.error(`HTTP error! status: ${error}`);
//         const errorData = JSON.stringify(error.response.data);
//         console.error('Response body:', errorData);
//         alert(`Error: ${errorData}`);
//       }
//       console.error('Error fetching data:', error);
//     }
//   };

//   fetchData();
// }, []);


//   const uniqueItemNames = [...new Set(rows.flatMap(row =>
//     Object.keys(row).filter(key => !['id', 'employee_code', 'employee_name', 'image'].includes(key))
//   ))];

//   const handleRequestSort = (event, property) => {
//     const isAsc = orderBy === property && order === 'asc';
//     setOrder(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handlePdfDownload = () => {
//     const doc = new jsPDF();
//     doc.autoTable({
//       head: [['Employee Code', 'Employee Name', 'Clampmeter', 'Plier', 'Hammer']],
//       body: filteredRows.map(row => [row.employee_code, row.employee_name, row.clampmeter, row.plier, row.hammer]),
//     });
//     doc.save('itemwise-tool-reports.pdf');
//   };

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   const filteredRows = rows.filter(row =>
//     row.employee_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     row.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     row.clampmeter.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     row.plier.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     row.hammer.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

//   const visibleRows = stableSort(filteredRows, getComparator(order, orderBy)).slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   return (
//     <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
//       <Paper sx={{ width: '100%', mb: 2, padding: 5 }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//           <Typography variant="h6" id="tableTitle" component="div">
//             Item Wise Tool Report
//           </Typography>
//           <Box>
//           <TextField
//               variant="outlined"
//               size="small"
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={handleSearchChange}
//               sx={{ marginRight: 2 }}
//             />
//             <Tooltip title="Download PDF">
//               <IconButton onClick={handlePdfDownload}>
//                 <DownloadIcon />
//               </IconButton>
//             </Tooltip>

//           </Box>
//         </Box>
//         <TableContainer>
//           <Table sx={{ minWidth: 730 }} aria-labelledby="tableTitle">
//             <EnhancedTableHead
//               order={order}
//               orderBy={orderBy}
//               onRequestSort={handleRequestSort}
//             />
//             <TableBody>
//               {visibleRows.map((row) => (
//                 <TableRow
//                   hover
//                   key={row.id}
//                   sx={{ cursor: 'pointer' }}
//                 >
//                   <TableCell component="th" scope="row" padding="none">
//                     {row.employee_code}
//                   </TableCell>
//                   <TableCell align="right">{row.employee_name}</TableCell>

//                   {uniqueItemNames.map(itemName => (
//         <TableCell key={itemName} align="right">{row[itemName] || 'N/A'}</TableCell>
//       ))}

//                 </TableRow>
//               ))}
//               {emptyRows > 0 && (
//                 <TableRow
//                   style={{
//                     height: (dense ? 33 : 53) * emptyRows,
//                   }}
//                 >
//                   <TableCell colSpan={6} />
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={filteredRows.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>
//     </Box>
//   );
// }

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
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
import ExcelJS from 'exceljs'; // Add Excel export
import { RiFileExcel2Fill } from "react-icons/ri";
import { format } from 'date-fns';

// const headCells = [
//   { id: 'employee_code', numeric: false, disablePadding: true, label: 'Employee Code' },
//   { id: 'employee_name', numeric: true, disablePadding: false, label: 'Employee Name' },

//   { id: 'clampmeter', numeric: true, disablePadding: false, label: 'Clamp Meter' },
//   { id: 'plier', numeric: true, disablePadding: false, label: 'Plier' },
//   { id: 'hammer', numeric: true, disablePadding: false, label: 'Hammer' },

// ];

export default function ItemWiseTool() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('employee_code');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemNames, setItemNames] = useState([]);

   const [headCells, setHeadCells] = useState([
     
    ]);
    const headCells1 = [
      { id: 'employee_code', numeric: false, disablePadding: true, label: 'Employee Code' },
      { id: 'employee_name', numeric: false, disablePadding: false, label: 'Employee Name' },
    ]
  
    // const [headCells, setHeadCells] = useState([]);  // Initialize headCells state

    useEffect(() => {
      const fetchItem = async () => {
        try {
          const response = await api.get('/item/getAll/');
          const data = response.data;
    
          // Filter data to include only items with item_type_id = 1
          const filteredData = data.filter(item => item.item_type.item_type_id === 1);
    
          // Set table headers dynamically
          const headers = filteredData.map((header) => ({
            id: header.item_name,
            label: header.item_name,
            numeric: header.numeric || false,
            disablePadding: header.disablePadding || false,
          }));
          setHeadCells(headers);
          console.log("Filtered headers:", headers);
    
          // Optionally, set rows for the table if needed
          // setRows(filteredData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      fetchItem();
    }, []);
    
 
    function EnhancedTableHead(props) {
      const { order, orderBy, onRequestSort } = props;
      
      const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
      };
  
      return (
        <TableHead>
          <TableRow>
          {headCells1.map((headCell) => (
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
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/item/issued/?filter=Tool');
        console.log("API Response:", response.data);

        const data = response.data.data || []; // Ensure data is available

        // Extract all unique item names dynamically
        const uniqueItemNames = [
          ...new Set(
            data.flatMap((item) => item.items.map((i) => i.item_name))
          ),
        ];
        setItemNames(uniqueItemNames);

        // Format the rows dynamically
        const formattedData = data.map((item, index) => {
          const itemDetails = {};

          // Dynamically add properties for each unique item name
          uniqueItemNames.forEach((name) => {
            const foundItem = item.items?.find(i => i.item_name === name);
            if (foundItem && foundItem.issue_date) {
              const formattedDate = format(new Date(foundItem.issue_date), 'dd/MM/yyyy'); // Format as dd/MM/yyyy
              itemDetails[name.toLowerCase().replace(/\s+/g, '_')] = formattedDate;
            } else {
              itemDetails[name.toLowerCase().replace(/\s+/g, '_')] = 'N/A';
            }
          });
          return {
            id: index + 1,
            employee_code: item.employee_id || 'N/A',
            employee_name: item.employee_name || 'N/A',
            image: item.image || 'N/A',
            ...itemDetails, // Spread dynamically created item properties
          };
        });

        console.log("Unique Item Names:", uniqueItemNames);
        console.log("Formatted Data:", formattedData);
        setRows(formattedData); // Set the formatted data in state
      } catch (error) {
        if (error.isAxiosError && error.response) {
          console.error(`HTTP error! status: ${error.response.status}`);
          console.error("Response body:", error.response.data);
          alert(`Error: ${JSON.stringify(error.response.data)}`);
        } else {
          console.error("Error fetching data:", error);
        }
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
      
      // Map over headCells1 to extract labels for the header
      const pdfHeaders = ['Employee Code', 'Employee Name', ...headCells.map(cell => cell.label)];
    
      doc.autoTable({
        head: [pdfHeaders],
        body: rows.map(row => [
          row.employee_code, 
          row.employee_name, 
          ...itemNames.map(name => row[name.toLowerCase().replace(/\s+/g, '_')])
        ]),
      });
    
      doc.save('itemwise-tools-reports.pdf');
    };
    
    const handleExcelDownload = async () => {
      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Itemwise PPE Report');
    
      // Define the header row
      worksheet.columns = [
        { header: 'Employee Code', key: 'employee_code' },
        { header: 'Employee Name', key: 'employee_name' },
        ...headCells.map(cell => ({ header: cell.label, key: cell.label.toLowerCase().replace(/\s+/g, '_') }))
      ];
    
      // Add rows with employee data
      rows.forEach(row => {
        worksheet.addRow({
          employee_code: row.employee_code,
          employee_name: row.employee_name,
          ...itemNames.reduce((acc, name) => {
            acc[name.toLowerCase().replace(/\s+/g, '_')] = row[name.toLowerCase().replace(/\s+/g, '_')];
            return acc;
          }, {})
        });
      });
    
      // Generate the Excel file and trigger download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'itemwise-tools-reports.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredRows = rows.filter(row =>
    row.employee_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) 
    // row.clampmeter.toLowerCase().includes(searchQuery.toLowerCase()) ||
    // row.plier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    // row.hammer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

  const visibleRows = stableSort(filteredRows, getComparator(order, orderBy)).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <Paper sx={{ width: '100%', mb: 2, padding: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" id="tableTitle" component="div">
            Item Wise Tool Report
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

            <Tooltip title="Download Excel">
            <IconButton onClick={handleExcelDownload}>
            <RiFileExcel2Fill />
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
                    {row.employee_code}
                  </TableCell>
                  <TableCell align="left">{row.employee_name}</TableCell>

                  {itemNames.map((name) => (
                <TableCell key={name}>{row[name.toLowerCase().replace(/\s+/g, '_')]}</TableCell> // Render row values dynamically
              ))}

                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
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
    </Box>
  );
}
