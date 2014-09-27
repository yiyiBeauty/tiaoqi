var roomID;
var playerID;
var ChessServer = {
    onConnect:function(){
    },
    onBroadcast:function(json){
    },
    onMessage:function(json){
    },
    socketUrl:"http://www.5igame.cc",//服务器地址

    socketConnect:function(){//建立websocket连接
        socket = io.connect(ChessServer.socketUrl);
        socket.on('connected',function(){
            console.log("connected now");
            ChessServer.onConnect();
        });
        socket.on('broadcast', function(json){
            console.log("broadcast" + JSON.stringify(json));
            ChessServer.onBroadcast(json);
        });
        socket.on('message',function(json){
            console.log("Message: " + JSON.stringify(json));
            ChessServer.onMessage(json);
        });
        socket.on('createRoomRsp', function(data){
            console.log("createRoomRsp: " + JSON.stringify(data));
            roomID = data.roomID;
            playerID = data.playerID;
            ChessServer.onCreateRoomRsp(roomID,playerID);
        });
        socket.on('joinRoomRsp', function(data){
            console.log("joinRoomRsp: " + JSON.stringify(data));
            roomID = data.roomID;
            playerID = data.playerID;
            ChessServer.onJoinRoomBroadcast(data.roomID,parseInt(data.peopleNum),data.playerID,data.allPlayerID);
        });
        socket.on('joinRoomBroadcast', function(data){
            console.log("joinRoomBraodcast", JSON.stringify(data));
            ChessServer.onJoinRoomBroadcast(data.roomID,parseInt(data.peopleNum),data.playerID,data.allPlayerID);
        });
        socket.on('leaveRoomBroadcast', function(data){
            console.log("leaveRoomBraodcast", JSON.stringify(data));
            ChessServer.onLeaveRoomBroadcast(data.roomID,data.playerID,data.allPlayerID);
        });
        socket.on('eventHappenRsp', function(data){
            console.log("eventHappenRsp", JSON.stringify(data));
            ChessServer.onEventHappenRsp(data.roomID,data.playerID,data.result);
        });
        socket.on('eventHappenBroadcast', function(data){
            console.log("eventHappenBroadcast", JSON.stringify(data));
            ChessServer.onEventHappenBroadcast(data.roomID,data.playerID,data.moreInfo);
        });
        var finishFunc = function(data){
            console.log("finish", JSON.stringify(data));
            ChessServer.onFinishRoomRsp(data.roomID,data.playerID);
        };
        socket.on("finishRoomRsp", finishFunc);
        socket.on("finishRoomBroadcast", finishFunc);
    },
    createRoom: function(peopleNum){
        console.log("Send createRoom Req");
        socket.emit("createRoomReq", {peopleNum: parseInt(peopleNum)});
    },
    onCreateRoomRsp:function(roomID,playerID){
        alert("createRoomRsp: "+"roomID="+roomID+", playerID="+playerID);
    },
    joinRoom: function(roomID){
        console.log("Send joinRoom Req");
        socket.emit("joinRoomReq", {roomID: roomID});
    },
    onJoinRoomRsp:function(roomID,peopleNum,playerID,allPlayerID){
        alert("createRoomRsp: roomID="+roomID+", peopleNum="+peopleNum+", playerID="+playerID+", allPlayerID="+allPlayerID);
    },
    onJoinRoomBroadcast:function(roomID,peopleNum,playerID,allPlayerID){
        alert("onJoinRoomBroadcast: roomID="+roomID+", peopleNum="+peopleNum+", playerID="+playerID+", allPlayerID="+allPlayerID);
    },
    onLeaveRoomBroadcast:function(roomID,playerID,allPlayerID){
        alert("onLeaveRoomBroadcast: roomID="+roomID+", playerID="+playerID+", allPlayerID="+allPlayerID);
    },
    eventHappen: function(obj){
        console.log("event happen Req");
        socket.emit("eventHappenReq", {
            roomID: roomID,
            playerID: playerID,
            moreInfo: obj
        });
    },
    onEventHappenRsp:function(roomID,playerID,result){
        alert("onEventHappenRsp: roomID="+roomID+", playerID="+playerID+", result="+result);
    },
    onEventHappenBroadcast:function(roomID,playerID,moreInfo){
        alert("onEventHappenBroadcast: roomID="+roomID+", playerID="+playerID+", moreInfo="+moreInfo);
    },
    finishRoom: function(roomID){
        console.log("finish Room Req");
        socket.emit("finishRoomReq", {roomID: roomID, playerID: playerID});
    },
    onFinishRoomRsp:function(roomID,playerID){
        console.log("onFinishRoomRsp");
        alert("Winner is " + playerID + " in room: " + roomID);
    }
};
