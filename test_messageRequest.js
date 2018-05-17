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

 //Import required models and API modules
import MessageRequest from '../../lib/model/messageRequest';
import MessageRequestApi from '../../lib/api/messageRequests';
import SenderIdApi from '../../lib/api/senderIds';
import Attachment from '../../lib/model/attachment';
import AttachmentApi from '../../lib/api/attachments';

//utils module
const sharedResource = require('../shared');

//create MessageRequestApi object
const api = new MessageRequestApi(sharedResource.getAuth(), sharedResource.getService());

//create senderIdApi object
const senderIdApi = new SenderIdApi(sharedResource.getAuth(), sharedResource.getService());

//Predefine the test prefix to aviod damage other data
const testPrefix = 'SynTest_';

/**
 * This test demostrates how to use create_message API
 */
function test_create() {
    //Use senderId API to list existing senderId
    senderIdApi.list_senderids((err0, res0) => {
        if (res0 && res0.list && res0.list.length > 0) {
            let sid = undefined;
            //Pick one active and private senderId for the create_message API
            for(let i = 0; i < res0.list.length; i ++) {
                if (res0.list[i].state == 'ACTIVE' && res0.list[i].ownership == 'PRIVATE') {
                    sid = res0.list[i];
                    break;
                }
            }
            if (sid) {
                //create messageRequest model, we just provide from, to and body
                let req = new MessageRequest({from:sid.id,"to":sharedResource.getTestSMSRecv(),"body":testPrefix + "Hello World @" + Date.now()});
                sharedResource.dbgOut(req);
                //call create_message API, it takes request object and callback
                api.create_message(req, (err, res) => {
                    if (err) {
                        //If there was any problem happened, print the error message
                        sharedResource.dbgOut(err);
                    }
                    if (res) {
                        //If it was successful, print the request id
                        sharedResource.dbgOut(res);
                    }
                })
            } else {
                //Cannot find qualified senderId, print related error message
                sharedResource.dbgOut(`You don't have any active senderId!`);
            }
        } else {
            //Cannot find any senederId, this will be the block to the test
            sharedResource.dbgOut(`You don't have any active senderId!`);
        }
    })
}

/**
 * This test shows how to send SMS using create_message API
 */
function test_send_sms() {
    //Create message request object, make sure the from senderId support SMS
    let req = new MessageRequest({from: sharedResource.getTestSender(),
        to: sharedResource.getTestSMSRecv(),
        verify_number: false,
        body: "Test SMS message from Nodejs SDK. @" + sharedResource.getTimeString(new Date(Date.now()))
    });
    //Print the message request data 
    sharedResource.dbgOut(req.exportData());
    //call create_message to fire the SMS, this api takes the request object and one callback
    api.create_message(req, (err, res) => {
        //If the SMS request was created successfully, err will be null, and res will contain the request id
        if (err) {
            //Print the error message if any problem happened
            sharedResource.dbgOut(err);
        }
        if (res) {
            //Print the request id if the SMS was sent successfully
            sharedResource.dbgOut(res);
        }
    })
}

/**
 * This test demostrates how to send MMS with the attachment API and create_message API
 */
function test_send_mms() {
    //create attachmentApi object
    let attachmentApi = new AttachmentApi(sharedResource.getAuth(), sharedResource.getService());

    //List all existing attachments
    attachmentApi.list_attachments((err, res) => {
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            let att = undefined;
            //Find the attachment which has been uploaded with png
            if (res.list && res.list.length > 0) {
                for (let i = 0; i < res.list.length; i ++) {
                    if (res.list[i].state == 'UPLOADED' && res.list[i].type == 'image/png') {
                        att = res.list[i].id;
                        break;
                    }
                }
            }
            if (!att) {
                //Cannot find qualified attachment, give a warm hint
                sharedResource.dbgOut(`Please upload png file with create_attachment API before running this test`);
            } else {
                //Push the attachment id into the array
                let atts = [];
                atts.push(att);
                //create message request object with the attachment id array and othe body message
                let req = new MessageRequest({from: sharedResource.getVoiceSender(),
                    to: sharedResource.getTestSMSRecv(),
                    verify_number: false,
                    attachments: atts,
                    body: "Test MMS message from Nodejs SDK. @" + sharedResource.getTimeString(new Date(Date.now()))
                });
                sharedResource.dbgOut(req.exportData());
                //Call create_message API with newly created messageRequest object
                api.create_message(req, (err, res) => {
                    if (err) {
                        //If there was any problem, dump the error message
                        sharedResource.dbgOut(err);
                    }
                    if (res) {
                        //If the MMS was sent out successfully, dump the messageRequest id
                        sharedResource.dbgOut(res);
                    }
                })
            }
            
        }
    })
}

