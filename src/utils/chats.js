import axios from "axios";
import { config } from "libs/config";
import * as FingerprintJS from "@fingerprintjs/fingerprintjs";

export async function getDeviceId() {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  console.log(result, '되라제발좀!')
  // //console.log(result.visitorId,'getdevice')
  return result.visitorId;
}

const dbName = 'talkie';
const storeName = 'talk';

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, 1);

    request.onupgradeneeded = event => {
      const db = event.target.result;
      db.createObjectStore(storeName, { keyPath: 'id' });
    };

    request.onsuccess = event => {
      const db = event.target.result;
      resolve(db);
    };

    request.onerror = event => {
      reject(event.target.error);
    };
  });
};

const fetchData = () => {
  return new Promise(async (resolve, reject) => {
    const db = await openDB();
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => {
      if (Array.isArray(request.result)) {
        if (request.result.length > 1) {
          for (let db of request.result) {
            if (db?.id === 'index') {
              resolve(db?.value);
            } else {
              resolve(null);
            }
          }
        } else {
          resolve(null);
        }
      }
    };

    request.onerror = error => {
      //console.log('Error fetching data', error);
      reject(error);
    };
  });
};

export async function saveIndexedDB(deviceId) {
  const db = await openDB();
  const newItem = { id: 'index', value: deviceId };

  const transaction = db.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);

  const request = store.add(newItem);

  request.onsuccess = () => {
    console.log('Data saved successfully');
  };

  request.onerror = error => {
    console.log('Error saving data', error);
  };
}

//**채팅방 생성
//client -> server
//1. 사용자 정보(토큰)
//2. personality

//server -> client
//1. 채팅방 정보(생성된 채팅방 아이디)
//2. ai 응답값 (텍스트)
async function babbleRoomLimit() {
  try {
    let result = await get_chatroom_list();
    let { babbles } = result.data;
    let limitNum = 10;
    if (babbles.length >= limitNum) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    return false;
  }
}


async function checkResponseStatus(targetUrl) {
  try {
    const response = await axios.get(config.baseUrl + targetUrl);
    //console.log(targetUrl)

    if (response.status === 200) {
      return true;
    } else if (response.status === 400) {
      return false;
    } else {
      // Handle other status codes if necessary
      return false;
    }
  } catch (error) {
    console.error('Error occurred while making the request:', error);
    return false;
  }
}

//10개 제한 걸기 limit: true =>  10개 제한 걸린거임 => alret!
export async function set_chatting_room(personality) {
  try {
    const token = localStorage.getItem('jwt');

    if (token) {
      let limit = await babbleRoomLimit();
      if (!limit) return { limit: true };

      const headers = { Authorization: `Bearer ${JSON.parse(token)}` }
      const response = await axios.post(config.baseUrl + config.urls.chats.set_chatting_room, personality, { headers: headers });
      return response;

    } else {
      const chk1 = await fetchData();
      const chk2 = localStorage.getItem('bear');
      let configUrl = config.urls.trials.get_trials;
      let targetUrl = configUrl.replace(":deviceId", chk2);
      const isChat = await checkResponseStatus(targetUrl);
      //console.log('isChat', isChat);

      if (chk1) {
        const response = await axios.post(config.baseUrl + config.urls.trials.set_trials, { ...personality, deviceId: chk1 ?? chk2 });
        return { ...response, limit: false };

      } else if (isChat) {

        const response = await axios.get(config.baseUrl + targetUrl);
        //console.log(config.baseUrl + targetUrl)
        //console.log(response);
        if (response.status === 200) {
          return response
        } else if (response.status === 404) {
          //console.log(response.status)
        }

      } else if (!isChat) {
        // const deviceId = localStorage.getItem('bear');
        const deviceId = await getDeviceId();
        const response = await axios.post(config.baseUrl + config.urls.trials.set_trials, { ...personality, deviceId: deviceId });
        saveIndexedDB(deviceId);
        localStorage.setItem('bear', deviceId);
        return { ...response, limit: false };
      }



    }
  } catch (error) {
    return error.message;
  }
}


