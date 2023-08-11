import { useRef } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Close, Menu } from "@material-ui/icons";
import { useEffect } from "react";
import { useContext } from "react";
import { AccountContext } from "context/userContext";

const Nav = () => {
  const [isNavbar, setIsNavbar] = useState(false);
  const [isLogo, setIsLogo] = useState(false);
  const { auth } = useContext(AccountContext);
  const navRef = useRef();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const authContext = useContext(AccountContext);

  /**상태 바꾸는 함수 */
  const handleNavbar = () => {
    setIsNavbar(c => !c)
  }

  /**첫 화면으로 이동하는 함수 */
  const handleMoveHome = () => {
    navigate("/");
  }

  /**이동하는 함수 */
  const hadleNavigation = (location) => {
    handleClose();
    switch (location) {
      case 'login':
        navigate('/login')
        break;
      case 'register':
        navigate('/register')
        break;
      case 'chat_main':
        navigate('/')
        break;
      case 'chat_list':
        navigate('/list')
        break;
      case 'logout':
        authContext.dispatch({ type: 'logout' });
        localStorage.removeItem('jwt');
        navigate('/')
        break;
    }
  }

  const handleClose = () => {
    handleNavbar();
  }

  //메인화면에서 로고 없애기
  useEffect(() => {
    if (pathname === '/') {
      setIsLogo(false)
    } else {
      setIsLogo(true)
    }
  }, [pathname])

  return (
    <>
      <div className="nav_header">
        {isLogo ? <img src="/assets/images/logos/logo.svg" className="logo_img" onClick={handleMoveHome} /> : <div></div>}
        <span className="nav_menu_icon" onClick={handleNavbar}><Menu /></span>
      </div>
      {isNavbar && 
        <div>
          <div className="overlay" onClick={handleClose}></div>
          <nav className="nav_bar" ref={navRef} >
            <span className="nav_close_button" onClick={handleClose}><Close /></span>

            {auth ?
              <ul className="nav_list">
                <li className="nav_list_item" onClick={() => hadleNavigation('chat_main')}>메인</li>
                <li className="nav_list_item" onClick={() => hadleNavigation('chat_list')}>채팅 목록</li>
                <li className="nav_list_item nav_logout_text" onClick={() => hadleNavigation('logout')}>로그아웃</li>
              </ul>
              :
              <ul className="nav_list">
                <li className="nav_list_item" onClick={() => hadleNavigation('chat_main')}>메인</li>
                <li className="nav_list_item" onClick={() => hadleNavigation('login')}>로그인</li>
                <li className="nav_list_item" onClick={() => hadleNavigation('register')}>회원가입</li>
              </ul>
            }
            
          </nav>
        </div>
      }
    </>
  )
};

export default Nav;
