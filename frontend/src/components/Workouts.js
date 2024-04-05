import React, { useState, useEffect } from 'react';
import FitNessyApi from '../api/api'; 
import { useAuth } from '../context/AuthContext';
import {FormGroup, Label, FormText} from 'reactstrap';
import {DatePicker} from 'reactstrap-date-picker';
import { format } from 'date-fns';

function Workouts() {

  const { currentUser } = useAuth();
  // For exercises on the specific date
  const [exercises, setExercises] = useState([]);
  const [date, setDate]= useState(new Date().toISOString())
  const [fmtDate, setFmtDate]= useState(undefined);


  function handleChange(date) {
    setDate(date)
    const formattedDate = format(new Date(date), 'yyyy-MM-dd');
    setFmtDate(formattedDate);
  }

  useEffect(( )=> {
    console.log(`Unformatted date is ${date}, Formatted date is ${fmtDate}`)
  }, [fmtDate])


  useEffect(() => {
    async function fetchExercises() {
      try {
        const exercisesByDate = await FitNessyApi.getExercisesByDate(currentUser.username, fmtDate);
        setExercises(exercisesByDate);
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      }
    }
  
    fetchExercises();
  }, [fmtDate]);

  

  return (
    <>
    <FormGroup>
      <Label>Date</Label>
      <DatePicker id="datepicker" 
                  date={date} 
                  onChange={(d) => handleChange(d)} />
    </FormGroup>


  </>
  )

}


export default Workouts;
