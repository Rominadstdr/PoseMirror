// ==========================================
// PoseMirror Server
// ==========================================

const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"*"
    }
});

app.use(
    express.static(
        path.join(__dirname,"public")
    )
);


// ==========================================
// Rooms
// ==========================================

const rooms = {};


// ==========================================
// Generate 4 Digit Code
// ==========================================

function generateCode(){

    let code;

    do{

        code = Math.floor(
            1000 +
            Math.random()*9000
        ).toString();

    }while(rooms[code]);

    return code;

}


// ==========================================
// Delete Room
// ==========================================

function deleteRoom(code){

    if(!rooms[code]) return;

    delete rooms[code];

    console.log(
        "Room Deleted:",
        code
    );

}


// ==========================================
// Find User Room
// ==========================================

function findRoom(socketId){

    for(const code in rooms){

        const room = rooms[code];

        if(
            room.camera === socketId ||
            room.viewer === socketId
        ){

            return code;

        }

    }

    return null;

}
// ==========================================
// Socket Connection
// ==========================================

io.on("connection",(socket)=>{

    console.log(
        "User Connected:",
        socket.id
    );



    // ==========================================
    // Camera Ready
    // ==========================================

    socket.on("camera-ready",()=>{

        const code =
        generateCode();

        rooms[code]={

            camera:socket.id,

            viewer:null

        };

        socket.emit(
            "room-code",
            code
        );

        console.log(
            "Room Created:",
            code
        );

    });

    //
    // Refresh Button
    //
    socket.on("refresh-room",(oldCode)=>{

    const oldRoom = rooms[oldCode];

    if(!oldRoom) return;

    if(oldRoom.camera !== socket.id) return;

    delete rooms[oldCode];

    const newCode = generateCode();

    rooms[newCode] = {

        camera: socket.id,

        viewer: null

    };

    socket.emit("room-code",newCode);

    });

    // ==========================================
    // Viewer Join
    // ==========================================

    socket.on("join-room",(code)=>{

        const room =
        rooms[code];

        if(!room){

            socket.emit(
                "invalid-code"
            );

            return;

        }

        if(room.viewer){

            socket.emit(
                "room-full"
            );

            return;

        }

        room.viewer =
        socket.id;

        socket.emit(
            "joined-room",
            code
        );

        io.to(room.camera)
        .emit(
            "viewer-ready"
        );

        console.log(
            "Viewer Joined:",
            code
        );

    });



    // ==========================================
    // Offer
    // ==========================================

    socket.on("offer",(data)=>{

        const room =
        rooms[data.room];

        if(!room) return;

        io.to(room.viewer)
        .emit(
            "offer",
            data
        );

    });



    // ==========================================
    // Answer
    // ==========================================

    socket.on("answer",(data)=>{

        const room =
        rooms[data.room];

        if(!room) return;

        io.to(room.camera)
        .emit(
            "answer",
            data
        );

    });



    // ==========================================
    // ICE Candidate
    // ==========================================

    socket.on("ice-candidate",(data)=>{

        const room =
        rooms[data.room];

        if(!room) return;

        if(socket.id===room.camera){

            io.to(room.viewer)
            .emit(
                "ice-candidate",
                data
            );

        }

        else if(socket.id===room.viewer){

            io.to(room.camera)
            .emit(
                "ice-candidate",
                data
            );

        }

    });



    // ==========================================
    // Leave Room
    // ==========================================

    socket.on("leave-room",()=>{

        const code =
        findRoom(socket.id);

        if(!code) return;

        const room =
        rooms[code];

        if(socket.id===room.camera){

            if(room.viewer){

                io.to(room.viewer)
                .emit("peer-left");

            }

            deleteRoom(code);

        }

        else if(socket.id===room.viewer){

            room.viewer=null;

            io.to(room.camera)
            .emit("peer-left");

        }

    });
        // ==========================================
    // Disconnect
    // ==========================================

    socket.on("disconnect",()=>{

        console.log(
            "User Disconnected:",
            socket.id
        );

        const code =
        findRoom(socket.id);

        if(!code) return;

        const room =
        rooms[code];

        if(!room) return;



        // Camera خارج شد
        if(room.camera===socket.id){

            if(room.viewer){

                io.to(room.viewer)
                .emit("peer-left");

            }

            deleteRoom(code);

        }



        // Viewer خارج شد
        else if(room.viewer===socket.id){

            room.viewer=null;

            io.to(room.camera)
            .emit("peer-left");

        }

    });

});
// ==========================================
// Start Server
// ==========================================

const PORT =
process.env.PORT || 3000;

server.listen(PORT,"0.0.0.0",()=>{

    console.log(
        `Server running on port ${PORT}`
    );

});