import React, { createContext, useState, useContext } from 'react';

type WorkoutSet = {
  reps: string;
  weight: string;
};

type WorkoutEntry = {
  id: string;
  date: string;
  exercise: string;
  sets: WorkoutSet[];
};

type WorkoutContextValue = {
  exercises: { id: string; name: string; bodyPart: string }[];
  setExercises: React.Dispatch<React.SetStateAction<{ id: string; name: string; bodyPart: string }[]>>;
  history: WorkoutEntry[];
  setHistory: React.Dispatch<React.SetStateAction<WorkoutEntry[]>>;
  recordWorkout: (entry: Omit<WorkoutEntry, 'id'>) => void;
};

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

export const WorkoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [exercises, setExercises] = useState([
    { id: '1', name: 'Wyciskanie sztangi', bodyPart: 'Klatka piersiowa' },
    { id: '2', name: 'Przysiady', bodyPart: 'Nogi' },
  ]);

  const [history, setHistory] = useState<WorkoutEntry[]>([]);

  const recordWorkout = (entry: Omit<WorkoutEntry, 'id'>) => {
    setHistory((prev) => [
      ...prev,
      { ...entry, id: `${Date.now()}-${Math.random().toString(16).slice(2)}` },
    ]);
  };

  return (
    <WorkoutContext.Provider value={{ exercises, setExercises, history, setHistory, recordWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const ctx = useContext(WorkoutContext);
  if (!ctx) {
    throw new Error('useWorkout must be used within WorkoutProvider');
  }
  return ctx;
};
