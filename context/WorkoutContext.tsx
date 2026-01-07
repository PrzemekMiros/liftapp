import React, { createContext, useEffect, useMemo, useRef, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type WorkoutSet = {
  id: string;
  reps: string;
  weight: string;
};

type WorkoutExercise = {
  id: string;
  name: string;
  sets: WorkoutSet[];
};

type WorkoutEntry = {
  id: string;
  date: string;
  exercises: WorkoutExercise[];
};

type WorkoutContextValue = {
  workouts: WorkoutEntry[];
  exerciseDb: string[];
  addWorkout: () => WorkoutEntry;
  removeWorkout: (workoutId: string) => void;
  addExerciseToWorkout: (workoutId: string, exerciseName: string) => void;
  removeExerciseFromWorkout: (workoutId: string, exerciseId: string) => void;
  addSetToExercise: (workoutId: string, exerciseId: string, reps: string, weight: string) => void;
  removeSetFromExercise: (workoutId: string, exerciseId: string, setId: string) => void;
  addExerciseToDb: (exerciseName: string) => void;
  removeExerciseFromDb: (exerciseName: string) => void;
};

const DEFAULT_EXERCISES = [
  'Wyciskanie sztangi na plaskiej',
  'Przysiad ze sztanga',
  'Martwy ciag',
  'Podciaganie na drazku (szeroko)',
  'Wioslowanie sztanga w opadzie',
];

const WORKOUTS_KEY = 'workouts_v3';
const EX_DB_KEY = 'ex_db_v3';

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const WorkoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [exerciseDb, setExerciseDb] = useState<string[]>(DEFAULT_EXERCISES);
  const hasLoaded = useRef(false);

  useEffect(() => {
    const load = async () => {
      try {
        const savedWorkouts = await AsyncStorage.getItem(WORKOUTS_KEY);
        const savedDb = await AsyncStorage.getItem(EX_DB_KEY);
        if (savedWorkouts) {
          setWorkouts(JSON.parse(savedWorkouts));
        }
        if (savedDb) {
          setExerciseDb(JSON.parse(savedDb));
        }
      } catch (error) {
        console.error('Load error', error);
      } finally {
        hasLoaded.current = true;
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) {
      return;
    }
    AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
    AsyncStorage.setItem(EX_DB_KEY, JSON.stringify(exerciseDb));
  }, [workouts, exerciseDb]);

  const addWorkout = () => {
    const newWorkout: WorkoutEntry = {
      id: makeId(),
      date: new Date().toLocaleDateString('pl-PL'),
      exercises: [],
    };
    setWorkouts((prev) => [newWorkout, ...prev]);
    return newWorkout;
  };

  const removeWorkout = (workoutId: string) => {
    setWorkouts((prev) => prev.filter((item) => item.id !== workoutId));
  };

  const addExerciseToWorkout = (workoutId: string, exerciseName: string) => {
    setWorkouts((prev) =>
      prev.map((workout) =>
        workout.id === workoutId
          ? {
              ...workout,
              exercises: [
                ...workout.exercises,
                { id: makeId(), name: exerciseName, sets: [] },
              ],
            }
          : workout
      )
    );
  };

  const removeExerciseFromWorkout = (workoutId: string, exerciseId: string) => {
    setWorkouts((prev) =>
      prev.map((workout) =>
        workout.id === workoutId
          ? {
              ...workout,
              exercises: workout.exercises.filter((ex) => ex.id !== exerciseId),
            }
          : workout
      )
    );
  };

  const addSetToExercise = (workoutId: string, exerciseId: string, reps: string, weight: string) => {
    setWorkouts((prev) =>
      prev.map((workout) =>
        workout.id === workoutId
          ? {
              ...workout,
              exercises: workout.exercises.map((ex) =>
                ex.id === exerciseId
                  ? {
                      ...ex,
                      sets: [...ex.sets, { id: makeId(), reps, weight }],
                    }
                  : ex
              ),
            }
          : workout
      )
    );
  };

  const removeSetFromExercise = (workoutId: string, exerciseId: string, setId: string) => {
    setWorkouts((prev) =>
      prev.map((workout) =>
        workout.id === workoutId
          ? {
              ...workout,
              exercises: workout.exercises.map((ex) =>
                ex.id === exerciseId
                  ? {
                      ...ex,
                      sets: ex.sets.filter((set) => set.id !== setId),
                    }
                  : ex
              ),
            }
          : workout
      )
    );
  };

  const addExerciseToDb = (exerciseName: string) => {
    const trimmed = exerciseName.trim();
    if (!trimmed) {
      return;
    }
    setExerciseDb((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
  };

  const removeExerciseFromDb = (exerciseName: string) => {
    if (DEFAULT_EXERCISES.includes(exerciseName)) {
      return;
    }
    setExerciseDb((prev) => prev.filter((item) => item !== exerciseName));
  };

  const value = useMemo(
    () => ({
      workouts,
      exerciseDb,
      addWorkout,
      removeWorkout,
      addExerciseToWorkout,
      removeExerciseFromWorkout,
      addSetToExercise,
      removeSetFromExercise,
      addExerciseToDb,
      removeExerciseFromDb,
    }),
    [workouts, exerciseDb]
  );

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
};

export const useWorkout = () => {
  const ctx = useContext(WorkoutContext);
  if (!ctx) {
    throw new Error('useWorkout must be used within WorkoutProvider');
  }
  return ctx;
};
