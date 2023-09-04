import {
  Background,
  CContainer,
  CMessages,
  InputArea,
  Contact,
  CItem,
  CInput,
  MessageArea,
  Options,
  JoinButton,
  LoginContainer,
  LoginContent,
  Main,
  LastMessage,
  Message,
  MessageContainer,
  ProfileImg,
  SendMessage,
  SendMessageContainer,
  TitleChatContainer,
  TitleMessage,
  UserNameInput
} from "./App-style";
import ImagemPf from './assets/profissao-programador_f801491a16284b568c89f23520ea8679.jpg'
import Send from './assets/send_4febd72a71c34f3c9c99e5536d44887e.png'
import socket from 'socket.io-client'
import { useEffect, useState, useRef } from "react";

const io = socket('http://localhost:4000');

function App() {

  const [userName, setUserName] = useState('');
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [myID, setMyID] = useState('');

  useEffect(() => {
    io.on("users", (users) => {
      setUsers(users);
    })
    io.on("message", (message) => setMessages((messages) => [...messages, message]));
    io.on("connect", () => setMyID(io.id))
  }, [])

  const handleJoin = () => {
    if(userName) {
      io.emit("join", userName);
      setJoined(true);
    }
  }

  
  const textAreaRef = useRef(null);
  
  const handleTextareaChange = () => {
    
    const content = textAreaRef.current.value;

    if (content.includes('\n')) {
      const textarea = textAreaRef.current;
      textarea.style.height = 'auto'; 
      textarea.style.height = `${textarea.scrollHeight}px`; 
    }
  };


  const handleMessage = () => {
    if(message.trim()) {
      io.emit("message", {message, userName});
      setMessage('');
      if (textAreaRef.current) {
        textAreaRef.current.focus()
      }
    }
  }

  if(!joined) {
    return (
      <LoginContainer>
        <LoginContent>
          <UserNameInput 
            placeholder="Digite o seu nome"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <JoinButton onClick={handleJoin}>Entrar</JoinButton>
        </LoginContent>
      </LoginContainer>
    )
  }

  let lastMessage = {};
  if (messages.length > 0) {
    lastMessage = messages[messages.length - 1];
  }

  return (
   <Main>
    <Background></Background>
    <ChatContainer>

      <ChatContacts>
        <ChatOptions></ChatOptions>
        <ChatItem>
          <ProfileImg alt="Image" src={ImagemPf} />
          <TitleChatContainer>
            <TitleMessage>NetWorking Profissão Programador</TitleMessage>
            <LastMessage>{lastMessage.userName}: {lastMessage.message}</LastMessage>
          </TitleChatContainer>
        </ChatItem>
      </ChatContacts>

      <ChatMessages>
        <ChatOptions>
        <ChatItem>
          <ProfileImg alt="Image" src={ImagemPf} />
          <TitleChatContainer>
            <TitleMessage>NetWorking Profissão Programador</TitleMessage>
            <LastMessage>
             {users.map((user, index) => (
              <span key={index}> 
              {user.userName}{index + 1 < users.length && users.length !== 0? ', ' : ''}
              
              </span>
             ))}
            </LastMessage>
          </TitleChatContainer>
        </ChatItem>
        </ChatOptions>

        <ChatMessagesArea>
          {messages.map((message, index) => (
            <MessageContainer
            key={index}
            myMessage={message.userID === myID}
            >
              <Message 
                myMessage={message.userID === myID}
              >
                {message.userName? `${message.userName}: ` : ''} {message.message}
              </Message>
            </MessageContainer>
          ))}
        </ChatMessagesArea>

        <ChatInputArea>
          <ChatInput 
            placeholder="Mensagem"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              handleTextareaChange()
            }}
            onKeyDown={(e) => {
              if (e.key === "Enviar") {
                e.preventDefault();
                handleMessage();
              }
            }}
            ref={textAreaRef}
            currentHeight={textAreaRef.current ? textAreaRef.current.scrollHeight : 0}
          />
          <SendMessageContainer>
            <SendMessage alt="Enviar" src={Send} onClick={() => handleMessage()}/>
          </SendMessageContainer>
        </ChatInputArea>

      </ChatMessages>

    </ChatContainer>
   </Main>
  );
}

export default App;
