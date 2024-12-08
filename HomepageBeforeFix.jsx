/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import createBoard from "../assets/images/Create_a_boardPNG-removebg-preview.png";
import { DndContext, closestCorners } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DraggableCard from "../components/DraggableCard";
import { MoveCard } from "../store/slices/userSlice";

import {
  CreateBoard,
  CreateList,
  AddCard,
  UpdateCardDescription,
  DeleteCard,
} from "../store/slices/userSlice";

function HomePage() {
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = parseInt(active.id);
    const overId = parseInt(over.id);

    // Find the source and destination lists
    let sourceListId, destinationListId;
    lists.forEach((list) => {
      list.cards.forEach((card) => {
        if (card.id === activeId) {
          sourceListId = list.id;
        }
      });
    });

    lists.forEach((list) => {
      if (list.cards.some((card) => card.id === overId)) {
        destinationListId = list.id;
      }
    });

    if (sourceListId && destinationListId) {
      dispatch(
        MoveCard({
          boardID: boardId,
          sourceListID: sourceListId,
          destinationListID: destinationListId,
          cardID: activeId,
        })
      );
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedinUser = useSelector((state) => state.user.Loggedin);
  const user = useSelector((state) => state.user.user);
  console.log("user", user);

  const [isAddList, setIsAddList] = useState(false);
  const [isAdBoard, setIsAdBoard] = useState(false);
  const [isAddCard, setIsAddCard] = useState(false);
  // const [boardId, setBoardId] = useState(null);
  const boardId = useSelector((state) => state.user.boardID);
  const [listId, setListId] = useState(null);
  const [editCard, setEditCard] = useState(null);
  const [isCardEdit, setIsCardEdit] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const loggedinuserData = user.find((user) => user.email === loggedinUser);
  const userboards = loggedinuserData?.boards;
  const selectedBoardId = useSelector((state) => state.user.boardID);
  const updateBoard = userboards?.find((board) => board.id === selectedBoardId);
  const lists = updateBoard?.lists;
  const allCards = useSelector((state) => state.user.user.boards);
  console.log(allCards);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      boardname: "",
      listname: "",
      cardname: "",
      carddescription: "",
    },
  });

  useEffect(() => {
    if (!loggedinUser) {
      navigate("/register");
    }
  }, [loggedinUser, navigate]);

  const onSubmitList = (ListData) => {
    setIsAddList(false);
    dispatch(
      CreateList({ boardID: selectedBoardId, listname: ListData.listname })
    );
  };

  const onSubmitCard = (CardData) => {
    setIsAddCard(false);
    dispatch(
      AddCard({
        boardID: selectedBoardId,
        listID: listId,
        cardname: CardData.cardname,
      })
    );
  };

  const onSubmitDescription = (DescriptionData) => {
    dispatch(
      UpdateCardDescription({
        boardID: boardId,
        listID: listId,
        cardID: editCard.id,
        description: DescriptionData.carddescription,
      })
    );
    setIsEditingDescription(false);
    setEditCard({ ...editCard, description: DescriptionData.carddescription });
    reset({ carddescription: "" });
  };

  const handleEditCard = (card) => {
    setEditCard(card);
    setIsCardEdit(true);
    setIsEditingDescription(!card.description);
    reset({ carddescription: card.description || "" });
  };

  const handleBoard = (BoardData) => {
    setIsAdBoard(false);
    dispatch(CreateBoard({ boardName: BoardData.boardname }));
  };

  const handleDeleteCard = (cardId) => {
    dispatch(DeleteCard({ boardID: boardId, listID: listId, cardID: cardId }));
    console.log("card ID", cardId);
  };

  return (
    <>
      <Header />
      {userboards?.length > 0 ? (
        <div className="main-homepage-wrapper w-full min-h-screen flex bg-blue-50 relative">
          {isCardEdit && (
            <div className="Edit-section-wrapper w-[80vw] h-[40vw] bg-white absolute top-[6vw] left-[18vw] rounded-xl border-2 max-md:w-[90vw] max-md:left-[5vw] max-sm:w-full max-sm:left-0">
              <div className="close-btn-wrapper w-full flex justify-end border-b-2">
                <button
                  onClick={() => setIsCardEdit(false)}
                  className="p-5 rounded-full"
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
                      d="M14.9994 15L9 9M9.00064 15L15 9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
              </div>

              <div className="card-info-wrapper w-full flex gap-5 p-5">
                <div className="icon-wrapper">
                  <svg
                    width={24}
                    height={24}
                    role="presentation"
                    focusable="false"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5 5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5ZM19 7H5V13H19V7ZM17 16C17 16.5523 17.4477 17 18 17C18.5523 17 19 16.5523 19 16C19 15.4477 18.5523 15 18 15C17.4477 15 17 15.4477 17 16ZM6 17C5.44772 17 5 16.5523 5 16C5 15.4477 5.44772 15 6 15H10C10.5523 15 11 15.4477 11 16C11 16.5523 10.5523 17 10 17H6Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <span>{editCard.name}</span>
              </div>
              <div className="card-description-wrapper flex justify-center items-center px-3">
                {isEditingDescription ? (
                  <form
                    className="w-full flex justify-center mt-2"
                    onSubmit={handleSubmit(onSubmitDescription)}
                  >
                    <div className="Forcarddescription m-auto w-full px-3">
                      <input
                        className="text-[1vw] border-[#8590A1] rounded-md border-[1px] w-full p-2"
                        placeholder="Enter Card Description"
                        type="text"
                        defaultValue={editCard.description}
                        {...register("carddescription", {
                          required: "carddescription is required",
                          minLength: {
                            value: 1,
                            message: "carddescription must not be empty",
                          },
                          maxLength: {
                            value: 255,
                            message: "You can add upto 255 words",
                          },
                          validate: (value) =>
                            value.trim().length > 0 ||
                            "carddescription cannot be just whitespace",
                        })}
                      />
                      <p className="text-sm sm:text-[1vw] text-red-500">
                        {errors.carddescription?.message}
                      </p>
                    </div>
                    <button
                      type="submit"
                      className="text-base bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {editCard.description ? "Update" : "Add"}
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="card-description-wrapper w-full flex gap-5 px-2 items-start">
                      <div className="icon mt-2">
                        <svg
                          width={24}
                          height={24}
                          role="presentation"
                          focusable="false"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM4 9C3.44772 9 3 9.44772 3 10C3 10.5523 3.44772 11 4 11H20C20.5523 11 21 10.5523 21 10C21 9.44772 20.5523 9 20 9H4ZM3 14C3 13.4477 3.44772 13 4 13H20C20.5523 13 21 13.4477 21 14C21 14.5523 20.5523 15 20 15H4C3.44772 15 3 14.5523 3 14ZM4 17C3.44772 17 3 17.4477 3 18C3 18.5523 3.44772 19 4 19H14C14.5523 19 15 18.5523 15 18C15 17.4477 14.5523 17 14 17H4Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                      <div>
                        <p>
                          {editCard.description}
                          <div className="edit-button-wrapper">
                            <button
                              onClick={() => setIsEditingDescription(true)}
                              className="px-3 bg-blue-500 text-white rounded-md flex items-center gap-1"
                            >
                              <span>Edit</span>
                            </button>
                          </div>
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          {boardId !== null ? (
            <div className="tasks-management w-[100vw] bg-white shadow-md max-md:w-full">
              <div className="task-heading-wrapper w-full p-4 flex justify-between items-center border-b border-blue-200">
                <span className="text-2xl font-bold text-blue-800">
                  {updateBoard?.name || "BoardName"}
                </span>
                <div className="options-wrapper flex gap-3">
                  <button className="text-sm bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Filter
                  </button>
                  <div className="profile-btn">
                    <button className="p-2 bg-blue-800 text-white rounded-full hover:bg-blue-700 transition-colors">
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
              <DndContext
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
              >
                <div className="list-wrapper w-full h-[60vw] flex gap-[1.7vw] p-4 overflow-auto max-md:flex-col max-md:h-auto">
                  {updateBoard
                    ? lists.map((list) => (
                        <div key={list.id} className="inner-list-wrapper">
                          <div className="list w-[18vw] bg-blue-800 rounded-xl shadow-lg max-md:w-full">
                            <div className="list-heading-wrapper flex items-center justify-between text-white text-base px-4 py-3 border-b border-blue-700">
                              <span className="font-semibold truncate">
                                {list.name}
                              </span>
                              <button
                                onClick={() => {
                                  setListId(list.id);
                                  setIsAddCard(true);
                                }}
                                className="text-sm bg-blue-700 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors"
                              >
                                Add Card
                              </button>
                            </div>
                            <SortableContext
                              items={list.cards.map((card) =>
                                card.id.toString()
                              )}
                              strategy={verticalListSortingStrategy}
                            >
                              <div className="card px-4 py-3 flex flex-col gap-2.5">
                                {list.cards.map((card) => (
                                  <DraggableCard
                                    key={card.id}
                                    card={card}
                                    onEdit={handleEditCard}
                                    onDelete={handleDeleteCard}
                                  />
                                ))}
                                {isAddCard && listId === list.id && (
                                  <form
                                    className="w-full flex gap-2 items-start mt-2"
                                    onSubmit={handleSubmit(onSubmitCard)}
                                  >
                                    <div className="flex-1">
                                      <input
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter card name"
                                        type="text"
                                        {...register("cardname", {
                                          required: "Card name is required",
                                          minLength: {
                                            value: 1,
                                            message:
                                              "Card name must not be empty",
                                          },
                                          validate: (value) =>
                                            value.trim().length > 0 ||
                                            "Card name cannot be just whitespace",
                                        })}
                                      />
                                      {errors.cardname && (
                                        <p className="text-xs text-red-500 mt-1">
                                          {errors.cardname.message}
                                        </p>
                                      )}
                                    </div>
                                    <button
                                      type="submit"
                                      className="text-sm bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
                                    >
                                      Add
                                    </button>
                                  </form>
                                )}
                              </div>
                            </SortableContext>
                          </div>
                        </div>
                      ))
                    : ""}
                </div>
              </DndContext>
            </div>
          ) : (
            <div className="main-wrapper w-full text-[3vw] font-sans flex justify-center items-center">
              <span>SELECT YOUR BOARD</span>
            </div>
          )}
        </div>
      ) : (
        <div className="Create-board-section w-full h-full flex justify-center items-center">
          <img src={createBoard} alt="" />
        </div>
      )}
    </>
  );
}

export default HomePage;
