const socket = io();



// Buttons
const cameraBtn = document.getElementById("cameraBtn");
const viewerBtn = document.getElementById("viewerBtn");
const connectBtn = document.getElementById("connectBtn");


// Sections
const home = document.getElementById("home");
const cameraSection = document.getElementById("cameraSection");
const viewerSection = document.getElementById("viewerSection");


// Video
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

const captureCanvas =
document.getElementById("captureCanvas");

const captureLocalBtn =
document.getElementById("captureLocalBtn");

const captureRemoteBtn =
document.getElementById("captureRemoteBtn");

// Inputs
const roomCode = document.getElementById("roomCode");
const codeInput = document.getElementById("codeInput");

const status = document.getElementById("status");


let currentCamera = "user";

let localStream = null;

let room = "";

let isCamera = false;
let isViewer = false;



const peer = new RTCPeerConnection({

    iceServers:[
        {
            urls:"stun:stun.l.google.com:19302"
        }
    ]

});




// Camera button

cameraBtn.onclick = async()=>{


    home.classList.add("hidden");

    cameraSection.classList.remove("hidden");

    switchCameraBtn.style.display = "block";

    cameraBtn.classList.add("hidden");

    viewerBtn.classList.add("hidden");


    isCamera = true;


    try{


        localStream =
    await navigator.mediaDevices.getUserMedia({

    video:{
        facingMode: currentCamera
    },
    audio:true

        });



        localVideo.srcObject = localStream;



        localStream.getTracks()
        .forEach(track=>{


            peer.addTrack(
                track,
                localStream
            );


        });



        status.textContent =
        "Creating room...";



        socket.emit(
            "camera-ready"
        );



    }
    catch(error){

        console.log(error);

        status.textContent =
        "Camera error";

    }


};

captureLocalBtn.onclick = ()=>{

    takePhoto(localVideo);

};


// Viewer button

viewerBtn.onclick = ()=>{


    switchCameraBtn.style.display = "none";

    home.classList.add("hidden");

    viewerSection.classList.remove("hidden");

    cameraBtn.classList.add("hidden");

    viewerBtn.classList.add("hidden");


    isViewer = true;


};


captureRemoteBtn.onclick = ()=>{

    takePhoto(remoteVideo);

};

// Viewer connect

connectBtn.onclick = ()=>{


    const code =
    codeInput.value.trim();



    if(code.length !== 4){

        alert(
            "Enter 4 digit code"
        );

        return;

    }



    socket.emit(
        "join-room",
        code
    );


};
// دریافت کد اتاق از سرور (برای Camera)

socket.on("room-code", (code)=>{

    room = code;

    roomCode.textContent = code;

    status.textContent =
    "Waiting for viewer...";

});




// اگر Viewer کد اشتباه وارد کند

socket.on("invalid-code", ()=>{

    alert(
        "Camera not found"
    );

});




// وقتی Viewer وارد اتاق شد
// Camera باید Offer بسازد

socket.on("viewer-ready", async()=>{


    if(!isCamera) return;



    const offer =
    await peer.createOffer();



    await peer.setLocalDescription(
        offer
    );



    socket.emit(
        "offer",
        {
            room: room,
            offer: offer
        }
    );



    status.textContent =
    "Connecting...";


});




// Viewer، Offer را دریافت می‌کند

socket.on("offer", async(data)=>{


    if(!isViewer) return;



    room = data.room;



    await peer.setRemoteDescription(

        new RTCSessionDescription(
            data.offer
        )

    );



    const answer =
    await peer.createAnswer();



    await peer.setLocalDescription(
        answer
    );



    socket.emit(
        "answer",
        {

            room: room,

            answer: answer

        }

    );



});




// Camera جواب Viewer را می‌گیرد

socket.on("answer", async(data)=>{


    if(!isCamera) return;



    await peer.setRemoteDescription(

        new RTCSessionDescription(
            data.answer
        )

    );


    status.textContent =
    "Connected";



});




// ارسال ICE Candidate

peer.onicecandidate = (event)=>{


    if(event.candidate){


        socket.emit(
            "ice-candidate",
            {

                room: room,

                candidate: event.candidate

            }
        );


    }


};




// دریافت ICE Candidate

socket.on("ice-candidate", async(data)=>{


    try{


        await peer.addIceCandidate(

            new RTCIceCandidate(
                data.candidate
            )

        );


    }
    catch(error){

        console.log(
            "ICE Error:",
            error
        );

    }


});




// دریافت ویدیو طرف مقابل

peer.ontrack = (event)=>{


    remoteVideo.srcObject =
    event.streams[0];

    remoteVideo.classList.add(
    "full-screen-video"
        );

};
const switchCameraBtn =
document.getElementById("switchCameraBtn");


switchCameraBtn.onclick = async()=>{


    if(!isCamera) return;


    // تغییر دوربین
    currentCamera =
    currentCamera === "user"
    ? "environment"
    : "user";


    // خاموش کردن دوربین قبلی
    if(localStream){

        localStream
        .getTracks()
        .forEach(track=>{
            track.stop();
        });

    }



    // گرفتن دوربین جدید

    localStream =
    await navigator.mediaDevices.getUserMedia({

        video:{
            facingMode: currentCamera
        },

        audio:true

    });



    localVideo.srcObject =
    localStream;

    localVideo.classList.add(
    "full-screen-video"
        );

    const newVideoTrack =
localStream.getVideoTracks()[0];



const sender =
peer.getSenders()
.find(
    s => s.track && s.track.kind === "video"
);



if(sender){

    await sender.replaceTrack(
        newVideoTrack
    );

}

};
function takePhoto(video){

    const ctx =
    captureCanvas.getContext("2d");



    captureCanvas.width =
    video.videoWidth;

    captureCanvas.height =
    video.videoHeight;



    ctx.drawImage(

        video,

        0,

        0,

        captureCanvas.width,

        captureCanvas.height

    );



    const image =
    captureCanvas.toDataURL(
        "image/png"
    );



    const a =
    document.createElement("a");



    a.href = image;

    a.download =
    "PoseMirror.png";



    a.click();

}