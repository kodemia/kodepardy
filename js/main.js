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
            "text": "id"
        }, {
            "isCorrect": false,
            "text": "href"
        }, {
            "isCorrect": false,
            "text": "name"
        }],
        "category": "HTML",
        "points": 200,
        "text": "¿Cuál de los siguientes atributos HTML sirve para asignar un identificador único a un elemento?"
    }, {
        "answers": [{
            "isCorrect": true,
            "text": "id"
        }, {
            "isCorrect": false,
            "text": "href"
        }, {
            "isCorrect": false,
            "text": "name"
        }],
        "category": "CSS",
        "points": 200,
        "text": "¿Cuál de los siguientes atributos HTML sirve para asignar un identificador único a un elemento?"
    }, {
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
        "category": "JS",
        "points": 500,
        "text": "¿Cuál de los siguientes tagname corresponde a un elemento de línea?"
    }, {
        "answers": [{
            "isCorrect": true,
            "text": "id"
        }, {
            "isCorrect": false,
            "text": "href"
        }, {
            "isCorrect": false,
            "text": "name"
        }],
        "category": "BOOTSTRAP",
        "points": 300,
        "text": "¿Cuál de los siguientes atributos HTML sirve para asignar un identificador único a un elemento?"
    }, {
        "answers": [{
            "isCorrect": true,
            "text": "id"
        }, {
            "isCorrect": false,
            "text": "href"
        }, {
            "isCorrect": false,
            "text": "name"
        }],
        "category": "JS / JQUERY",
        "points": 100,
        "text": "¿Cuál de los siguientes atributos HTML sirve para asignar un identificador único a un elemento?"
    }]
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
    $('.question-text').text(selectedQuestion.text);
    $('.answers-wrapper').empty();
    answers.forEach((answer, index) => {
        $('.answers-wrapper').append(`
            <div class='btn btn-block btn-outline-secondary'>${answer.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')}</div>
        `)
    })
}

fillGrid();

console.log(questions.questions)