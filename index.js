let TasksMinHeap = require('./sub-modules/TasksMinHeap');

let data, currentTaskRunningHolder;

class JoltTasksScheduler {

    constructor() {
        // Init new heap and has
        data = new TasksMinHeap();
        this.closestTask = null;
    }

    get tasks() {
        return data.getSize();
    }

    insert(task) {
        let id = data.insert(task);
        this._updateClosestTask();
        return id;
    }

    updateTask(id,task) {
        if (task != null && task != undefined && data.contains(id)) {
                data.update(id, task);
                this._updateClosestTask();
            };
    }

    remove(id){
        return data.remove(id);
    }

    pop(){
        return data.pop();
    }

    _updateClosestTask() {
        // If there's update but no tasks are present
        if(data.peek() == null) return;

        // Means that the DS is either empty or we've got earlier event
        this.closestTask = data.peek();

        // Stop previous timeout holder
        if(currentTaskRunningHolder) {
            clearTimeout(currentTaskRunningHolder);
        }

        // invoke task function
        this._invoke();
    }

    _invoke() {
        let that = this;
        let invocationCallback = function(){
            data.pop();
            that.closestTask.callbackFunction();
            that._updateClosestTask()
        };

        let timeToWait = (this.closestTask.startTime - Date.now());
        currentTaskRunningHolder = setTimeout(invocationCallback, timeToWait < 0? 0 : timeToWait);
    }
}

module.exports = JoltTasksScheduler;