import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import {setRole, setUserInfo} from 'src/store'; // Import the setRole action
import image from '../login/asset/industry4.jpg'; // Import your background image
import {getLoggedInUserInfo, login} from 'src/auth';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue
      contrastText: '#ffffff', // White for text
    },
    secondary: {
      main: '#ffffff', // White
      contrastText: '#1976d2', // Blue for text
    },
  },
});

const ADMIN_ROLE = 'Admin';
const OPERATOR_ROLE = 'Operator';
const VIEWER_ROLE ='Viewer'

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumberError, setMobileNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(''); // State for network error message

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();

    let isValid = true;
    if (!mobileNumber) {
      setMobileNumberError('Mobile number is required');
      isValid = false;
    }
    else if(isNaN(mobileNumber)){
      setMobileNumberError('Mobile number should contain only digit');
      isValid = false;
    }
    else if(mobileNumber.toString().length !== 10){
      setMobileNumberError('Mobile number length should be 10 digits');
      isValid = false;
    } else {
      setMobileNumberError('');
    }

    // const passwordRegex = /^(?=.[A-Z])(?=.[!@#$%^&])(?=.[a-zA-Z0-9]).{8,}$/;
    // if (!password) {
    //   setPasswordError('Password is required');
    //   isValid = false;
    // } else if (!passwordRegex.test(password)) {
    //   setPasswordError('Password must be at least 8 characters, start with a capital letter, and include a special character');
    //   isValid = false;
    // } else {
    //   setPasswordError('');
    // }


    if (!isValid) return;

    setLoading(true); // Set loading state to true
    try {
      await login(mobileNumber, password);
      console.log('Login successful');

      const response = await getLoggedInUserInfo();
      const role = response.info.role;
      dispatch(setUserInfo(response.info));
      dispatch(setRole(role));

      if (role === ADMIN_ROLE) {
        navigate('/dashboard');
      } else if (role === OPERATOR_ROLE) {
        navigate('/appsidebar1');
      }
      else if (role === VIEWER_ROLE) {
        navigate('/appsidebar2');
      }
    }
    catch (error) {
      if (error.isAxiosError && error.response) {
        // Handle API response errors
        console.error('Error logging in:', error.response.data.detail);
        alert('Login failed. Please check your credentials and try again.');
      } else {
        // Handle network errors
        console.error('Network error:', error);
        setNetworkError('Network error occurred. Please try again later.');
      }
    }
    finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundImage:`url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          objectFit: 'fill'
        }}
      >
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
            borderRadius: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            padding: '20px',
          }}
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" color="primary">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              {networkError && (
                <Alert severity="error" sx={{ width: '100%' }}>
                  {networkError}
                </Alert>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="mobileNumber"
                label="Mobile Number"
                name="mobileNumber"
                autoComplete="mobileNumber"
                autoFocus
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                error={!!mobileNumberError}
                helperText={mobileNumberError}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(0, 0, 0, 0.6)',
                    '&.Mui-focused': {
                      color: 'primary.main',
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(0, 0, 0, 0.6)',
                    '&.Mui-focused': {
                      color: 'primary.main',
                    },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading} // Disable button while loading
              >
                {loading ? <CircularProgress size={24} color="secondary" /> : 'Sign In'}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                {/* <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid> */}
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;