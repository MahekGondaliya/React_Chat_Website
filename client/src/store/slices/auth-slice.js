export const createAuthslice = (set) =>(
  {
    userInfo: undefined,
    setUserInfo: (userInfo) => set({userInfo })
  }
);
