
let sequence = [];
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
$(".item").hover(function(){
    $(this).addClass("selected");
    $(this).siblings(".selected").removeClass("selected");
    let t = $(this).parent().parent().children().index($(this).parent());
    let v = $(this).parent().children(".item").index(this);
    sequence[t] = v;

});

let note = -1;
let allNotes = $("#container").children(".row");
let numNotes = allNotes.length;
$("document").ready(function(){
    setInterval(function(){
        note = (note+1)% numNotes;
        $(allNotes[note]).addClass("played");
        $(allNotes[note]).siblings(".played").removeClass("played");
        playSound(sequence[note]);
    },500);
    
});




function playSound(v){
    if(v !== undefined){
        var oscillator = audioCtx.createOscillator();
        let gainNode = audioCtx.createGain();
        let filterNode = audioCtx.createBiquadFilter();


        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(440 * Math.pow(Math.pow(2,1/12), v), audioCtx.currentTime); // value in hertz

        filterNode.type = "lowpass";
        filterNode.frequency.setValueAtTime(500, audioCtx.currentTime);
       
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001,audioCtx.currentTime+0.5);

        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        

        oscillator.start();

        setTimeout(function(){
            oscillator.stop();
            oscillator.disconnect();
        }, 500);
    } 
} 



