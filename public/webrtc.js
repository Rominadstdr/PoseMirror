

// ==============================
// WebRTC V3
// ==============================

let peer = null;
let remoteStream = null;

function createPeer() {

    if (peer) {
        peer.close();
    }

    remoteStream = new MediaStream();

    iceServers: [
    {
        urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302"
        ]
    }
]
    peer.onicecandidate = ({ candidate }) => {

        if (!candidate) return;

        socket.emit("ice-candidate", {

            room,
            candidate

        });

    };

    peer.ontrack = (event) => {

        console.log(
            "Remote track:",
            event.track.kind
        );

        if (
            !remoteStream
                .getTracks()
                .find(t => t.id === event.track.id)
        ) {

            remoteStream.addTrack(
                event.track
            );

        }

        remoteVideo.srcObject =
            remoteStream;

        remoteVideo.autoplay = true;
        remoteVideo.playsInline = true;

        remoteVideo.play()
            .catch(console.error);

    };

    peer.onconnectionstatechange = () => {

        console.log(
            "Connection:",
            peer.connectionState
        );

    };

    peer.oniceconnectionstatechange = () => {

        console.log(
            "ICE:",
            peer.iceConnectionState
        );

    };

}

async function addLocalTracks() {

    if (!peer) return;

    if (!localStream) return;

    const senders =
        peer.getSenders();

    for (const track of localStream.getTracks()) {

        const sender =
            senders.find(s =>
                s.track &&
                s.track.kind === track.kind
            );

        if (sender) {

            await sender.replaceTrack(track);

            continue;

        }

        peer.addTrack(
            track,
            localStream
        );

    }

}

async function createOffer() {

    await addLocalTracks();

    const offer =
        await peer.createOffer({

            offerToReceiveVideo: true,
            offerToReceiveAudio: false

        });

    await peer.setLocalDescription(
        offer
    );

    socket.emit("offer", {

        room,
        offer

    });

}

async function receiveOffer(data) {

    room = data.room;

    await addLocalTracks();

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

    socket.emit("answer", {

        room,
        answer

    });

}

async function receiveAnswer(data) {

    await peer.setRemoteDescription(

        new RTCSessionDescription(
            data.answer
        )

    );

}

async function receiveCandidate(data) {

    if (!data.candidate) return;

    try {

        await peer.addIceCandidate(

            new RTCIceCandidate(
                data.candidate
            )

        );

    }

    catch (err) {

        console.error(err);

    }

}

function closePeer() {

    if (!peer) return;

    peer.getSenders().forEach(sender => {

        if (sender.track) {

            sender.track.stop();

        }

    });

    peer.close();

    peer = null;

    remoteStream = null;

}