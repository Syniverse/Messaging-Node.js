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
import Call from '../../lib/model/call';
import CallApi from '../../lib/api/calls';

const sharedResource = require('../shared');

//create callApi object, you just need pass the authentication config and the gateway server address
const callApi = new CallApi(sharedResource.getAuth(), sharedResource.getService());

/**
 * This test demostrates how to use create_call API to instantiate calling
 */
function test_create() {
    //create calling object, please refer to model Call for the supported fields
    let call = new Call({
        //caller
        from: sharedResource.getVoiceSender(),
        //callee
        to: sharedResource.getTestSMSRecv()[0]
    });
    //call create_call API, pass the call object and the callback
    callApi.create_call(call, (err, res) => {
        //If err happened, the err will contain the detailed error message, or it will be null
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            //If it was successful, res will contain the callid 
            sharedResource.dbgOut(res);
        }
    })
}

/**
 * This test demostrates how to use list_call API, you just need to pass callback to handle
 * success or fail
 */
function test_list() {
    callApi.list_call((err, res) => {
        //If err happened, the err will contain the detailed error message, or it will be null
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            sharedResource.dbgOut(`Total calls: ${res.list.length}`);
            sharedResource.dbgOut(res);
        }
    })
}

/**
 * This test demostrates how to use delete_call, you just need pass the related callId and the error callback
 */
function test_delete() {
    //List all existing calls
    callApi.list_call((err, res) => {
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            //pick the first one to delete
            let call = res.list[0];
            callApi.delete_call(call.id, (err_d) => {
                sharedResource.dbgOut(!err_d ? 'Success!' : err_d);
            })
        }
    })
}

/**
 * This test demostrates how to use accept_call
 */
function test_accept() {
    //list all calls
    callApi.list_call((err, res) => {
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            //pick the first one
            let call = res.list[0];
            if (!call) {
                call = {};
                call.id = 'RSSDEDE';
            }
            //accept_call with callid
            callApi.accept_call(call.id, (err_d) => {
                sharedResource.dbgOut(!err_d ? 'Success!' : err_d);
            })
        }
    })
}

/**
 * This test demostrates how to use hangup_call API
 */
function test_hangup() {
    //List all vailable calls
    callApi.list_call((err, res) => {
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            //pick the first one
            let call = res.list[0];
            if (!call) {
                call = {};
                call.id = 'RSSDEDE';
            }
            //hang the call with the related callid
            callApi.hangup_call(call.id, (err_d) => {
                //if it was success, err_d will be filled with null
                sharedResource.dbgOut(err_d ? err_d : 'Success!');
            })
        }
    })
}

/**
 * test firing, uncomment those tests you want to run.
 */
//test_create();
test_list();
//test_delete();
//test_accept();
//test_hangup();