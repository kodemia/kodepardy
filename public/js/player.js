var database = firebase.database();

var questionRef = database.ref("/currentQuestion");
var playersRef = database.ref("/players");
var currentQuestion;

var playerData = {};

$(document).ready(() => {
    let playerLogged = localStorage.getItem('playerKey');
    !playerLogged ? $("#login-modal").modal("show") : null
})


questionRef.on("value",( snapshot ) => {
    currentQuestion = snapshot.val();
    $('#message-modal').removeClass('answered').modal("hide")
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
            
            updateCurrentQuestion();

            let playerKey =  localStorage.getItem('playerKey');
            
            
            const addScore = () => {
                $.ajax({
                    url: `https://kodepardy.firebaseio.com/players/${playerKey}.json`,
                    method:"GET",
                    success: (response) => {
                        playerData = response;
                        console.log(playerData)
                        let newScore = playerData.playerScore + questionScore;
                        database.ref(`/players/${playerKey}`).set({...playerData,playerScore:newScore})
                    }
                  });
            }

            $.ajax({
                url: `https://kodepardy.firebaseio.com/currentQuestion.json`,
                method:"GET",
                success: (response) => {
                    let answered = response.isAnswered
                    !answered ? addScore : null
                }
              });
            

              

              

    
            break;
        
        case false:
            $('#message-modal:not(".answered") .modal-title').text("¡¡¡Nooooo!!!");
            $('#message-modal:not(".answered") .modal-text').text("Tu respuesta es incorrecta, ¡suerte para la próxima!");
            $('#message-modal').modal('show');
            
            break;

        case 'answered':
            $('#message-modal:not(".answered") .modal-title').text("¡¡¡Ups!!!");
            $('#message-modal:not(".answered") .modal-text').text("Alguien ha respondido antes que tú, ¡suerte para la próxima!");
            $('#message-modal').modal('show');
            
            break;
    }
}

const savePlayer = () => {
    let playerName = $("#user-name").val();
    let playerObject = {}
    playerObject.playerName = playerName;
    playerObject.playerScore = 0;
    let playerKey = playersRef.push(playerObject).key;  // key === "last"
    console.log(playerKey)
    localStorage.setItem('playerKey', playerKey);

    console.log(playerObject)

    $("#login-modal").modal("hide");
}

playersRef.on("value", (snapshot) => {
    console.log(snapshot.val())
    let playersList = snapshot.val();
    $(".best-ranking-wrapper").empty();
    $.each(playersList, (key, value) => {
        $(".best-ranking-wrapper").append(`
            <div class="btn btn-warning mb-2 d-block">${value.playerName} tiene ${value.playerScore}</div>
        `)
    })
})

