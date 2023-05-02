import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from "./enemies.js";
import { UI } from "./UI.js";


window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d');
    canvas.width = 900; //pixels
    canvas.height = 500;

    class Game{ // all game logic goes through here
        constructor(width, height){ //constructor(special method): gets automatically executed when called using 'new' -> will create a new instance of the class and as a side-effect, it will run all code inside it(Therefore we create an inst. of player and that inst. of player gets created, whenever instance of game class is created)
            this.width = width; // converted to class prop. using 'this'
            this.height = height;
            this.groundMargin = 40;
            this.speed = 0;
            this.maxSpeed = 3;
            this.background = new Background(this);
            this.player = new Player(this); // Since 'game' is an argument to be expected in class 'Player', here 'this' in player means this constructor/object 
            this.input = new InputHandler(this);//instance of inputhandler created, Inputhandle class gets auto. instantiated when instance of game class is created(will create this.keys array and apply keydown eventlistener)
            this.UI = new UI(this);//instance of UI class, with ref. to the main game object
            this.particles = [];//array to hold all currently active particles
            this.maxParticles = 200;
            this.floatingMessages = [];
            this.collisions = [];//array to hold all currently active collision animation objects
            //adding enemies's helper varaibles
            this.enemies = [];//holds all currently active enemy objects
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.debug = false;//debug mode
            this.score = 0;//score
            this.winningScore = 50;
            this.fontColor = 'black';
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
            this.time = 0;
            this.maxTime = 30000;
            this.gameOver = false;
            this.lives = 5;
        }
        update(deltaTime){//runs for every anim. frame
            this.time += deltaTime;
            if(this.time > this.maxTime) this.gameOver = true;
            this.background.update();
            this.player.update(this.input.keys, deltaTime);//we pass the current list of active inputs for every anim. frame in the Update method
            //Enemy Handling/Inputting Logic
            if(this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {//runni through the array(enemies) to trigger update for each enemy obj. in order to move them around
                enemy.update(deltaTime);
                //BUG: if(enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1);
            });//forEach executes a provided function once for each array element 
            //handle floatinmessages
            this.floatingMessages.forEach(message => {
                message.update();
            });
            //handle particles - calling update on all active particles and deleting old ones
            this.particles.forEach((particle, index) => {//forEach passes auto-generated index arguments, so we assign it to a variable, 'index'
                particle.update();
                //OPT: if(particle.markedForDeletion) this.particles.splice(index,1);
            });
            //limiting particles to maxParticles(200)
            if(this.particles.length > this.maxParticles) {
                this.particles.length = this.maxParticles;//splice doesn't modify original array, we explicitly do it here  
            }
            //console.log(this.particles);
            //handle collision sprites
            this.collisions.forEach((collision, index) => {
                collision.update(deltaTime);
                //OPT: if(collision.markedForDeletion) this.collisions.splice(index,1);
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);//filter method runs provided callback function once per each element in the array, element that don't provide callback are skipped and not added to the array(also assigning filtered array to the original)
        }
        draw(context){//draws images/scores etc.
            this.background.draw(context);
            this.player.draw(context);// calls draw() method in player.js
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.particles.forEach(particle => {
                particle.draw(context);
            });
            this.collisions.forEach(collision => {
                collision.draw(context);
            });
            this.floatingMessages.forEach(message => {
                message.draw(context);
            });
            this.UI.draw(context);//using instance of UIclass-> i.e. 'this.UI' property, calling it's draw method and passing context 
        } 
        addEnemy(){//adding enemies logic and in a specific time interval
            if(this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this)); //adding groundEnemy only when game is scrolling, and making it to have only 50% chance of a groundEnemy appearing(Math.random() here is coded to return value btw. 0&1)
            else if(this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
            this.enemies.push(new FlyingEnemy(this));/*push adds element to the array, and returns the length of the array
            Instance of FlyingEnemy class created and for'game'constructor argument in FlyingEnemy class, 'this' is passed to refer to the main-game object*/
            //console.log(this.enemies);
            
            console.log(this.enemies, this.particles, this.collisions, this.floatingMessages);//logged here so it logs periodically and not every animation frame i.e logged in update() method
        }
    }

    const game = new Game(canvas.width, canvas.height)// instance of game class 
    //console.log(game);
    let lastTime = 0;//helper variable to hold value from the timestamp from the previous animation loop

    function animate(timeStamp){//timeStamp auto.gen only when called by reqanimfr 
        const deltaTime = timeStamp - lastTime;//diff in milllsec betweem the timestamp in this anim loop and the timestamp passed in the earlier loop.(Gives the time in millisec for how long each frame stays on the screen, before gettin redrawn) 
        lastTime = timeStamp;//override lastTime to current timestamp, inorder to calc. deltaTime for the next loop.
        ctx.clearRect(0,0,canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if(!game.gameOver) requestAnimationFrame(animate);// to create animation loop. .requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser calls a specified function(here, animate) to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint(animate) 
    }//requestAnimationFrame 1> auto. adjusts screen refresh rate. 2> auto-generates timestamp value and passes it as an arg. to the function it calls(here, 'animate')
    animate(0); 
});  
