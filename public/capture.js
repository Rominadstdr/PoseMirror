// ==============================
// Capture
// ==============================

const captureCanvas =
document.getElementById("captureCanvas");



function takePhoto(video){

    if(
        !video ||
        video.videoWidth === 0 ||
        video.videoHeight === 0
    ){

        alert("تصویر هنوز آماده نیست.");

        return;

    }



    captureCanvas.width =
    video.videoWidth;

    captureCanvas.height =
    video.videoHeight;



    const ctx = captureCanvas.getContext("2d",{
    alpha:false,
    desynchronized:false
});

ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";



    ctx.drawImage(

        video,

        0,

        0,

        captureCanvas.width,

        captureCanvas.height

    );



    return captureCanvas.toDataURL(
    "image/jpeg",
    1.0
);

}
function downloadPhoto(image){

    if(!image) return;



    const link =
    document.createElement("a");



    const time =
    new Date().getTime();



    link.href = image;

    link.download =
    `PoseMirror-${time}.jpg`;



    link.click();

}
function captureLocalPhoto(){

    const image =

    takePhoto(localVideo);



    if(!image) return;



    downloadPhoto(image);

}
function captureRemotePhoto(){

    const image =

    takePhoto(remoteVideo);



    if(!image) return;



    downloadPhoto(image);

}
captureLocalBtn.onclick = ()=>{

    captureLocalPhoto();

};



captureRemoteBtn.onclick = ()=>{

    captureRemotePhoto();

};