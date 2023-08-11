

export const config = {
  baseUrl: process.env.REACT_APP_SERVER_URL, 
  urls: {
    users: {
      auth_user: '/api/users/auth', //유저 로그인 (Get) //userId=<userId>&userPassword=<userPassword>
      set_user: '/api/users/new', //유저 회원가 (Post)
      get_user:'', // 유저 정보 가져오기-> 토큰
      token_valid:'/api/users/private' //토큰 유효성검사(Get) //Authorization : token 보내기
    },
    chats:{
      get_chat:'/api/babbles/:roomId', //채팅 목록(Get)
      set_chat:'/api/babbles/:roomId', //1건의 채팅 넘기기(Post) // body -> Ex) content:'안녕?'
      get_chatting_room:'/api/babbles', //채팅방 목록(Get)
      set_chatting_room:'/api/babbles', //채팅방 생성(Post) : body -> ex) personality: 사춘기 10살 소녀
     
    },
    trials:{
      set_trials:'/api/trials', // 체험판 생성(Post)
      get_trials:'/api/trials/:deviceId', //체험판 기록 확인하기(Get)
      set_trials_chat:'/api/trials/:deviceId' //체험판 대화하기(Post)
    }
  }
}