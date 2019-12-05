const highlightRandomCell = () => {
    let randomIndex = Math.floor(Math.random() * (25 - 1) + 1);
    console.log(randomIndex)
    $(".body-cell").removeClass("bg-success")
    let randomCell = $(`.body-cell:eq(${randomIndex})`)
    if(!randomCell.hasClass('disabled')){
        randomCell.addClass("bg-success")
        console.log("invisible")
    }
        
    
}

var randomSelect = setInterval(highlightRandomCell, 300);