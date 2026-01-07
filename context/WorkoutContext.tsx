import React, { createContext, useState, useContext } from 'react';

const WorkoutContext = createContext<any>(null);

export const WorkoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [exercises, setExercises] = useState([
    { id: '1', name: 'Wyciskanie sztangi', bodyPart: 'Klatka piersiowa' },
    { id: '2', name: 'Przysiady', bodyPart: 'Nogi' },
  ]);

  const [history, setHistory] = useState([]);

  return (
    <WorkoutContext.Provider value={{ exercises, setExercises, history, setHistory }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => useContext(WorkoutContext);