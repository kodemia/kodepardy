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
        $('#answered-modal').modal('show');
        $('#answered-modal').on('shown.bs.modal', e => {
            setTimeout(() => {
                clearPlayerPanel()
                $('#answered-modal').modal('hide');
            }, 2000)
        })
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

const showMessageModal = ( correctAnswer) => {
    const modalContent = [
        {
            modalTitle:"¡¡¡Felicidades!!!",
            modalText:`Tu respuesta es correcta, has ganado ${questionScore} puntos.`
        },
        {
            modalTitle:"¡¡¡Nooooo!!!",
            modalText:"Tu respuesta es incorrecta, ¡suerte para la próxima!"  
        }
    ]

    let selectedContent = {};

    correctAnswer ? ( updateCurrentQuestion(), selectedContent = modalContent[0]) : selectedContent = modalContent[1]
    $('#message-modal .modal-title').text(selectedContent.modalTitle);
    $('#message-modal .modal-text').text(selectedContent.modalText);

    $('#message-modal').modal('show')
    $('#message-modal').on('shown.bs.modal', e => {
        setTimeout(() => {
            $('#message-modal').modal('hide')
        }, 2000)
    })
}

const updateCurrentQuestion = () => {
    firebase.database().ref('currentQuestion').set({...currentQuestion, isAnswered:true});
}