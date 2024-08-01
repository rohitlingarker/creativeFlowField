let canvas;
let ctx;
let ef;
window.onload = function(){
    canvas = document.getElementById('canvas1');
    context = canvas.getContext('2d');
    console.log(context);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ef =new Effect(canvas.width,canvas.height,context);
    ef.init();
    ef.animate();

}

let mouse = {
    x: 0,
    y: 0
}

window.addEventListener('resize',function(){
    location.reload();
})

window.addEventListener('mouseup',function(e){
    mouse.x = e.x;
    mouse.y = e.y;
    ef.blast()
})

class Particle{
    constructor(x, y , color , effect) {
        this.initialX = x;
        this.initialY = y;
        // this.x = x;
        // this.y = y;
        this.x = Math.random() * effect.width;
        this.y = Math.random() * effect.height;
        this.vx = 0;
        this.vy = 0;
        this.size = 5;
        this.color = color;
    }

    draw(ctx){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        // ctx.rect(this.x,this.y,this.size,this.size);
        ctx.arc(this.x , this.y,this.size/2,0,Math.PI*2)
        ctx.fill();
    }
    update(){
        this.x += this.vx;
        this.y += this.vy;
        this.vx = (this.initialX - this.x)/100 ;
        this.vy = (this.initialY - this.y)/100 ;
    }
}

class Effect{
    constructor(width,height,ctx) {
        this.particles = [];
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.ctx.fillStyle = 'white';
        this.pstep = 10;
        this.centerX = this.width/2;
        this.centerY = this.height/2;
        this.blastRadius = 1000;
    }

    getImageData(){
        const image = document.getElementById('image1');
        const imgWidth = image.width;
        const imgHeight = image.height;
        const percent = 1;
        this.ctx.drawImage(image, 0, 0, imgWidth * percent, imgHeight *percent);
        const imgaeData = this.ctx.getImageData(0,0,this.width,this.height);
        return imgaeData;
    }

    getTextData(text){
        let textData = this.ctx.measureText(text);
        let fontSize = Math.floor(this.width / textData.width);
        if(fontSize>50) fontSize = 50;
        this.ctx.font = `${fontSize *8}px serif`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, this.centerX,this.centerY +fontSize*2);
        const imgaeData = this.ctx.getImageData(0,0,this.width,this.height);
        return imgaeData;
    }

    init(){
        const pixelsArray = this.getTextData("Rohit").data;
        // const pixelsArray = this.getImageData().data;
        for (let y=0 ; y<this.height; y+=this.pstep){
            for (let x=0 ; x<this.width; x+=this.pstep){
                const index = (y * this.width + x ) *4;
                const r = pixelsArray[index];
                const g = pixelsArray[index+1];
                const b = pixelsArray[index+2];
                const a = pixelsArray[index+3];
                if (a > 0) {
                    this.particles.push(new Particle(x,y,`rgb(${r},${g},${b})`,this));
                }
            }
        }

        
    }

    drawLine(p1,p2,distance){
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'yellow';
        this.ctx.lineWidth = 100/distance;
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();

    }

    randomize(){
        this.particles.forEach(particle=>{
            particle.x = Math.random() * this.width;
            particle.y = Math.random() * this.height;
        })
    }

    blast(){
        this.particles.forEach(particle=>{
            const dx =  particle.x - mouse.x ;
            const dy = particle.y - mouse.y ;
            const distance = dx * dx + dy * dy;
            if(distance < 3600){
                particle.x = mouse.x + this.blastRadius * dx / distance;
                particle.y = mouse.y + this.blastRadius * dy / distance;
            }
        })
    }


    animate(){
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.particles.forEach(particle => {
            particle.draw(this.ctx);
            particle.update();
        });
        for(let i=0;i<this.particles.length;i++){
            for(let j=i;j<this.particles.length;j++){
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = dx * dx + dy * dy;
                if(distance < 3600){
                    this.drawLine(this.particles[i],this.particles[j],distance);
                }
            }
        }
        console.log('animating');
        requestAnimationFrame(() => this.animate());
    }
}