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
import Bridge from '../../lib/model/bridge';
import BridgeApi from '../../lib/api/bridges';

import Call from '../../lib/model/call';
import CallApi from '../../lib/api/calls';

//get util object
const sharedResource = require('../shared');

//create calling API
const callApi = new CallApi(sharedResource.getAuth(), sharedResource.getService());

//create bridge API
const bridgeApi = new BridgeApi(sharedResource.getAuth(), sharedResource.getService());

/**
 * This test demostrates how to create a bridge
 */
function test_create() {
    //Create a bridge object
    let bridge = new Bridge({
        bridge_audio: true
    });
    //create bridge, if it was failed, err parameter in the callback will hold the related
    //error message, if it was Success, err will be null, the related bridge ID will be put in
    //the res object
    bridgeApi.create_bridge(bridge, (err, res) => {
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            sharedResource.dbgOut(res);
        }
    });
}

/**
 * Test list bridges
 */
function test_list() {
    //list bridges, the only parameter is the callback
    bridgeApi.list_bridges((err, res) => {
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            //the bridge will be in res.list
            sharedResource.dbgOut(res);
        }
    })
}

/**
 * This test demostrates how to add calls into the bridge
 */
function test_addcalls() {
    //Create the bridge object
    let bridge = new Bridge({
        bridge_audio: true
    });
    //create the bridge, pass the bridge object and callback
    bridgeApi.create_bridge(bridge, (err, res) => {
        if (err) {
            //oops, problem happened, dump the error message
            sharedResource.dbgOut(err);
        }
        if (res) {
            //the bridge created
            const bdgeId = res.content.id;
            //create calling object, we need from and to
            let call = new Call({
                from: sharedResource.getVoiceSender(),
                to: sharedResource.getTestSMSRecv()[0]
            });
            //create the calling
            callApi.create_call(call, (err_call, res_call) => {
                if (err_call) {
                    sharedResource.dbgOut(err_call);
                }
                if (res_call) {
                    //sharedResource.dbgOut(res);
                    //calling created Success, let's add the call to bridge, you can add
                    //multiple calls 
                    let callids = [];
                    callids.push(res_call.content.id);
                    //call add_calls API, pass bridgeId, callid array and callback
                    bridgeApi.add_calls(bdgeId, callids, (err_add, res_add) =>{
                        if (err_add) {
                            sharedResource.dbgOut(err_add);
                        }
                        if (res_add) {
                            sharedResource.dbgOut(res_add);
                        }
                    })
                }
            })
        }
    });
}

/**
 * This test demostrates how to delete bridge, it will use list API to list all bridges,
 * then the first one will be deleted
 */
function test_delete() {
    //List all bridges
    bridgeApi.list_bridges((err, res) => {
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            let bdge = res.list[0];
            //delete the first item, if the call was Success, the callback parameter err_d will
            //be null, or it will be filled with the related error message
            bridgeApi.delete_bridge(bdge.id, (err_d) => {
                sharedResource.dbgOut(!err_d ? 'Success!' : err_d);
            })
        }
    })
}

/**
 * Test driver, uncomment the tests you want to run
 */
//test_create();
test_list();
//test_addcalls();
//test_delete();