/**
 * This test demostrates send message to misc recipients
 */
function test_2_group() {
    //use list_senderids API to list existing senderId
    senderIdApi.list_senderids((err0, res0) => {
        if (res0 && res0.list && res0.list.length > 0) {
            let sid = undefined;
            //Pick an active and private senderid
            for(let i = 0; i < res0.list.length; i ++) {
                if (res0.list[i].state == 'ACTIVE' && res0.list[i].ownership == 'PRIVATE') {
                    sid = res0.list[i];
                    break;
                }
            }
            if (sid) {
                //create messageRequest object with multiple audients 
                let req = new MessageRequest({from:sid.id,
                    "to":["1234","mdn:1234","contact:LlXEIlRMSeGkWrRi6Fnp9A","group:FM5KT9CIT5awoFq7RuW4oQ"],"body":"Hello World"
                });
                sharedResource.dbgOut(req);
                //call create_message API with the newly created reqauest object, fire the request
                api.create_message(req, (err, res) => {
                    if (err) {
                        //If there was any error, print the error message
                        sharedResource.dbgOut(err);
                    }
                    if (res) {
                        //If it was successful, print the request id.
                        sharedResource.dbgOut(res);
                    }
                })
            } else {
                //Cannot find qualified senderId, print the error message
                sharedResource.dbgOut(`You don't have any active senderId!`);
            }
        } else {
            //Cannot find any senderId, print the error message
            sharedResource.dbgOut(`You don't have any active senderId!`);
        }
    })
}

/**
 * This test demostrates how to use list_messages API and get_message
 */
function test_list() {
    //Use list_messages to list all existing messages
    api.list_messages((err, res) => {
        if (err) {
            //If there was any error, print the error message
            sharedResource.dbgOut(err);
        }
        if (res) {
            //Dump the total messages
            sharedResource.dbgOut(`Total messages: ${res.list.length}`);
            //Print all messages in the list
            sharedResource.dbgOut(res);
            if (res.list.length > 0) {
                //Pick the first one, try it with get_message, this api take the messageRequest id and one callback
                sharedResource.dbgOut(`test get id: ${res.list[0].id}`);
                api.get_message(res.list[0].id, (err1, res1) => {
                    if (err1) {
                        sharedResource.dbgOut(err1);
                    }
                    if (res1) {
                        //if it was successful, print the message content data
                        sharedResource.dbgOut(res1.exportData());
                    }
                });
            }
        }
    })
}

/**
 * This test shows how to use delete_message
 */
function test_delete() {
    //Use list_messages API to list all existing messages
    api.list_messages((err, res) => {
        if (err) {
            //Hit error, print the related error message
            sharedResource.dbgOut(err);
        }
        if (res) {
            //sharedResource.dbgOut(res);
            if (res.list.length < 1) {
                //If the list is empty, print error message
                sharedResource.dbgOut('Please add some messageRequest first');
            } else {
                //Take the first item in the list
                let req = res.list[0];
                //print its id
                sharedResource.dbgOut(`Delete messageRequest id=${req.id}`);
                //call delete_message API, this api takes the messageRequest id and one callback
                api.delete_message(req.id, (err_d) => {
                    //If it was successful, err_d will be null, otherwise, it will be filled with the related error message
                    sharedResource.dbgOut(err_d ? err_d : 'Deleted successfully');
                    //Use list_messages API to list all rest messages
                    api.list_messages((err2, res2) => {
                        if (err2) {
                            //If encountered any error, print the error message
                            sharedResource.dbgOut(err2);
                        }
                        if (res2) {
                            //Print all rest message
                            sharedResource.dbgOut(res2);
                        }
                    })
                })
            }
            
        }
    })
}

/**
 * Test driver, uncomment the tests you want to run
 */
//test_create();
test_list();
//test_delete();
//test_2_group();
//test_update();
//test_send_sms();
//test_send_mms();
