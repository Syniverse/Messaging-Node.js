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

 //import the required model and API module for the tests
import Message from '../../lib/model/message';
import MessageApi from '../../lib/api/messages';
import SenderIdApi from '../../lib/api/senderIds';

//get help API module
const sharedResource = require('../shared');

//Create MessageApi object
const api = new MessageApi(sharedResource.getAuth(), sharedResource.getService());

//Create senderId Api object
const senderIdApi = new SenderIdApi(sharedResource.getAuth(), sharedResource.getService());

const testPrefix = 'SynTest_';

/**
 * This test shows how to use list_messages API and get message API
 */
function test_list() {
    //List existing messages
    api.list_messages((err, res) => {
        if (err) {
            //If there was any error happened, print the related error message
            sharedResource.dbgOut(err);
        }
        if (res) {
            //Print the total messages
            sharedResource.dbgOut(`Total messages: ${res.list.length}`);
            //Print each message in the list
            sharedResource.dbgOut(res);

            if (res.list.length > 0) {
                //If we do have existing message, pick the first one for testing get_message API
                let id = res.list[0].id;
                sharedResource.dbgOut(`>>>Test get message, id:${id}`);
                api.get_message(id, (err1, res1) => {
                    if (err1) {
                        sharedResource.dbgOut(err1);
                    }
                    if (res1) {
                        //If it was success, print its data
                        sharedResource.dbgOut(res1.exportData());
                    }
                })
            }
        }
    })
}

/**
 * This tests demostrates how to use delete message API
 */
function test_delete() {
    //List existing messages
    api.list_messages((err, res) => {
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            //Print the total number of the messages existing
            sharedResource.dbgOut(`Total messages: ${res.list.length}`);
            //Print the message list
            sharedResource.dbgOut(res);
            if (res.list.length > 0) {
                //Pick the first one to try the delete API
                let id = res.list[0].id;
                sharedResource.dbgOut(`>>>Test delete message, id:${id}`);
                api.delete_message(id, (err1) => {
                    //If it was successfull, err1 will be filled with null, otherwise, it will
                    //contain the related error message
                    sharedResource.dbgOut(err1 ? err1 : 'Deleted successfull!');
                })
            }
        }
    })
}

/**
 * Test driver, enable the tests you want to run 
 */
test_list();
//test_delete();