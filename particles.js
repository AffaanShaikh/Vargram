class Particle {
    constructor(game){
        this.game = game;
        this.markedForDeletion = false;
    }
    update(){
        this.x -= this.speedX + this.game.speed;
        this.y -= this.speedY;
        this.size *= 0.95//for every frame size of each particle will decrease by 5%
        if(this.size < 0.5) this.markedForDeletion = true;//when particle is small enough to be deleted
    }
}

export class Dust extends Particle {
    constructor(game, x, y){
        super(game);
        this.game = game;
        this.size = Math.random() * 10 + 10;//random no. btw. 10&20
        this.x = x;//X co-ord will be x passed as argument, same for y
        this.y = y;
        this.speedX = Math.random();//random no. btw. 0&1
        this.speedY = Math.random();
        this.color = 'rgba(0,0,0,0.2)';
    }
    draw(context){
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);//arc args (x-coord,y,radius,startingAngle,endingAngle,(optional)counterclockwise);
        //to create a full circle sAngle is 0 and eAngle is Math.PI * 2
        context.fillStyle = this.color;
        context.fill();//filling path with black color(default)


    }
}

export class Splash extends Particle {
    constructor(game, x, y){
        super(game);
        this.size = Math.random() * 100 + 100;//between 10 and 200pixels
        this.x = x - this.size * 0.4;//offsetting x and y of particle effect
        this.y = y - this.size * 0.5;
        this.speedX = Math.random() * 6 - 4;
        this.speedY = Math.random() * 2 + 1;
        this.gravity = 0;//logic similar to player jumping
        this.image = document.getElementById('fire');
    }
    update(){
        super.update();
        this.gravity += 0.1;
        this.y += this.gravity;
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y, this.size, this.size);
    }
}

export class Fire extends Particle {
    constructor(game, x, y){
        super(game);
        this.image = document.getElementById('fire');
        this.size = Math.random() * 100 + 50;//random value between 50 and 150 pixels
        this.x = x;//x and y passed as argument
        this.y = y;
        this.speedX = 1;//1 pixel per frame(horiz and vertical speed)
        this.speedY = 1;
        this.angle = 0;
        this.va = Math.random() * 0.2 - 0.1; //random value btw. -0.1 and 0.1, can be used to adjust rotation speed
    }
    update(){
        super.update();
        this.angle += this.va;
        this.x += Math.sin(this.angle * 5);//for wave in fire trail

    }
    draw(context){
        context.save();//to not let the rotations overflow and affect the fire element, we rub this code between save and restore
        context.translate(this.x, this.y);//translating rotation centre point from it's default value(0,0) of the canvas to the destination/center of the item we want to rotate(basically, relocating origin/centre point of rotation)
        context.rotate(this.angle);//takes angle value in radians
        context.drawImage(this.image, -this.size * 0.5, -this.size * 0.5, this.size, this.size);
        context.restore();//this ensures all canvas settings we declare inbetw. only affects this one particle
    } 
}