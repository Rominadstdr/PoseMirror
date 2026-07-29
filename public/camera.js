// ==============================
// Camera
// ==============================

let localStream = null;

let currentCamera = "user";



async function startCamera(){

    stopCamera();

    try{

        localStream =
await navigator.mediaDevices.getUserMedia({

    video:{

        facingMode: currentCamera,

        width:{
            ideal:1280
        },

        height:{
            ideal:720
        },

        frameRate:{
            ideal:30,
            max:30
        }

    },

    audio:true

});

        localVideo.srcObject = localStream;
        const videoTrack =
localStream.getVideoTracks()[0];


console.log(
    "Camera settings:",
    videoTrack.getSettings()
);


if("ImageCapture" in window){

    imageCapture =
    new ImageCapture(videoTrack);

    console.log("ImageCapture enabled");

}
else{

    console.log("ImageCapture not supported");

}

       

        return localStream;

    }

    catch(error){

        console.error(error);

        setStatus("خطا در دسترسی به دوربین");

        return null;

    }

}



function stopCamera(){

    if(!localStream) return;

    localStream
    .getTracks()
    .forEach(track=>track.stop());

    localStream = null;

    localVideo.srcObject = null;

}



async function switchCamera(){

    currentCamera =
    currentCamera === "user"
    ? "environment"
    : "user";


    const stream =
    await startCamera();


    if(!stream) return;



    const newVideoTrack =
    stream.getVideoTracks()[0];



    if(peer){

        const sender =

        peer
        .getSenders()
        .find(sender=>

            sender.track &&

            sender.track.kind==="video"

        );



        if(sender){

            await sender.replaceTrack(
                newVideoTrack
            );

        }

    }

}