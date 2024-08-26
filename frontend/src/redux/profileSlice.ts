import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { ProfileDAO } from '../types';

type Status = 'idle' | 'pending' | 'succeeded' | 'rejected';

interface ProfileSlice extends ProfileDAO {
  status: Status;
  isAuthenticated: boolean;
}

const initialState: ProfileSlice = {
  email: "",
  firstName: "",
  lastName: "",
  imagePath: "/profile-images/no-profile-image.png",
  receiveUpdates: false,
  phoneNumber: "",
  status: "idle",
  isAuthenticated: false
};

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async () => {
    const response = await axios.get(import.meta.env.VITE_BASE_URL + '/profile', { withCredentials: true });
    const data = response.data as ProfileDAO;
    return data;
  }
);

export const logOut = createAsyncThunk(
    'profile/logOut',
    async () => {
        await axios.post(import.meta.env.VITE_BASE_URL + '/logout', null, { withCredentials: true });
        return null;
    }
)

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<ProfileDAO>) {
        state.status = 'idle';
        state.email = action.payload.email;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.phoneNumber = action.payload.phoneNumber;
        state.imagePath = action.payload.imagePath;
        state.receiveUpdates = action.payload.receiveUpdates;  
        state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<ProfileDAO>) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.email = action.payload.email;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.phoneNumber = action.payload.phoneNumber;
        state.imagePath = action.payload.imagePath;
        state.receiveUpdates = action.payload.receiveUpdates;  
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.status = 'rejected';
        state.isAuthenticated = false;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.email = "";
        state.firstName = "";
        state.lastName = "";
        state.imagePath = "/profile-images/no-profile-image.png";
        state.receiveUpdates = false;
        state.phoneNumber = "";
        state.status = "idle";
      })
  }
});

export const { setProfile } = profileSlice.actions;

export default profileSlice.reducer;