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

 //import the required the data model and API module
import SenderId from '../../lib/model/senderId';
import SenderIdApi from '../../lib/api/senderIds';

const sharedResource = require('../shared');

//create senderId API object
const senderIdApi = new SenderIdApi(sharedResource.getAuth(), sharedResource.getService());

const testName = "Syntest";

/**
 * This test shows how to use create_senderid API to create new senderId
 */
function test_create() {
    //create senderId model object, please refer to SenderId model for supported fields
    let sid = new SenderId({"name": `${testName} 05142`,
        "class_id":"COMMERCIAL",
        "type_id":"LONGCODE",
        "address":"1321345681",
        "country":"USA", 
        "consent_managed_by":"SCG", "capabilities":["SMS", "MMS"]});
    //Call create_senderid API to submit the creation request, this api take the newly created
    //senderId model object and the callback
    senderIdApi.create_senderid(sid, (err, res) => {
        if (err) {
            //If any problem happened, print the error message
            sharedResource.dbgOut(err);
        }
        if (res) {
            //If it was successful, err will be null, res will be filled with the newly created sender id
            sharedResource.dbgOut(res);
        }
    })
}

/**
 * This test demostrates how to use list_senderids API to list existing senderIds and how to
 * use get_senderid API to retrieve a senderId with its id
 */
function test_list() {
    //use list_senderids to list existing senderIds
    senderIdApi.list_senderids((err, res) => {
        if (err) {
            //Error happened, print the error message
            sharedResource.dbgOut(err);
        }
        if (res) {
            //Print the list
            sharedResource.dbgOut(res);
            //Find the senderId we newly created with the name has testName, pick it and try with get_senderid API
            let getId = undefined;
            for(let i = 0; i < res.list.length; i ++) {
                let sid = res.list[i];
                if (sid.name && sid.name.indexOf(testName) > -1) {
                    getId = sid.id;
                    break;
                }
            }
            if (getId) {
                //Print the id
                sharedResource.dbgOut(`****demostrate get id of ${getId}`);
                //Use get_senderid to retrieve the senderId content 
                senderIdApi.get_senderid(getId, (err1, res1) => {
                    if (err1) {
                        //problem happened, print the error message
                        sharedResource.dbgOut(err1);
                    }
                    if (res1) {
                        sharedResource.dbgOut(`This is the data of ${getId}`);
                        sharedResource.dbgOut(res1.exportData());
                    }
                })
            } else {
                //Cannot find any, show the error message
                sharedResource.dbgOut('Please run the test_create to create some senderId before running this test.');
            }
            
        }
    })
}

/**
 * This test documentation how to use delete_senderid API to delete specific senderId with its id
 */
function test_delete() {
    //Call list_senderids API to list all existing senderIds
    senderIdApi.list_senderids((err, res) => {
        if (err) {
            //If problem happened, print the related error message
            sharedResource.dbgOut(err);
        }
        if (res) {
            //Pick the senderId with the name has testName (we added, avoid delete somebody else's item)
            let getId = undefined;
            for(let i = 0; i < res.list.length; i ++) {
                let sid = res.list[i];
                if (sid.name && sid.name.indexOf(testName) > -1) {
                    getId = sid.id;
                    break;
                }
            }
            if (getId) {
                //Get the one we can try delete API
                //Print its id first
                sharedResource.dbgOut(`****demostrate delete id of ${getId}`);
                //call delete_senderid API to delete the selected senderId.
                senderIdApi.delete_senderid(getId, (err1) => {
                    //If it was successful, err1 will be null, otherwise, it will be filled with the related error message
                    sharedResource.dbgOut(err1 ? err1 : 'Deleted successfully!')
                })
            } else {
                //We cannot find the one we can try deleting, print the error message
                sharedResource.dbgOut(`Please run test_create to add some your own senderId before running this test`);
            }
            
        }
    })
}

/**
 * This test demostrates how to use update_senderid API to update the content of specific senderId
 */
function test_update() {
    //Use list_senderids API to list all existing senderIds
    senderIdApi.list_senderids((err, res) => {
        if (err) {
            //If problem happened, print the related error message
            sharedResource.dbgOut(err);
        }
        if (res) {
            
            //Pick one with name has testName inside for trying update_senderid API
            let uid = undefined;
            for(let i = 0; i < res.list.length; i ++) {
                let sid = res.list[i];
                if (sid.name && sid.name.indexOf(testName) > -1) {
                    uid = sid;
                    break;
                }
            }
            if (uid) {
                //Before update, print its id
                sharedResource.dbgOut(`****demostrate update id of ${uid.id}`);
                //Print its content
                sharedResource.dbgOut(uid);
                //Update its name
                uid.name = `${testName} up0514`;
                //call update_senderid API to update this senderId
                senderIdApi.update_senderid(uid, (err1, res1) => {
                    if (err1) {
                        //If error happened, print the error message
                        sharedResource.dbgOut(err1);
                    }
                    if (res1) {
                        //Print the result
                        sharedResource,dbgOut(res1);
                    }
                })
            } else {
                //If cannot find qualified senderId for testing, print the error message
                sharedResource.dbgOut(`Please add some senderId with name begin with Stang`);
            }
            
        }
    })
}

/**
 * Test driver, uncomment the tests you wish to run.
 */
//test_create();
//test_list();
//test_delete();
test_update();