/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  user: [],
  Loggedin: null,
  boardID: 1,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
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

    AddCard: (state, action) => {
      const { boardID, listID, cardname } = action.payload;
      const user = state.user.find((user) => user.email === state.Loggedin);
      if (user) {
        const board = user.boards.find((board) => board.id === boardID);
        if (board) {
          const list = board.lists.find((list) => list.id === listID);
          if (list) {
            const newCard = {
              id: list.cards.length + 1,
              name: cardname,
              description: "",
            };
            list.cards.push(newCard);
          }
        }
      }
    },

    UpdateCardDescription: (state, action) => {
      const { boardID, listID, cardID, description } = action.payload;
      const user = state.user.find((user) => user.email === state.Loggedin);
      if (user) {
        const board = user.boards.find((board) => board.id === boardID);
        if (board) {
          const list = board.lists.find((list) => list.id === listID);
          if (list) {
            const card = list.cards.find((card) => card.id === cardID);
            if (card) {
              card.description = description;
            }
          }
        }
      }
    },

    DeleteCard: (state, action) => {
      const { boardID, listID, cardID } = action.payload;
      const user = state.user.find((user) => user.email === state.Loggedin);
      if (user) {
        const board = user.boards.find((board) => board.id === boardID);
        if (board) {
          const list = board.lists.find((list) => list.id === listID);
          if (list) {
            list.cards = list.cards.filter((card) => card.id !== cardID);
          }
        }
      }
    },
    // Add this reducer to your userSlice reducers
    MoveCard: (state, action) => {
      const {
        boardID,
        sourceListID,
        destinationListID,
        sourceIndex,
        destinationIndex,
      } = action.payload;
    
      const user = state.user.find((user) => user.email === state.Loggedin);
      if (!user) return;
    
      const board = user.boards.find((board) => board.id === boardID);
      if (!board) return;
    
      const sourceList = board.lists.find((list) => list.id === sourceListID);
      const destinationList = board.lists.find((list) => list.id === destinationListID);
    
      if (!sourceList || !destinationList) return;
    
      // Remove card from source list
      const [removedCard] = sourceList.cards.splice(sourceIndex, 1);
    
      // Add card to destination list
      destinationList.cards.splice(destinationIndex, 0, removedCard);
    },
    

    SetBoardID: (state, action) => {
      const { id } = action.payload;
      state.boardID = id;
      console.log(state.boardID);
    },

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
  UpdateCardDescription,
  DeleteCard,
  SetBoardID,
  MoveCard,
  logout,
} = userSlice.actions;

export default userSlice.reducer;