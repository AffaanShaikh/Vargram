export class UI {
    constructor(game){
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Creepster';
        this.livesImage = document.getElementById('lives'); 
    }
    draw(context){//to draw all UI elements and statuses 
        context.save();//wrapping code in save and restore to ensure the settings here only affect this text
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'white';
        context.shadowBlur = 0;
        context.font = this.fontSize + 'px ' + this.fontFamily;
        this.textAlign = 'left';
        context.fillStyle = this.game.fontColor;//fillstyle returns color gradient
        //score
        context.fillText('Score: ' + this.game.score, 20, 50);//fillText draws filled text on the canvas(default color: black). args-(text,x,y,maxWidth)
        //timer
        context.font =  this.fontSize * 0.6 + 'px ' + this.fontFamily;
        context.fillText('Time: ' + (this.game.time * 0.001).toFixed(1), 20, 80);//milli to sec by '* 0.001' and .toFixed for seeing only 1 decimal space 
        //lives
        for(let i = 0; i < this.game.lives; i++){
            context.drawImage(this.livesImage, 30 * i + 20, 95, 25, 25);// +20 for margin
        }
        //game over message
        if(this.game.gameOver) {
            context.textAlign = 'center';
            context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
            if(this.game.score > this.game.winningScore){
                context.fillText('YOU WIN!', this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily; 
                context.fillText('WELL PLAYED.', this.game.width * 0.5, this.game.height * 0.5 + 20);
            } else {
                context.fillText('YOU LOSE!', this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily; 
                context.fillText('NEED TO BE QUICKER THAN THAT!', this.game.width * 0.5, this.game.height * 0.5 + 20);
            }   
        }
        context.restore();
    }
}