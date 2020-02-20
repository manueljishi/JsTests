window.onload = function() {
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
console.log(ctx);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

//get mouse position
let mouse  ={
    x: null,
    y: null,
    radius: (canvas.height/120) * (canvas.width/120)
}
window.addEventListener('mousemove',
    function(event){
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

//create particle
class Particle {
    constructor(x, y, directionX, directionY, size, color){
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = '';
    }
    //Color setter to change opacity based on distance to cursor
    setColor(a){
            this.color = a;
    }
    //check particle position, check mouse position, move the particle, draw the particle
    update(){
        //check if particle is still within canvas
        if(this.x > canvas.width || this.x < 0){
            this.directionX = -this.directionX;
        }    
        if(this.y > canvas.height || this.y < 0){
            this.directionY = -this.directionY;
        }

        //check collision detection - mouse position / particle position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if(distance < mouse.radius + this.size){
                if(mouse.x < this.x && this.x < canvas.width - this.size * 10){
                    this.x += 3;
                    this.directionX = -this.directionX;
                }
                if(mouse.x > this.x && this.x > this.size * 10){
                    this.x -= 3;
                    this.directionX = -this.directionX;
                }
                if(mouse.y < this.y && this.y < canvas.height - this.size * 10){
                    this.y += 3;
                    this.directionY = -this.directionY;
                }
                if(mouse.y > this.y && this.y > this.size * 10){
                    this.y -= 3;
                    this.directionY = -this.directionY;
                }
        }
        //move particle
        this.x += this.directionX;
        this.y += this.directionY;
        
        //draw particle 
        this.draw();
    }
        //method to draw individually
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}



//create particle array 
function init(){
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for(let i = 0; i < numberOfParticles; i++){
        let size = (Math.random() * 3) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2 );
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2 );
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = '#FFFFFF';

        //Instantiate every particle and push it into the array
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}
//check if particles are close enough to draw a line between them
function connect(){
    let opacityValue = 1;
    for(let a = 0; a < particlesArray.length; a++){
        //The connections array will store all the nodes that are connected to the point we are checking
        let connections = [];
        for(b = a; b < particlesArray.length; b++){
            let distance =getDistanceWithoutSQRT((particlesArray[a].x - particlesArray[b].x), (particlesArray[a].y - particlesArray[b].y));
                //Int this statement we can adjust the distance we want to connect the nodes and also the manimum number of connections we want for each node
            if(distance < (canvas.width / 8) * (canvas.height/8) && connections.length < 3){
                connections.push(particlesArray[b]);
                //This opacity value is an alpha value to connection lines that grows thicker when particles
                // are closer and starts fading as distance increase
                opacitValue = opacityValue - (distance/2000);
                ctx.strokeStyle ='rgba(140,85,31,'+ opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }else{
                connections.pop;
            }
            }
    }
}

//animation loop
function animate(){
    //Call this method as a callback to perform an animation every time the browser paints the values on screen
    //Number of callbacks will be usually 60 times / second 
    
    ctx.clearRect(0,0, innerWidth, innerHeight);
    for(let i = 0; i < particlesArray.length; i++){
        let opacity = 1/0.01*getDistance((particlesArray[i].x - mouse.x), (particlesArray[i].y - mouse.y));
        console.log(1/5*getDistance((particlesArray[i].x - mouse.x), (particlesArray[i].y - mouse.y)));
        let color = 'rgba(0,0,0,' + opacity + ')';
        particlesArray[i].setColor(color);
        particlesArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}
init();
animate();

//resize event for recalculating variables such as mouse radius
window.addEventListener('resize',
    function(){
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height/120) * (canvas.width/120));
        init();
    }
);

//function to stop particles detecting the mouse when it's out
window.addEventListener('mouseout',
    function(){
        mouse.x = undefined;
        mouse.y = undefined;
    }    
);

function getDistanceWithoutSQRT(a, b){
    return ((a * a) + ( b * b));
}
function getDistance(a, b){
    return Math.sqrt((a * a) + ( b * b));
}

}