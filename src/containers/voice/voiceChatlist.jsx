import NoChatlist from "components/chats/chatlist/noChat";
import ChatlistItem from "components/chats/chatlist/chatlistItem";
import { useEffect } from "react";
import { get_chatroom_list } from "utils/chats";
import { useState } from "react";

const VoiceChatlist = () => {
  const [roomlist, setRoomlist] = useState([]);

  async function get_chatlist() {
    try {
      let result = await get_chatroom_list();
      let { babbles: list } = result.data;
      let sortArr = list.sort((a,b)=> new Date(b.modified) - new Date(a.modified));
      // console.log(sortArr,'sortArr')
      setRoomlist(sortArr);
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    get_chatlist();
  }, []);

  return <div className="chatlist_box">
    {roomlist.length === 0 && <NoChatlist />}

    <div className="chatlist">    
    {roomlist.length > 0 && roomlist.map((one) => {
      return <ChatlistItem key={one._id} item={one} />
    })}
    </div>
  </div>;
};

export default VoiceChatlist;
