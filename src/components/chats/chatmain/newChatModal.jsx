
import { useState } from "react";
import { assistant_personality } from "libs/copys";
import { Close, ExpandMore, ChevronRight } from "@material-ui/icons";
import { useContext } from 'react';
import { AccountContext } from 'context/userContext';

const NewChatModal = ({ selectCopy, onModal, onNewChat }) => {
  const { auth } = useContext(AccountContext);
  const [selectPersonality, setSelectPersonality] = useState(
    auth ?
    selectCopy.includes('상담') ? '심리치료사' :
      selectCopy.includes('회화') ? '언어상담사' :
        selectCopy.includes('간단', '대화') ? '유쾌한 농담 상대' :
          selectCopy.includes('기분') ? '친구같은 20대 청년' :
            selectCopy.includes('날씨') ? '침착한 30대 청년' :
              '유쾌한 농담 상대'
              : '유쾌한 농담 상대'
  );

  const [isMenu, setIsMenu] = useState(false);

  const handleSelectPersonality = (person) => {
    setSelectPersonality(person);
    handleIsMenu();
  }

  const handleIsMenu = () => {
    setIsMenu(prev => !prev)
  }

  const handleClose = () => {
    onModal();
  }

  const handleNew = () => {
    onNewChat(selectPersonality);
  }

  return <>
    <div className="backdrop"></div>
    <div className="modal_box">
      <h2 className="title">{auth ? "구체적인 대화상대 정하기" : "Talkie 체험해보기"}</h2>
      <Close className="close_icon" onClick={handleClose} />

      {auth && <div className="menu_list_box">
      {auth && <span className="copy auth"> 첫 대화 | {selectCopy}</span>}
        <div className="select_bar" onClick={handleIsMenu}>
          <span className='text' >대화상대 | {selectPersonality}</span>
          <ExpandMore className="expand_icon" />
        </div>

        {isMenu && <ul className="option_box">
          {assistant_personality.map(one => <li className="option" onClick={() => handleSelectPersonality(one)} key={one}>{one}</li>)}
        </ul>}
      </div>}
      {!auth && <div className="login_copy_box">
      <span className="copy"> 첫 대화 | {selectCopy}</span>
      <span className="login_copy title"> 대화상대 | {selectPersonality}</span>
      </div>}
      <button className="new_chat_btn" onClick={handleNew}>{auth ? "채팅 시작하기":"Talkie 체험판 시작하기"}<ChevronRight /></button>
      {!auth &&  <span className="login_copy text">로그인 하시면 다양한 대화 상대 설정이 가능합니다.</span> }
    </div>
  </>;
};

export default NewChatModal;
