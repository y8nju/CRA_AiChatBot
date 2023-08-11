import 'styles/chat.scss';
import { useState } from 'react';
import Copy from 'components/chats/chatmain/copy';
import NewChatModal from 'components/chats/chatmain/newChatModal';
import { useNavigate } from 'react-router-dom';
import { set_chatting_room } from 'utils/chats';
import { getDeviceId, saveIndexedDB } from 'utils/chats';
import { useEffect } from 'react';
import { ChevronRight } from '@material-ui/icons';
import { useContext } from 'react';
import { AccountContext } from 'context/userContext';
import { get_chatroom_list } from '../../utils/chats';

const ChatMain = () => {
  const [lastroom,setLastroom] = useState("");
  const [selectCopy, setSelectCopy] = useState("");
  const [modalopen, setModalopen] = useState(false);
  const navigate = useNavigate();
  const { auth } = useContext(AccountContext);
  // const setBear = async () => {
  //   const deviceId = await getDeviceId();
  //   saveIndexedDB(deviceId)
  //   localStorage.setItem('bear', deviceId);
  // }
  // useEffect(() => {
  //   lastChattingRoom();
  //   if (!localStorage.getItem('bear')) {
  //     setBear();
  //   }
  // }, [])

  async function createChattingRoom(person) {
    try {
      let Personality = new Object();
      Personality.personality = person;
      let result = await set_chatting_room(Personality);
      let { status, data, limit } = result;

      if (limit) {
        alert('채팅방 생성 갯수를 초과했습니다. 채팅 목록으로 이동합니다.');
        return navigate('/list');
      }

      if (status === 201 || status === 200) {
        const trialId = localStorage.getItem('bear');
        let { babbleId } = data;
        console.log(trialId,'trialId!')
        if (babbleId) navigate('/room/' + babbleId, { state: selectCopy.includes('음성','시작') ? null :selectCopy  });
        else navigate('/room/' + trialId, { state: selectCopy });
      }
    } catch (error) {
      return //console.log(error.message)
    }
  }


  const handleCopy = (copy) => {
    setSelectCopy(copy)
  }

  const handleIsModalOpen = () => {
    setModalopen(prev => !prev)
  }

  const handleNewChat = (person) => {
    createChattingRoom(person);
  }

  async function lastChattingRoom (){
    try {
      let result = await get_chatroom_list();
      let {babbles} = await result.data;
      console.log(babbles,'babbles!')
      let sortArr = babbles.sort((a,b)=> new Date(b.modified)-new Date(a.modified));
      setLastroom(sortArr[0]._id);
      return sortArr[0]._id;
    } catch (error) {
      //console.log(error,'<= last chatting list error')
    }
  }

  const handleChat = async () => {
    if (auth) {
      //기존 채팅방 들어가기(가장 최근 채팅방)
     let lastRoomId =await lastChattingRoom();
     if(lastRoomId){
        navigate('/room/'+lastRoomId);
     }else{
        handleIsModalOpen();
        setSelectCopy('채팅방에서 음성으로 시작해보세요');
     }

    } else {
      let trialId = localStorage.getItem('bear');
      if(trialId) navigate('/room/'+trialId);
      else createChattingRoom('기본 시스템');
    }
  }

  return (<div className="chat_main">
    <Copy onCopy={handleCopy} onModal={handleIsModalOpen} />
    {modalopen && <NewChatModal selectCopy={selectCopy} onModal={handleIsModalOpen} onNewChat={handleNewChat} />}
    <button onClick={handleChat} className='main_arrow_button'>{!auth? '체험판 채팅방으로 이동' : lastroom ? '마지막 채팅방으로 이동':'새로운 채팅방으로 이동'}<ChevronRight /></button>
  </div>);
};

export default ChatMain;