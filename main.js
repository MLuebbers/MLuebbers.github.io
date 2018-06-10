let view = "about";
let mouseMove = false;
let timeOut;
let ctx;
let lp = {x:null, y:null};
let samples = [];
let mute = false;
let draw = true;

let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Create an empty three-second stereo buffer at the sample rate of the AudioContext
let currSource;
let myArrayBuffer = audioCtx.createBuffer(2, audioCtx.sampleRate*1.5, audioCtx.sampleRate);
$(document).ready(function() {
    $('#about-link').click(function() {
        goToAbout();
    });

    $('#notes-link').click(function() {
        goToNotes();
    });

    $('#volume').click(function() {
        if(mute === false){
            $('#volume').removeClass('fa fa-volume-up');
            $('#volume').addClass('fa fa-volume-off');
            mute = true;
        } else {
            $('#volume').removeClass('fa fa-volume-off');
            $('#volume').addClass('fa fa-volume-up');
            mute = false;
        }
    });
    $('#draw').click(function() {
        if(draw === true){
            $('#draw').removeClass('fa fa-eye');
            $('#draw').addClass('fa fa-eye-slash');
            draw = false;
        } else {
            $('#draw').removeClass('fa fa-eye-slash');
            $('#draw').addClass('fa fa-eye');
            draw = true;
        }
    });

    var c=document.getElementById("waveform");
    c.setAttribute('width',window.innerWidth);
    c.setAttribute('height',window.innerHeight);
    ctx=c.getContext("2d");

    addTumblr();

});

function addTumblr(){
    $.ajax({
        url: "https://api.tumblr.com/v2/blog/mluebbers.tumblr.com/posts?api_key=3djnNPx3M3rUZR5qdmzqAeHopZn1UyMI66GA1q9TWWui8Zht17",
        dataType: 'jsonp',
        error: function(){
            var text = 'Notes could not be retrieved.';
            $('#notes').append(text);
            $('#notes-link').addClass('error');
        },
        success: function(posts){
            var postings = posts.response.posts;
            var text = '';
            var lastDate = '';

            for (var i in postings) {

                var p = postings[i];
                text += '<p></p>';

                if(lastDate != p.date.substring(0,7)){
                    text += '<div class="post-date tumblr-date" ><span>' + p.date.substring(0,7) + '</span></div>';
                    lastDate = p.date.substring(0,7);
                }
                if(p.type == 'photo'){
                    text +='<img class="tumblr-img" src=' +  p.photos[0].original_size.url + '>' + p.caption
                    text += '<br><a href='+ p.post_url +'>'+ p.post_url +'</a></li>';
                }
                if(p.type == 'video'){
                    text += '<div class="video-container">' + p.player[0].embed_code + '</div>' +'<p></p>' + p.caption;
                }
                if(p.type == 'text'){
                    text += '<p class="tumblr-text">' +  p.body + '</p>';
                    text += '<br><a class="tumblr-link" href='+ p.post_url +'>'+ p.post_url +'</a></li>';
                }

                text += '<br></br>';
            }
            $('#notes').append(text);
        }
    });
}

function goToAbout() {
    view = "about";
    $('#content').removeClass('overflow');
    $('#about-link').addClass('fadeout');
    $('#about').removeClass('slideout');

    $('#notes-link').removeClass('fadeout');
    $('#notes').addClass('slideout');
}

function goToNotes() {
    view = "notes";
    $('#content').addClass('overflow');
    $('#about-link').removeClass('fadeout');
    $('#about').addClass('slideout');

    $('#notes-link').addClass('fadeout');
    $('#notes').removeClass('slideout');
}

function drawWaveform(e) {
    if(lp.x != null && lp.y != null){
        clearInterval(timeOut);
        samples[e.pageX] = e.pageY;
        if(lp.x < e.pageX){
            for(let i = lp.x; i < e.pageX; i ++){
                samples[i] = lp.y + ((lp.y-e.pageY)/(lp.x-e.pageX))*(i-lp.x);
            }
        } else {
            for(let i = lp.x; i > e.pageX; i --){
                samples[i] = lp.y + ((lp.y-e.pageY)/(lp.x-e.pageX))*(i-lp.x);
            }
        }

        ctx.clearRect(0,0,window.innerWidth,window.innerHeight);

        let s = 0;
        while(samples[s] != undefined){
            s ++;
        }


        ctx.beginPath();
        ctx.moveTo(s, samples[s]);
        for(let i = s; i < window.innerWidth; i ++){
            if(samples[i] != null){
                ctx.lineTo(i, samples[i]);
            }
        }

        if(draw === true){
            ctx.strokeStyle="lightgray";
            ctx.stroke();
        }
    }

    //Update last mouse position vector
    lp = {x:e.pageX, y:e.pageY};

    //Set timeout
    timeOut = setInterval(function(){
        clearInterval(timeOut);
        if(mute ===false){
            playAudioBuffer(samples);
        }
        samples = [];
        ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
        lp = {x:null, y:null};
    },250);
}

function prepSamples(s){
    let ps = [];
    let largest = 0;

    for(var i = s.length - 1; i >= 0; i--) {
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
    let normFactor = ps[largest];
    for(let i = 0; i < s.length; i ++){
        ps[i] = ps[i]/normFactor;
    }

    return ps;
}

// WebAudio API code adapted from MDN. 
function playAudioBuffer(buffer) {
    let gainNode = audioCtx.createGain();
    if(currSource != undefined){
        currSource.stop();
    }
    for (var channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
      // This gives us the actual array that contains the data
      var nowBuffering = myArrayBuffer.getChannelData(channel);
      let s = prepSamples(buffer);
      for (var i = 0; i < myArrayBuffer.length; i++) {
        nowBuffering[i] = s[i % s.length];
      }
    }
    // This is the AudioNode to use when we want to play an AudioBuffer
    var source = audioCtx.createBufferSource();
    currSource = source;
    // set the buffer in the AudioBufferSourceNode
    source.buffer = myArrayBuffer;
    // connect the AudioBufferSourceNode to the
    // destination so we can hear the sound
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    // start the source playing
    source.start();
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001,audioCtx.currentTime+1.5);
}
