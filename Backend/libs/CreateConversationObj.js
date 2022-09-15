const platformClient = require("purecloud-platform-client-v2");

function createConversationObj(name) {
    console.log("Creating conversation object");

    const client = platformClient.ApiClient.instance;

    client.setEnvironment(platformClient.PureCloudRegionHosts.us_east_1); // Genesys Cloud region
  
    let apiInstance = new platformClient.WebChatApi();
  
    let params = {
      organizationId: "adb3e3ee-7bb4-4e2a-b754-178ff8fc359b",
      deploymentId: "be34dee8-c823-487b-98fe-2afa1f08de35",
      routingTarget: {
        targetType: "queue",
        targetAddress: "TESTE",
      },
      memberInfo: {
        displayName: name,
        avatarImageUrl: "http://some-url.com/JoeDirtsFace",
        lastName: name,
        firstName: name,
        email: "joe.dirt@example.com",
        phoneNumber: "+12223334444",
        customFields: {
          some_field: "arbitrary data",
          another_field: "more arbitrary data",
        },
      },
    }; // Object | CreateConversationRequest
  
    // Create an ACD chat conversation from an external
    return apiInstance
      .postWebchatGuestConversations(params)
      .then((data) => {
        
        return data;
      })
      .catch((err) => {
        console.log("There was a failure calling postWebchatGuestConversations");
        console.error(err);
      });
  }
  
  module.exports = { createConversationObj }