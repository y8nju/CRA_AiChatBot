import { useEffect, useState, useRef } from "react";
import Chats from "components/chats/chatroom/chats";
import Recorder from "components/chats/chatroom/recorder";
import Info from 'components/commons/Info'
import { get_chat } from "utils/chats";
import { useLocation, useParams } from "react-router-dom";

const VoiceChatroom = () => {
  const params = useParams();
  const scrollRef = useRef();
  const {state: startChat} = useLocation();
  const [customer, setCustomer] = useState(false); // 손님 모드인지?
  const [chatList, setChatList] = useState([]);
  const [reload, setReload] = useState(false);

  const [notice, setNotice] = useState(false);
  const [infoPopup, setInfoPopup] = useState(false);

  const [customerLimit, setCustomerLimit] = useState(false);

  useEffect(() => {
    getData();
  }, [reload]);

  useEffect(() => {
    if (
      /webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      // 안드로이드인 경우
    } else if (/Android/i.test(navigator.userAgent)) {
      setNotice(true);
    }

    if(!localStorage.getItem('jwt')){
      setCustomer(true);
    }

  }, []);


  useEffect(() => {
    // 스크롤 위치 하단으로
    scrollToBottom();
    if(customer) {
      chatList.length >= 6 && setCustomerLimit(true)
    }
  }, [chatList, scrollRef]);

  const scrollToBottom = () => {
    scrollRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };
  
  // 대화 리스트 불러오기
  const getData = async () => {
    try {
      let { roomId } = params;
      if(roomId){
        const result = await get_chat(roomId);
        //console.log(result,'chats!') //TODO: 데이터 chatlist에 넣어야함
        let {messages} = result.data;
        setChatList(messages);
        
      }
    } catch (error) {
      //console.log(error)
    }
  };

  const handleReload = () =>{
    setReload(prev => !prev)
  }


  return (
    <div className="chat_room_box" ref={scrollRef}>
      {
        (customer && !customerLimit ) &&
        <div className="customer">
          <Info type='warning' text='비가입자는 사용 횟수가 최대 3회입니다.' /> 
        </div>
      }
      <div className="chat_list">
        {chatList.length !== 0 &&
          chatList.map((chat, chatIdx) => <Chats key={chatIdx} data={chat} />)}

        {chatList.length == 0 && <span className="no_chatting">채팅이 존재하지 않습니다. 채팅을 시작해보세요!</span>}
      </div>
      {customerLimit && (
        <div className="customer limit">
          <Info type='warning'  text='사용 횟수가 최대 3회가 초과되었습니다. 로그인 후 이용해주세요' />
        </div>
      )}
      <Recorder onReload={handleReload} customerLimit={customerLimit} startChat={startChat}/>

      {notice && <div className="notice_container" onClick={() => setInfoPopup(prev => !prev)}>
        <div className="notice_btn">
          ?
        </div>
        {
          infoPopup &&
          <div className="notice">
            <p>안드로이드 기종일 경우, 현재 텍스트 음성 출력 기능이 정상 작동하지않을 수 있습니다.</p>
            <p>정상 작동이 안될 경우,</p>
            <p>1. ⚙설정 - 일반 - 글자 읽어주기 화면으로 진입합니다.</p>
            <p>2. 초기화를 진행시킵니다.</p>
            <p>3. 현재 사용 중인 앱/웹을 종료 후, 재실행합니다.</p>
            <p>위 설명대로 진행하였으나, 똑같은 문제가 발생한다면 고객센터로 문의바랍니다.</p>
          </div>
        }
      </div>}


    </div>
  );

};

export default VoiceChatroom;
