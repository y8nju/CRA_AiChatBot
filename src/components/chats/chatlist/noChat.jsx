import { useNavigate } from "react-router-dom";
import { set_chatting, set_chatting_room } from "../../../utils/chats";

const NoChatlist = () => {
  const navigate = useNavigate();


  const handleNavigate = async () => {
    try {
      let Personality = { personality: "20대 청년" }
      let result = await set_chatting_room(Personality);
      let { _id: roomId } = result.data;
      let { status , limit } = result;
      if(limit) alert('채팅방 생성 갯수를 초과했습니다.')
      if (status === 201 || status === 200) {
        navigate('/room/' + roomId);
      } else {
        alert("채팅방 생성에 실패하였습니다.");
        navigate('/');
      }
    } catch (error) {
      //console.log(error)
    }
  }

  return <div className="no_chatlist_box">
    <span className="no_chat_ment">활성화 된 채팅이 없습니다.</span>
    <span className="no_chat_ment navigate_new_chat" onClick={handleNavigate}>Talkie로 보이스 채팅을 시작해보세요!</span>
  </div>;
};

export default NoChatlist;
