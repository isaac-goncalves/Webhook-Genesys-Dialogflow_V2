const fetch = require("node-fetch");

function sendGenesysMessage(conversationID, jwt, memberId, message, firstMessage) {
  console.log("Sending Genesys Message");

  console.log(conversationID);
  console.log("\n");
  console.log(jwt);
  console.log("\n");
  console.log(memberId);
  console.log("\n");
  console.log(message);
  console.log("\n");
  console.log(firstMessage);

  let messageBody;

  if (firstMessage == true) {
    messageBody = {
      body: message,
      bodyType: "standard | notice",
    };
  } else if (firstMessage == false) {
    messageBody = {
      body: message,
      bodyType: "standard",
    };
  }
  fetch(
    `https://api.mypurecloud.com/api/v2/webchat/guest/conversations/${conversationID}/members/${memberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageBody),
    }
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw Error(res.statusText);
      }
    })
    .then(async (jsonResponse) => {
      console.log(jsonResponse);
      // Start the first function
    })
    .catch((e) => console.error(e));
}

  module.exports = {sendGenesysMessage}