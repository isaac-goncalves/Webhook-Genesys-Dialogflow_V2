import React, { Component, Fragment, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatHead from "./components/ChatHead";
import Message from "./components/Message";
import ChatFooter from "./components/ChatFooter";
import io from "socket.io-client";
import GlobalStyle from "./GlobalStyle";
import { Container, ChatContainer, ChatBody } from "./elements";

const socket = io.connect("http://localhost:3002"); //ss

function randomName() {
  const adjectives = [
    "Maria",
    "Gustavo",
    "Silvio",
    "Pedro",
    "Luís",
    "Tomás",
    "Augusto",
  ];
  const nouns = [
    "Ferreira",
    "Martins",
    "Sousa",
    "Francisco",
    "Lopes",
    "Mendes",
    "Correia",
    "Costa",
    "Fonseca",
    "Rodrigues",
  ];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective} ${noun}`;
}

var messages = [];

//message format { userId: 2, message: "teste de mensagem" }

function getQuote(data) {
  // for (var i = 0; i <= numberMessages; i++) {
  //   var randomNounIndex = Math.floor(Math.random() * nouns.length);
  //   var randomAdjectiveIndex = Math.floor(Math.random() * adjectives.length);
  //   var retVal =
  //     i % 2 === 0
  //       ? `The ${nouns[randomNounIndex]} is ${adjectives[randomAdjectiveIndex]} and
  //                   ${nouns[randomNounIndex]} is ${adjectives[randomAdjectiveIndex]} and
  //                   ${nouns[randomNounIndex]} is ${adjectives[randomAdjectiveIndex]}`
  //       : `${nouns[randomNounIndex]} is ${adjectives[randomAdjectiveIndex]}`;

  // }
  console.log(messages);
  return messages;
}

class App extends Component {
  componentDidMount() {
    this.scrollToBottom();
    console.log("The component has mounted successfully!");

    

    socket.on("receive_message", (message) => {
      // messages.push({ userId: 2, message: data });
      // console.log(data);wdawd
      console.log(message);
      this.setState((prevState) => {
        const newMessage = { userId: 2, message: message };
        return {
          messages: [...prevState.messages, newMessage],
        };
      });
    });
  }

  state = {
    sessionId: uuidv4(),
    name: randomName(),
    messages: messages,
    toggleChat: false,
  };

  fistMessage = true

  messagesEndRef = React.createRef();

    
  componentDidUpdate() {
    this.scrollToBottom();
  }
  scrollToBottom = () => {
    this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  onSubmitMessage = async (msg) => {
    
    if(this.fistMessage){
      this.fistMessage = false
      await socket.emit("registerClient", this.state.sessionId )
    }

    console.log(
      JSON.stringify({
        message: msg,
        name: this.state.name,
      })
    );
    const params = {
      message: msg,
      name: this.state.name,
      sessionId: this.state.sessionId
    };

      fetch("http://localhost:4000/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((json) => console.log(json));

    this.setState((prevState) => {
      const newMessage = { userId: 1, message: msg };
      return {
        messages: [...prevState.messages, newMessage],
      };
    });
  };

  handleToggle = () => {
    this.setState({ toggleChat: !this.state.toggleChat });
  };

  render() {
    return (
      <Fragment>
        <GlobalStyle />
        <Container>
          <ChatContainer toggle={this.state.toggleChat}>
            <ChatHead
              name={this.state.name}
              toggle={this.state.toggleChat}
              onClick={this.handleToggle}
            />
            <ChatBody toggle={this.state.toggleChat}>
              <Message messages={this.state.messages} />
              <div ref={this.messagesEndRef} />
            </ChatBody>
            <ChatFooter
              toggle={this.state.toggleChat}
              onSubmitMessage={this.onSubmitMessage}
            />
          </ChatContainer>
        </Container>
      </Fragment>
    );
  }
}

export default App;
