import { createContext, useEffect, useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { decodeToken, isExpired } from "react-jwt";
import { token_valid } from 'utils/users.js';

export const AccountContext = createContext();

function accountReducer(state = null, action) {
  switch (action.type) {
    case 'login':
      return action.payload;
    case 'logout':
      return null;
  }
}


export function AccountContextProvider({ children }) {
  const [auth, dispatch] = useReducer(accountReducer, null); //auth 값 -> token
  //유저관리합시다.
  useEffect(() => {
    handleAuthCheck();
  }, [])

  // // ** 로컬스토리지에 토큰 존재
  // const handleTokenValie = async (jwt) => {

  //   const TokenExpired = isExpired(jwt);
  //   //1. (토큰) 만료됐는지 검증

  //   if (!TokenExpired) { //2. 만료가 안됐으면 바로 auth에 때려넣기
  //     dispatch({ type: 'login', payload: jwt });

  //   } else { //2. 토큰 기간 만료 됐으면 서버에서 토큰 검증 및 새로 발급 받기
  //     //console.log('token is expired');

  //     try {
  //       const authRst = await token_valid(jwt); //서버에 토큰 날려주기

  //       switch (authRst) {
  //         case true: //3. 토큰 발급 정상처리 => auth & localStorage에 넣어주기
  //           localStorage.setItem('jwt', authRst.data.token);
  //           dispatch({ type: 'login', payload: authRst.data.token });
  //           break;

  //         case false://3. 토큰 발급 비정상처리 => 다시 로그인 / 로컬스토리지에 있는 토큰 삭제
  //           alert('세션이 만료되었습니다. 다시 로그인해주시길 바랍니다.');
  //           localStorage.removeItem('jwt');
  //           navigate('/');
  //           break;

  //         default:
  //           break;
  //       }
  //     } catch (error) {
  //       return alert(error.message);
  //     }

  //   }
  // }

  //1. 로그인 페이지에서 로컬스토리지에 저장 & auth 에 저장했음.
  const handleAuthCheck = () => {
    try {
      //console.log('auth-check-!')
      //2. 마운트 될 때 로컬스토리지에 있는 토큰 가져와서
      const jwt = localStorage.getItem("jwt");
      if (jwt) { // 3. 로컬스토리지에 토큰 존재
         dispatch({ type: 'login', payload: JSON.parse(jwt) }); 
         //만료기간이 설정 X -> 그냥 로그인 때려버리기
      }

    } catch (error) {
      return alert(error.message);
    }
  };


  return (
    <AccountContext.Provider value={{ auth, dispatch }}>
      {children}
    </AccountContext.Provider>
  )
}