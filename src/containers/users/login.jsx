import { useContext } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'styles/user.scss'
import { user_auth } from 'utils/users';
import { AccountContext } from 'context/userContext';
import { LayoutContext } from 'context/layoutContext';

const LoginPage = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const authContext = useContext(AccountContext);
  const navigate = useNavigate();
  const { handleSnackbar } = useContext(LayoutContext);
  
  const handleChange = (event) => {
    let { name, value } = event.target;
    switch (name) {
      case 'userId':
        setUserId(value);
        break;
      case 'password':
        setPassword(value);
        break;
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (userId && password) {
      let userData = new Object();
      userData.userId = userId;
      userData.userPassword = password;
      try {
        //로그인 시 서버에서 보내준 토큰 정보 
        let result = await user_auth(userData);
        //로그인 성공 시 챗 메인화면으로 네비게이트!
        if (result.status === 200) {
          //로컬스토리지에 저장, auth reducer에 저장
          let { data } = result;
          localStorage.setItem('jwt', JSON.stringify(data.access_token));
          authContext.dispatch({ type: 'login', payload: data.access_token });
          navigate('/');
          return handleSnackbar({
            open: true,
            text: '어서오세요'
          })
        }else{
          return alert('로그인에 실패하였습니다. 로그인 정보를 다시 한번 확인해주시길 바랍니다.')
        }

      } catch (error) {
        return alert(error.message)
      }
    }
  }

  return <form type="submit" className="user_box" onSubmit={handleSubmit}>
    <h2 className="user_title">Login</h2>
    <input
      type="text"
      name="userId"
      onChange={handleChange}
      className="user_input"
      placeholder='아이디' />
    <input
      type="password"
      name="password"
      autoComplete="new-password"
      onChange={handleChange}
      className="user_input"
      placeholder='비밀번호' />
    <button className="user_btn">로그인</button>
  </form>;
};

export default LoginPage;
