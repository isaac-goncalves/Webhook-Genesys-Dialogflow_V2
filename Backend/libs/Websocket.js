const WebSocket = require("ws");
const { Server } = require("socket.io");

const io = new Server(3002, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const { ActiveChats } = require('./ActiveChatsRepository');
const activeChats = ActiveChats.getInstance();

async function startWebsocket(eventStreamUri) {
    let clients = [new WebSocket(eventStreamUri)];
    clients.map((client) => {
        client.on("message", (buffer) => {
            handleWebSocketMessage(buffer.toString());
        });
    });
    return;
}

async function handleWebSocketMessage(jsonResponse) {
    msg = JSON.parse(jsonResponse);
    console.log("=====================WebsocketMessage================");
    console.log(msg); // resposta do websocket
    console.log("=====================================================");
    if (msg.topicName == "channel.metadata") {
        return;
    } else if (msg.metadata.type == "typing-indicator") {
        return;
    }
    else if (msg.eventBody.bodyType == "member-leave") {
        console.log("Member leave detected");
        const memberData = activeChats.findMemberData(msg.eventBody.conversation.id)
        console.log(memberData)
        if (memberData.memberId ===
            msg.eventBody.sender.id) {
            console.log("Memberid equals sender ID");

            activeChats.disableChatWithAgent(memberData.conversationId)

            message = "This Conversation has Ended";

            sendWebSocketMessage(
                message,
                memberData.webSocketInfo
            );

            message = "Resume_Conversation";
            // const response = await detectIntentText(message, activeChats[objIndex].sessionId);

            // console.log(
            //   `\n Current Page: ${response.queryResult.currentPage.displayName}`
            // );

            message = "Say Hi! if you want to start another conversation";

            sendWebSocketMessage(
                message,
                memberData.webSocketInfo
            );
        }
    }
    else if (msg.eventBody.bodyType == "standard") {
        if (msg.eventBody.conversation.id) {
            console.log("Message from Genesys Detected")
            const memberData = activeChats.findMemberData(msg.eventBody.conversation.id)
            console.log(memberData)
            if (
                memberData.memberId !==
                msg.eventBody.sender.id
            ) {
                sendWebSocketMessage(
                    msg.eventBody.body,
                    memberData.webSocketInfo
                );
            }
        }
    }
}

function sendWebSocketMessage(msg, socketId) {
    io.sockets.to(socketId).emit("receive_message", msg);
}

io.sockets.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("registerClient", (sessionId) => {
        console.log(socket.id);
        console.log(sessionId);

        activeChats.includeChat(sessionId, socket.id)

        const activeChatSearch = activeChats.findAllChats()
        console.log("New socketID resgistered!");
        console.log(activeChatSearch);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

module.exports = { startWebsocket, sendWebSocketMessage }