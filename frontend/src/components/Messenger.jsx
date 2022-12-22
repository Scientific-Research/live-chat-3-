import React, { useEffect, useState, useRef } from "react";
import { FaEdit, FaEllipsisH, FaSistrix } from "react-icons/fa";
import ActiveFriend from "./ActiveFriend";
import Friends from "./Friends";
import RightSide from "./RightSide";
import { useDispatch, useSelector } from "react-redux";
import {
  getFriends,
  messageSend,
  getMessage,
  imageMessageSend,
} from "../store/actions/messengerAction";
import toast, { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";

import useSound from "use-sound";
import notificationSound from "../audio/notification.mp3";
import sendingSound from "../audio/sending.mp3";

const Messenger = () => {
  const [notificationSPlay] = useSound(notificationSound);
  const [sendingSPlay] = useSound(sendingSound);

  const scrollRef = useRef();
  const socket = useRef();
  const dispatch = useDispatch();

  const { friends, message } = useSelector((state) => state.messenger);
  const { myInfo } = useSelector((state) => state.auth);

  const [currentFriend, setCurrentFriend] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const [activeUser, setActiveUser] = useState([]);
  const [socketMessage, setSocketMessage] = useState("");

  const [typingMessage, setTypingMessage] = useState("");

  // console.log(currentFriend);
  // console.log(socket);
  useEffect(() => {
    socket.current = io("ws://localhost:8000");
    socket.current.on("getMessage", (data) => {
      // console.log(data);
      setSocketMessage(data);
    });

    socket.current.on("typingMessageGet", (data) => {
      // console.log(data);
      setTypingMessage(data);
    });
  }, []);

  useEffect(() => {
    if (socketMessage && currentFriend) {
      if (
        socketMessage.senderId === currentFriend._id &&
        socketMessage.receiverId === myInfo.id
      ) {
        dispatch({
          type: "SOCKET_MESSAGE",
          payload: {
            message: socketMessage,
          },
        });
      }
    }
    setSocketMessage("");
  }, [currentFriend, dispatch, myInfo.id, socketMessage]);

  useEffect(() => {
    socket.current.emit("addUser", myInfo.id, myInfo);
  }, [myInfo, myInfo.id]);

  useEffect(() => {
    socket.current.on("getUser", (users) => {
      const filterUser = users.filter((u) => u.userId !== myInfo.id);
      // console.log(users);
      setActiveUser(filterUser);
    });
  }, [myInfo.id]);

  useEffect(() => {
    if (
      socketMessage &&
      socketMessage.senderId !== currentFriend._id &&
      socketMessage.receiverId === myInfo.id
    ) {
      notificationSPlay();
      toast.success(`${socketMessage.senderName} sent a new message!`);
    }
  }, [currentFriend._id, myInfo.id, notificationSPlay, socketMessage]);

  // console.log(currentFriend);

  const inputHandle = (e) => {
    setNewMessage(e.target.value);

    //pass this value to socket:
    socket.current.emit("typingMessage", {
      senderId: myInfo.id,
      receiverId: currentFriend._id,
      msg: e.target.value,
    });
  };

  // console.log(newMessage);

  const sendMessage = (e) => {
    e.preventDefault();
    sendingSPlay();
    const data = {
      senderName: myInfo.userName,
      receiverId: currentFriend._id,
      message: newMessage ? newMessage : "💓",
    };
    socket.current.emit("sendMessage", {
      senderId: myInfo.id,
      senderName: myInfo.userName,
      receiverId: currentFriend._id,
      time: new Date(),
      message: {
        text: newMessage ? newMessage : "💓",
        image: "",
        // image: newMessage.image,
        // image: message.image,
      },
    });

    socket.current.emit("typingMessage", {
      senderId: myInfo.id,
      receiverId: currentFriend._id,
      msg: "",
    });

    dispatch(messageSend(data));
    setNewMessage("");
    // console.log(newMessage);
  };

  // console.log(friends);

  useEffect(() => {
    dispatch(getFriends());
  }, [dispatch]);

  useEffect(() => {
    if (friends && friends.length > 0) {
      setCurrentFriend(friends[0]);
    }
  }, [dispatch, friends]);

  useEffect(() => {
    dispatch(getMessage(currentFriend._id));
  }, [currentFriend?._id, dispatch]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const emojiSend = (emu) => {
    setNewMessage(`${newMessage}` + emu);
    // setNewMessage(emu);
    // console.log(emu);
    socket.current.emit("typingMessage", {
      senderId: myInfo.id,
      receiverId: currentFriend._id,
      msg: emu,
    });
  };

  const ImageSend = (e) => {
    if (e.target.files.length !== 0) {
      sendingSPlay();
      const imageName = e.target.files[0].name;
      const newImageName = Date.now() + imageName;

      // to send the images in Real Time like Text
      socket.current.emit("sendMessage", {
        senderId: myInfo.id,
        senderName: myInfo.userName,
        receiverId: currentFriend._id,
        time: new Date(),
        message: {
          text: "",
          image: newImageName,
          // image: newMessage.image,
          // image: message.image,
        },
      });

      const formData = new FormData();
      formData.append("senderName", myInfo.userName);
      formData.append("imageName", newImageName);
      formData.append("receiverId", currentFriend._id);
      formData.append("image", e.target.files[0]);
      dispatch(imageMessageSend(formData));
      // console.log(newImageName);
      // console.log(Date.now());
    }
    // console.log(e.target.files[0]);
  };

  return (
    <div className="messenger">
      {/* Notification */}
      <Toaster
        // timeout={5000}
        position={"top-right"}
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: "18px",
          },
        }}
      />

      <div className="row">
        <div className="col-3">
          <div className="left-side">
            <div className="top">
              <div className="image-name">
                <div className="image">
                  <img
                    src={`./images/${myInfo.image}`}
                    // width="1000px"
                    // height="1000px"
                    alt=""
                  />
                </div>
                <div className="name">
                  <h3>{myInfo.userName}</h3>
                </div>
              </div>
              <div className="icons">
                <div className="icon">
                  <FaEllipsisH />
                </div>
                <div className="icon">
                  <FaEdit />
                </div>
              </div>
            </div>
            <div className="friend-search">
              <div className="search">
                <button>
                  <FaSistrix />
                </button>
                <input
                  type="text"
                  placeholder="Search"
                  className="form-control"
                />
              </div>
            </div>
            <div className="active-friends">
              {activeUser && activeUser.length > 0
                ? activeUser.map((u) => (
                    <ActiveFriend
                      setCurrentFriend={setCurrentFriend}
                      user={u}
                    />
                  ))
                : ""}
            </div>
            <div className="friends">
              {friends && friends.length > 0
                ? friends.map((fd, i) => (
                    <div
                      onClick={() => setCurrentFriend(fd)}
                      key={i}
                      className={
                        currentFriend._id === fd._id
                          ? "hover-friend active"
                          : "hover-friend"
                      }
                    >
                      <Friends friend={fd} />
                    </div>
                  ))
                : "No Friend"}
            </div>
          </div>
        </div>
        {currentFriend ? (
          <RightSide
            currentFriend={currentFriend}
            inputHandle={inputHandle}
            newMessage={newMessage}
            sendMessage={sendMessage}
            message={message}
            scrollRef={scrollRef}
            emojiSend={emojiSend}
            ImageSend={ImageSend}
            activeUser={activeUser}
            typingMessage={typingMessage}
          />
        ) : (
          "Please select your friend"
        )}
      </div>
    </div>
  );
};

export default Messenger;
