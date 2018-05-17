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
import ContactAddressStatus from '../../lib/model/contactAddressStatus';
import ContactAddressStatusApi from '../../lib/api/contactAddressStatus';
import ContactAddressHistoryApi from '../../lib/api/contactAddressHistory';

const sharedResource = require('../shared');
//create contact address status API object
const casApi = new ContactAddressStatusApi(sharedResource.getAuth(), sharedResource.getService());

/**
 * This test shows how to use list_contact_address_history API to list all contact address history
 */
function test_contact_address_history() {
    //create contact address history API object
    const api = new ContactAddressHistoryApi(sharedResource.getAuth(), sharedResource.getService());
    //call list contact address history API, pass the callback for failure and success
    api.list_contact_address_history((err, res) => {
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            //print out the whole contact address history
            sharedResource.dbgOut(res);
        }
    })
}

/**
 * This test demostrates how to use create_contact_address_status to create contact address status
 */
function test_create() {
    //Create the contact address history object, please refer to the model to check supported fields
    let cas = new ContactAddressStatus({"address_type":"LONGCODE",
        "address":"21213333", "sender_id":
        sharedResource.getVoiceSender()});
    //call the create api with the object and callback function to create the contactAddressStatus
    casApi.create_contact_address_status(cas, (err, res) => {
        //If there was any problem, print the error content
        if (err) {
            sharedResource.dbgOut(err);
        }
        //If it was success, print the object id
        if (res) {
            sharedResource.dbgOut(res);
        }
    })
}

/**
 * This test shows how to use list_contact_address_status and get_contact_address_status
 */
function test_list() {
    //call list_contact_address_status API, pass the callback with err and result arguments
    casApi.list_contact_address_status((err, res) => {
        //If there was any problem, err will be filled with error message
        if (err) {
            //print the error
            sharedResource.dbgOut(err);
        }
        //If it was success, err will be null, and res will contain the whole list of the contactAddressStatus
        if (res) {
            //print the content
            sharedResource.dbgOut(res);
            if (res.list.length >  0) {
                //call get_contact_address_status API to retrieve the first item
                casApi.get_contact_address_status(res.list[0].id, (err_get, res_get) => {
                    sharedResource.dbgOut(res_get);
                });
            }
        }
    })
}

/**
 * This test demostrates how to use update_contact_address_status to update the contactAddressStatus,
 * you can only update consent_status
 */
function test_update() {
    //Create a new contactAddressStatus
    let cas = new ContactAddressStatus({"address_type":"LONGCODE",
        "address":"17205368837", "sender_id":
        sharedResource.getVoiceSender()});
    //call the create api with the object and callback function to create the contactAddressStatus
    casApi.create_contact_address_status(cas, (err, res) => {
        //If there was any problem, print the error content
        if (err) {
            sharedResource.dbgOut(err);
        }
        //If it was success, print the object id
        if (res) {
            sharedResource.dbgOut(res);
            let id = res.id;
            //get the new created one
            casApi.get_contact_address_status(id, (err_get, res_get) => {
                sharedResource.dbgOut(res_get);
                let cas_u = res_get;
                //chang its consent_status
                cas_u.consent_status = "OPTIN";
                //do update
                casApi.update_contact_address_status(cas_u, (err_u, res_u) => {
                    if (err_u) {
                        sharedResource.dbgOut(err_u);
                    }
                    if (res_u) {
                        sharedResource.dbgOut(res_u);
                    }
                    casApi.delete_contact_address_status(id, (err_d) => {
                        sharedResource.dbgOut(err_d? err_d : 'Deleted!!');
                    })
                })
            });
        }
    })
}

/**
 * This test demostrates how to use delete API to delete contactAddressStatus
 */
function test_delete() {
    //add item first and then delete it
    //create a contactAddressStatus object
    let cas = new ContactAddressStatus({"address_type":"LONGCODE",
        "address":"17172227890", "sender_id":
        sharedResource.getVoiceSender()});
    //create the contactAddressHistory
    casApi.create_contact_address_status(cas, (err, res) => {
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            //print the return result
            sharedResource.dbgOut(res);
            let id = res.id;
            //delete this item
            casApi.delete_contact_address_status(id, (err_d) => {
                sharedResource.dbgOut(err_d? err_d : 'Deleted!!');
            })
        }
    })
}

/**
 * Test driver, uncomment those tests you want to run
 */
//test_contact_address_history();
//test_create();
//test_update();
//test_list();
test_delete();