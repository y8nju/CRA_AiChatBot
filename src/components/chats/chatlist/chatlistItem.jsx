
import ChatBubbleOutline from "@material-ui/icons/ChatBubbleOutline";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get_chat } from "utils/chats";

const ChatlistItem = ({ item }) => {

  const navigate = useNavigate();
  const { _id: roomId } = item;
  const [babblePreview, setBabblePreview] = useState();
  const handleMove = () => {
    if (roomId) {
      navigate('/room/' + roomId)
    }
  }

  async function getChatData() {
    try {
      let { messages } = item;
      if(messages.length>0){
      let assistantArr = messages.filter(one => one.role === "assistant");
      let prevObj = assistantArr[assistantArr.length - 1];
      let prevContent = prevObj?.content;
      setBabblePreview(prevContent);
    }
    } catch (error) {
      //console.log(error)
    }
  }

  useEffect(() => {
    roomId && getChatData();
  }, [item])

  return <div className="chatlist_item_box" onClick={handleMove}>
    <p className="item">
      <ChatBubbleOutline
        className="chat_icon"
      />
      <span className="chat_text">{babblePreview ? babblePreview : "Talkie를 시작해보세요!"}</span>
    </p>
  </div>;
};

export default ChatlistItem;
