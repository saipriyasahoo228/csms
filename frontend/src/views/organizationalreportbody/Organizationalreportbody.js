import React from "react";
import Box from '@mui/material/Box';
import Toollist from "../toollist/Toollist";
import Ppelist from "../ppelist/Ppelist";
import Dresslist from "../dresslist/Dresslist";
import Trainingreport from "../trainingreport/Trainingreport";
// import Accidentreportdashboard from "../accidentreportdashboard/Accidentreportdashboard";
import Accidentreport from "../accidentreport/Accidentreport";
import Organizationcheckup from "../organizationwisecheckup/Organizationcheckup";

export default function Organizationalreportbody() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h2 style={{color:"white"}}>Equipment List Report</h2>
            
            <Box sx={{ width: '100%' }}>
                <Toollist />
            </Box>
            <Box sx={{ width: '100%' }}>
                <Ppelist />
            </Box>
            <Box sx={{ width: '100%' }}>
                <Dresslist />
            </Box>
           
            <h2 style={{color:"white"}}>Training Report</h2>
            <Box sx={{ width: '100%' }}>
                <Trainingreport />
            </Box>
            <Box sx={{ width: '100%' }}>
                <Accidentreport />
            </Box>
            <Box sx={{ width: '100%' }}>
                <Organizationcheckup />
            </Box>
        </Box>
    );
}
