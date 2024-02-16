function onSubmit(event){
    const email = document.getElementById("email");
    const subject = document.getElementById("subject");
    const content = document.getElementById("content");

    let failed = false;

    if(!isValidMail(email.value)){
        failed = true;
        const label = document.getElementById("emailLabel");
        const labelSpan = document.getElementById("emailSpan");
        label.style.color = "red";
        labelSpan.style.display = "inline";
    } else {
        const label = document.getElementById("emailLabel");
        const labelSpan = document.getElementById("emailSpan");
        label.style.color = "white";
        labelSpan.style.display = "none";
    }

    if(subject.value === "none"){
        failed = true;
        const label = document.getElementById("subjectLabel");
        const labelSpan = document.getElementById("subjectSpan");
        label.style.color = "red";
        labelSpan.style.display = "inline";
    } else {
        const label = document.getElementById("subjectLabel");
        const labelSpan = document.getElementById("subjectSpan");
        label.style.color = "white";
        labelSpan.style.display = "none";
    }

    if(content.value.length < 25){
        failed = true;
        const label = document.getElementById("contentLabel");
        const labelSpan = document.getElementById("contentSpan");
        label.style.color = "red";
        labelSpan.style.display = "inline";
    } else {
        const label = document.getElementById("contentLabel");
        const labelSpan = document.getElementById("contentSpan");
        label.style.color = "white";
        labelSpan.style.display = "none";
    }

    if(failed){
        event.preventDefault();
    }
}

function isValidMail(email){
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

document.addEventListener("submit", onSubmit);