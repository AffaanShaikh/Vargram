export class FloatingMessage {
    constructor(value, x, y, targetX, targetY){
        this.value = value;
        this.x = x;//initial x&y
        this.y = y;
        this.targetX = targetX;//target x&y i.e towards 'score'
        this.targetY = targetY;
        this.markedForDeletion = false;
        this.timer = 0;//messages disappear after this timer
    }
    update(){
        this.x += (this.targetX - this.x) * 0.03;//to move the message towards the score
        this.y += (this.targetY - this.y) * 0.03;//multiplyin the current pos by 3% of the difference between target and current posis(since difference gets smaller the speed of floating values decreases)
        this.timer++;
        if(this.timer > 100) this.markedForDeletion = true;
    }
    draw(context){
        context.font = '20px Creepster';
        context.fillStyle = 'white';
        context.fillText(this.value, this.x, this.y);
        context.fillStyle = 'black';//duplicated for canvas shadowing
        context.fillText(this.value, this.x - 2, this.y - 2);// - 2 offset added for shadow effect     
    }
}