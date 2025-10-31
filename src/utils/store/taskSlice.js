import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createTask, updateTask, deleteTask, listenToTasks } from '@/api/tasksApi';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

export const addTask = createAsyncThunk('tasks/addTask', async (task) => {
  return await createTask(task);
});

export const editTask = createAsyncThunk('tasks/editTask', async ({ id, updates }) => {
  await updateTask(id, updates);
  return { id, updates };
});

export const removeTask = createAsyncThunk('tasks/removeTask', async (id) => {
  await deleteTask(id);
  return id;
});

export const subscribeToTasks = (userId) => (dispatch) => {
  dispatch(tasksSlice.actions.setLoading(true));
  return listenToTasks(userId, (tasks) => {
    dispatch(tasksSlice.actions.setTasks(tasks));
  });
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(state, action) {
      state.tasks = action.payload;
      state.loading = false;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(editTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = { ...state.tasks[index], ...action.payload.updates };
        }
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      });
  },
});

export const { setTasks, setLoading } = tasksSlice.actions;
export default tasksSlice.reducer;
