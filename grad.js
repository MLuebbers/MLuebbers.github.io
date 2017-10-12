

var c = document.getElementById("grad");
var ctx = c.getContext("2d");

// Create gradient
var grd = ctx.createLinearGradient(0,100,0,0);
grd.addColorStop(0,"blue");
grd.addColorStop(1,"white");

// Fill with gradient
ctx.fillStyle = grd;
ctx.fillRect(0,0,c.offsetWidth , c.offsetHeight);
