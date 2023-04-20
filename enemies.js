//javascript doesn't actually have classes/subclasses(or the concept?), below is just modern,clean and simplified js syntax(behind scenes:js inheritence comes into play)
class Enemy {
    constructor(){
        //Sprite navigation
        this.frameX = 0;
        this.frameY = 0;
        //fps controlling, 3 helper variables
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        //for deletion of enemy objects
        this.markedForDeletion = false;
    }
    update(deltaTime){//deltaTime is the difference in millisec. between the previous and current anim. frame
        //movement
        this.x -= this.speedX + this.game.speed;//enemiesX&Y, also accounting for game speed 
        this.y += this.speedY;
        if(this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if(this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0; 
        } 
        else{
            this.frameTimer += deltaTime;
        }
        //Checking if enemy object is offscreen,then marking it for deletion
        if(this.x + this.width < 0) this.markedForDeletion = true;
    }
    draw(context){
        if(this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);//hitboxes for enemies
        context.drawImage(this.image, this.frameX*(this.width), 0, this.width, this.height, this.x, this.y, this.width, this.height,);/*drawin enemy spritesheet using 'drawImage' method
         arguments-(the image , next 4 arguments define what to crop out, the next 4 define where to put the cropped image on the canvas)
         this.frameX*this.width, width of a single frame to advance in the sprite sheet. 0 for Source Y because enemy sprite sheet has only 1 row*/
    }
}

export class FlyingEnemy extends Enemy {
    constructor(game){
        super();//extending parent class 'constructor'
        this.game = game;//to be aware of game area width and height, instance of game class created(converted game into class property)
        this.width = 60;//width & height is different for each enemy type, hence not declared in parent class
        this.height = 44;//width&height of a single frame in the sprite sheet
        this.x = this.game.width + Math.random() * this.game.width * 0.5//flyin enemy startin at diff. loc then others, hence co-ordinates defined here(to get more randomnes in the initial position and spacing between each enemies)
        this.y = Math.random() * this.game.height * 0.5;//to put flyinenemies randomly and above ground(0.5times from game height)
        this.speedX = Math.random() + 1;//Horizontal Speed(randomizing it to make enemies move at different speeds)(value btw. 1&2 pixelsframe)
        this.speedY = 0;    
        this.maxFrame = 5;
        this.image = document.getElementById('enemy_fly');
        //helper variables for wavemovement in flyingenemies 
        this.angle = 0;
        this.va = Math.random() * 0.1 + 0.1;//velocity of angle, the value by which the angle will increase
    }
    update(deltaTime){//this way, all code inside 'update' in the parent class will run first and then code specified here(specific to flying enemies) will run
        super.update(deltaTime);//extending parent class 'method'
        this.angle += this.va; 
        this.y += Math.sin(this.angle);//feeding the slowly increasing angle to math.sin(), which maps it along  a sine wave
    }
}

export class GroundEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 60;
        this.height = 87;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = document.getElementById('enemy_plant');
        this.speedX = 0;
        this.speedY = 0;
        this.maxFrame = 1;
    }
}

export class ClimbingEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 120;
        this.height = 144;
        this.x = this.game.width;
        this.y = Math.random() * this.game.height * 0.5;
        this.image = document.getElementById('enemy_spider_big');
        this.speedX = 0;
        this.speedY = Math.random() > 0.5 ? 1 : -1;//example of ternary operator 
        this.maxFrame = 5;
    }
    update(deltaTime){
        super.update(deltaTime);//first runs update method from parent class
        if(this.y > this.game.height - this. height - this.game.groundMargin) this.speedY *= -1;//setting spider's y speed to its negative to make it go the other direction when bottom is reached
        if(this.y < -this.height) this.markedForDeletion = true;
    }
    draw(context){
        super.draw(context);
        //to create the spider's web 
        context.beginPath();
        context.moveTo(this.x + this.width/2, 0); //moveTo sets initial x&y co-ords of the line
        context.lineTo(this.x + this.width/2, this.y + 50);//lineTo defines the ending x&y co-ords
        context.stroke();
    }
}