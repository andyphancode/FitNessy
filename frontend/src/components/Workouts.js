import React, { useState, useEffect } from 'react';
import FitNessyApi from '../api/api'; 
import { useAuth } from '../context/AuthContext';
import {FormGroup, Label, Table, Button} from 'reactstrap';
import {DatePicker} from 'reactstrap-date-picker';
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import './Workouts.css';


function Workouts() {


  const { currentUser } = useAuth();
  // For exercises on the specific date
  const [exercises, setExercises] = useState([]);
  const [date, setDate]= useState(new Date().toISOString())
  const [fmtDate, setFmtDate]= useState(undefined);
  const [editingExerciseId, setEditingExerciseId] = useState(null);



  function handleChange(date) {
    setDate(date)
    const formattedDate = format(new Date(date), 'yyyy-MM-dd');
    setFmtDate(formattedDate);
  }

  useEffect(( )=> {
    console.log(`Unformatted date is ${date}, Formatted date is ${fmtDate}`)
  }, [date, fmtDate])


  useEffect(() => {
    async function fetchExercises() {
      try {
        const exercisesByDate = await FitNessyApi.getExercisesByDate(currentUser.username, fmtDate);
        setExercises(exercisesByDate);
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      }
    }
  
    if (fmtDate && currentUser.username) {
      fetchExercises();
    }
  }, [fmtDate, currentUser.username]);

  // exerciseData must include { exercise_id, exercise_date, [...reps], [...rir] }
  const handleAddExercise = async (exerciseData) => {
    try {
      const newExercise = await FitNessyApi.addExercise(currentUser.username, exerciseData);
      setExercises([...exercises, newExercise]); }
    catch (error) {
        console.error("Failed to add exercise:", error);
    }
      
    }

    // updatedData must include { exerciseId, [...reps], [...rir] }
    const handleUpdateExercise = async (exerciseId, updatedData) => {
      try {
        // need to check what kind of data this API call responds with, then change updatedExercise in setExercises
        const updatedExercise = await FitNessyApi.updateExercise(currentUser.username, exerciseId, updatedData);
        setExercises(exercises.map(ex => ex.exercise_id === exerciseId ? updatedExercise.updated : ex)); // Update the exercise in the local state
        console.log(exercises);
      } catch (error) {
        console.error("Failed to update exercise:", error);
      }
    };
    
    // 
    const handleDeleteExercise = async (user_excercise_id) => {
      try {
        await FitNessyApi.deleteExercise(currentUser.username, user_excercise_id);
        setExercises(exercises.filter(ex => ex.user_exercise_id !== user_excercise_id)); // Remove the exercise from the local state
      } catch (error) {
        console.error("Failed to delete exercise:", error);
      }
    };

    const handleRepChange = (e, id, index) => {
      const newExercises = exercises.map(ex => {
        if (ex.user_exercise_id === id) {
          return { ...ex, [`rep${index}`]: +e.target.value };
        }
        return ex;
      });
      setExercises(newExercises);
    };
    
    const handleRirChange = (e, id, index) => {
      const newExercises = exercises.map(ex => {
        if (ex.user_exercise_id === id) {
          return { ...ex, [`rir${index}`]: +e.target.value };
        }
        return ex;
      });
      setExercises(newExercises);
    };
    

    const saveChanges = async (exercise) => {
      try {
        // Assuming `handleUpdateExercise` is already implemented to update the exercise
        console.log(exercise);
        await handleUpdateExercise(exercise.user_exercise_id, {
          // Construct updated data object here
          exerciseId: exercise.exercise_id,
          reps: [exercise.rep1, exercise.rep2, exercise.rep3, exercise.rep4, exercise.rep5 ],
          rir: [exercise.rir1, exercise.rir2, exercise.rir3, exercise.rir4, exercise.rir5 ],
          // e.g., { reps: [exercise.rep1, exercise.rep2, ...], rir: [exercise.rir1, exercise.rir2, ...] }
        });
        // Exit edit mode
        setEditingExerciseId(null);
      } catch (error) {
        console.error("Failed to save changes:", error);
        // Handle error (e.g., show error message)
      }
    };
    
  

  return (
    <>
      <FormGroup>
        <Label>Date</Label>
        <DatePicker id="datepicker" 
                    date={date} 
                    onChange={(d) => handleChange(d)} />
      </FormGroup>
      <Table className="text-center" hover bordered >
        <thead>
          <tr>
            <th>Exercise Name</th>
            <th>Rep</th>
            <th>Rep</th>
            <th>Rep</th>
            <th>Rep</th>
            <th>Rep</th>
            <th>RIR</th>
            <th>RIR</th>
            <th>RIR</th>
            <th>RIR</th>
            <th>RIR</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
        {exercises.map(exercise =>
          <tr key={exercise.user_exercise_id}>
            <th scope="row">
              {exercise.exercise_name}
            </th>
            {[1, 2, 3, 4, 5].map((index) => (
              <td key={`rep${index}`}>
                {editingExerciseId === exercise.user_exercise_id ? 
                  <input type="number" defaultValue={exercise[`rep${index}`]} onChange={(e) => handleRepChange(e, exercise.user_exercise_id, index)} className="table-input" /> :
                  exercise[`rep${index}`]
                }
              </td>
            ))}
            {[1, 2, 3, 4, 5].map((index) => (
              <td key={`rir${index}`}>
                {editingExerciseId === exercise.user_exercise_id ? 
                  <input type="number" defaultValue={exercise[`rir${index}`]} onChange={(e) => handleRirChange(e, exercise.user_exercise_id, index)} className="table-input" /> :
                  exercise[`rir${index}`]
                }
              </td>
            ))}
            <td>
              {editingExerciseId === exercise.user_exercise_id ? (
                <>
                  <Button color="success" onClick={() => saveChanges(exercise)}>Save Changes</Button>
                  {" "}
                  <Button color="danger" onClick={() => setEditingExerciseId(null)}>Cancel</Button>
                </>
              ) : (
                <EditIcon onClick={() => setEditingExerciseId(exercise.user_exercise_id)}/>
              )}
            </td>

            <td><DeleteIcon onClick={() => handleDeleteExercise(exercise.user_exercise_id)}/></td>
          </tr>

        )}
        </tbody>

      </Table>
    </>
  )

}


export default Workouts;
