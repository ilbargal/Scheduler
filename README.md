# Scheduler
Jolt Task Scheduler - developed by Bar Gal.
This project is a part of my application process to [Jolt](http://jolt.us).

# Usage
1. Import scheduler
```javascript
let Scheduler = require('./index')
OR
import Scheduler from './index'
```
2. Create new JoltTasksScheduler
```javascript
let Scheduler = new JoltTasksScheduler()
```
3. Append new task object
```javascript
let task = {
    name: 'my task',
    startTime: Date.now(),
    callbackFunction: function(){ return 1;}
}
scheduler.insert(task)
```
4. Wait for it :)
 
# Important!
The task object passed to the scheduler should be of the following format:
```javascript
{
    name: String,
    startTime: Number (as date format),
    callbackFunction: Function
}
```
If failed to create this kind of objects, you'll hit an exception

# Testing
Supplied by Mocha. Either run ```$ npm install``` and then ```$ npm test```.
