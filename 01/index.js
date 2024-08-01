let canvas;
let ctx;
let flowfield;
let flowfieldAnimation;

window.onload = function(){
    canvas = document.getElementById("canvas1");
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    flowfield = new FlowFieldEffect(ctx,canvas.width,canvas.height);
    flowfield.animate(0);
}

const mouse = {
    x:0,
    y:0
}

window.addEventListener("mousemove",function(e){
    mouse.x = e.x;
    mouse.y = e.y;
})

window.addEventListener('resize', function(){
    cancelAnimationFrame(flowfieldAnimation);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    flowfield = new FlowFieldEffect(ctx,canvas.width,canvas.height);
    flowfield.animate(0);
})

window.addEventListener('mousedown' , function(){
    this.cancelAnimationFrame(flowfieldAnimation);
})

window.addEventListener('mouseup',function(){
    flowfield.animate(0);
})

class FlowFieldEffect{
    #ctx;
    #width;
    #height;

    constructor(ctx, width,height){
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        console.log("ji",this.#ctx);
        this.#ctx.strokeStyle='white';
        this.#ctx.lineWidth=1;
        this.lasttime = 0;
        this.interval = 1000/120;
        this.timer = 0;
        this.cellSize = 15;
        this.gradient ;
        this.#createGradient();
        this.#ctx.strokeStyle = this.gradient;
        this.radius = 0;
        this.vr = 0.03;
    }

    #createGradient(){
        this.gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height);
        this.gradient.addColorStop("0.1","#ff5c33");
        this.gradient.addColorStop("0.2","#ff66b3");
        this.gradient.addColorStop("0.4","#ccccff");
        this.gradient.addColorStop("0.6","#b3ffff");
        this.gradient.addColorStop("0.8","#80ff80");
        this.gradient.addColorStop("0.9","#ffff33");
        
    }

    #drawLine(angle,x,y){
        let positionX = x;
        let positionY = y;
        let dx = mouse.x - positionX;
        let dy = mouse.y - positionY;
        let distance = (dx *dx + dy*dy);
        // if(distance<100000) distance = 100000;
        let length = distance/1000;
        const drr = 2
        if(length >this.cellSize *drr) length = this.cellSize *drr;
        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
        this.#ctx.lineTo(x+Math.cos(angle) *length , y + Math.sin(angle) *length);
        this.#ctx.stroke();
    }

    animate(timeStamp){
        let deltaTime = timeStamp - this.lasttime;
        this.lasttime = timeStamp;
        if (this.timer > this.interval) {
            this.#ctx.clearRect(0, 0, this.#width, this.#height);
            this.radius += this.vr;
            if (this.radius <-5 ||  this.radius>5) {
                this.vr*=-1;
            }

            for (let y = 0; y < this.#height; y+=this.cellSize) {
                for(let x = 0 ; x<this.#width ; x+=this.cellSize){
                    const angle = (Math.cos(x * 0.02) + Math.sin(y *0.02)) * this.radius;
                    this.#drawLine(angle,x,y);
                }
            }
            this.timer=0;
        }else{
            this.timer += deltaTime;
        }
        flowfieldAnimation = requestAnimationFrame(this.animate.bind(this));
    }


}