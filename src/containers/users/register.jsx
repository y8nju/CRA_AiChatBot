import { useEffect } from "react";
import { useState } from "react";
import { user_copys } from "libs/copys";
import { user_register } from "utils/users";
import Info from "components/commons/Info";
import { useNavigate } from "react-router-dom";
import { LayoutContext } from "context/layoutContext";
import { useContext } from "react";
const RegisterPage = () => {
  const navigate = useNavigate();
  const { handleSnackbar } = useContext(LayoutContext);

  const [userInfo, setUserInfo] = useState({
    userId: '',
    userName: '',
    userEmail: '',
    userBirthdate: ''
  });

  const [registerError, setRegisterError] = useState({
    userId: false,
    userName: false,
    userEmail: false,
    userBirthdate: false,
    userPassword: false
  });

  const [password, setPassword] = useState({
    password: '',
    passwordCheck: ''
  });

  //비밀번호 외 정보들
  const handleChange = (event) => {
    let { name, value } = event.target;

    setUserInfo((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  //비밀번호 검증
  const handlePasswordChange = (event) => {
    let { name, value } = event.target;
    setPassword((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  //submit 함수
  const handleSubmit = async (event) => {
    event.preventDefault();

    const hasErrors = Object.values(registerError).some((error) => error);
    const isStr = Object.values(userInfo).includes('');


    if (hasErrors || isStr) {
      return alert('회원가입 양식을 올바르게 작성해주세요.');
    } else {
      //console.log('Form submitted successfully!');
      let user_data = userInfo;
      user_data.userPassword = password.password;
      let birthYear = user_data.userBirthdate.slice(0, 4);
      let birthMon = user_data.userBirthdate.slice(4, 6);
      let birthDate = user_data.userBirthdate.slice(6, 8);
      user_data.userBirthdate = `${birthYear}-${birthMon}-${birthDate}`;
      try {

        let result = await user_register(user_data);
        //result 가 올바르면 navigate 해주기
        if (result.status === 201) {
          navigate('/login');
          return handleSnackbar({
            open: true,
            text: '회원가입에 성공하였습니다.'
          })
        } else {
          return alert('회원가입에 실패하였습니다. 정보를 다시 한번 확인해주시길 바랍니다.')
        }

      } catch (error) {
        return alert(error.message);
      }
    }
  };


  //조건검색
  useEffect(() => {
    // Function to check if a value is empty or not
    const isNotEmpty = (value) => value.trim() !== '';

    // 조건 1 ) 아이디 -> 영어로 6자 이상이어야 한다.
    setRegisterError((prev) => ({
      ...prev,
      userId: isNotEmpty(userInfo.userId) && (userInfo.userId.length < 6 || !/^[a-z0-9]+$/.test(userInfo.userId))
    }));

    // 조건 2 ) 비밀번호 -> 확인용 비밀번호와 같아야 하고, 8자 이상 특수문자 1개는 있어야 함.
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[\W_])(?=.*\d).{8,}$/;
    setRegisterError((prev) => ({
      ...prev,
      userPassword:
        isNotEmpty(password.password) &&
        isNotEmpty(password.passwordCheck) &&
        (!passwordRegex.test(password.password) || password.password !== password.passwordCheck)
    }));
    // 조건 3 ) 이름 -> 2자 이상
    setRegisterError((prev) => ({
      ...prev,
      userName: isNotEmpty(userInfo.userName) && userInfo.userName.length < 2
    }));
    // 조건 4 ) 생년월일 -> 8자 무조건 숫자
    setRegisterError((prev) => ({
      ...prev,
      userBirthdate: isNotEmpty(userInfo.userBirthdate) && (userInfo.userBirthdate.length !== 8 || !/^\d+$/.test(userInfo.userBirthdate))
    }));

    // 조건 5 ) 이메일 -> @가 들어간 조건식 
    setRegisterError((prev) => ({
      ...prev,
      userEmail: isNotEmpty(userInfo.userEmail) && !userInfo.userEmail.includes("@")
    }));
  }, [password.password, password.passwordCheck, userInfo.userBirthdate, userInfo.userEmail, userInfo.userId, userInfo.userName]);

  return <form type="submit" className="user_box" onSubmit={handleSubmit}>
    <h2 className="user_title">Register</h2>
    <div className="input_box">
      <input type="text"
        onChange={handleChange}
        name="userId"
        value={userInfo.userId}
        className="user_input"
        placeholder="아이디" />
      {registerError.userId ? 
        <Info type='error' text={user_copys.userid} />:
        <Info type='info' text='영어 6자 이상' />
      }

    </div>

    <div className="input_box">
      <input type="text"
        onChange={handleChange}
        name="userEmail"
        value={userInfo.userEmail}
        className="user_input"
        placeholder="메일주소" />
      {registerError.userEmail && <Info type='error' text={user_copys.mail} />}
    </div>
    <div className="input_box">
      <input type="password"
        autoComplete="new-password"
        className="user_input"
        name="password"
        onChange={handlePasswordChange}
        value={password.password}
        placeholder="비밀번호" />   
    </div>
    <div className="input_box">
      <input type="password"
        className="user_input"
        name="passwordCheck"
        onChange={handlePasswordChange}
        value={password.passwordCheck}
        placeholder="비밀번호 확인" />
      {registerError.userPassword ? 
        <Info type='error' text={user_copys.password} />:
        <Info type='info' text='8자 이상 특수문자 1개' />  
      }
    </div>
    <div className="input_box">
      <input type="text"
        onChange={handleChange}
        name="userName"
        value={userInfo.userName}
        className="user_input"
        placeholder="이름" />
      {registerError.userName && <Info type='error' text={user_copys.username} />}
    </div>
    <div className="input_box">
      <input type="text"
        onChange={handleChange}
        name='userBirthdate'
        value={userInfo.userBirthdate}
        className="user_input"
        placeholder="생년월일 8자리" />
      {registerError.userBirthdate ?
        <Info type='error' text={user_copys.birth} /> : 
        <Info type='info' text='대화 생성에 도움' />}
    </div>
    <button className="user_btn">회원가입</button>
  </form>;
};

export default RegisterPage;
