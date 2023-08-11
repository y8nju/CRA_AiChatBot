import axios from "axios";
import { config } from "libs/config";

//로그인
//client -> server
//1. userId
//2. userPassword

//server -> client
//1. 토큰
export async function user_auth(user_info) {
  try {
    const response = await axios.get(config.baseUrl + config.urls.users.auth_user, {
      params : 
      user_info
    });
      
    //response => access_token
    return response;
  } catch (error) {
    return error.message;
  }
}

//회원가입
//client-> server
//1. userId
//2. userPassword
//3. userEmail
//4. userName
//5. userBirthdate : 숫자8자리
export async function user_register(user_info) {
  try {
    const response = await axios.post(config.baseUrl + config.urls.users.set_user, user_info);
    return response;
  } catch (error) {
    return error.message;
  }
}

//토큰 유효성 검사
//client -> server
//사용자 정보 (토큰)
export async function token_valid() {
  try {
    let token = JSON.parse(localStorage.getItem('jwt'))
    const headers = { Authorization: `Bearer ${token}` }
    const response = await axios.get(config.baseUrl + config.urls.users.token_valid, { headers: headers });
    return response;
  } catch (error) {
    return error.message;
  }
}