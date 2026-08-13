
// ==============================
// UI Manager
// ==============================


function changePage(showPage){


    const pages = [

        home,

        cameraSection,

        viewerSection

    ];



    pages.forEach(page=>{


        if(page === showPage){


            page.classList.remove("hidden");


            page.classList.remove(
                "page-exit"
            );


            // برای اجرای دوباره animation

            void page.offsetWidth;


            page.classList.add(
                "page-enter"
            );


        }

        else{


            if(!page.classList.contains("hidden")){


                page.classList.remove(
                    "page-enter"
                );


                page.classList.add(
                    "page-exit"
                );



                setTimeout(()=>{


                    page.classList.add(
                        "hidden"
                    );


                },300);


            }


        }


    });


}



function showHome(){

    changePage(home);

}



function showCamera(){

    changePage(cameraSection);

}



function showViewer(){

    changePage(viewerSection);

}
function updateStatus(elementId, text, type){

    const status = document.getElementById(elementId);

    if(!status) return;

    status.textContent = text;

    status.classList.remove(
        "status-waiting",
        "status-connected",
        "status-error"
    );

    status.classList.add(type);
}

function setStatus(message, type) {
    const badge = isCamera
        ? document.getElementById("cameraStatus")
        : document.getElementById("viewerStatus");

    if (!badge) return;

    const text = badge.querySelector(".status-text");
    text.textContent = message;

    badge.classList.remove(
        "status-waiting",
        "status-connected",
        "status-error"
    );

    if (type === "success") {
        badge.classList.add("status-connected");
    } else if (type === "error") {
        badge.classList.add("status-error");
    } else {
        badge.classList.add("status-waiting");
    }
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