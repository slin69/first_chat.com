var app=require('express')(); var http=require('http').Server(app);
var io = require('socket.io')(http);
var prompt = require('prompt');
var name="none"
prompt.start();
var users=new Set();
var users_id=new Set();
app.get("/",function(req,res) {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection",function(socket){
    socket.on('message', (message) =>     {
        var input=message['message']
        var username=message['username']
        console.log(username)
        users_id.add(socket)
        users.add(username);
        //console.log(users)
        console.log(`${username}: ${message}`);
        //users.append(username);
        msg={
            "users":users_id.size,
            "username":username,
            "message":input
        }
        console.log(JSON.stringify(msg['users']))
        io.emit('message',msg);
  
    });
    function arrayRemove(arr, value) { 
    
        return arr.filter(function(ele){ 
            return ele != value; 
        });
    }
    console.log("a user connected");
    io.emit("a user connected");
    socket.on("disconnect",function(){
        /*users_id.splice(0,users_id.indexOf(socket));
        users.splice(0,users.indexOf(users_id[socket]))*/
        users_id.delete(socket)
        console.log(users_id.size)
        msg={
            "users":users.size
        }
        io.emit("message",msg)
        var users_l=Array.from(users)
        var users_idl=Array.from(users_id)
        users_l.splice(0,1)
        console.log(users_l.length)


        console.log("user disconnected");
    });
});

http.listen(8080,function(){
    console.log("waiting for users to join");

});