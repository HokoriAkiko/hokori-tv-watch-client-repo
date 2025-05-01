class EventEmitter {

    constructor(){
        this.events = {};
    }

    //push a listener of a type of event
    push(e,l) {
        if(`${e}` in this.events) this.events[e].push(l);
        else this.events[e] = [l];
    } 

    //pop a listener of a type of event
    pop(e,l){
        if(`${e}` in this.events){
            let temp = [];
            for(let i=0;i<this.events[e].length;i++){
                const list = this.events[e][i];
                if(l !== list){temp.push(list)}
            }
            this.events[e] = temp;
        }
    }
        
    //on event emit , call the listener function
    emit(e,pass) {
        if(`${e}` in this.events) this.events[e].forEach((listener)=>listener(pass));
    }
}

const event_handler = new EventEmitter();

export default event_handler;