import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  FormControl,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
  Divider,
  Grid,
  Button,
  Container,
  CircularProgress,
  Checkbox,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Fab,
  IconButton,
  List,
  ListItem,
} from '@mui/material'
import Imagecompression from '../imagecompression/Imagecompression'
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import api from 'src/api'

import { useForm } from 'react-hook-form'

const Safetytraining = (onEmployeesChange) => {
  const userInfo = useSelector((state) => state.userInfo)
  const [whitelevel_id, setWhitelevel_id] = useState(userInfo.whitelevel_id)
  const [training_date, setTraining_date] = useState(new Date().toISOString().split('T')[0])
  const [training_id, setTraining_id] = useState('')
  const [training_type, setTraining_type] = useState('4')
  const [training_name, setTraining_name] = useState('')
  const [showOtherTrainingField, setShowOtherTrainingField] = useState(false)
  const [trainers, setTrainers] = useState([])
  const [trainees, setTrainees] = useState([])
  const [compressedImageBase64, setCompressedImageBase64] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [about_the_training, setAbout_the_training] = useState('')
  const [state, setState] = useState({
    option1: false,
  })
  const [rows, setRows] = useState([])
  const [rows1, setRows1] = useState([
    { employee_id: '', employee_name: '', manual: false, disableNameField: false },
  ])
  const [suggestions, setSuggestions] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [activeRowIndex, setActiveRowIndex] = useState(null)
  const [showSuggestions, setShowSuggestions] = useState({})
  const [role, setRole] = useState(null)

  const [errors, setErrors] = useState({
    trainingDate: '',
    trainingId: '',
    whitelevelId: '',
    trainingType: '',
    trainingName: '',
    rows1: '',
    rows: '',
    image: '',
    about_the_training: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false) // Track if form has been submitted
  const validateEmployeeName = (name) => /^[a-zA-Z\s.]*$/.test(name)

  const checkForDuplicates = (rows1, rows) => {
    const trainerCodes = rows1.map((trainer) => trainer.employee_id)
    const traineeCodes = rows.map((trainee) => trainee.employee_id)
    const duplicateCodes = trainerCodes.filter((code) => traineeCodes.includes(code))
    return duplicateCodes.length > 0
  }
  const fetchEmployeeName = async (employee_id) => {
    try {
      const response = await api.post(`/employee/name/`, {
        employee_id,
        whitelevel_id,
      })
      return response.data.employee_name || ''
    } catch (error) {
      console.error('Error fetching employee name:', error)
      return ''
    }
  }

  const fetchEmployeeSuggestions = async (nameQuery) => {
    try {
      const response = await api.get(`/employee/search/?nameQuery=${nameQuery}`)
      return response.data || []
    } catch (error) {
      console.error('Error fetching employee suggestions:', error)
      return []
    }
  }

  // useEffect(() => {
  //   onChange(
  //     rows.map((row) => ({
  //       employee: row.employee_id,
  //       employee_id: row.employee_id,
  //       employee_name: row.employee_name,
  //       whitelevel_id: whitelevel_id,
  //       trainee_id: row.employee_id,
  //       trainee_name: row.employee_name,
  //     })),
  //   )
  // }, [rows, onChange])

  const handleAddRow = () => {
    const hasEmptyFields = rows.some(
      (row) =>
        (typeof row.employee_id === 'string' && row.employee_id.trim() === '') ||
        (typeof row.employee_name === 'string' && row.employee_name.trim() === ''),
    )

    if (hasEmptyFields) {
      alert('Please fill in all the fields before adding a new row.')
      const updatedRows = rows.map((row) => ({
        ...row,
        error:
          (typeof row.employee_id === 'string' && row.employee_id.trim() === '') ||
          (typeof row.employee_name === 'string' && row.employee_name.trim() === '')
            ? 'empty_field'
            : row.error,
      }))
      setRows(updatedRows)
      console.log('Updated rows after adding a row with empty fields:', updatedRows) // Log the updated rows
      return
    }

    const updatedRows = [
      ...rows,
      { employee_id: '', whitelevel_id, employee_name: '', error: null, disableNameField: false },
    ]
    setRows(updatedRows)
    console.log('Updated rows after adding a new row:', updatedRows) // Log the updated rows
  }
  const handleAddRow1 = () => {
    const isLastRowFilled =
      rows1.length === 0 ||
      (rows1[rows1.length - 1].employee_id &&
        (rows1[rows1.length - 1].employee_name || rows1[rows1.length - 1].name))

    if (isLastRowFilled) {
      setRows1([
        ...rows1,
        {
          employee_id: '',
          whitelevel_id,
          employee_name: '',
          name: '',
          error: '',
          manual: false,
          employee_id_error: false,
          employee_name_error: false,
          disableNameField: false,
          invalidCharacterError: false,
        },
      ])
    } else {
      const updatedRows = [...rows1]
      if (!rows1[rows1.length - 1].employee_id) {
        updatedRows[rows1.length - 1].employee_id_error = true
      }
      if (!(rows1[rows1.length - 1].employee_name || rows1[rows1.length - 1].name)) {
        updatedRows[rows1.length - 1].employee_name_error = true
      }
      setRows1(updatedRows)
    }
  }

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index)

    setRows(updatedRows)

    console.log('Updated rows after deleting a row:', updatedRows) // Log the updated
  }
  const handleDeleteRow1 = (index) => {
    const updatedRows = rows1.filter((_, i) => i !== index)
    setRows1(updatedRows)
    console.log('Updated rows after deleting a row:', updatedRows) // Log the updated
  }

  const handleInputChange1 = async (index, event) => {
    const { name, value } = event.target
    const updatedRows = [...rows]
    updatedRows[index][name] = value.trim()

    if (name === 'employee_id') {
      const isDuplicateID = updatedRows.some((row, i) => row.employee_id === value && i !== index)

      if (isDuplicateID) {
        updatedRows[index].error = 'duplicate'
        updatedRows[index].employee_name = '' // Clear the employee name field
        updatedRows[index].disableNameField = true // Disable the employee name field
      } else if (value.trim() !== '') {
        const employee_name = await fetchEmployeeName(value)
        if (employee_name) {
          updatedRows[index].employee_name = employee_name
          updatedRows[index].error = null
          updatedRows[index].disableNameField = true // Disable the employee name field
        } else {
          updatedRows[index].employee_name = ''
          updatedRows[index].error = 'invalid'
          updatedRows[index].disableNameField = true // Disable the employee name field when employee does not exist
        }
      } else {
        updatedRows[index].employee_name = ''
        updatedRows[index].error = null
        updatedRows[index].disableNameField = false // Enable the employee name field
      }
    }

    setRows(updatedRows)
    console.log('Updated rows after employee_id input change:', updatedRows) // Log the updated rows
  }

  // const handleDeleteRow = (index) => {
  //   const updatedRows = rows.filter((_, i) => i !== index)
  //   setRows(updatedRows)
  // if (role === 'trainers') {
  //   setTrainers(updatedRows)
  //   if (isSubmitted) {
  //     let trainerErrors = []
  //     let hasEmptyFields = false

  //     // Check for empty fields in trainers
  //     updatedRows.forEach((trainer, index) => {
  //       if (trainer.trainer_id !== '0' && (!trainer.trainer_id || !trainer.trainer_name)) {
  //         trainerErrors.push(Trainer ${index + 1} has empty fields.)
  //         hasEmptyFields = true
  //       }
  //     })

  //     if (hasEmptyFields) {
  //       newErrors.trainers = trainerErrors.join(' ')
  //       setErrors(newErrors)
  //       return
  //     }

  //     // Check for duplicates if no empty fields
  //     if (checkForDuplicates(updatedRows, rows)) {
  //       newErrors.trainers = 'Trainer and Trainee employee codes should not be equal'
  //       newErrors.rows = 'Trainer and Trainee employee codes should not be equal'
  //     } else {
  //       newErrors.trainers = ''
  //       newErrors.rows = ''
  //     }
  //   }
  // }

  // if (role === 'trainees') {
  //   setTrainees(updatedRows)
  //   if (isSubmitted) {
  //     let traineeErrors = []
  //     let hasEmptyFields = false

  //     // Check for empty fields in trainees
  //     updatedRows.forEach((trainee, index) => {
  //       if (trainee.trainee_id !== '0' && (!trainee.trainee_id || !trainee.trainee_name)) {
  //         traineeErrors.push(Trainee ${index + 1} has empty fields.)
  //         hasEmptyFields = true
  //       }
  //     })

  //     if (hasEmptyFields) {
  //       newErrors.rows = traineeErrors.join(' ')
  //       setErrors(newErrors)
  //       return
  //     }

  //     // Check for duplicates if no empty fields
  //     if (checkForDuplicates(trainers, updatedRows)) {
  //       newErrors.trainers = 'Trainer and Trainee employee codes should not be equal'
  //       newErrors.rows = 'Trainer and Trainee employee codes should not be equal'
  //     } else {
  //       newErrors.trainers = ''
  //       newErrors.rows = ''
  //     }
  //   }
  // }
  // }

  // Remove handleDeleteRow function

  // Proceed with the relevant code for trainers and trainees validation and state updates
  const handleRowValidation = (updatedRows) => {
    let newErrors = {} // Initialize new errors object

    if (role === 'rows1') {
      setRows1(updatedRows) // Update the rows1 for trainers
      if (isSubmitted) {
        let rows1Errors = []
        let hasEmptyFields = false

        // Check for empty fields in trainers
        updatedRows.forEach((row1, index) => {
          if (row1.employee_id !== '0' && (!row1.employee_id || !row1.employee_name)) {
            rows1Errors.push(`Trainer ${index + 1} has empty fields.`)
            hasEmptyFields = true
          }
        })

        if (hasEmptyFields) {
          newErrors.rows1 = rows1Errors.join(' ')
          setErrors(newErrors)
          return
        }

        // Check for duplicates between trainers and trainees
        if (checkForDuplicates(updatedRows, rows, rows1)) {
          newErrors.rows1 = 'Trainer and Trainee employee codes should not be equal'
          newErrors.rows = 'Trainer and Trainee employee codes should not be equal'
          setErrors(newErrors)
        } else {
          newErrors.rows1 = ''
          newErrors.rows = ''
          setErrors(newErrors)
        }
      }
    }

    if (role === 'rows') {
      setRows(updatedRows) // Update the rows for trainees
      if (isSubmitted) {
        let rowsErrors = []
        let hasEmptyFields = false

        // Check for empty fields in trainees
        updatedRows.forEach((row, index) => {
          if (row.employee_id !== '0' && (!row.employee_id || !row.employee_name)) {
            rowsErrors.push(`Trainee ${index + 1} has empty fields.`)
            hasEmptyFields = true
          }
        })

        if (hasEmptyFields) {
          newErrors.rows = rowsErrors.join(' ')
          setErrors(newErrors)
          return
        }

        // Check for duplicates between trainers and trainees
        if (checkForDuplicates(rows1, rows, updatedRows)) {
          newErrors.rows1 = 'Trainer and Trainee employee codes should not be equal'
          newErrors.rows = 'Trainer and Trainee employee codes should not be equal'
          setErrors(newErrors)
        } else {
          newErrors.rows = ''
          newErrors.rows1 = ''
          setErrors(newErrors)
        }
      }
    }
  }

  // Use handleRowValidation to update rows and validate

  const handleInputChange2 = async (index, event) => {
    const { name, value } = event.target
    const updatedRows = [...rows1]

    // Check for invalid characters
    if (name === 'employee_name' || name === 'name') {
      if (!validateEmployeeName(value)) {
        updatedRows[index].invalidCharacterError = true
        setRows1(updatedRows)
        return
      } else {
        updatedRows[index].invalidCharacterError = false
      }
    }

    updatedRows[index][name] = value

    if (name === 'employee_id') {
      updatedRows[index].employee_id_error = false
      updatedRows[index].error = ''

      if (value === '0') {
        updatedRows[index].employee_name = ''
        updatedRows[index].manual = true
        updatedRows[index].disableNameField = false
      } else {
        const isDuplicate = updatedRows.some((row, i) => row.employee_id === value && i !== index)
        updatedRows[index].error = isDuplicate ? 'duplicate' : ''
        if (isDuplicate) {
          updatedRows[index].disableNameField = true
        } else {
          const empName = await fetchEmployeeName(value, whitelevel_id)
          if (empName) {
            updatedRows[index].employee_name = empName
            updatedRows[index].manual = false
            updatedRows[index].disableNameField = true
          } else {
            updatedRows[index].error = 'invalid'
            updatedRows[index].employee_name = ''
            updatedRows[index].disableNameField = true
          }
        }
      }
    } else if (name === 'employee_name') {
      if (value.length > 0) {
        const isDuplicate = updatedRows.some((row, i) => row.employee_name === value && i !== index)
        if (isDuplicate) {
          updatedRows[index].error = 'duplicate'
          updatedRows[index].disableIDField = true
        } else {
          const suggestionsData = await fetchEmployeeSuggestions(value)
          setSuggestions((prev) => ({ ...prev, [index]: suggestionsData }))
          setShowSuggestions((prev) => ({ ...prev, [index]: true }))
          updatedRows[index].disableIDField = false
        }
      } else {
        setSuggestions((prev) => ({ ...prev, [index]: [] }))
        setShowSuggestions((prev) => ({ ...prev, [index]: false }))
      }
    } else {
      updatedRows[index].employee_name_error = false
      if (name === 'name' && rows1[index].employee_id === '0') {
        updatedRows[index].employee_name_error = false
        updatedRows[index].error = ''
      }
    }
    setRows1(updatedRows)
  }

  const handleSuggestionClick = (index, suggestion) => {
    const updatedRows = [...rows]
    const isDuplicateID = updatedRows.some(
      (row) => row.employee_id === suggestion.employee_id && row !== updatedRows[index],
    )

    if (isDuplicateID) {
      updatedRows[index].error = 'duplicate'
      updatedRows[index].disableNameField = true // Disable the Employee Name field
    } else {
      updatedRows[index].employee_id = suggestion.employee_id
      updatedRows[index].employee_name = suggestion.employee_name
      updatedRows[index].error = null
      updatedRows[index].disableNameField = true // Disable the Employee Name field
    }

    setRows(updatedRows)
    setSuggestions([])
    setActiveRowIndex(null)
    console.log('Updated rows after suggestion click:', updatedRows) // Log the updated rows
  }

  const handleSuggestionMouseEnter = (idx) => {
    setSelectedIndex(idx)
  }

  const handleSuggestionMouseLeave = () => {
    setSelectedIndex(null)
  }

  const handleChange = async (event) => {
    const { name, checked } = event.target

    if (!training_id) return

    setIsLoading(true)
    setIsLoading(true)
    try {
      const response = await api.post('/training/training-details/', {
        training_id: training_id,
        whitelevel_id: whitelevel_id,
      })
      const data = response.data

      if (data) {
        // Update state with fetched data
        setTraining_date(data.training_date)
        setTraining_type(data.training_type)
        setTraining_name(data.training_name)
        setRows1(
          data.trainers.map((trainer) => ({
            employee_id: trainer.employee_id,
            employee_name: trainer.trainer_name,
          })),
        )

        // Fetch and set trainees with specific fields
        setRows(
          data.trainees.map((trainee) => ({
            employee_id: trainee.employee_id,
            employee_name: trainee.trainee_name,
          })),
        )
        setCompressedImageBase64(data.training_image)
        setAbout_the_training(data.about_the_training)
      } else {
        // If data is not found, handle it
        alert('No SafetyTraining data found. Please check the reference number.')
      }

      console.log('Fetched data:', response.data)
    } catch (error) {
      console.error('Error fetching accident data:', error)
      setErrors({ fetch: 'Failed to fetch accident data. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  // const handleInputChange = (role, updatedRows) => {

  // }

  const handleWhiteLevelIdChange = (e) => {
    setWhitelevel_id(e.target.value)
  }

  const handleDateChange = (event) => {
    setTraining_date(event.target.value)
  }

  const handleTrainingTypeChange = (event) => {
    const selectedValue = event.target.value
    setTraining_type(selectedValue)
    setShowOtherTrainingField(selectedValue === '1') // Show field if "Others" is selected
    setErrors({ ...errors, trainingType: selectedValue === '' ? 'Training Type is required' : '' })
  }
  const handleOtherTrainingNameChange = (event) => {
    const value = event.target.value
    const namePattern = /^[A-Za-z\s]*$/ // Regex to allow only alphabets and spaces
    setTraining_name(value)
    if (training_type === '1') {
      // Validate only if 'Others' is selected and form is submitted
      if (!namePattern.test(value)) {
        setErrors({
          ...errors,
          trainingName: 'Training Name must contain only alphabets and spaces',
        })
      } else {
        setErrors({ ...errors, trainingName: '' })
      }
    }
  }

  const handleTrainingIdChange = (event) => {
    setTraining_id(event.target.value)
  }

  const handleTraining = (e) => {
    setAbout_the_training(e.target.value)
  }

  const today = new Date().toISOString().split('T')[0]

  const resetForm = () => {
    setWhitelevel_id(userInfo.whitelevel_id)
    setTraining_date(new Date().toISOString().split('T')[0])
    setTraining_id('')
    setTraining_type('4')
    setTraining_name('')
    setShowOtherTrainingField(false)
    setRows([])
    setRows1([])
    setCompressedImageBase64('')
    setAbout_the_training('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setIsSubmitted(true) // Mark form as submitted
    handleRowValidation() // Perform validation

    // Initialize form validity and error object
    let formValid = true
    const newErrors = {
      trainingDate: !training_date ? 'Training Date is required' : '',
      trainingId: !training_id ? 'Training ID is required' : '',
      whitelevelId: !whitelevel_id ? 'Whitelevel ID is required' : '',
      trainingType: !training_type ? 'Training Type is required' : '',
      trainingName: training_type === '1' && !training_name ? 'Training Name is required' : '',
      rows1: rows1.length === 0 ? 'At least one Trainer is required' : '',
      rows: rows.length === 0 ? 'At least one Trainee is required' : '',
      //about_the_training: !about_the_training ? 'About the training is required' : '',
      // image: !compressedImageBase64 ? 'Image Upload is required' : '',
    }

    // Validate training name if training type is 'Others'
    if (training_type === '1') {
      if (!training_name) {
        newErrors.trainingName = 'Training Name is required'
        formValid = false
      } else if (!/^[A-Za-z\s]*$/.test(training_name)) {
        newErrors.trainingName = 'Training Name must contain only alphabets and spaces'
        formValid = false
      }
    }

    // Validate required fields
    Object.keys(newErrors).forEach((key) => {
      if (newErrors[key]) {
        formValid = false
      }
    })

    // Check for empty fields in trainers
    rows1.forEach((trainer, index) => {
      if (trainer.employee_id !== '0' && (!trainer.employee_id || !trainer.employee_name)) {
        newErrors[`trainer_${index}_name`] = 'Trainer name is required'
        formValid = false
      }
    })

    // Check for empty fields in trainees
    rows.forEach((rows, index) => {
      if (rows.employee_id_id !== '0' && (!rows.employee_id || !rows.employee_name)) {
        newErrors[`trainee_${index}_name`] = 'Trainee name is required'
        formValid = false
      }
    })

    // Check for duplicates in trainers and trainees
    if (checkForDuplicates(rows1, rows)) {
      newErrors.rows1 = 'Trainer and Trainee employee codes should not be equal'
      newErrors.rows = 'Trainer and Trainee employee codes should not be equal'
      formValid = false
    }

    // Set error messages
    setErrors(newErrors)

    // Prevent form submission if there are validation errors
    if (!formValid) {
      setIsLoading(false)
      return // Stop form submission
    }

    // Prepare form data for submission
    const formData = {
      training_id,
      training_date,
      whitelevel_id,
      training_type,
      training_image: compressedImageBase64,
      about_the_training,
      training_name: training_type === '1' ? training_name : null,
      trainers: rows1.map(({ employee_id, whitelevel_id, employee_name }) => ({
        trainer_id: employee_id,
        whitelevel_id,
        trainer_name: employee_name,
      })),
      trainees: rows.map(({ employee_id, employee_name, whitelevel_id }) => ({
        trainee_id: employee_id,
        whitelevel_id,
        trainee_name: employee_name,
      })),
    }

    console.log('Submitting the following data:')
    console.log(JSON.stringify(formData, null, 2))

    try {
      const response = await api.post('/training/start/', formData)
      console.log('Success:', response.data)
      window.alert('Safety Training Form submitted successfully!')

      // Reset form state after successful submission
      resetForm() // Reset form values using react-hook-form
      setWhitelevel_id(userInfo.whitelevel_id)
      setTraining_date(new Date().toISOString().split('T')[0])
      setTraining_id('')
      setTraining_type('4')
      setTraining_name('')
      setShowOtherTrainingField(false)
      setRows1([])
      setRows([])
      setCompressedImageBase64('')
      setAbout_the_training('')
    } catch (error) {
      if (error.response) {
        console.error(`HTTP error! Status: ${error.response.status}`)
        const errorData = JSON.stringify(error.response.data)
        console.error('Response body:', errorData)

        if (
          error.response.data?.training_id?.[0] === 'training with this training id already exists.'
        ) {
          window.alert('Training ID already exists. Please use a different ID.')
        } else {
          window.alert('Error submitting form. Please check the details and try again.')
        }
      } else if (error.isAxiosError) {
        console.error('Axios error:', error.message)
        window.alert('An error occurred with the request. Please try again.')
      } else if (error.name === 'TypeError') {
        console.error('Network error: Please check if the server is running and accessible.')
        window.alert('Network error: Please check if the server is running and accessible.')
      } else {
        console.error('Error fetching data:', error.message)
        window.alert(`Error fetching data: ${error.message}`)
      }
    } finally {
      setIsLoading(false)
    }
  }
  const handleUpdate = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    // setErrors(null);
    const formData = {
      training_id,
      training_type,
      training_name,
      whitelevel_id: whitelevel_id,
      // employees: employees,
      image: compressedImageBase64,
      about_the_training,
      training_image: compressedImageBase64,
      trainers: rows1.map(({ employee_id, whitelevel_id, employee_name }) => ({
        employee_id,
        whitelevel_id,
        trainer_name: employee_name,
      })),
      trainees: rows.map(({ employee_id, employee_name, whitelevel_id }) => ({
        employee_id,
        whitelevel_id,
        trainee_name: employee_name,
      })),
    }
    console.log(JSON.stringify(formData, null, 2))
    try {
      const response = await api.put('/training/training-details-update/', formData)
      console.log('Updated Training:', response.data)
      alert('Updated Training SucessFully:', response.data)
      resetForm()
      // Handle success for updating the accident
    } catch (err) {
      console.error('Error:', err)
      setErrors('An error occurred while updating the accident.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick2 = (index, suggestion) => {
    const updatedRows = [...rows1]

    const isDuplicate = updatedRows.some(
      (row, i) => row.employee_name === suggestion.employee_name && i !== index,
    )

    if (isDuplicate) {
      updatedRows[index].error = 'duplicate'
      updatedRows[index].employee_id_error = true
      updatedRows[index].employee_name = suggestion.employee_name
      updatedRows[index].employee_id = ''
      updatedRows[index].disableIDField = true
    } else {
      updatedRows[index].employee_name = suggestion.employee_name
      updatedRows[index].employee_id = suggestion.employee_id
      updatedRows[index].manual = false
      updatedRows[index].error = ''
      updatedRows[index].employee_id_error = false
      updatedRows[index].disableIDField = false
    }

    setShowSuggestions((prev) => ({ ...prev, [index]: false }))
    setRows1(updatedRows)
  }
  const handleBlur = (index) => {
    setTimeout(() => {
      setShowSuggestions((prev) => ({ ...prev, [index]: false }))
    }, 200)
  }

  return (
    <Container maxWidth="xl">
      <Box className="section" sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>

        <form onSubmit={handleSubmit}>
          <Card sx={{ width: '100%', padding: 3, boxShadow: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={5.5}>
                  <TextField
                    label="Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      max: new Date().toISOString().split('T')[0],
                    }}
                    value={training_date}
                    onChange={handleDateChange}
                    max={today} // Set max attribute to disable future dates
                    error={!!errors.trainingDate}
                    helperText={errors.trainingDate}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={5.5}>
                  <TextField
                    label="Reference Number"
                    fullWidth
                    value={training_id}
                    onChange={handleTrainingIdChange}
                    error={!!errors.trainingId}
                    helperText={errors.trainingId}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                 
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleChange}
                    fullWidth
                    disabled={isLoading}
                  >
                    ok
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" style={{ display: 'none' }}>
                    Whitelevel ID:
                  </Typography>
                  <FormControl fullWidth margin="normal" style={{ display: 'none' }}>
                    <TextField
                      style={{ display: 'none' }}
                      label="Whitelevel ID"
                      fullWidth
                      value={whitelevel_id}
                      onChange={handleWhiteLevelIdChange}
                      error={!!errors.whitelevelId}
                      helperText={errors.whitelevelId}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ marginBottom: 1 }} required>
                    Training Type *:
                  </Typography>
                  <RadioGroup row value={training_type} onChange={handleTrainingTypeChange}>
                    <FormControlLabel value="4" control={<Radio />} label="Tool box Training" />
                    <FormControlLabel value="3" control={<Radio />} label="Job & Safety" />
                    <FormControlLabel value="2" control={<Radio />} label="Behavioural" />
                    <FormControlLabel value="1" control={<Radio />} label="Others" />
                  </RadioGroup>
                  {showOtherTrainingField && (
                    <TextField
                      label="Name of Training"
                      fullWidth
                      value={training_name}
                      onChange={handleOtherTrainingNameChange}
                      error={!!errors.trainingName}
                      helperText={errors.trainingName}
                    />
                  )}
                  {errors.trainingType && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                      {errors.trainingType}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ marginBottom: 3 }} />
                  <Typography variant="h6">TRAINER *: (Enter 0 in case of Others)</Typography>
                  <Box sx={{ position: 'relative' }}>
                  {errors.rows1 && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                      {errors.rows1}
                    </Typography>
                  )}
                    <TableContainer
                      component={Paper}
                      sx={{ border: '1px solid lightgrey', borderRadius: '8px', boxShadow: 'none' }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Sl. No</TableCell>
                            <TableCell sx={{ pl: 12 }}>Employee ID</TableCell>
                            <TableCell sx={{ pl: 12 }}>Employee Name</TableCell>
                            <TableCell sx={{ pl: 2 }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows1.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  name="employee_id"
                                  value={row.employee_id !== 0 ? row.employee_id : ''} // Ensure 0 is treated as a valid input
                                  onChange={(event) => handleInputChange2(index, event)}
                                  fullWidth
                                  required
                                  error={!!row.error || row.employee_id_error}
                                  helperText={
                                    row.error === 'duplicate'
                                      ? 'Duplicate employee ID'
                                      : row.error === 'invalid'
                                        ? 'Employee does not exist'
                                        : row.employee_id_error
                                          ? 'Employee ID is required'
                                          : ''
                                  }
                                  disabled={row.disableIDField}
                                  onFocus={() =>
                                    setShowSuggestions((prev) => ({ ...prev, [index]: false }))
                                  }
                                />
                              </TableCell>

                              <TableCell>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  name="employee_name"
                                  value={
                                    row.employee_id === '0'
                                      ? row.name || row.employee_name
                                      : row.employee_name || ''
                                  } // Reflect manual input and submission logic
                                  onChange={(event) => handleInputChange2(index, event)} // Update employee_name manually
                                  onBlur={() => handleBlur(index)} // Optionally handle blur (validation)
                                  fullWidth
                                  required
                                  disabled={row.disableNameField} // Disable if auto-filled
                                  error={row.employee_name_error || row.invalidCharacterError} // Show error if applicable
                                  helperText={
                                    row.invalidCharacterError
                                      ? 'Invalid characters in employee name'
                                      : row.employee_name_error
                                        ? 'Employee name is required'
                                        : ''
                                  }
                                />

                                {showSuggestions[index] && suggestions[index] && (
                                  <Paper
                                    sx={{ position: 'absolute', zIndex: 1, maxWidth: '300px' }}
                                  >
                                    <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                                      {suggestions[index].map((suggestion, idx) => (
                                        <ListItem
                                          key={idx}
                                          button
                                          onClick={() => handleSuggestionClick2(index, suggestion)}
                                        >
                                          {`${suggestion.employee_name}`}
                                        </ListItem>
                                      ))}
                                    </List>
                                  </Paper>
                                )}
                              </TableCell>

                              <TableCell>
                                <IconButton color="primary" onClick={() => handleDeleteRow1(index)}>
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Fab
                      color="primary"
                      size="small"
                      onClick={handleAddRow1}
                      sx={{
                        position: 'absolute',
                        bottom: -18,
                        left: '49%',
                        transform: 'translateX(-50%)',
                        boxShadow: 'none',
                        zIndex: 1,
                      }}
                    >
                      <AddIcon />
                    </Fab>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">TRAINEE *:</Typography>
                  {/* <Training4
                    onChange={(updatedRows1) => handleInputChange('trainees', updatedRows1)}
                    error={!!errors.trainees}
                    helperText={errors.trainees}
                    initialData={trainees}
                  />

                  )} */}

                  <Box sx={{ position: 'relative', backgroundColor: '#FAF9F6' }}>
                    {errors.rows && (
                      <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                        {errors.rows}
                      </Typography>
                    )}
                    <TableContainer
                      component={Paper}
                      sx={{ border: '1px solid lightgrey', borderRadius: '8px', boxShadow: 'none' }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Sl. No</TableCell>
                            <TableCell sx={{ pl: 12 }}>Employee ID</TableCell>
                            <TableCell sx={{ pl: 12 }}>Employee Name</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  name="employee_id"
                                  value={row.employee_id}
                                  onChange={(event) => handleInputChange1(index, event)}
                                  fullWidth
                                  required
                                  error={Boolean(row.error)}
                                  helperText={
                                    row.error === 'duplicate'
                                      ? 'Duplicate employee ID'
                                      : row.error === 'invalid'
                                        ? 'Employee does not exist'
                                        : row.error === 'empty_field'
                                          ? 'Employee ID should not be empty'
                                          : ''
                                  }
                                  disabled={row.disableIDField} // Disable based on the error state
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  name="employee_name"
                                  value={row.employee_name}
                                  onChange={(event) => handleNameInputChange(index, event)}
                                  fullWidth
                                  required
                                  error={Boolean(row.error)}
                                  helperText={
                                    row.error === 'invalid_name'
                                      ? 'Invalid characters. Only letters, spaces, and dots are allowed.'
                                      : row.error === 'name_mismatch'
                                        ? 'Incorrect name for the given Employee ID'
                                        : row.error === 'duplicate_name'
                                          ? 'Duplicate employee name'
                                          : row.error === 'empty_field'
                                            ? 'Employee Name should not be empty'
                                            : ''
                                  }
                                  disabled={row.disableNameField} // Disable based on the error state
                                />

                                {index === activeRowIndex && suggestions.length > 0 && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      zIndex: 1000,
                                      width: '100%',
                                      backgroundColor: '#fff',
                                      border: '1px solid lightgrey',
                                      borderRadius: '4px',
                                      boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                                      marginTop: '4px',
                                    }}
                                  >
                                    {suggestions.map((suggestion, idx) => (
                                      <div
                                        key={suggestion.employee_id}
                                        style={{
                                          padding: '8px',
                                          backgroundColor:
                                            selectedIndex === idx ? '#f0f0f0' : '#fff',
                                          cursor: 'pointer',
                                        }}
                                        onMouseEnter={() => handleSuggestionMouseEnter(idx)}
                                        onMouseLeave={handleSuggestionMouseLeave}
                                        onClick={() => handleSuggestionClick(index, suggestion)}
                                      >
                                        {suggestion.employee_name}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => handleDeleteRow(index)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box mt={2}>
                      <Fab
                        size="small"
                        color="primary"
                        aria-label="add"
                        onClick={handleAddRow}
                        sx={{
                          position: 'absolute',
                          bottom: -18,
                          left: '49%',
                          transform: 'translateX(-50%)',
                          boxShadow: 'none',
                          zIndex: 1,
                        }}
                      >
                        <AddIcon />
                      </Fab>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth margin="normal">
                    <TextField
                      label="Description"
                      multiline
                      rows={4}
                      value={about_the_training}
                      onChange={handleTraining}
                    />
                  </FormControl>
                </Grid>
                {/* <Grid item xs={12}>
                 <Imagecompression setCompressedImageBase64={setCompressedImageBase64}/>
                </Grid> */}
                <Grid item xs={12}>
                  <Imagecompression
                    setCompressedImageBase64={setCompressedImageBase64}
                    compressedImageBase64={compressedImageBase64} // Pass the value here
                  />
                </Grid>

                <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                  <Grid item xs={12} md={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                      disabled={isLoading}
                    >
                      Submit
                    </Button>
                  </Grid>

                  {/* {accident_id && ( */}
                  <Grid item xs={12} md={6}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleUpdate}
                      fullWidth
                      disabled={isLoading}
                    >
                      Update
                    </Button>
                  </Grid>
                  {/* )} */}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </form>
      </Box>
    </Container>
  )
}

export default Safetytraining