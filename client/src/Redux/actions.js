export const loggedIn = () => ({
  type: "LOGIN",
});
  
export const loggedOut = () => ({
  type: "LOGOUT",
});
  
export const addUser = (user) => ({
  type: "ADD_USER",
  user
});

export const removeUser = () => ({
  type: "REMOVE_USER",
});
  
export const getSongs = () => ({
  type: "GET_SONGS",
});

export const getNowPlaying = () => ({
  type: "GET_NOW_PLAYING",
});