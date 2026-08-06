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