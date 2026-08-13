// ==============================
// Camera
// ==============================

let localStream = null;

let currentCamera = "user";



async function startCamera(){

    setStatus(
    "در انتظار اتصال",
    "info"
        );

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
        ideal:30
    }
},

    audio:true

});

  const track = localStream.getVideoTracks()[0];
  const capabilities = track.getCapabilities();

  const zoomControl = document.getElementById("zoomControl");
const zoomSlider = document.getElementById("zoomSlider");

if (capabilities.zoom) {
  zoomControl.style.display = "block";

  zoomSlider.min = capabilities.zoom.min;
  zoomSlider.max = capabilities.zoom.max;
  zoomSlider.step = capabilities.zoom.step || 0.1;
  zoomSlider.value = capabilities.zoom.min;

  zoomSlider.oninput = async () => {
    await track.applyConstraints({
      advanced: [{ zoom: Number(zoomSlider.value) }]
    });
  };
} else {
  zoomControl.style.display = "none";
}

  console.log("Camera Track:", track);
  console.log("Camera Capabilities:", capabilities);

         const torchBtn = document.getElementById("torchBtn");
let torchOn = false;

if (capabilities.torch) {
  torchBtn.style.display = "block";

  torchBtn.onclick = async () => {
    torchOn = !torchOn;

    await track.applyConstraints({
      advanced: [{ torch: torchOn }]
    });
  };
} else {
  torchBtn.style.display = "none";
}

        const exposureControl = document.getElementById("exposureControl");
        const exposureSlider = document.getElementById("exposureSlider");

    if (capabilities.exposureCompensation) {
  exposureControl.style.display = "block";

  exposureSlider.min = capabilities.exposureCompensation.min;
  exposureSlider.max = capabilities.exposureCompensation.max;
  exposureSlider.step = capabilities.exposureCompensation.step || 0.1;
  exposureSlider.value = 0;

  exposureSlider.oninput = async () => {
    await track.applyConstraints({
      advanced: [{
        exposureCompensation: Number(exposureSlider.value)
      }]
    });
  };
} else {
  exposureControl.style.display = "none";
}

        const focusControl = document.getElementById("focusControl");
        const focusSelect = document.getElementById("focusSelect");

    if (capabilities.focusMode) {
  focusControl.style.display = "block";

  focusSelect.innerHTML = capabilities.focusMode
    .map(mode => `<option value="${mode}">${mode}</option>`)
    .join("");

  focusSelect.onchange = async () => {
    await track.applyConstraints({
      advanced: [{ focusMode: focusSelect.value }]
    });
  };
} else {
  focusControl.style.display = "none";
}

const qualitySelect = document.getElementById("qualitySelect");

qualitySelect.onchange = async () => {
  const height = Number(qualitySelect.value);

  await track.applyConstraints({
    width: height === 1080 ? 1920 : 1280,
    height: height
  });
};


    localVideo.srcObject = localStream;


    await localVideo.play().catch(()=>{});

        const videoTrack =
localStream.getVideoTracks()[0];


if("ImageCapture" in window){

    try{

        window.imageCapture =
        new ImageCapture(videoTrack);

        console.log(
            "ImageCapture enabled"
        );

    }
    catch(error){

        console.log(
            "ImageCapture failed",
            error
        );

        window.imageCapture = null;

    }

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