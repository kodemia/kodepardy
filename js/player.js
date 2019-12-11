var database = firebase.database();

var currentQuestion = database.ref("/currentQuestion");

currentQuestion.on("value",( snapshot ) => {
    console.log(snapshot.val())
    let currentQuestion = snapshot.val()[0];
    $('.question-category').text(currentQuestion.category)
    $('.question-text').text(currentQuestion.text);
    $('.answers-wrapper').empty();
    currentQuestion.answers.forEach((answer, index) => {
        $('.answers-wrapper').append(`
            <div data-answer-id=${index} class='btn btn-block btn-outline-secondary'>${answer.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')}</div>
        `)
    })
})