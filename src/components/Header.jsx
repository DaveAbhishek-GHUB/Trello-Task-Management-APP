/* eslint-disable no-unused-vars */
// Header.jsx
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

function Header() {
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
      boardname: ""
    },
  });
  const user = useSelector((state) => state.user.user);
  const loggedinUser = useSelector((state) => state.user.Loggedin);
  const loggedinuserData = user.find((user) => user.email === loggedinUser);
  const userboards = loggedinuserData?.boards;
  const boardID = useSelector((state) => state.user.boardID);

  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const onSubmitBoard = (data) => {
    dispatch(CreateBoard({ boardName: data.boardname }));
    setIsCreatingBoard(false);
    reset();
  };

  const onSubmitList = (ListData) => {
    setIsCreatingList(false);
    dispatch(CreateList({ boardID: boardID, listname: ListData.listname }));
  };

  const handleBoardSelect = (e) => {
    const selectedId = parseInt(e.target.value);
    dispatch(SetBoardID({ id: selectedId }));
    dispatch()
  };

  return (
    <>
      <div className="main-header-container w-[100vw] h-[5vw] flex justify-between items-center border-[#1F2937] border-b-2 p-5">
        <div className="logo w-[20vw] flex justify-center items-center">
          <Logo/>
        </div>
        <div className="operations-wrapper w-[60vw] flex items-center justify-evenly relative">
          <div
            className="board-section"
            onClick={() => setIsCreatingBoard(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={24}
              height={24}
              color={"#000000"}
              fill={"none"}
            >
              <path
                d="M7.99805 16H11.998M7.99805 11H15.998"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M7.5 3.5C5.9442 3.54667 5.01661 3.71984 4.37477 4.36227C3.49609 5.24177 3.49609 6.6573 3.49609 9.48836L3.49609 15.9944C3.49609 18.8255 3.49609 20.241 4.37477 21.1205C5.25345 22 6.66767 22 9.49609 22L14.4961 22C17.3245 22 18.7387 22 19.6174 21.1205C20.4961 20.241 20.4961 18.8255 20.4961 15.9944V9.48836C20.4961 6.6573 20.4961 5.24177 19.6174 4.36228C18.9756 3.71984 18.048 3.54667 16.4922 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M7.49609 3.75C7.49609 2.7835 8.2796 2 9.24609 2H14.7461C15.7126 2 16.4961 2.7835 16.4961 3.75C16.4961 4.7165 15.7126 5.5 14.7461 5.5H9.24609C8.2796 5.5 7.49609 4.7165 7.49609 3.75Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            {isCreatingBoard === true && (
              <div className="form-wrapper absolute top-[5vw] left-[7vw] bg-white border-black border-[1px] z-10 p-5 rounded-lg">
                <form
                  className="flex flex-col gap-2"
                  onSubmit={handleSubmit(onSubmitBoard)}
                >
                  <input
                    className="p-2 border-2 rounded-lg"
                    {...register("boardname", {
                      required: "boardname is required",
                      minLength: {
                        value: 1,
                        message: "boardname must not be empty",
                      },
                      maxLength: {
                        value: 32,
                        message: "You can add upto 32 words"
                      },
                      validate: (value) =>
                        value.trim().length > 0 ||
                        "boardname cannot be just whitespace",
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
          </div>

          <div className="all-boards-wrapper">
            <select onChange={handleBoardSelect} value={selectedBoardId || ""}>
              <option value="">Select a Board</option>
              {userboards &&
                userboards.map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.name}
                  </option>
                ))}
            </select>
          </div>

          <div
            className="list-wrapper relative"
            onClick={() => setIsCreatingList(!isCreatingList)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={24}
              height={24}
              color={"#000000"}
              fill={"none"}
            >
              <path
                d="M4 5L14 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 12L20 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 19L20 19"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {isCreatingList && (
              <div
                className="list-input-wrapper absolute top-[15vw] right-[5vw] bg-white border-black border-[1px] z-10 p-10 rounded-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <form
                  className="flex flex-col gap-2"
                  onSubmit={handleSubmit(onSubmitList)}
                >
                  <input
                    className="p-2 border-2 rounded-lg"
                    {...register("listname", {
                      required: "listname is required",
                      minLength: {
                        value: 1,
                        message: "listname must not be empty",
                      },
                      maxLength: {
                        value: 18,
                        message: "You can add upto 18 words",
                      },
                      validate: (value) =>
                        value.trim().length > 0 ||
                        "listname cannot be just whitespace",
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
        </div>
        <div className="logout-btn-wrapper w-[20vw] flex justify-center items-center">
          <button
            onClick={handleLogout}
            className="border-white border-2 px-5 py-2.5 font-medium bg-blue-50 hover:text-red-600 text-red-500 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Header;
