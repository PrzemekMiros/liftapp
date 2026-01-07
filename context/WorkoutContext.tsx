import React, { createContext, useState, useContext } from 'react';

type WorkoutSet = {
  reps: string;
  weight: string;
};

type WorkoutExercise = {
  name: string;
  sets: WorkoutSet[];
};

type WorkoutEntry = {
  id: string;
  date: string;
  exercises: WorkoutExercise[];
};

type Exercise = {
  id: string;
  name: string;
  bodyPart: string;
};

type WorkoutContextValue = {
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
  history: WorkoutEntry[];
  setHistory: React.Dispatch<React.SetStateAction<WorkoutEntry[]>>;
  recordWorkout: (entry: Omit<WorkoutEntry, 'id'>) => void;
  addExercise: (exercise: Omit<Exercise, 'id'>) => void;
};

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

const initialExercises: Exercise[] = [
  { id: '1', name: 'Wyciskanie sztangi', bodyPart: 'Klatka' },
  { id: '2', name: 'Wyciskanie hantli', bodyPart: 'Klatka' },
  { id: '3', name: 'Przysiady', bodyPart: 'Nogi' },
  { id: '4', name: 'Martwy ciag', bodyPart: 'Plecy' },
  { id: '5', name: 'Podciaganie', bodyPart: 'Plecy' },
  { id: '6', name: 'Wyciskanie zolnierskie', bodyPart: 'Barki' },
  { id: '7', name: 'Uginanie ramion', bodyPart: 'Biceps' },
  { id: '8', name: 'Prostowanie ramion', bodyPart: 'Triceps' },
];

export const WorkoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [history, setHistory] = useState<WorkoutEntry[]>([]);

  const recordWorkout = (entry: Omit<WorkoutEntry, 'id'>) => {
    setHistory((prev) => [
      ...prev,
      { ...entry, id: `${Date.now()}-${Math.random().toString(16).slice(2)}` },
    ]);
  };

  const addExercise = (exercise: Omit<Exercise, 'id'>) => {
    setExercises((prev) => [
      ...prev,
      { ...exercise, id: `${Date.now()}-${Math.random().toString(16).slice(2)}` },
    ]);
  };

  return (
    <WorkoutContext.Provider
      value={{ exercises, setExercises, history, setHistory, recordWorkout, addExercise }}
    >
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
