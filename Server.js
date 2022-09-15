const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
var jsonParser = bodyParser.json();

const { detectIntentText } = require("./Backend/libs/DialogflowCallAPI");
const { sendGenesysMessage } = require('./Backend/libs/SendGenesysMessage');
const { createConversationObj } = require('./Backend/libs/CreateConversationObj');
const { startWebsocket, sendWebSocketMessage } = require("./Backend/libs/Websocket")

const { ActiveChats } = require('./Backend/libs/ActiveChatsRepository');
const activeChats = ActiveChats.getInstance();

app.use(bodyParser.json());

app.use("/message", async (request, response) => {
  console.log("===================Start======================");
  console.log("We got a hit @ " + new Date() + "\n");

  const { sessionId } = request.body;
  const { message } = request.body;
  const { name } = request.body;

  const currentdate = new Date();
  const currentMessage =
    "CLIENTE(" +
    currentdate.getDate() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getFullYear() +
    " " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds() +
    "): " +
    message;

  console.log(
    "Name: " +
    name +
    "\n" +
    "Message: " +
    message +
    "\n" +
    "SessionID: " +
    sessionId +
    "\n"
  );

  if (name == undefined || message == undefined || sessionId == undefined) {
    console.log("primeiro request descartado");
    console.log("===================End======================");
    return response.status(200).json({ message: "Empty request!" });

  } else {
    activeChats.setName(sessionId, name)

    activeChats.setHistory(sessionId, currentMessage)

    console.log(activeChats);
  }

  activeChat = activeChats.findChat(sessionId);

  if (activeChat == "NOT FOUND") {
    console.log("User not Found!")
    return
  }

  messageHandler(activeChat, message);

  console.log("===================End======================");
  return response.status(200).json({ message: "Message received!" });
});

async function messageHandler(activeChat, message) {
  const { sessionId } = activeChat;
  const { name } = activeChat;
  const { chatWithAgent } = activeChat;

  if (chatWithAgent == false) {
    const response = await detectIntentText(message, sessionId);
    for (const message of response.queryResult.responseMessages) {
      if (message.text) {
        console.log(`Agent Response: ${message.text.text}`);

        const currentdate = new Date();
        const currentMessage =
          "AGENTE(Dialogflow)(" +
          currentdate.getDate() +
          "/" +
          (currentdate.getMonth() + 1) +
          "/" +
          currentdate.getFullYear() +
          " " +
          currentdate.getHours() +
          ":" +
          currentdate.getMinutes() +
          ":" +
          currentdate.getSeconds() +
          "): " +
          message.text.text;

        activeChats.setHistory(sessionId, currentMessage)

        const getWeksocketInfoData = activeChats.getWeksocketinfo(sessionId)

        sendWebSocketMessage(
          message.text.text,
          getWeksocketInfoData
        );
      }
    }

    console.log(
      `\n Current Page: ${response.queryResult.currentPage.displayName}`
    );

    if (response.queryResult.match.intent) {
      console.log(
        `Matched Intent: ${response.queryResult.match.intent.displayName}`
      );
      if (response.queryResult.match.intent.displayName == "Yes_agentRequest") {
        const chatInfo = await createConversationObj(name);

        const conversationID = chatInfo.id;
        const jwt = chatInfo.jwt;
        const memberId = chatInfo.member.id;
        const eventStreamUri = chatInfo.eventStreamUri;

        activeChats.setGenesysSessionData(sessionId, conversationID, jwt, memberId, eventStreamUri);

        await startWebsocket(eventStreamUri);

        const firstMessage = true;

        const messageHistoryData = activeChats.getHistory(sessionId)

        console.log(messageHistoryData)

        let messageHistory = messageHistoryData.join("\n");

        setTimeout(() => {
          sendGenesysMessage(conversationID, jwt, memberId, messageHistory, firstMessage);
        }, 2000);
      }
    }
  } else if (chatWithAgent == true) { //envia mensagem para a Genesys caso o usuário esteja conversando com agente
    let firstMessage = false;
    const { conversationId, jwt, memberId } = activeChats.getGenesysSessionData(sessionId)

    sendGenesysMessage(
      conversationId,
      jwt,
      memberId,
      message,
      firstMessage
    );
  }
}

app.listen(4000, () => {
  console.log("server is Running on 4000");
});
