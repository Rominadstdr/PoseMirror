const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});


app.use(express.static(path.join(__dirname, "public")));


// ذخیره اتاق‌ها
const rooms = {};


// ساخت کد ۴ رقمی
function generateCode(){

    let code;

    do{

        code = Math.floor(
            1000 + Math.random() * 9000
        ).toString();

    }while(rooms[code]);


    return code;

}



io.on("connection", (socket)=>{


    console.log("User connected:", socket.id);



    // وقتی کاربر دوربین را فعال می‌کند
    socket.on("camera-ready", ()=>{


        const code = generateCode();


        rooms[code] = {

            camera: socket.id,

            viewer: null

        };


        socket.emit("room-code", code);


        console.log(
            "New camera room:",
            code
        );


    });



    // وقتی Viewer کد را وارد می‌کند
    socket.on("join-room", (code)=>{


        const room = rooms[code];


        if(!room){

            socket.emit(
                "invalid-code"
            );

            return;

        }


        room.viewer = socket.id;


        socket.emit(
            "joined-room",
            code
        );


        io.to(room.camera)
        .emit("viewer-ready");


        console.log(
            "Viewer joined:",
            code
        );


    });
        // دریافت Offer از Camera و ارسال به Viewer
    socket.on("offer", (data)=>{

        const room = rooms[data.room];

        if(!room) return;


        io.to(room.viewer)
        .emit("offer", data);

    });



    // دریافت Answer از Viewer و ارسال به Camera
    socket.on("answer", (data)=>{

        const room = rooms[data.room];

        if(!room) return;


        io.to(room.camera)
        .emit("answer", data);

    });



    // رد و بدل کردن ICE Candidate ها
    socket.on("ice-candidate", (data)=>{


        const room = rooms[data.room];


        if(!room) return;



        if(socket.id === room.camera){


            io.to(room.viewer)
            .emit(
                "ice-candidate",
                data
            );


        }else{


            io.to(room.camera)
            .emit(
                "ice-candidate",
                data
            );


        }


    });




    // وقتی کاربر قطع شد
    socket.on("disconnect", ()=>{


        console.log(
            "User disconnected:",
            socket.id
        );


        for(const code in rooms){


            const room = rooms[code];


            if(room.camera === socket.id || room.viewer === socket.id){


                delete rooms[code];


                console.log(
                    "Room deleted:",
                    code
                );


            }

        }


    });


});



// اجرای سرور
server.listen(3000, "0.0.0.0", ()=>{


    console.log(
        "Server running on http://localhost:3000"
    );


});