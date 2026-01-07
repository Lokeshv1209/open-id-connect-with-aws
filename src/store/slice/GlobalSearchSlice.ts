import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface GlobalSearchState {
  NavBarSearch: string;
}

const initialState: GlobalSearchState = {
  NavBarSearch: "",
};

const GlobalSearchSlice = createSlice({
  name: "globalSearch",
  initialState,
  reducers: {
    changeNavSearch: (state, action: PayloadAction<string>) => {
      state.NavBarSearch = action.payload;
    },
    clearGlobalSearch: (state) => {
      state.NavBarSearch = initialState.NavBarSearch;
    },
  },
});

export const { changeNavSearch, clearGlobalSearch } = GlobalSearchSlice.actions;
export default GlobalSearchSlice.reducer;
