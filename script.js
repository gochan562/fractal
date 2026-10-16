const canvas = document.getElementById("fractal");
const ctx = canvas.getContext("2d");
const palette = document.getElementById("palette");
const iterations = document.getElementById("iterations");
const iterationValue = document.getElementById("iteration-value");
const resetButton = document.getElementById("reset");

let centerX= -0.5;
let centerY= 0;
let viewWidth = 3.5;

function mandelbrot(x, y, maxIterations) {
    let a = 0;
    let b = 0;
    let count = 0;
    while (a*a+b*b <= 4 && count < maxIterations){
        let newa = a*a-b*b+x;
        let newb = 2*a*b+y;

        a = newa;
        b=newb;
        count++;
    }
    return count;
}

function getColor(count,maxIterations){
    if (count === maxIterations){
        return [5, 8, 20];
    }
    if (palette.value === "violet"){
        return [count*5%255, count *2%150, 220];
    }
    if (palette.value === "ember"){
        return [255, count*4%255, count*2%100];
    }
    return [count*2%100, count *5%255, 220];
}

//render

function drawFractal() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const width = canvas.width;
    const height = canvas.height;
    const maxIterations = Number(iterations.value);
    const image = ctx.createImageData(width, height);
    const data = image.data;


    for (let py=0; py< height; py++ ) {
        for (let px = 0; px < width ; px++){
            let x = centerX + (px/width-0.5) * viewWidth;
            let y = centerY+ (py/height-0.5) * viewWidth*height/width;
            let count = mandelbrot(x,y,maxIterations);
            let color = getColor(count, maxIterations);
            let index = (py* width + px) * 4;

            data[index] = color[0];
            data[index+1] = color [1];
            data[index+2] = color [2];
            data[index+3] = 255;
        }
    }

    ctx.putImageData(image,0,0);
}

// event listenerss

palette.addEventListener("change", drawFractal);
iterations.addEventListener("input", () =>{
    iterationValue.textContent = iterations.value;
    drawFractal();
});

resetButton.addEventListener("click", () => {
    centerX = -0.5
    centerY = 0;
    viewWidth = 3.5;
    drawFractal();
});

window.addEventListener("resize", drawFractal);
drawFractal()

// countrol
canvas.addEventListener("wheel", (event)=>{
    
    event.preventDefault();
    const zoom = event.deltaY < 0? 0.8: 1.25;

    viewWidth *= zoom;
    drawFractal();
}, {passive: false});

let dragging = false;
let lastX = 0;
let lastY = 0;
canvas.addEventListener("pointerdown", (event) => {
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", (event) => {
    if (!dragging) return;

    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    centerX-=dx / canvas.width* viewWidth;
    centerY -= dy / canvas.height* viewWidth;
    lastX = event.clientX;
    lastY = event.clientY;

    drawFractal()
});
canvas.addEventListener("pointerup", () => {
    dragging = false;

});

canvas.addEventListener("pointercancel", () => {
    dragging = false;
})