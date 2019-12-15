
var database = firebase.database();
var questionsReference = database.ref("/questions");

console.log(questionsReference)

var questions;

questionsReference.on("value", (snapshot) => {
    questions = snapshot.val()
    console.log(questions)

    let clasifiedQuestions = questions.reduce((accum, current, index) => {
        current = {...current,index}
        const category = current.category
        const categoryArr = accum[category] || []
        return {
            ...accum,
            [category]:[
                ...categoryArr,
                current
            ]
        }
    }, {});
    console.log(clasifiedQuestions)
    $.each(clasifiedQuestions, (key, value) => {
        value.forEach((item, index) => {
            $(`#${key}`).append(`
            <div data-question-id="${item.index}" class="game-cell border border-secondary rounded text-center p-2 m-1">${item.points} pts</div>
            `)
        })
    })
})

const selectRandomCell = () => {
    $(".game-cell").removeClass("bg-success")
    /*obtener la cantidad de casillas*/
    let cellsQuantity = $(".game-cell:not('.bg-success')").length - 1;

    /*obtener un número al azar dentro del rango creado con la cantidad de casillas*/

    let randomIndex = Math.floor(Math.random() * (cellsQuantity - 0) + 0);
    /*seleccionar la casilla correspondiente a ese número*/
    /*modificar el estilo de la casilla seleccionada*/
    $(".game-cell:not('.bg-success')").eq(randomIndex).addClass("bg-success");
}

const startGame = () => {
    var timer = setInterval(selectRandomCell,100)
    setTimeout(()=>{
        clearInterval(timer);
        let questionIndex = $(".bg-success").data
        ("question-id");

        $.ajax({
            url: `https://kodepardy.firebaseio.com/questions/${questionIndex}.json`,
            method:"GET",
            success: (response) => {
                console.log(response)
                firebase.database().ref('currentQuestion').set({...response,isAnswered:false})
            }
          });

        console.log(questionIndex)
    },2000)
}


