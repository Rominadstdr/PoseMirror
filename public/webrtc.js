// ==============================
// WebRTC
// ==============================

let peer = null;



function createPeer(){

    peer = new RTCPeerConnection({

        iceServers:[
            {
                urls:"stun:stun.l.google.com:19302"
            }
        ]

    });



    peer.onicecandidate = (event)=>{

        if(!event.candidate) return;

        socket.emit(

            "ice-candidate",

            {

                room: room,

                candidate: event.candidate

            }

        );

    };



   peer.ontrack = (event)=>{

    console.log("Remote track received");

    const stream = event.streams[0];

    if(remoteVideo.srcObject !== stream){

        remoteVideo.srcObject = stream;

    }


    remoteVideo.play()
    .catch(error=>{

        console.log(
            "Video play error:",
            error
        );

    });

};

}
async function addLocalTracks(){

    if(!localStream) return;

    localStream

    .getTracks()

    .forEach(track=>{

        peer.addTrack(

            track,

            localStream

        );

    });

}
async function createOffer(){

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

}
async function receiveOffer(data){

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

}
async function receiveAnswer(data){

    await peer.setRemoteDescription(

        new RTCSessionDescription(

            data.answer

        )

    );

}
async function receiveCandidate(data){

    try{

        await peer.addIceCandidate(

            new RTCIceCandidate(

                data.candidate

            )

        );

    }

    catch(error){

        console.log(error);

    }

}
function closePeer(){

    if(!peer) return;

    peer.close();

    peer = null;

}