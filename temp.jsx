/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CreateBoard, CreateList } from "../store/slices/userSlice";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedinUser = useSelector((state) => state.user.Loggedin);
  const [isAddList, setIsAddList] = useState(false);
  const [isAdBoard, setIsAdBoard] = useState(false);
  const [boardId, setBoardId] = useState(null);
  const user = useSelector((state) => state.user.user);
  const loggedinuserData = user.find((user) => user.email === loggedinUser);

  const userboards = loggedinuserData?.boards;

  const updateBoard = userboards?.find((board) => board.id === boardId);

  const lists = updateBoard?.lists;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      boardname: "",
      listname: "",
    },
  });

  useEffect(() => {
    if (!loggedinUser) {
      navigate("/register");
    }
  }, [loggedinUser, navigate]);

  const onSubmit = (ListData) => {
    setIsAddList(false);
    dispatch(CreateList({ boardID: boardId, listname: ListData.listname }));
  };

  const handleBoard = (BoardData) => {
    setIsAdBoard(false);
    dispatch(CreateBoard({ boardName: BoardData.boardname }));
  };

  return (
    <>
      <Header />
      <div className="main-homepage-wrapper w-full min-h-screen flex bg-gray-100">
        <div className="sidebar-wrapper bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg">
          <div className="sidebar w-[18vw] h-full text-white border-r border-gray-700">
            <div className="user-profile-wrapper w-full flex flex-col px-4 py-5 border-b border-gray-700">
              <span className="text-lg font-semibold">John Doe</span>
              <span className="text-sm text-gray-400">johnbhai@gmail.com</span>
            </div>
            <div className="create-board-secton-wrapper mt-1">
              <div className="heading-wrapper w-full flex justify-between px-4 py-2 border-b border-gray-700 flex-col item">
                <div className="w-full flex justify-between items-center">
                  <span className="text-base font-medium">
                    Create New Board
                  </span>
                  <button onClick={() => setIsAdBoard(true)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width={24}
                      height={24}
                      color={"#ffffff"}
                      fill={"none"}
                      className="hover:bg-gray-700 rounded-full p-1"
                    >
                      <path
                        d="M12 4V20"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 12H20"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                {isAdBoard && (
                  <div className="form-wrapper">
                    <form
                      className="w-full flex flex-row-reverse justify-center gap-2"
                      onSubmit={handleSubmit(handleBoard)}
                    >
                      <div className="Forlistname m-auto w-full">
                        <input
                          className="text-[1vw] text-black border-[#8590A1] rounded-md border-[1px] w-full p-1"
                          placeholder="Enter New boardname"
                          type="text"
                          {...register("boardname", {
                            required: "Enter a boardname",
                          })}
                        />
                        <p className="text-sm sm:text-[1vw] text-red-500">
                          {errors.boardname?.message}
                        </p>
                      </div>
                      <button
                        type="submit"
                        className="text-[1vw] bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Create
                      </button>
                    </form>
                  </div>
                )}
              </div>
              <div className="boards-name-wrapper px-4 py-3 text-base font-semibold">
                <span>Your Boards</span>
              </div>
              {userboards &&
                userboards.map((board) => (
                  <div
                    onClick={() => setBoardId(board.id)}
                    key={board.id}
                    className="board w-full text-sm pl-8 p-3 hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <span>{board.name}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="tasks-management w-[80vw] bg-white shadow-md">
          <div className="task-heading-wrapper w-full p-4 flex justify-between items-center border-b border-gray-200">
            <span className="text-2xl font-bold text-gray-800">
              {updateBoard?.name || "BoardName"}
            </span>
            <div className="options-wrapper flex gap-3">
              <button className="text-sm bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors">
                Filter
              </button>
              <div className="profile-btn">
                <button className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width={24}
                    height={24}
                    color={"#ffffff"}
                    fill={"none"}
                  >
                    <path
                      d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="add-list-button-wrapper p-4 border-b border-gray-200 flex items-center">
            {!isAddList ? (
              <button
                onClick={() => setIsAddList(true)}
                className="text-base bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Add List
              </button>
            ) : (
              <form
                className="w-full flex flex-row-reverse justify-center"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="Forlistname m-auto w-full px-3">
                  <input
                    className="text-[1vw] border-[#8590A1] rounded-md border-[1px] w-full p-2"
                    placeholder="Enter New Listname"
                    type="text"
                    {...register("listname", {
                      required: "Enter a list name",
                    })}
                  />
                  <p className="text-sm sm:text-[1vw] text-red-500">
                    {errors.listname?.message}
                  </p>
                </div>
                <button
                  type="submit"
                  className="text-base bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Create
                </button>
              </form>
            )}
          </div>
          <div className="list-wrapper w-full h-[60vw] flex gap-4 p-4">
            {updateBoard ? (
              lists.map((list) => (
                <div key={list.id} className="inner-list-wrapper">
                  <div className="list w-[18vw] bg-gray-800 rounded-xl shadow-md">
                    <div className="list-heading-wrapper text-white text-base px-4 py-2 border-b border-gray-700">
                      <span className="font-semibold">{list.name}</span>
                    </div>
                    <div className="card px-4 py-3 flex flex-col gap-2">
                      {list.cards.map((card, index) => (
                        <div
                          key={index}
                          className="card py-2 border border-gray-600 rounded-xl text-gray-200 px-3 bg-gray-700 hover:bg-gray-600 transition-colors text-[1vw]"
                        >
                          <span>{card}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="create-list-heading">
                <span>First Create a list</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;