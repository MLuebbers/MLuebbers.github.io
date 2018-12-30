let chain = []

function setup() {
    createCanvas(640, 480); 
}
    
function draw() {
    background(255);
    let lastPoint = undefined;
    let currPoint = undefined;
    for(let x = 0; x < 640; x++){
        if(chain[x] !== undefined)
            currPoint = chain[x];
            if(lastPoint !== undefined){
                line(currPoint.x, currPoint.y, lastPoint.x, lastPoint.y);
            }
            lastPoint = currPoint;
    }

    line(0,0,640,480); 
}

let lastMousePosition = undefined;
let currentMousePosition = undefined;

function mouseMoved(){
    currentMousePosition = {x:mouseX, y:mouseY};
    chain[mouseX] = {x:mouseX, y:mouseY};
    if(lastMousePosition !== undefined){
        if(currentMousePosition.x > lastMousePosition.x){
            for(let x = currentMousePosition.x-1; x > lastMousePosition.x; x --){
                chain[x] = undefined;
            }
        } else {
            for(let x = currentMousePosition.x+1; x < lastMousePosition.x; x ++){
                chain[x] = undefined;
            }
        }   
    }
    lastMousePosition = currentMousePosition;
    
}