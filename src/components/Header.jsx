/* eslint-disable no-unused-vars */
// Header.jsx - Component for main application header with board/list management

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  CreateBoard,
  CreateList,
  SetBoardID,
} from "../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Logo from "../assets/svgs/Logo.jsx";
import BoardIcon from "../assets/svgs/ BoardIcon.jsx";
import ListIcon from "../assets/svgs/ListIcon.jsx";
import { Tooltip } from "react-tooltip";

function Header() {
  // Hooks initialization
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      listname: "",
      boardname: "",
    },
  });

  // Redux state selectors
  const user = useSelector((state) => state.user.user);
  const loggedinUser = useSelector((state) => state.user.Loggedin);
  const loggedinuserData = user.find((user) => user.email === loggedinUser);
  const userboards = loggedinuserData?.boards;
  const boardID = useSelector((state) => state.user.boardID);

  // Local state management
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  // Event Handlers
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const onSubmitBoard = (data) => {
    dispatch(CreateBoard({ boardName: data.boardname }));
    setIsCreatingBoard(false);
    reset({ boardname: "" });
  };

  const onSubmitList = (ListData) => {
    setIsCreatingList(false);
    dispatch(CreateList({ boardID: boardID, listname: ListData.listname }));
    reset({ listname: "" });
  };

  const handleBoardSelect = (e) => {
    const selectedId = parseInt(e.target.value);
    dispatch(SetBoardID({ id: selectedId }));
  };

  return (
    <div className="main-header-container w-[100vw] h-[5vw] flex justify-between items-center border-[#1F2937] border-b-2 p-5">
      {/* Logo Section */}
      <div className="logo w-[20vw] flex justify-center items-center">
        <Logo />
      </div>

      {/* Operations Section */}
      <div className="operations-wrapper w-[60vw] flex items-center justify-evenly relative">
        {/* Board Creation */}
        <div
          className="board-section cursor-pointer"
          onClick={() => setIsCreatingBoard(true)}
          data-tooltip-id="board-tooltip"
          data-tooltip-content="Create New Board"
        >
          <BoardIcon />
          <Tooltip className="z-10" id="board-tooltip" />
        </div>

        {/* Board Creation Form */}
        {isCreatingBoard && (
          <div className="form-wrapper absolute top-[5vw] left-[3vw] bg-white border-black border-[1px] z-10 p-5 rounded-lg">
            <form
              className="flex flex-col gap-2"
              onSubmit={handleSubmit(onSubmitBoard)}
            >
              <input
                autoFocus
                className="p-2 border-2 rounded-lg"
                {...register("boardname", {
                  required: "Board name is required",
                  minLength: {
                    value: 1,
                    message: "Board name must not be empty",
                  },
                  maxLength: {
                    value: 32,
                    message: "You can add up to 32 characters",
                  },
                  validate: (value) =>
                    value.trim().length > 0 ||
                    "Board name cannot be just whitespace",
                })}
                placeholder="Enter board name"
              />
              <p className="text-sm sm:text-[1vw] text-red-500">
                {errors.boardname?.message}
              </p>
              <button
                className="bg-blue-500 text-white px-5 py-2 rounded-xl"
                type="submit"
              >
                Create Board
              </button>
            </form>
          </div>
        )}

        {/* Board Selection Dropdown */}
        <div className="all-boards-wrapper flex justify-center items-center">
          <select
            className="text-[1.3vw] max-md:text-[2vw] max-sm:text-[2.5vw] cursor-pointer"
            onChange={handleBoardSelect}
            value={selectedBoardId || ""}
          >
            <option value="">Select a Board</option>
            {userboards &&
              userboards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.name}
                </option>
              ))}
          </select>
        </div>

        {/* List Creation */}
        <div
          className="list-wrapper relative cursor-pointer"
          onClick={() => setIsCreatingList(!isCreatingList)}
          data-tooltip-id="list-tooltip"
          data-tooltip-content="Create New List"
        >
          <ListIcon />
          <Tooltip className="z-10" id="list-tooltip" />
        </div>

        {/* List Creation Form */}
        {isCreatingList && (
          <div
            className="list-input-wrapper absolute top-[5vw] right-[0vw] bg-white border-black border-[1px] z-10 p-10 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              className="flex flex-col gap-2"
              onSubmit={handleSubmit(onSubmitList)}
            >
              <input
                autoFocus
                className="p-2 border-2 rounded-lg"
                {...register("listname", {
                  required: "List name is required",
                  minLength: {
                    value: 1,
                    message: "List name must not be empty",
                  },
                  maxLength: {
                    value: 18,
                    message: "You can add up to 18 characters",
                  },
                  validate: (value) =>
                    value.trim().length > 0 ||
                    "List name cannot be just whitespace",
                })}
                placeholder="Enter list name"
              />
              <p className="text-sm sm:text-[1vw] text-red-500">
                {errors.listname?.message}
              </p>
              <button
                className="bg-blue-500 text-white px-5 py-2 rounded-xl"
                type="submit"
              >
                Add List
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Logout Section */}
      <div className="logout-btn-wrapper w-[20vw] flex justify-center items-center">
        <button
          onClick={handleLogout}
          className="border-white border-2 px-5 py-2.5 font-medium bg-blue-50 hover:text-red-600 text-red-500 rounded-lg text-[1vw] max-sm:text-[2vw]"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Header;
