let mouseMove = false;
let timeOut;
let ctx;
let lp = {x:null, y:null};
let samples = [];
let mute = false;
let lastScrollX = null;
let waveformBuffer;
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let canvasSize = {};

// Create an empty three-second stereo buffer at the sample rate of the AudioContext
let currSource;
let myArrayBuffer = audioCtx.createBuffer(2, audioCtx.sampleRate*1.5, audioCtx.sampleRate);

function setup() {
    canvasSize = {w:windowWidth, h:windowHeight};
    createCanvas(canvasSize.w, canvasSize.h); 
    waveformBuffer = createGraphics(canvasSize.w, canvasSize.h);
    
}

function windowResized() {
    canvasSize = {w:windowWidth, h:windowHeight};
    resizeCanvas(windowWidth, windowHeight);
}

function mouseMoved() {
    let startX;
    let endX;

    if(lp.x != null && lp.y != null){
        clearInterval(timeOut);
        samples[mouseX] = mouseY;
        if(lp.x < mouseX){
            for(let i = lp.x; i < mouseX; i ++){
                samples[i] = lp.y + ((lp.y-mouseY)/(lp.x-mouseX))*(i-lp.x);
            }
        } else {
            for(let i = lp.x; i > mouseX; i --){
                samples[i] = lp.y + ((lp.y-mouseY)/(lp.x-mouseX))*(i-lp.x);
            }
        }
        background(255);
        waveformBuffer.clear();

        let s = 0;
        while(samples[s] != undefined){
            s ++;
        }

        for(let i = 0; i <canvasSize.w; i ++){
            if(startX === undefined && samples[i] !== undefined ){
                startX = i;
            }
            if(samples[i] !== undefined){
                endX = i;
            }
        }

        //Draw
        waveformBuffer.noFill();
        waveformBuffer.beginShape();
        waveformBuffer.stroke(220);
        waveformBuffer.strokeWeight(1);
        waveformBuffer.vertex(s, samples[s]);
        periods = canvasSize.w/(Math.max(1,(endX-startX)));
        for(let j = -periods; j < periods; j++){
            for(let i = s; i < window.innerWidth; i ++){
                if(samples[i] != null){
                    waveformBuffer.vertex(i+(j*(endX-startX)),samples[i]);
                };        
            }
        }
        waveformBuffer.endShape();
    }
    
    
    //Update last mouse position vector
    lp = {x:mouseX, y:mouseY};

    image(waveformBuffer,0,(windowHeight/2)-samples[startX]);
    timeOut = setInterval(function(){
        clearInterval(timeOut);
        if(mute ===false){
            playAudioBuffer(samples);
        }
        samples = [];
        waveformBuffer.clear();
        background(255);
        image(waveformBuffer,0,0);
        lp = {x:null, y:null};
    },250);

}



function prepSamples(s){
    let ps = [];
    let largest = 0;

    for(let i = s.length - 1; i >= 0; i--) {
        if(s[i] === undefined) {
            s.splice(i, 1);
        }
    }

    for(let i = 0; i < s.length; i ++){
        ps[i] = s[i]-s[0];
        if(Math.abs(ps[i]) > Math.abs(ps[largest])){
            largest = i;
        }
    }
    
    for(let i = 0; i < s.length; i ++){
        ps[i] = ps[i]/window.innerHeight/1.5;
    }

    return ps;
}

// WebAudio API code adapted from MDN. 
function playAudioBuffer(buffer) {
    let gainNode = audioCtx.createGain();
    if(currSource != undefined){
        currSource.stop();
    }
    for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
      // This gives us the actual array that contains the data
      let nowBuffering = myArrayBuffer.getChannelData(channel);
      let s = prepSamples(buffer);
      for (let i = 0; i < myArrayBuffer.length; i++) {
        nowBuffering[i] = s[i % s.length];
      }
    }
    // This is the AudioNode to use when we want to play an AudioBuffer
    let source = audioCtx.createBufferSource();
    currSource = source;
    // set the buffer in the AudioBufferSourceNode
    source.buffer = myArrayBuffer;
    // connect the AudioBufferSourceNode to the
    // destination so we can hear the sound
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    // start the source playing
    source.start();
    moveLetters();
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001,audioCtx.currentTime+1.5);
}

let waveInterval;
function moveLetters(){
    clearInterval(waveInterval);
    let interpolate = Math.random();
    let amplitude = 25;
    let countDown = 8;
    waveInterval = setInterval(function(){
        if(countDown == 0){
            clearInterval(waveInterval);
        }
        interpolate += Math.PI;
        $(".letter" ).each(function( index ) {
            $(this).css("top", `${(Math.sin(2*Math.PI/$(".letter").length*index+(2*Math.PI*interpolate))*amplitude).toString()+"px"}`);
        });
        amplitude -= 25/8;
        countDown --;
    }, 125);
}