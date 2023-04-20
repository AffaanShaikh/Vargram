import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit} from "./playerStates.js";
import { CollisionAnimation } from "./collisionAnimation.js";
import { FloatingMessage } from "./floatingMessages.js";

export class Player{ //n no. of exports but only 1 default export for a module/file
    constructor(game){
        this.game = game; //js obj are so called reference datatypes(work as pointer, no copy of "game" obj. is created, only 'pointed' towards.
        this.width = 100; // ^ reference of 'game' converted to class property "game" through this.game = game  
        this.height = 91.3 ;
        this.x = 0;
        this.vy = 0;// vertical velocity(speed)
        this.weight = 1;//to help player get down after jumping
        this.y = this.game.height - this.height - this.game.groundMargin; // To align player to the bottom of the game area, player object need to be aware of game height.
        this.image = document.getElementById('player'); //property created, pointed to image element in .html by getElementById
        this.frameX = 0;//horizontal cycling (left to right) in sprite sheet for animation
        this.frameY = 0;//vertical cycling on change of state
        this.maxFrame;
        this.speed = 0;
        this.maxSpeed = 10;//player's speed in pixels per frame.      
        //fps adjustment
        this.fps = 30;//docspritesheet animation requirements is 20fps
        this.frameInterval = 1000/this.fps;//variable to hold how long 1 frame stays on screen
        this.frameTimer = 0;//cycle between 0 and frameInterval increased by deltaTime for each frame   
        //Helper props. to apply state design patterns (below)
        this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game)];//instantiate each state class. 'this.game' since the states expect game argument
        this.currentState = null;//OPT: .currentState belongs in player.js
    }
    update(input, deltaTime){ 
        this.checkCollision();
        this.currentState.handleInput(input);
        //horizontal movement
        this.x += this.speed;
        if (input.includes('ArrowRight') && this.currentState !== this.states[6]) this.speed = this.maxSpeed;//.includes returns tru/false based on whether the value is included in the array(here, inderOf method is valid too)
        else if (input.includes('ArrowLeft') && this.currentState !== this.states[6]) this.speed = -this.maxSpeed;//also disabling left&right movement on hit 
        else this.speed = 0;//stops the player if no left/right key pressed
        //horizontal boundaries
        
        // these 2 lines to keep the player within the canvas borders 
        if(this.x < 0) this.x = 0;
        if(this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        //vertical movement(moved to playerStates>Jumping )
        this.y += this.vy; 
        if(!this.onGround()) this.vy += this.weight;//whenever the player is not standing on the ground
        else this.vy = 0;
        //vertical boundaries(to avoid player getting stuck under ground) Resetting player's y to on ground when it goes below ground
        if(this.y > this.game.height - this.height - this.game.groundMargin) 
        this.y = this.game.height - this.height - this.game.groundMargin;
        //sprite animation
        if(this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if(this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0; 
        } 
        else{
            this.frameTimer += deltaTime;
        }
    }
    draw(context){
        if(this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);//drawing rectangle around player object AKA hitboxes
        context.drawImage(this.image, this.frameX*(this.width), this.frameY*(this.height), this.width, this.height, this.x, this.y, this.width, this.height) //The drawImage() method draws an image, canvas, or video onto the canvas, (can animate an image)can also draw parts of an image, and/or increase/reduce the image size.
    }//9 arguments of .drawImage(theimage, ('cropped' rectangle in the sheet)(source x and y axis of the rect.) sx, sy, swidth, sheight, destinationx, dest.y, dest.width , dest.height)
    onGround(){// to check if the player is in the air
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state, speed){//function to change states
        this.currentState = this.states[state];//arg. 'state' is a no. correspondent to the index in this.states array
        this.game.speed = speed*this.game.maxSpeed;//setting speed prop. on game obj. to the passed'speed' argument times maxSpeed(this way we can adjust game speed by adjusting maxSpeed's value)
        //console.log(this.game.speed);
        this.currentState.enter();//to set up speed and sprite anim.
    }
    checkCollision(){//here we cycle throught the 'enemies' array, through each currently held enemy object and compare they're x&y-width&height to the x&y-width&height of the player
        this.game.enemies.forEach(enemy => {
            if( 
                enemy.x < this.x + this.width &&//2 conditions to know horizontal collision btw. player and enemy
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&//2 vertical collision check
                enemy.y + enemy.height > this.y
            ){
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                if(this.currentState === this.states[4] || this.currentState === this.states[5]){// if rolling or diving, we score
                    this.game.score++;
                    this.game.floatingMessages.push(new FloatingMessage('+1', enemy.x, enemy.y, 150, 50));//args for 'floatingMessages class constructor
                } else {
                    this.setState(6, 0)//6 is index of 'Hit' state and setting game speed to 0 on hit
                    if(this.game.score > 5) this.game.score -= 5;//penalty for getting hit
                    this.game.lives--;
                    if(this.game.lives <= 0) this.game.gameOver = true;
                }
            }
        });
    }
}