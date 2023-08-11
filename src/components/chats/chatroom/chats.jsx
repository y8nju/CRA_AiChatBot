import { useEffect } from "react";


const Chats = ({ data }) => {

  let { role: author } = data;
  let { content: talk } = data;
  let { timestamp } = data;

  if (author === 'assistant') {
    author = 'ai';
  }
  
  return (
    <div className={["chat_item", author].join(' ')}>
      <div className={`${author}_chatbox`}>
        <div className="chat">{talk}</div>
        {timestamp && <div className="time">
          <p>{new Intl.DateTimeFormat().format(new Date(timestamp))}</p>
          <p>{new Intl.DateTimeFormat('ko', { timeStyle: 'medium' }).format(new Date(timestamp))}</p>
        </div>}
      </div>
    </div>
  );
};

export default Chats;
