let questions = {
    "questions": [{
        "answers": [{
            "isCorrect": false,
            "text": "<p></p>"
        }, {
            "isCorrect": true,
            "text": "<span></span>"
        }, {
            "isCorrect": false,
            "text": "<div></div>"
        }],
        "category": "HTML",
        "points": 100,
        "text": "¿Cuál de los siguientes tagname corresponde a un elemento de línea?"
    }, {
        "answers": [{
            "isCorrect": true,
            "text": "RealTime Database"
        }, {
            "isCorrect": false,
            "text": "Firebase Database"
        }, {
            "isCorrect": false,
            "text": "Cloud Storage"
        }],
        "category": "HTML",
        "points": 200,
        "text": "¿Cuál es el nombre del servicio que nos permite generar una base de datos en tiempo real?"
    }, {
        "answers": [{
            "isCorrect": false,
            "text": "px"
        }, {
            "isCorrect": false,
            "text": "rem"
        }, {
            "isCorrect": true,
            "text": "vem"
        }],
        "category": "CSS",
        "points": 300,
        "text": "¿Cuál de las siguientes no es una unidad de medida válida en CSS?"
    }, {
        "answers": [{
            "isCorrect": false,
            "text": "En cualquier lugar está bien"
        }, {
            "isCorrect": false,
            "text": "Junto al botón que invocará dicha Modal"
        }, {
            "isCorrect": true,
            "text": "Al inicio del documento"
        }],
        "category": "BOOTSTRAP",
        "points": 500,
        "text": "¿En qué lugar de mi documento de HTML se debe colocar el snippet del componente 'Modal'?"
    }, {
        "answers": [{
            "isCorrect": false,
            "text": ".toggle()"
        }, {
            "isCorrect": true,
            "text": ".toggleClass()"
        }, {
            "isCorrect": false,
            "text": ".exchangeClass()"
        }],
        "category": "JS / JQUERY",
        "points": 400,
        "text": "Este método de JQuery sirve para intercambiar entre dos clases de un elemento:"
    }]
}

var database = firebase.database();

const setCurrentQuestion = question => {
    firebase.database().ref('currentQuestion/0').set(question);
}

let activeCells;

const highlightRandomCell = () => {
    console.log(activeCells)
    $('.body-cell').removeClass('bg-success')
    let randomIndex = Math.floor(Math.random() * (activeCells) + 0);
    $(`.body-cell:not('.disabled'):eq(${randomIndex})`).addClass('bg-success')
    console.log(randomIndex)
}

const startRoulette = () => {
    let randomSelect = setInterval(highlightRandomCell, 100);
    setTimeout(() => {
        clearInterval(randomSelect)
        setSelectedQuestion();
    }, 2000)
}

$('#roulette-start').on('click', () => {
    activeCells = $('.body-cell').not('.disabled').length
    startRoulette();
})

const fillGrid = () => {
    questions.questions.forEach((item, index) => {
        $('.grid-container').append(`
            <div data-question-id=${index} class="body-cell m-1 text-center d-flex align-items-center border border-rounded color-white">${item.points} puntos</div>
        `)
    })
}

const setSelectedQuestion = () => {
    let questionIndex = $('.body-cell.bg-success').data('question-id');
    console.log(questions.questions[questionIndex])
    let selectedQuestion = questions.questions[questionIndex];
    let answers = selectedQuestion.answers;
    $('.question-category').text(selectedQuestion.category)
    $('.question-text').text(selectedQuestion.text);
    $('.answers-wrapper').empty();
    answers.forEach((answer, index) => {
        $('.answers-wrapper').append(`
            <div data-answer-id=${index} class='btn btn-block btn-outline-secondary'>${answer.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')}</div>
        `)
    })
    setCurrentQuestion(selectedQuestion)
}

fillGrid();

console.log(questions.questions)