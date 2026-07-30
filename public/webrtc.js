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

    console.log("Remote track:", event.track.kind);

    if(!remoteVideo.srcObject){

        remoteVideo.srcObject = new MediaStream();

    }

    remoteVideo.srcObject.addTrack(event.track);

    remoteVideo.play().catch(console.error);

};

}
async function addLocalTracks(){

    if(!peer || !localStream) return;

    const senders = peer.getSenders();

    localStream.getTracks().forEach(track=>{

        const exists = senders.find(sender =>
            sender.track &&
            sender.track.kind === track.kind
        );

        if(exists) return;

        peer.addTrack(track, localStream);

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
        new RTCSessionDescription(data.offer)
    );

    // مهم
    await addLocalTracks();

    const answer = await peer.createAnswer();

    await peer.setLocalDescription(answer);

    socket.emit("answer",{
        room,
        answer
    });

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