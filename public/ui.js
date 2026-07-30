// ==============================
// UI Manager
// ==============================

function showHome(){

    home.classList.remove("hidden");

    cameraSection.classList.add("hidden");

    viewerSection.classList.add("hidden");

}


function showCamera(){

    home.classList.add("hidden");

    cameraSection.classList.remove("hidden");

    viewerSection.classList.add("hidden");

}


function showViewer(){

    home.classList.add("hidden");

    cameraSection.classList.add("hidden");

    viewerSection.classList.remove("hidden");

}


function setStatus(text, type = "info") {

    status.textContent = text;

    status.className = "";

    status.classList.add(type);

}


function clearStatus(){

    status.textContent = "";

}


function resetUI(){

    showHome();

    clearStatus();

    roomCode.textContent = "----";

    codeInput.value = "";

}


function disableHomeButtons(){

    cameraBtn.disabled = true;

    viewerBtn.disabled = true;

}


function enableHomeButtons(){

    cameraBtn.disabled = false;

    viewerBtn.disabled = false;

}


function hideSwitchCamera(){

    switchCameraBtn.classList.add("hidden");

}


function showSwitchCamera(){

    switchCameraBtn.classList.remove("hidden");

}


function hideCaptureButtons(){

    captureLocalBtn.classList.add("hidden");

    captureRemoteBtn.classList.add("hidden");

}


function showLocalCapture(){

    captureLocalBtn.classList.remove("hidden");

}


function showRemoteCapture(){

    captureRemoteBtn.classList.remove("hidden");

}


function hideBackButtons(){

    backCameraBtn.classList.add("hidden");

    backViewerBtn.classList.add("hidden");

}


function showCameraBack(){

    backCameraBtn.classList.remove("hidden");

}


function showViewerBack(){

    backViewerBtn.classList.remove("hidden");

}