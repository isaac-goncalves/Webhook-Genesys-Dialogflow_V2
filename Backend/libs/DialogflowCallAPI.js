const {SessionsClient} = require('@google-cloud/dialogflow-cx');

async function detectIntentText(query, sessionId) {

  const projectId = "total-pad-356412";
  const location = "us-central1";
  const agentId = "4b6e8e2c-a64d-48f0-b1be-f5bf3452e8b6";
  const languageCode = "en";
  const client = new SessionsClient({
    apiEndpoint: "us-central1-dialogflow.googleapis.com",
  });

  const sessionPath = client.projectLocationAgentSessionPath(
    projectId,
    location,
    agentId,
    sessionId
  );
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
      },
      languageCode,
    },
  };
  const [response] = await client.detectIntent(request);
  return response
}

module.exports = {detectIntentText} 
