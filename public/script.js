// ==========================================
// PoseMirror V2
// script.js
// ==========================================


// ---------- Socket ----------

const socket = io();


// ---------- Buttons ----------

const cameraBtn =
document.getElementById("cameraBtn");

const viewerBtn =
document.getElementById("viewerBtn");

const connectBtn =
document.getElementById("connectBtn");

const switchCameraBtn =
document.getElementById("switchCameraBtn");

const captureLocalBtn =
document.getElementById("captureLocalBtn");

const captureRemoteBtn =
document.getElementById("captureRemoteBtn");

const backCameraBtn =
document.getElementById("backCameraBtn");

const backViewerBtn =
document.getElementById("backViewerBtn");

const refreshCodeBtn =
document.getElementById("refreshCodeBtn");

const moreBtn = 
document.getElementById("moreBtn");

const toolsPanel = 
document.getElementById("toolsPanel");

const gridToggle = 
document.getElementById("gridToggle");

const flashToggle = 
document.getElementById("flashToggle");

const gridOverlay = 
document.getElementById("gridOverlay");


// ---------- Sections ----------

const home =
document.getElementById("home");

const cameraSection =
document.getElementById("cameraSection");

const viewerSection =
document.getElementById("viewerSection");


// ---------- Videos ----------

const localVideo =
document.getElementById("localVideo");

const remoteVideo =
document.getElementById("remoteVideo");


// ---------- Inputs ----------

const roomCode =
document.getElementById("roomCode");

const codeInput =
document.getElementById("codeInput");

const status =
document.getElementById("status");

const qrSheet =
document.getElementById("qrSheet");

// ==========================================
// Auto Join From QR
// ==========================================

const params = new URLSearchParams(window.location.search);

const roomFromQR = params.get("room");

// ---------- State ----------

let room = "";

let isCamera = false;

let isViewer = false;

// ==========================================
// Camera Button
// ==========================================

cameraBtn.onclick = async()=>{

    isCamera = true;
    isViewer = false;

    showCamera();

    createPeer();

    await startCamera();

    showSwitchCamera();

    showLocalCapture();

    showCameraBack();

    setStatus(
    "در حال آماده‌سازی دوربین...",
    "info"
    );

    socket.emit("camera-ready");

};


// ==========================================
// Viewer Button
// ==========================================

viewerBtn.onclick = ()=>{

    isViewer = true;
    isCamera = false;

    showViewer();

    showRemoteCapture();

    showViewerBack();

    setStatus("کد اتصال را وارد کنید.");

    createPeer();

};

//btn//
moreBtn.onclick = ()=>{

    toolsPanel.classList.toggle("hidden");

};

let gridEnabled = false;

gridToggle.onclick = ()=>{

    gridEnabled = !gridEnabled;

    gridToggle.classList.toggle("active");

    gridOverlay.classList.toggle("hidden");

};

let flashEnabled = false;

flashToggle.onclick = ()=>{

    flashEnabled = !flashEnabled;

    flashToggle.classList.toggle("active");

};
// ==========================================
// Connect Button
// ==========================================

connectBtn.onclick = ()=>{


    const code =
    codeInput.value.trim();

    if(code.length !== 4){

        alert("کد باید ۴ رقمی باشد.");

        return;

    }

    room = code;

    console.log(
    "Viewer joining:",
    code
);

    socket.emit(

        "join-room",

        room

    );

};
// ==========================================
// Socket Events
// ==========================================


// ---------- کد اتاق ----------

socket.on("room-code",(code)=>{

    room = code;

    roomCode.textContent = code;

    updateQRCode(code);

    setStatus(
    "در انتظار اتصال...",
    "info"
    );

});



// ---------- کد اشتباه ----------

socket.on("invalid-code",()=>{

    alert("کد وارد شده معتبر نیست.");

});



// ---------- Viewer وارد شد ----------

socket.on("viewer-ready", async()=>{

    if(!isCamera) return;

    await createOffer();

    setStatus(
    "در حال برقراری ارتباط...",
    "info"
    );

});



// ---------- دریافت Offer ----------

socket.on("offer",async(data)=>{

    if(!isViewer) return;

    await receiveOffer(data);

});



// ---------- دریافت Answer ----------

socket.on("answer",async(data)=>{

    if(!isCamera) return;

    await receiveAnswer(data);

    setStatus(
    "✓ اتصال برقرار شد",
    "success"
    );

});



// ---------- دریافت ICE ----------

socket.on("ice-candidate",async(data)=>{

    await receiveCandidate(data);

});



// ---------- اتصال موفق ----------

socket.on("joined-room",(code)=>{

    history.replaceState({}, "", "/");

    room = code;

    setStatus("در حال برقراری ارتباط...");

});



// ---------- خروج طرف مقابل ----------

socket.on("peer-left",()=>{

    remoteVideo.pause();

    remoteVideo.srcObject = null;

    setStatus(
    "ارتباط قطع شد",
    "error"
    );

});



// ==========================================
// Camera Buttons
// ==========================================

// تغییر دوربین

switchCameraBtn.onclick = async()=>{

    await switchCamera();

};


// ثبت عکس دوربین

captureLocalBtn.onclick = ()=>{

    captureLocalPhoto();

};


// ثبت عکس Viewer

captureRemoteBtn.onclick = ()=>{

    captureRemotePhoto();

};

refreshCodeBtn.onclick = ()=>{

    if(!room){
        return;
    }

    socket.emit("refresh-room",room);

};


// ==========================================
// Back Camera
// ==========================================

backCameraBtn.onclick = ()=>{

    socket.emit("leave-room",room);

    stopCamera();

    closePeer();

    remoteVideo.srcObject = null;

    clearQRCode();

    room = "";

    isCamera = false;

    resetUI();

};


// ==========================================
// Back Viewer
// ==========================================

backViewerBtn.onclick = ()=>{

    socket.emit("leave-room",room);

    closePeer();

    remoteVideo.srcObject = null;

    room = "";

    isViewer = false;

    resetUI();

};


// ==========================================
// Disconnect
// ==========================================

window.addEventListener("beforeunload",()=>{

    socket.emit("leave-room",room);

});

// ==========================================
// QR Bottom Sheet
// ==========================================

if(qrSheet){

    qrSheet.onclick = ()=>{

        qrSheet.classList.toggle(
            "active"
        );

    };

}

const qr = document.getElementById("qrcode");


// ==========================================
// Start App
// ==========================================

resetUI();

hideSwitchCamera();

hideCaptureButtons();

hideBackButtons();

// ==========================================
// Auto Join
// ==========================================

if(roomFromQR){

    viewerBtn.click();

    codeInput.value = roomFromQR;

    setTimeout(()=>{

        connectBtn.click();

    },300);

}
