let questions;

var database = firebase.database();
var questionsReference = database.ref('questions')

questionsReference.on('value', snapshot => {
    questions = snapshot.val();
    let clasifiedQuestions = questions.reduce((accum, current, index) => {
        current = {...current,index}
        const category = current.category
        const categoryArr = accum[category] || []
        return {
          ...accum,
          [category]: [
            ...categoryArr,
            current
          ]
        }
      }, {})

    console.log(clasifiedQuestions)
    $.each(clasifiedQuestions, (key, value) =>{
        console.log(key, value)
        value.forEach(( item, index ) => {
            console.log(item.points)
            $(`.${key}`).append(
                `<div data-question-index=${item.index} class="grid-cell">${item.points} pts</div>`
            )
        })
    })
    //fillGrid(questions);
})

const setCurrentQuestion = question => {
    firebase.database().ref('currentQuestion').set({...question,isAnswered:false});
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

const fillGrid = questions => {
    questions.forEach((item, index) => {
        $('.grid-container').append(`
            <div data-question-id=${index} class="body-cell m-1 text-center d-flex align-items-center border border-rounded color-white">${item.points} puntos</div>
        `)
    })
}

const setSelectedQuestion = () => {
    let questionIndex = $('.body-cell.bg-success').data('question-id');
    console.log(questions[questionIndex])
    let selectedQuestion = questions[questionIndex];
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