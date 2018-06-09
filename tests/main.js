'use strict';
const chai = require('chai');
const JoltTasksScheduler = require('./../index');
const dataStructureTests = require('./data-structure-logic');
const schedulerLogicTests = require('./schedule-logic');

chai.should();

class JoltTaskSchedulerTests{
    static testInit(){
        describe('Test Initialization', ()=>{
            it('Initalize private min-heap', ()=>{
                let instance = new JoltTasksScheduler();

                // No Access to heap variable
                'undefined'.should.equal(typeof instance.data)
            })
        })
    }

    static run(){
        this.testInit();
        dataStructureTests();
        schedulerLogicTests();
    }
}

JoltTaskSchedulerTests.run();