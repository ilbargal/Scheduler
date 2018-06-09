const JoltTasksScheduler = require('./../index');

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

let schedulerLogic = {
    testStandardExecution: () => {
        beforeEach(() => {
            // Create a new Rectangle object before every test.
            instance = new JoltTasksScheduler()
        });
        describe('Standard task insertion and execution', () => {
            it('Insertion of task (1s delayed)', done => {
                let isTaskStarted = false;

                let callback = () => isTaskStarted = true;
                let task = createTask('regular execution task', 1, callback);
                instance.insert(task);

                setTimeout(function () {
                    // Test execution
                    true.should.equal(isTaskStarted);
                    done();
                }, 1001);
            });
            it('Insertion of 2 tasks, (1.5s delay)', done => {
                // Set variables to test callback against
                let isTaskStartedA = false;
                let isTaskStartedB = false;

                // Callback will modify the var from null to {}
                let callbackA = () => isTaskStartedA = true;
                let callbackB = () => isTaskStartedB = true;

                let taskA = createTask('task A', 1, callbackA);
                let taskB = createTask('task B', 2, callbackB);
                instance.insert(taskA);
                instance.insert(taskB);

                setTimeout(function () {
                    // Stop tasks between a and b
                    true.should.equal(isTaskStartedA);
                    false.should.equal(isTaskStartedB)
                    // Wait for timeout
                    done();
                }, 1500);
            })
        })
        describe('Execution race', () => {
            it('Insert first task and second task that sooner - do second task before', done => {
                let tasksOrder = '';

                // Callbacks to modify the var
                let callbackA = () => tasksOrder += 'A ';
                let callbackB = () => tasksOrder += 'B ';
                let taskA = createTask('task A', 1.5, callbackA);
                let taskB = createTask('task B', 1, callbackB);
                instance.insert(taskA);
                instance.insert(taskB)

                //  Since we expect execution of B and then A,
                // 	We should 'B A '
                setTimeout(function () {
                    // Test execution
                    tasksOrder.should.equal('B A ');
                    done();
                }, 1800);
            })
            it('Insert task and negative time tasks (immediate)', function (done) {
                // Set variable to test callback against
                let tasksOrder = '';

                // Callbacks to modify the var
                let callbackA = () => tasksOrder += 'A ';
                let callbackB = () => tasksOrder += 'B ';
                let callbackC = () => tasksOrder += 'C ';
                let task_a = createTask('task A', 1, callbackA)
                let task_b = createTask('task B', -0.5, callbackB)
                let task_c = createTask('task C', -0.5, callbackC)
                instance.insert(task_a);
                instance.insert(task_b);
                instance.insert(task_c);

                //  Since we expect execution of B and C (no order) and then A,
                // 	We should get 'B C A'
                //  If A would of executed before B or C, we will get (2+1)*2=10
                setTimeout(function () {
                    // Test execution
                    tasksOrder.should.equal('B C A ');
                    done();
                }, 1001);
            })
        })
    }
}

function run() {
    describe('Test scheduler logic', () => {
        schedulerLogic.testStandardExecution();
    });
}

module.exports = run;