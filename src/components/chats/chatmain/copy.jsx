import { voice_copys } from "libs/copys";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { get_chat } from "../../../utils/chats";
import { AccountContext } from 'context/userContext';
import { useNavigate } from "react-router-dom";
const Copy = ({ onCopy, onModal }) => {
  const [active, setActive] = useState(false);
  const { auth } = useContext(AccountContext);
  const navigate = useNavigate();

  async function getTrialsList() {
    try {
      let result = await get_chat();
      //console.log(result, 'trials0result!')
      let { talker } = await result.data;

      if (talker) { 
        return { roomId: talker, newChat: false }; 
      } else {
        return { newChat: true };
    }
      
    } catch (error) {
    //console.log(error)
  }
}

const handleMove = async (copys) => {
    onCopy(copys);
    onModal();
}

useEffect(() => {
  // 페이지가 처음 로드될 때 슬라이드 인 효과를 활성화합니다.
  setActive(true);

  // 컴포넌트가 unmount 될 때 슬라이드 인 효과를 초기화합니다.
  return () => {
    setActive(false);
  };
}, []);



return (<div className="copy_box">
  <h1 className={`copy_title ${active ? 'active' : ''}`}>
    <img src="/assets/images/logos/logo_text.svg" className="logo_background_img" />
  </h1>
  <div className="copy_example_box">
    {voice_copys.examples.map((copys, index) => <span className="copy_example"
      style={{ animationDelay: `${index * 0.3}s` }}
      key={copys} onClick={() => handleMove(copys)}>{copys}</span>)}
  </div>
  <span className="copy_induce">{voice_copys.induce}</span>
</div>
);
};

export default Copy;
