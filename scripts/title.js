$("document").ready(function(){
    let titleString = $('#title').text();
    let titleLetters = "";
    titleString.split('').forEach(function(i){
        titleLetters += `<span class="letter">${i}</span>`;
    });
        
    $('#title').replaceWith(`<div id="title">${titleLetters}</div>`)
    
});