export class CollisionAnimation {
    constructor(game, x, y){
        this.game = game;
        this.image = document.getElementById('collisionAnimation');
        this.spriteWidth = 100;//Width&Height of a frame of boom sprite sheet
        this.spriteHeight = 90;
        this.sizeModifier = Math.random() + 0.5;//variable to cause size difference in boom effects 
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = x - this.width * 0.5;//adjusting x&y to center of the animation
        this.y = y - this.height * 0.5;
        this.frameX = 0;
        this.maxFrame = 4;
        this.markedForDeletion = false;
        //controlling animation speed
        this.fps = Math.random() * 10 + 5;
        this.frameInterval = 1000/this.fps;//amount of millsec. that need to pass before passing next animation frame
        this.frameTimer = 0;//counting from 0 to frameInterval
    }
    draw(context){
        //first 4 args specify which area we want to crop out from the source spritesheet. Next 4 specify where to draw the cropped out frame on destination canvas
        context.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
    update(deltaTime){//to ensure collision animations move with the game world
        this.x -= this.game.speed;
        if(this.frameTimer > this.frameInterval){
            this.frameX++;
            this.frameTimer = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        if(this.frameX > this.maxFrame) this.markedForDeletion = true;
        //console.log(this.game.collisions);
    }
}