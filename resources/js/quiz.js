function handleQuizInteraction(id){
    const response = document.getElementById("response");
    response.style.display = "block";
    const correctAnswer = document.getElementById("answer_2");

    if(id === "answer_2"){
        const answer1 = document.getElementById("answer_1");
        const answer3 = document.getElementById("answer_3");
        const pickedAnswer = document.getElementById(id);

        correctAnswer.style.border = "1px solid lawngreen";
        correctAnswer.style.boxShadow = "0 0 5px 2px lawngreen";
        response.innerHTML = 'Well done, that\'s correct! You already know so much about me but have you seen <a href="skills.html" class="link">my Skills</a>.';
        answer1.disabled = true;
        answer3.disabled = true;
        return;
    }

    const pickedAnswer = document.getElementById(id);
    pickedAnswer.disabled = true;

    const falseResponses = ["Aww, that was not right. I've highlighted the correct answer for you.",
        "The answers are pretty similar, don't worry. It was made to be hard. I'll give you another chance",
        "That was close. I bet it was a missclick. You got another try but use your hand to aim this time.",
        "This gotta be a joke. You know what? I'll forgive you, try again."
    ];
    const index = Math.floor(Math.random() * falseResponses.length);

    response.innerHTML = falseResponses[index];

}
