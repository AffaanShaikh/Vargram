// to capture and keep track of user input 
export class InputHandler{
    constructor(game){//code inside constructor executes auto. whenever we create an instance of the class it is in
        this.game = game;
        this.keys=[];
        window.addEventListener('keydown', e => {
            
            if(( e.key === 'ArrowDown' ||//if either of these r pressed (ArrowDown...) they get stored in Keys array and later using splice() are removed on release of the button in the 'keyup' eventlistener 
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === 'Enter'
                ) && this.keys.indexOf(e.key) === -1){//indexof is used to check if the key pressed is included in the keys array( -1 means it is not present in the array or > -1)
                this.keys.push(e.key);
            } else if (e.key === 'd') this.game.debug = !this.game.debug; //for debugging: console.log(e.key, this.keys);(key is the prop. that holds the name of the key that was pressed)
        });
        window.addEventListener('keyup', e => {
            if(e.key === 'ArrowDown' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === 'Enter'
                ){
                this.keys.splice(this.keys.indexOf(e.key), 1);// splice arguments(index of the element to remove, and how many elements)
            }
        });
    }
}