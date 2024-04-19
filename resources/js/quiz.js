const falseResponses = ["Aww, that was not right. How about another try?",
    "That's a tough quiz. Don't worry, everyone makes mistakes.",
    "That was close. I bet it was a missclick. You got another but try to focus this time.",
    "You're kidding right? You know what. I'll forgive you, try again."
];
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
        response.innerHTML = 'Well done, that\'s correct! You can find out more about me <a href="skills.html" class="link">here</a>.';
        answer1.disabled = true;
        answer3.disabled = true;
        return;
    }

    const pickedAnswer = document.getElementById(id);
    pickedAnswer.disabled = true;

    const index = Math.floor(Math.random() * falseResponses.length);

    response.innerHTML = falseResponses[index];
    falseResponses.splice(index, 1);
}
