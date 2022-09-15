class ActiveChats { 
    constructor() {
        this.activeChats = [];
    }

    static getInstance() {
        if (!ActiveChats.instance) {
            console.log("\n============ActiveChats Instance Created========\n")
            ActiveChats.instance = new ActiveChats()
        }        
        return ActiveChats.instance
    }

    includeChat(sessionId, socketId) {
        this.activeChats.push({
            sessionId: sessionId,
            webSocketInfo: socketId,
            name: "",
            messageHistory: [],
            chatWithAgent: false,
            genesysSessionData: { conversationId: "", memberId: "" },
        });
        console.log(this.activeChats);
    }
    
    findChat(sessionId) {
        const objIndex = this.activeChats.findIndex((obj) => obj.sessionId == sessionId);
        if (objIndex == -1) {
            return "NOT FOUND"
        }
        return this.activeChats[objIndex]
    }

    findAllChats() {
        return this.activeChats
    }

    setName(sessionId, name) {
        console.log(sessionId, name)
        const objIndex = this.activeChats.findIndex((obj) => obj.sessionId == sessionId);
        if (objIndex == -1) {
            return "NOT FOUND"
        }
        this.activeChats[objIndex].name = name;
    }

    setHistory(sessionId, currentMessage) {
        const objIndex = this.activeChats.findIndex((obj) => obj.sessionId == sessionId);
        if (objIndex == -1) {
            return "NOT FOUND"
        }
        this.activeChats[objIndex].messageHistory.push(currentMessage);
    }

    getHistory(sessionId) {
        const objIndex = this.activeChats.findIndex((obj) => obj.sessionId == sessionId);
        return this.activeChats[objIndex].messageHistory
    }

    getWeksocketinfo(sessionId) {
        const objIndex = this.activeChats.findIndex((obj) => obj.sessionId == sessionId);
        return this.activeChats[objIndex].webSocketInfo
    }

    setGenesysSessionData(sessionId, conversationId, jwt, memberId, eventStreamUri) {
        const objIndex = this.activeChats.findIndex((obj) => obj.sessionId == sessionId);
        this.activeChats[objIndex].chatWithAgent = true;
        this.activeChats[objIndex].genesysSessionData = {
            conversationId,
            jwt,
            memberId,
            eventStreamUri,
        }

    }

    getGenesysSessionData(sessionId) {
        const objIndex = this.activeChats.findIndex((obj) => obj.sessionId == sessionId);
        const genesysData = {
            conversationId: this.activeChats[objIndex].genesysSessionData.conversationId,
            jwt: this.activeChats[objIndex].genesysSessionData.jwt,
            memberId: this.activeChats[objIndex].genesysSessionData.memberId
        }
        return genesysData
    }

    findMemberData(conversationId) {
        const objIndex = this.activeChats.findIndex((obj) => obj.genesysSessionData.conversationId == conversationId);
        const memberData = {
            memberId: this.activeChats[objIndex].genesysSessionData.memberId,
            conversationId: this.activeChats[objIndex].genesysSessionData.conversationId,
            webSocketInfo: this.activeChats[objIndex].webSocketInfo,
        }
        return memberData
    }

    disableChatWithAgent(conversationId) {
        const objIndex = this.activeChats.findIndex((obj) => obj.genesysSessionData.conversationId == conversationId);
        this.activeChats[objIndex].chatWithAgent = false;
    }

}

module.exports = { ActiveChats }