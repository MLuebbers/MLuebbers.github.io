$("document").ready(function(){
    let titleString = $('#title-container .title').text();
    let titleLetters = "";
    titleString.split('').forEach(function(i){
        titleLetters += `<span class="letter">${i}</span>`;
    });
        
    $('#title-container .title').replaceWith(`<div class="title">${titleLetters}</div>`)
    
});