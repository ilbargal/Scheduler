const JoltTasksScheduler = require('./../index');
const messages = require('../assets/messages');

let instance;
function createTask(name, startTimeSecs, callback) {
    let time = new Date();
    time.setMilliseconds(time.getMilliseconds() + startTimeSecs * 1000);

    return {
        "name": name,
        "startTime": time.getTime(),
        "callbackFunction": callback
    }
}

let dataStructureLogicTests = {
    testInsertion: () => {
        let taskInsertionExample;
        beforeEach(() => {
            instance = new JoltTasksScheduler();
            taskInsertionExample = {
                name: 'Insertion Task Example',
                startTime: 1,
                callbackFunction: () => {
                }
            }
        });

        describe('Test Insertion', () => {
            it('Size after initalize - 0', () => {
                instance.tasks.should.equal(0)
            });

            it('Size after 1 insertion - 1', () => {
                taskInsertionExample.startTime = 10;
                instance.insert(taskInsertionExample)
                instance.tasks.should.equal(1)
            });

            it('Size after 5 insertions - 5', () => {
                for (let i = 0; i < 5; i++) {
                    taskInsertionExample.startTime = i;
                    taskInsertionExample.name = 'Size Insertion: ' + i;
                    instance.insert(taskInsertionExample)
                }
                instance.tasks.should.equal(5)
            });

            it('Insertion of incorrect task json - throws exception', done => {
                try {
                    instance.insert({name: 'Bad task Json', bad: 'val'});
                }
                catch (e) {
                    e.should.equal(messages.TASK_SERIALIZATION_ERR);
                    done();
                }
            })
        });
    },

    testExtraction: () => {
        describe('Test Extraction',()=>{
            let taskExtractionExample;

            beforeEach(() => {
                instance = new JoltTasksScheduler();
                taskExtractionExample = {
                    name: 'Extraction Task Example',
                    startTime: 1,
                    callbackFunction: () => {}
                }
            });

            it('Test id existence',()=>{
                instance.insert(taskExtractionExample);
                (typeof instance.pop()._id).should.equal('string')
            });
            it('Test extracted object equality',()=>{
                instance.insert(taskExtractionExample)
                let res = instance.pop()
                taskExtractionExample.name.should.equal(res.name)
                taskExtractionExample.startTime.should.equal(res.startTime)
                taskExtractionExample.callbackFunction.should.equal(res.callbackFunction)
            });
            it('Test insertion of multiple and in-order extraction of few',()=>{
                let temp1 = createTask('1st task', 30, () => {});
                let temp2 = createTask('2nd task', 10, () => {});
                let temp3 = createTask('3rd task', 20, () => {});
                let temp4 = createTask('4th task', 50, () => {});
                instance.insert(temp1)
                instance.insert(temp2)
                instance.insert(temp3)
                instance.insert(temp4)

                // Order should be --> 2nd, 3rd, 1st, 4th
                instance.pop().name.should.equal('2nd task')
                instance.pop().name.should.equal('3rd task')
                instance.pop().name.should.equal('1st task')
                instance.pop().name.should.equal('4th task')
            });
            it('Test size after insertion and extraction',()=>{
                for(let i = 0; i < 3; i++){
                    instance.insert({name:'task '+ i, startTime: i, callbackFunction:()=>{}})
                }

                instance.tasks.should.equal(3)
                instance.pop()
                instance.tasks.should.equal(2)
                instance.pop()
                instance.pop()
                instance.tasks.should.equal(0)
            });
        })
    },
    testDeletion: () => {
        describe('Test delete task',()=>{
            let instance;
            let taskDeletionExample = {
                name: 'Task deletion example',
                startTime: 1,
                callbackFunction: () => {}
            };
            beforeEach(()=>{
                instance = new JoltTasksScheduler();
            })

            it('insert task and delete it - size should be 0',()=>{
                let id = instance.insert(taskDeletionExample);
                instance.remove(id);
                instance.tasks.should.equal(0);
            });
            it('Attempt deletion of non-existing - throws an exception', done =>{
                try{
                    instance.remove(123);
                    // Should throw exception, therefor if it's here we force fail
                    "a".should.equal(0);
                }catch (e){
                    e.should.equal(messages.TASK_NOT_EXISTS);
                    done();
                }
            });
        })
    },
    testUpdateTasks: () => {
        describe('Test Update tasks',function(){
            beforeEach(() => {
                instance = new JoltTasksScheduler()
            });

            it('Simple task update (all data but time)', ()=>{
                let task = createTask('Task to update', 60, () => { return 1; });
                let taskId= instance.insert(task);
                instance.updateTask(taskId, {name:'updatedTask'});
                instance.updateTask(taskId, {callbackFunction: () => { return 2 }});


                let popped = instance.pop();
                popped.name.should.equal('updatedTask');
                popped.callbackFunction().should.equal(2)

            });
            it('Update time of task to immediate',(done)=>{
                let isUpdated = false;
                let task = createTask('task to update', 60, () => isUpdated = true);
                let nodeId= instance.insert(task);

                task = createTask('task updated', 1, () => isUpdated = true);
                instance.updateTask(nodeId, task);
                setTimeout(function(){
                    isUpdated.should.equal(true);
                    done();
                }, 1500)

            });
            it('Update task to create race',(done)=>{
                let tasksOrder = '';
                let taskA = createTask('task A', 1, () => tasksOrder += 'A ');
                let taskB = createTask('task B', 6, () => tasksOrder += 'B ');

                // insert
                instance.insert(taskA);
                let taskBID = instance.insert(taskB);

                // Modify to immediate invocation
                taskB = createTask('updatedTask B', 0.3, () => tasksOrder += 'B ');
                instance.updateTask(taskBID, taskB);

                setTimeout(function(){
                    tasksOrder.should.equal('B A ');
                    done();
                }, 1310)
            })
        })
    }
};

function run() {
    describe('Test data structure',()=>{
        dataStructureLogicTests.testInsertion();
        dataStructureLogicTests.testExtraction();
        dataStructureLogicTests.testDeletion();
        dataStructureLogicTests.testUpdateTasks();
    });
}

module.exports = run;
