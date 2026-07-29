const qrContainer = document.getElementById("qrcode");

function createQRCode(code){

    qrContainer.innerHTML = "";

    const url =
    `${window.location.origin}/?room=${code}`;

    new QRCode(qrContainer,{
        text:url,
        width:180,
        height:180
    });

}


function clearQRCode(){

    qrContainer.innerHTML = "";

}


function updateQRCode(code){

    clearQRCode();

    createQRCode(code);

}