import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import StopRoundedIcon from "@material-ui/icons/StopRounded";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom'


// eslint-disable-next-line react/prop-types
const RecordingBtn = ({status, controlAudio, customerLimit}) => {
  const navigate = useNavigate();

  useEffect(()=>{
    requestMicrophonePermission();
  },[])


  async function requestMicrophonePermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      //console.log("마이크 권한 획득 성공", stream);
    } catch (error) {
      console.error("마이크 권한 획득 실패", error);
      navigate('/')
    }
  }

  return <div className="recording_btn_box">
    
  {customerLimit ? (
      <i className="limitBtn"></i>
    ) : (
      status !== "recording" ? (
        <FiberManualRecordIcon 
          onClick={() => controlAudio("recording")}
          className="recordingIcon" />
      ) : (
        <StopRoundedIcon
          onClick={() => controlAudio("inactive")}
          className="recordingIcon" />
      )
    )}
  </div>;
};

export default RecordingBtn;
