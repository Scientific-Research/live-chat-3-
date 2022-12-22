import React from "react";
import {
  FaEdit,
  FaEllipsisH,
  FaPhone,
  FaPhoneAlt,
  FaRocketchat,
  FaSistrix,
  FaVideo,
} from "react-icons/fa";
import FriendInfo from "./FriendInfo";
import Message from "./Message";
import MessageSend from "./MessageSend";

const RightSide = (props) => {
  const {
    currentFriend,
    inputHandle,
    newMessage,
    sendMessage,
    message,
    scrollRef,
    emojiSend,
    ImageSend,
    activeUser,
    typingMessage
  } = props;
  // console.log(currentFriend);
  return (
    <div className="col-9">
      <div className="right-side">
        <input type="checkbox" id="dot" />
        <div className="row">
          <div className="col-8">
            <div className="message-send-show">
              <div className="header">
                <div className="image-name">
                  <div className="image">
                    <img
                      src={`./images/${currentFriend.image}`}
                      // width="1000px"
                      // height="1000px"
                      alt=""
                    />
                    {activeUser &&
                    activeUser.length > 0 &&
                    activeUser.some((u) => u.userId === currentFriend._id) ? (
                      <div className="active-icon"></div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="name">
                    <h3>{currentFriend.userName}</h3>
                  </div>
                </div>
                <div className="icons">
                  <div className="icon">
                    <FaPhoneAlt />
                  </div>

                  <div className="icon">
                    <FaVideo />
                  </div>

                  <div className="icon">
                    <label htmlFor="dot">
                      <FaRocketchat />
                    </label>
                  </div>
                </div>
              </div>
              <Message
                message={message}
                currentFriend={currentFriend}
                scrollRef={scrollRef}
                typingMessage = {typingMessage}
              />
              <MessageSend
                inputHandle={inputHandle}
                newMessage={newMessage}
                sendMessage={sendMessage}
                emojiSend={emojiSend}
                ImageSend={ImageSend}
              />
            </div>
          </div>

          <div className="col-4">
            <FriendInfo currentFriend={currentFriend} activeUser={activeUser} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSide;
