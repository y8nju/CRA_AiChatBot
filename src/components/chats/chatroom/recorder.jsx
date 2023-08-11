import { useState } from "react";
import AudioAnalyser from 'react-audio-analyser';
import RecordingBtn from "components/chats/chatroom/recordBtn";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useEffect } from "react";
import { set_chatting } from "utils/chats";
import { useParams } from "react-router-dom";
import { getSpeech } from "../../../utils/chats";

const Recorder = ({ onReload, customerLimit, startChat }) => {
    //console.log(startChat,'startChat!')
    useEffect(() => {
        window.speechSynthesis.getVoices();
    }, []);

    const {
        transcript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();
    const { roomId } = useParams();
    const [status, setStatus] = useState("");
    const [transcriptStr, setTranscriptStr] = useState(startChat ? startChat : "");

    async function setBabble() {
        try {
            let voiceContent = new Object();
            voiceContent.content = transcriptStr;
            let result = await set_chatting(voiceContent, roomId);
            onReload();
            //console.log(result, '<= voice chat 보내면 오는 응답');

            // 응답 tts 출력
            getSpeech(result.data.content);

        } catch (error) {
            //console.log(error)
        }
    }

    useEffect(() => {
        if (transcriptStr) {
            setBabble();
        }
    }, [startChat])

    const handleRecording = (status) => {
        setStatus(status);
        switch (status) {
            case "recording":
                SpeechRecognition.startListening({ language: 'ko' });
                break;
            case "inactive":
                SpeechRecognition.stopListening();
                setTranscriptStr(transcript);
                break;
        }
    };

    if (!browserSupportsSpeechRecognition) {
        return alert('이 브라우저는 지원이 되지 않습니다.')
    }

    const audioProps = {
        audioType: 'audio/webm',
        status,
        // audioSrc, // 녹음 종료시 반환되는 audioSrc에 대하여 audio 태그 보여줌
        timeslice: 1000,
        // 레코딩 시작 이벤트
        backgroundColor: 'transparent',
        strokeColor: status === 'recording' ? '#f4433640' : 'transparent',
        width: status === 'recording' ? 200 : 0,
        height: 50,
        startCallback: (e) => {
            //console.log("succ start", e);
        },
        // 레코딩 일시정지 이벤트 (status: 'paused')
        pauseCallback: (e) => {
            //console.log("succ pause", e);
        },
        // 레코딩 중지 이벤트 
        stopCallback: (e) => {
            // setAudioSrc(window.URL.createObjectURL(e));
            //console.log("succ stop", e);
            if (transcriptStr) {
                setBabble();
            }
        },
        // 레코딩 되는 동안 발생하는 이벤트
        // onRecordCallback: (e) => {
        //     //console.log("recording", e);
        // },
        // 레코딩 중 에러 처리 이벤트
        errorCallback: (err) => {
            //console.log("error", err);
        },
    };

    return (
        <div className="recorderWrap">
            {/* <p>Microphone: {listening ? 'on' : 'off'}</p> */}
            <div className="btn_wrap">
                <RecordingBtn status={status} controlAudio={handleRecording} customerLimit={customerLimit} />
            </div>
            <AudioAnalyser {...audioProps}>
            </AudioAnalyser>
        </div>
    );
};

export default Recorder;

