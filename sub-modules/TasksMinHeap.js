const MinHeap = require('min-heap');
const messages = require('../assets/messages')

class TasksMinHeap {
    constructor() {
        this.heap = new MinHeap((task1, task2) => { return task1.startTime - task2.startTime });
        this.ids = {}
    }

    getSize() {
        return this.heap.size;
    }

    peek() {
        return this.heap.heap[0];
    }

    pop() {
        let poped = this.heap.removeHead();
        if (poped != null && poped != undefined) {
            delete this.ids[poped._id];
            return poped;
        }

        return null;
    }

    insert(task) {
        if(verify(task)){
            // entry is of the proper form, need to generate id
            let id = generateId(task.startTime);
            let identifiedTask = Object.assign({}, task, {_id: id})
            this.ids[id] = identifiedTask;
            this.heap.insert(identifiedTask);
            return id;
        }
        else {
            throw messages.TASK_SERIALIZATION_ERR;
        }
    }

    contains(id){
        return !!this.ids.hasOwnProperty(id);
    }

    remove(id) {
        if (!this.contains(id)) {
            throw messages.TASK_NOT_EXISTS;
        }else{
            let entry = this.ids[id];
            this.heap.remove(entry);
            delete this.ids[id];
        }

    }

    update(id,task) {
        let pointer = this.ids[id];

        if(task.name != null)
            pointer.name = task.name;

        if(task.startTime != null){
            delete this.ids[id];
            this.heap.remove(pointer);

            // Update time & inject back
            pointer.startTime = task.startTime;

            this.ids[id] = pointer;
            this.heap.insert(pointer);
        }

        if(task.callbackFunction != null)
            pointer.callbackFunction = task.callbackFunction;
    }
}

// Referenced from https://gist.github.com/gordonbrander/2230317
let generateId = (startTime) => {
    return '_' + Math.random().toString(36).substr(2, 7) + startTime.toString();
}

let verify = (task) => {
    return task.hasOwnProperty('name') &&
        typeof task.name == 'string' &&
        task.hasOwnProperty('startTime') &&
        typeof task.startTime == 'number' &&
        task.hasOwnProperty('callbackFunction') &&
        typeof task.callbackFunction == 'function'
}


module.exports = TasksMinHeap;