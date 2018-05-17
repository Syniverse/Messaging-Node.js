/**
 * MIT License
 *
 * Copyright (c) 2018 Syniverse Communication Gateway
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

 //import the required model and api module
import MessageTemplate from '../../lib/model/messageTemplate';
import MessageTemplateApi from '../../lib/api/messageTemplates';

const sharedResource = require('../shared');

//create api module object
const api = new MessageTemplateApi(sharedResource.getAuth(), sharedResource.getService());
//prefix of testName, avoid the impact to othe data
const testName = 'synTest';

/**
 * This test demostrates how to use create_messageTemplate API to create new messageTemplate
 */
function test_create() {
    //create messageTemplate object, please refer to messageTemplate model for supported fields
    let messageTemplate = new MessageTemplate({"designation":"TEMPLATE",
        "name":testName + Date.now(),
        "pattern":"Your test is $TEST"});
    //call create_messageTemplate API, this API takes newly created messageTemplate object and one callback
    api.create_messageTemplate(messageTemplate, (err, res) => {
        if (err) {
            //If there was any error happened, print the related error message.
            sharedResource.dbgOut(err);
        }
        if (res) {
            //If it was successful, print the id of the created object
            sharedResource.dbgOut(res);
        }
    })
}

/**
 * This test shows how to use list_messageTemplate to list existing messageTemplate and use
 * get messageTemplate to retrieve specific messageTemplate
 */
function test_list() {
    //Use list_messageTemplate to list all existing messageTemplate
    api.list_messageTemplate((err, res) => {
        if (err) {
            //print error message
            sharedResource.dbgOut(err);
        }
        if (res) {
            //print all existing messageTemplates
            sharedResource.dbgOut(res);
            if (res.list.length > 0) {
                //Pick the first one in the list to try out get_messageTemplate
                let id = res.list[0].id;
                sharedResource.dbgOut(`dumpe the id with ${id}`);
                //call get_messageTemplate, this api take the messageTemplate id and callback
                api.get_messageTemplate(id, (err1, res1) => {
                    if(err1) {
                        //If error happened, print the error message
                        sharedResource.dbgOut(err1);
                    }
                    if (res1) {
                        //If it was successful, print the messageTemplate data
                        sharedResource.dbgOut(res1.exportData());
                    }
                });
            }
        }
    })
}
/**
 * This test shows how to use delete_messageTemplate
 */
function test_delete() {
    //List existing message templates
    api.list_messageTemplate((err, res) => {
        if (err) {
            //If there was any error, print the related error message
            sharedResource.dbgOut(err);
        }
        if (res) {
            let mst;
            //Pick the message template which has the name begin with testName (avoid to delete other data)
            for (let i = 0; i < res.list.length; i ++) {
                mst = res.list[i];
                if (mst.name.indexOf(testName) > -1) {
                    break;
                }
            }
            //print the message template to be deleted
            sharedResource.dbgOut(mst);
            //call delete_messageTemplate API to delete the provided messageTemplate with its id
            api.delete_messageTemplate(mst.id, (err_del) => {
                //If it was successful, err_del will be null, otherwise, it contains the error message
                sharedResource.dbgOut(err_del ? err_del : 'Deleted successfully');
            })
        }
    })
}

/**
 * This test demostrates how to use update_messageTemplate API to update the messageTemplate
 */
function test_update() {
    //use list_messageTemplate to list existing messageTemplate
    api.list_messageTemplate((err, res) => {
        if (err) {
            //If there was any error, print the related error message
            sharedResource.dbgOut(err);
        }
        if (res) {
            //Pick the one with the name contains testName (avoid hurt other data)
            let mst;
            for (let i = 0; i < res.list.length; i ++) {
                mst = res.list[i];
                if (mst.name.indexOf(testName) > -1) {
                    break;
                }
            }
            if (mst) {
                //Print the picked messageTemplate
                sharedResource.dbgOut(mst);
                sharedResource.dbgOut(`Update the messageTemplate`);
                const mstId = mst.id;
                //update the messageTemplate with new name and designation
                mst.designation = 'TEMPLATE';
                mst.name = `${testName}_${Date.now()}`;
                //call update_messageTemplate API to update the messageTemplate, this api take MessageTemplate
                //object and callback
                api.update_messageTemplate(mst, (erru) => {
                    if (erru) {
                        //If it was failed, print the related error message
                        sharedResource.dbgOut(erru);
                    } else {
                        //If it was success, use get_messageTemplate to retrieve the item for verification
                        // get_messageTemplate take the id and callback as the parameters
                        api.get_messageTemplate(mstId, (err1, res1) => {
                            if (err1) {
                                //Error happened, print the error message
                                sharedResource.dbgOut(err1);
                            }
                            if (res1) {
                                //Got the item, print its data content
                                sharedResource.dbgOut(`Dump updated message template:`);
                                sharedResource.dbgOut(res1.exportData());
                            }
                        })
                    }
                })
            } else {
                //Didn't find any qualified messageTemplate, print error message
                sharedResource.dbgOut('Please run create_messageTemplate test to add some test data');
            }
            
        }
    })
}

/**
 * Test driver, uncomment the tests you wish to run
 */
//test_create();
//test_list();
//test_delete();
test_update();