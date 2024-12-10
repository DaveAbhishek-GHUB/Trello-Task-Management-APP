/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import createBoard from "../assets/images/Create_a_boardPNG-removebg-preview.png";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  CreateBoard,
  CreateList,
  AddCard,
  UpdateCardDescription,
  DeleteCard,
} from "../store/slices/userSlice";
import CloseBTN from "../assets/svgs/CloseBTN";
import CardIcon from "../assets/svgs/CardIcon";
import CardDes from "../assets/svgs/CardDes";
import ProfileBTN from "../assets/svgs/ProfileBTN";
import DeleteBTN from "../assets/svgs/DeleteBTN";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedinUser = useSelector((state) => state.user.Loggedin);
  const user = useSelector((state) => state.user.user);

  // State variables for managing UI states
  const [listId, setListId] = useState(null);
  const [editCard, setEditCard] = useState(null);

  const [isAddList, setIsAddList] = useState(false);
  const [isAdBoard, setIsAdBoard] = useState(false);
  const [isAddCard, setIsAddCard] = useState(false);

  const [isCardEdit, setIsCardEdit] = useState(false);
  const boardId = useSelector((state) => state.user.boardID);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  // Fetch user data and boards
  const loggedinuserData = user.find((user) => user.email === loggedinUser);
  const userboards = loggedinuserData?.boards;
  const selectedBoardId = useSelector((state) => state.user.boardID);
  const updateBoard = userboards?.find((board) => board.id === selectedBoardId);
  const lists = updateBoard?.lists;

  // Form handling using react-hook-form
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

  // Redirect to register if user is not logged in
  useEffect(() => {
    if (!loggedinUser) {
      navigate("/register");
    }
  }, [loggedinUser, navigate]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or the card is dropped in the same position
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    dispatch({
      type: "user/MoveCard",
      payload: {
        boardID: selectedBoardId,
        sourceListID: parseInt(source.droppableId),
        destinationListID: parseInt(destination.droppableId),
        sourceIndex: source.index,
        destinationIndex: destination.index,
      },
    });
  };

  // Handle card submission
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

  // Handle card description submission
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

  // Handle card editing
  const handleEditCard = (card) => {
    setEditCard(card);
    setIsCardEdit(true);
    setIsEditingDescription(!card.description);
    reset({ carddescription: card.description || "" });
  };

  const handleDeleteCard = (cardId) => {
    if (!boardId || !listId) return;
    
    dispatch(
      DeleteCard({
        boardID: boardId,
        listID: listId,
        cardID: cardId,
      })
    );
  };
  

  return (
    <>
      <Header />
      {userboards?.length > 0 ? (
        <div className="main-homepage-wrapper w-full min-h-screen flex bg-blue-50 relative">
          {isCardEdit && (
            <div className="Edit-section-wrapper w-[80vw] h-[40vw] bg-white absolute top-[4vw] left-[10vw] rounded-xl border-2 max-md:w-[90vw] max-md:left-[5vw] max-sm:w-full max-sm:left-0">
              <div className="close-btn-wrapper w-full flex justify-end border-b-2">
                <button
                  onClick={() => setIsCardEdit(false)}
                  className="p-5 rounded-full"
                >
                  <CloseBTN />
                </button>
              </div>

              <div className="card-info-wrapper w-full flex gap-5 p-5 items-center">
                <div className="icon-wrapper">
                  <CardIcon />
                </div>
                <span className="text-[2vw] max-md:text-[3vw] max-sm:text-[4vw]">
                  {editCard.name}
                </span>
              </div>
              <div className="card-description-wrapper flex justify-center items-center px-3">
                {isEditingDescription ? (
                  <form
                    className="w-full flex justify-center mt-2"
                    onSubmit={handleSubmit(onSubmitDescription)}
                  >
                    <div className="Forcarddescription m-auto w-full px-3">
                      <input
                        className="text-[2vw] max-md:text-[3vw] max-sm:text-[4vw] border-[#8590A1] rounded-md border-[1px] w-full p-2"
                        placeholder="Enter Card Description"
                        type="text"
                        defaultValue={editCard.description}
                        {...register("carddescription", {
                          required: "Card description is required",
                          minLength: {
                            value: 1,
                            message: "Card description must not be empty",
                          },
                          maxLength: {
                            value: 255,
                            message: "You can add up to 255 characters",
                          },
                          validate: (value) =>
                            value.trim().length > 0 ||
                            "Card description cannot be just whitespace",
                        })}
                      />
                      <p className="text-red-500 text-[1.5vw] max-md:text-[2.5vw] max-sm:text-[3vw]">
                        {errors.carddescription?.message}
                      </p>
                    </div>
                    <button
                      type="submit"
                      className="text-[2vw] max-md:text-[3vw] max-sm:text-[4vw] bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {editCard.description ? "Update" : "Add"}
                    </button>
                  </form>
                ) : (
                  <div className="card-description-wrapper w-full flex gap-5 px-2 items-start">
                    <div className="icon mt-2">
                      <CardDes />
                    </div>
                    <div>
                      <p className="text-[2vw] max-md:text-[3vw] max-sm:text-[4vw]">
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
                )}
              </div>
            </div>
          )}
          {boardId !== null ? (
            <div className="tasks-management w-[100vw] bg-white shadow-md max-md:w-full">
              <div className="task-heading-wrapper w-full p-4 flex justify-between items-center border-b border-blue-200">
                <span className="text-[2.5vw] max-md:text-[3.5vw] max-sm:text-[4.5vw] font-bold text-blue-800">
                  {updateBoard?.name || "Board Name"}
                </span>
                <div className="options-wrapper flex gap-3">
                  <button className="text-[1.5vw] max-md:text-[2.5vw] max-sm:text-[3.5vw] bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Filter
                  </button>
                  <div className="profile-btn">
                    <button className="p-2 bg-blue-800 text-white rounded-full hover:bg-blue-700 transition-colors">
                      <ProfileBTN />
                    </button>
                  </div>
                </div>
              </div>
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="list-wrapper w-full h-[60vw] flex gap-[1.7vw] p-4 overflow-auto max-md:flex-col max-md:h-auto">
                  {updateBoard ? (
                    lists.map((list) => (
                      <div key={list.id} className="inner-list-wrapper">
                        <div className="list w-[23vw] bg-blue-800 rounded-xl shadow-lg max-md:w-full">
                          <div className="list-heading-wrapper flex items-center justify-between text-white text-[1.5vw] max-md:text-[2.5vw] max-sm:text-[3.5vw] px-4 py-3 border-b border-blue-700">
                            <span className="font-semibold truncate text-[1vw] max-md:text-[2vw] max-sm:text-[2.5vw]">
                              {list.name}
                            </span>
                            <button
                              onClick={() => {
                                setListId(list.id);
                                setIsAddCard(true);
                              }}
                              className="text-[1vw] max-md:text-[2.5vw] max-sm:text-[3.5vw] bg-blue-700 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors"
                            >
                              Add Card
                            </button>
                          </div>
                          <Droppable droppableId={list.id.toString()}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="card px-4 py-3 flex flex-col gap-2.5"
                              >
                                {list.cards.map((card, index) => (
                                  <Draggable
                                    key={`${list.id}-${card.id}`}
                                    draggableId={`${list.id}-${card.id}`}
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`card py-2.5 bg-white rounded-xl text-black px-4 ${snapshot.isDragging
                                            ? "opacity-50"
                                            : ""
                                          } hover:bg-gray-50 transition-colors text-[1.5vw] max-md:text-[2.5vw] max-sm:text-[3.5vw] flex justify-between items-center shadow-sm`}
                                      >
                                        <button
                                          onClick={() => {
                                            setListId(list.id);
                                            handleEditCard(card);
                                          }}
                                          className="text-left flex-1 truncate hover:text-blue-800"
                                        >
                                          {card.name}
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setListId(list.id);
                                            handleDeleteCard(card.id);
                                          }}
                                          className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                                        >
                                          <DeleteBTN />
                                        </button>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                                {isAddCard && listId === list.id && (
                                  <form
                                    className="w-full flex gap-2 items-center mt-2"
                                    onSubmit={handleSubmit(onSubmitCard)}
                                  >
                                    <div className="flex-1">
                                      <input
                                        className="w-full px-3 py-2 text-[1vw] max-md:text-[2.5vw] max-sm:text-[3.5vw] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                      className="text-[1.5vw] max-md:text-[2.5vw] max-sm:text-[3.5vw] bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
                                    >
                                      Add
                                    </button>
                                  </form>
                                )}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="create-list-heading text-[2vw] max-md:text-[3vw] max-sm:text-[4vw] font-medium text-gray-600">
                      First create a list
                    </div>
                  )}
                </div>
              </DragDropContext>
            </div>
          ) : (
            <div className="main-wrapper w-full text-[3vw] font-sans flex justify-center items-center">
              <span className="text-[3vw] max-md:text-[4vw] max-sm:text-[5vw]">
                SELECT YOUR BOARD
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="Create-board-section w-full h-full flex justify-center items-center">
          <img src={createBoard} alt="Create a Board" />
        </div>
      )}
    </>
  );
}

export default HomePage;
