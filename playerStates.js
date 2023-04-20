import { Dust, Fire, Splash } from "./particles.js";

const states = {//enum object, holds key:value pairs
    SITTING: 0,//assign's each state number a more readable value
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
    DIVING: 5,
    HIT: 6
}

class State {
    constructor(state, game){
        this.state = state;//converting the argument into a class property for console loggin and debuggin purposes 
        this.game = game;
    }
}

export class Sitting extends State {
    constructor(game){//to access prop. on the player class, cons takes ref. to player obj. as an argument
        super('SITTING', game);//inorder to run constructor located in the parent/super class 
        //if we use 'this' before 'super' in a child class, error occurs
    }
    enter(){//run once, when this state is entered
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 4;
        this.game.player.frameY = 5;//frm line 16(this.player, that points to the player object) and set its frameY prop. to 5 
    }
    handleInput(input){//constantly check for particular inputs to transition into diff. states(every 60sec)
        if(input.includes('ArrowLeft') || input.includes('ArrowRight')){
            this.game.player.setState(states.RUNNING, 2);//instead of passing no. 0, using enum operator 'states'(line1) we pass RUNNING(more readabality)
        } else if(input.includes('Enter')){
            this.game.player.setState(states.ROLLING, 3);
        }
    }
}

export class Running extends State {
    constructor(game){//to access prop. on the player class, cons takes ref. to player obj. as an argument
        super('RUNNING', game);
    }
    enter(){//run once, when this state is entered
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 8;
        this.game.player.frameY = 3;
    }
    handleInput(input){//runs every 60 sec and checks for inputs
        //pushing instance of Dust into 'particles' array and adjusting the particles with resp. to the player
        //unshift(built-in array method) used instead of .push , to keep the old particles and slice the new ones during the slice operation
        this.game.particles.unshift(new Dust(this.game, this.game.player.x + this.game.player.width * 0.6, this.game.player.y + this.game.player.height));
        //inputs
        if(input.includes('ArrowDown')){
            this.game.player.setState(states.SITTING, 0);
        } else if(input.includes('ArrowUp')){
            this.game.player.setState(states.JUMPING, 2);
        } else if(input.includes('Enter')){
            this.game.player.setState(states.ROLLING, 3);
        }
    }
}

export class Jumping extends State {
    constructor(game){//to access prop. on the player class, cons takes ref. to player obj. as an argument
        super('JUMPING', game);
    }
    enter(){//run once, when this state is entered
        if(this.game.player.onGround()) this.game.player.vy -= 27;
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 1; 
    }
    handleInput(input){//runs every 60 sec and checks for inputs
        if(this.game.player.vy > this.game.player.weight) {
            this.game.player.setState(states.FALLING, 2);
        } else if(input.includes('Enter')){
            this.game.player.setState(states.ROLLING, 3);
        } else if(input.includes('ArrowDown')){
            this.game.player.setState(states.DIVING, 0);
        }
    } 
}

export class Falling extends State {
    constructor(game){//to access prop. on the player class, cons takes ref. to player obj. as an argument
        super('FALLING', game);
    }
    enter(){//run once, when this state is entered
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 2; 
    }
    handleInput(input){//runs every 60 sec and checks for inputs
        if(this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 2);
        } else if(input.includes('ArrowDown')){
            this.game.player.setState(states.DIVING, 0);
        }
    } 
}

export class Rolling extends State {
    constructor(game){//to access prop. on the player class, cons takes ref. to player obj. as an argument
        super('ROLLING', game);
    }
    enter(){//run once, when this state is entered
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 6; 
    }
    handleInput(input){//runs every 60 sec and checks for inputs
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
        if(!input.includes('Enter') && this.game.player.onGround()) {//to change state while not in roll and on ground
            this.game.player.setState(states.RUNNING, 2);
        } else  if(!input.includes('Enter') && this.game.player.onGround()) {//to change state while not in roll and on ground
            this.game.player.setState(states.FALLING, 2);
        } else if (input.includes('Enter') && input.includes('ArrowUp') && this.game.player.onGround()){//to jump during rolling
            this.game.player.vy -= 27;
        } else if(input.includes('ArrowDown') && !this.game.player.onGround()){
            this.game.player.setState(states.DIVING, 0);
        }
    } 
}

export class Diving extends State {
    constructor(game){//to access prop. on the player class, cons takes ref. to player obj. as an argument
        super('DIVING', game);
    }
    enter(){//same sprite animation roll as rolling...so no change here
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 6;
        this.game.player.vy = 15;//to get the dive impact
    }
    handleInput(input){//runs every 60 sec and checks for inputs
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
        if(this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 2);
            for (let i = 0; i < 30; i++){//creating a splash of 30 particles
                this.game.particles.unshift(new Splash(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height));//creating the splash particle and offsetting it so it shrinks to the top left of its area
            }
        } else  if(input.includes('Enter') && this.game.player.onGround()) {
            this.game.player.setState(states.ROLLING, 3);
        }
    } 
}

export class Hit extends State {
    constructor(game){//to access prop. on the player class, cons takes ref. to player obj. as an argument
        super('HIT', game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 10;
        this.game.player.frameY = 4;
    }
    handleInput(input){//runs every 60 sec and checks for inputs
        //trigger for switching states here, will be anim. frame
        if(this.game.player.frameX >= 10 && this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 2);
        } else  if(this.game.player.frameX >= 10 && !this.game.player.onGround()) {
            this.game.player.setState(states.FALLING, 2);
        }
    } 
}