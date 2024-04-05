import React, { useState, useEffect } from 'react';
import FitNessyApi from '../api/api'; 
import { useAuth } from '../context/AuthContext';
import {FormGroup, Label, FormText} from 'reactstrap';
import {DatePicker} from 'reactstrap-date-picker';

function Workouts() {

  const { currentUser } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [value, setValue]= useState(new Date().toISOString())
  const [fmtValue, setFmtValue]= useState(undefined);

  function handleChange(value, formattedValue) {
    setValue(value)
    setFmtValue(formattedValue)
  }

  useEffect(( )=> {
    console.log(`Formatted value is ${fmtValue}`)
  }, [fmtValue])

  useEffect(() => {
    async function fetchExercises() {
      try {
        const exercisesByDate = await FitNessyApi.getExercisesByDate(currentUser.username, value);
        setExercises(exercisesByDate);
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
        // Optionally set an error state and display an error message to the user
      }
    }
  
    if (value) {
      fetchExercises();
    }
  }, [value]);

  return (
    <FormGroup>
      <Label>Date</Label>
      <DatePicker id      = "datepicker" 
                  value   = {value} 
                  onChange= {(v,f) => handleChange(v, f)} />
    </FormGroup>
  )

}


export default Workouts;
