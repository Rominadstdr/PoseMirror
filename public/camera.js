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
        ideal:3840
    },

    height:{
        ideal:2160
    }

},

            audio:true

        });

        localVideo.srcObject = localStream;

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

    await addLocalTracks();

    if(!stream) return;



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

                stream.getVideoTracks()[0]

            );

        }

    }

}