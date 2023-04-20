class Layer {
    constructor(game, width, height, speedModifier, image){
        this.game = game;
        this.width = width;
        this.height = height;
        this.speedModifier = speedModifier;
        this.image = image;
        this.x = 0;
        this.y = 0;
    }
    update(){
        if(this.x < -this.width) this.x = 0;
        else this.x -= this.game.speed * this.speedModifier;
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);//to create seamlessly scrolling bg, we draw same image twice, next to each other
    }
}

export class Background {
    constructor(game){
        this.game = game;
        this.width = 1667;
        this.height = 500;
        this.layer1image = document.getElementById('layer1');//since JavaScript auto. creates references to all elements with an id in the global namespace
        this.layer2image = document.getElementById('layer2');
        this.layer3image = document.getElementById('layer3');
        this.layer4image = document.getElementById('layer4');
        this.layer5image = document.getElementById('layer5');
        this.layer1 = new Layer(this.game, this.width, this.height, 0, this.layer1image);//instance of layer class
        this.layer2 = new Layer(this.game, this.width, this.height, 0.2, this.layer2image);
        this.layer3 = new Layer(this.game, this.width, this.height, 0.4, this.layer3image);
        this.layer4 = new Layer(this.game, this.width, this.height, 0.8, this.layer4image);
        this.layer5 = new Layer(this.game, this.width, this.height, 1, this.layer5image);
        this.backgroundLayers = [this.layer1, this.layer2, this.layer3, this.layer4, this.layer5];//array to hold all background images
    }
    update(){
        this.backgroundLayers.forEach(layer =>{
            layer.update();
        })
    }
    draw(context){
        this.backgroundLayers.forEach(layer =>{
            layer.draw(context);
        })
    }
}