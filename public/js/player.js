var database = firebase.database();

var questionRef = database.ref("/currentQuestion");
var currentQuestion;


questionRef.on("value",( snapshot ) => {
    currentQuestion = snapshot.val();
    if( !currentQuestion){
        clearPlayerPanel();
    } else if( currentQuestion && !currentQuestion.isAnswered){
        updatePlayerQuestion(currentQuestion)
    } else if (currentQuestion.isAnswered){
        showMessageModal("answered")
    }
})

const updatePlayerQuestion = currentQuestion => {
    console.log(currentQuestion.isAnswered)
    questionScore = currentQuestion.points;
    $('.question-category').text(currentQuestion.category)
    $('.question-text').text(currentQuestion.text);
    $('.question-score').text(`${currentQuestion.points} puntos`)
    $('.answers-wrapper').empty();
    currentQuestion.answers.forEach((answer, index) => {
        $('.answers-wrapper').append(`
            <div data-correct-answer=${answer.isCorrect} class='btn btn-block btn-outline-secondary btn-answer'>${answer.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')}</div>
        `)
    })

    $('.btn-answer').on('click', getPlayerAnswer)
    $('.questions-text-wrapper').fadeIn('fast');
}

const clearPlayerPanel = () => {
    $('.questions-text-wrapper').fadeOut('fast');
}

const getPlayerAnswer = (event) => {
    let correctAnswer = $(event.target).data('correct-answer');
    showMessageModal(correctAnswer)
}

const updateCurrentQuestion = () => {
    firebase.database().ref('currentQuestion').set({...currentQuestion, isAnswered:true});
}

const showMessageModal = ( status ) => {
    switch ( status ) {
        case true:
            $('#message-modal .modal-title').text("¡¡¡Felicidades!!!");
            $('#message-modal .modal-text').text(`Tu respuesta es correcta, has ganado ${questionScore} puntos.`);
            $('#message-modal').addClass("answered").modal('show');
            $('#message-modal').on('shown.bs.modal', () => {
                setTimeout(() => {
                    $('#message-modal').removeClass('answered').modal('hide')
                },2000)
            })
            updateCurrentQuestion();
            break;
        
        case false:
            $('#message-modal:not(".answered") .modal-title').text("¡¡¡Nooooo!!!");
            $('#message-modal:not(".answered") .modal-text').text("Tu respuesta es incorrecta, ¡suerte para la próxima!");
            $('#message-modal').modal('show');
            $('#message-modal').on('shown.bs.modal', () => {
                setTimeout(() => {
                    $('#message-modal').removeClass('answered').modal('hide')
                },2000)
            })
            break;

        case 'answered':
            $('#message-modal:not(".answered") .modal-title').text("¡¡¡Ups!!!");
            $('#message-modal:not(".answered") .modal-text').text("Alguien ha respondido antes que tú, ¡suerte para la próxima!");
            $('#message-modal').modal('show');
            $('#message-modal').on('shown.bs.modal', () => {
                setTimeout(() => {
                    $('#message-modal').removeClass('answered').modal('hide')
                },2000)
            })
            break;
    }
}

