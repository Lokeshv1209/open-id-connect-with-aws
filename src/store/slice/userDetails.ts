import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface UserInfo {
  email: string;
  name: string;
  role: string;
}

interface OrgInfo {
  organizationId: string;
  name: string;
  domain: string;
  logoUrl: string;
  description: string;
}

interface TokenInfo {
  accessToken: string;
  refreshToken: string;
}

interface UserDetailsState {
  userInfo: UserInfo;
  orgInfo: OrgInfo;
  token: TokenInfo;
}

const initialState: UserDetailsState = {
  userInfo: {
    email: "",
    name: "",
    role: "",
  },
  orgInfo: {
    organizationId: "",
    name: "",
    domain: "",
    logoUrl: "",
    description: "",
  },
  token: {
    accessToken: "",
    refreshToken: "",
  },
};

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    setOrgInfo: (state, action: PayloadAction<OrgInfo>) => {
      state.orgInfo = action.payload;
    },
    setToken: (state, action: PayloadAction<TokenInfo>) => {
      state.token = action.payload;
    },
    clearInfo: (state) => {
      state.userInfo = initialState.userInfo;
      state.orgInfo = initialState.orgInfo;
      state.token = initialState.token;
    },
  },
});

export const { setUserInfo, clearInfo, setOrgInfo, setToken } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
