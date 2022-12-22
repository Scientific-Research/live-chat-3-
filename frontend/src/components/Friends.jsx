import React from "react";
import moment from "moment";

const Friends = (props) => {
  const { fndInfo, msgInfo } = props.friend;
  const myId = props.myId;

  return (
    <div className="friend">
      <div className="friend-image">
        <div className="image">
          <img
            src={`./images/${fndInfo.image}`}
            // width="1000px"
            // height="1000px"
            alt=""
          />
        </div>
      </div>
      <div className="friend-name-seen">
        <div className="friend-name">
          <h4>{fndInfo.userName}</h4>
          <div className="msg-time">
            {msgInfo && msgInfo.senderId === myId ? (
              <span>You </span>
            ) : (
              <span>{fndInfo.userName + " "}</span>
            )}
            {msgInfo && msgInfo.message.text ? (
              <span>{msgInfo.message.text.slice(0, 10)}</span>
            ) : msgInfo && msgInfo.message.image ? (
              <span>Send an Image</span>
            ) : (
              <span>Connected You</span>
            )}
            <span>
              {msgInfo
                ? moment(msgInfo.createAt).startOf("mini").fromNow()
                : moment(fndInfo.createAt).startOf("mini").fromNow()}
            </span>
          </div>
        </div>
        {myId === msgInfo?.senderId ? (
          <div className="seen-unseen-icon">
            <img
              src={`./images/${fndInfo.image}`}
              // width="1000px"
              // height="1000px"
              alt=""
            />
          </div>
        ) : (
          <div className="seen-unseen-icon">
            <div className="seen-icon">
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