//주고받은 채팅 목록
//client-> server
//1. 사용자 정보(토큰)
//2. 채팅방 정보(아이디)

//server-> client
//1. 지금까지 주고받은 채팅 목록(끊어서 받아와야할 듯?)
export async function get_chat(roomId) {

  //console.log('get_chat roomId', roomId)
  try {
    const token = localStorage.getItem('jwt');
    if (token) {
      const headers = { Authorization: `Bearer ${JSON.parse(token)}` }
      let configUrl = config.urls.chats.get_chat;
      let targetUrl = configUrl.replace(":roomId", roomId);
      const response = await axios.get(config.baseUrl + targetUrl, { headers: headers });
      return response;
    } else {
      // const deviceId = await getDeviceId();
      const deviceId = localStorage.getItem('bear')
      let configUrl = config.urls.trials.get_trials;
      let targetUrl = configUrl.replace(":deviceId", deviceId)
      const response = await axios.get(config.baseUrl + targetUrl);
      return response;
    }
  } catch (error) {
    return error.message;
  }
}


//채팅방 목록
//client -> server
//1. 사용자 정보(토큰)

//server -> client
//1. 채팅방 목록 (페이징처리로 할꺼면 페이지까지 보내줘야 함. !상의)
export async function get_chatroom_list() {
  try {
    const token = localStorage.getItem('jwt');
    const headers = { Authorization: `Bearer ${JSON.parse(token)}` };
    const response = await axios.get(config.baseUrl + config.urls.chats.get_chatting_room, { headers: headers });
    return response;
  } catch (error) {
    return error.message;
  }
}

//채팅 
//client-> server
//1. chat(blob) => content
//2. 사용자 정보(토큰)

//server->client
//1. ai 응답값 (스트링)
export async function set_chatting(chat_info, roomId) {
  try {
    const token = localStorage.getItem('jwt');
    if (token) {

      const headers = { Authorization: `Bearer ${JSON.parse(token)}` }
      const configUrl = config.urls.chats.set_chat;
      const targetUrl = configUrl.replace(":roomId", roomId);
      const response = await axios.post(config.baseUrl + targetUrl, chat_info, { headers: headers });
      return response;

    } else {
      // const deviceId = await getDeviceId();
      const deviceId = localStorage.getItem('bear')

      let configUrl = config.urls.trials.set_trials_chat;
      let targetUrl = configUrl.replace(":deviceId", deviceId);
      const response = await axios.post(config.baseUrl + targetUrl, chat_info);
      return response;
    }
  } catch (error) {
    return error.message;
  }
}


export const getSpeech = (text) => {
  let voices = [];

  //디바이스에 내장된 voice를 가져온다.
  const setVoiceList = () => {
    voices = window.speechSynthesis.getVoices();
  };

  setVoiceList();

  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    //voice list에 변경됐을때, voice를 다시 가져온다.
    window.speechSynthesis.onvoiceschanged = setVoiceList;
  }

  const speech = (txt) => {
    const lang = "ko-KR";
    const utterThis = new SpeechSynthesisUtterance(txt);

    utterThis.lang = lang;

    /* 한국어 vocie 찾기
      디바이스 별로 한국어는 ko-KR 또는 ko_KR로 voice가 정의되어 있다.
    */
    const kor_voice = voices.find(
      (elem) => elem.lang === lang || elem.lang === lang.replace("-", "_")
    );

    // //console.log(voices)
    //힌국어 voice가 있다면 ? utterance에 목소리를 설정한다 : 리턴하여 목소리가 나오지 않도록 한다.
    if (kor_voice) {
      utterThis.voice = kor_voice;
    } else {
      return;
    }

    //utterance를 재생(speak)한다.
    window.speechSynthesis.speak(utterThis);
  };

  speech(text);
};