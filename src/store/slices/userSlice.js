import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Initial state of the user slice
const initialState = {
  user: [],
  Loggedin: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Register a new user
    RegisterUser: (state, action) => {
      const { username, email, password } = action.payload;
      const newUser = {
        id: state.user.length + 1,
        username,
        email,
        password,
        boards: [],
      };
      state.user.push(newUser);
      state.Loggedin = email;
    },

    // Log in an existing user
    LoginUser: (state, action) => {
      const { email, password } = action.payload;
      const userForLogin = state.user.find(
        (user) => user.email === email && user.password === password
      );

      if (userForLogin) {
        state.Loggedin = email;
      } else {
        toast.error("User not Found, Register First!");
      }
    },

    // Create a new board
    CreateBoard: (state, action) => {
      const { boardName } = action.payload;
      const user = state.user.find((user) => user.email === state.Loggedin);
      if (user) {
        const newBoard = {
          id: user.boards.length + 1,
          name: boardName,
          lists: [],
        };
        user.boards.push(newBoard);
      }
    },

    // Create a new list in a particular board
    CreateList: (state, action) => {
      const { boardID, listname } = action.payload;
      const user = state.user.find((user) => user.email === state.Loggedin);
      if (user) {
        const board = user.boards.find((board) => board.id === boardID);
        if (board) {
          const newList = {
            id: board.lists.length + 1,
            name: listname,
            cards: [],
          };
          board.lists.push(newList);
        }
      }
    },

    // Add a new card to a list in a particular board
    AddCard: (state, action) => {
      const { boardID, listID, cardname } = action.payload;
      const user = state.user.find((user) => user.email === state.Loggedin);
      if (user) {
        const board = user.boards.find((board) => board.id === boardID);
        if (board) {
          const list = board.lists.find((list) => list.id === listID);
          if (list) {
            list.cards.push(cardname);
          }
        }
      }
    },

    // Log out the current user
    logout: (state) => {
      state.Loggedin = null;
    },
  },
});

export const {
  RegisterUser,
  LoginUser,
  CreateBoard,
  CreateList,
  AddCard,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
