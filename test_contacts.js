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

//imnport the required model and API 
import Contact from '../../lib/model/contact';
import ContactApi from '../../lib/api/contacts';
import ApplicationToken from '../../lib/model/applicationToken';

//refer to the utils lib
const sharedResource = require('../shared');

//create contactApi object, pass the auth configuration and the Gateway url
const contactApi = new ContactApi(sharedResource.getAuth(), sharedResource.getService());

/**
 * This test demostrates the usage of create contact
 */
function test_create() {
    //Create contact object, please refer to the Contact model for supported fields
    let contact = new Contact({first_name:'John', last_name:'Doe', primary_mdn:'18134117121'});
    //call create_contact API with contact object and callback to create the contact
    contactApi.create_contact(contact, (err, res) => {
        //If the operate was success, err will be filled with null, res will be filled with the contact ID
        if (err) {
            //If there was any error, print the error message
            sharedResource.dbgOut(err);
        }
        if (res) {
            //If it was successful, print the contact id in the response.
            sharedResource.dbgOut(res);
        }
    })
}

/**
 * This test shows how to use list_contacts and get_contact
 */
function test_list() {
    //list_contacts, pass two args callback
    contactApi.list_contacts((err, res) => {
        if (err) {
            //print the error message if there was any happened
            sharedResource.dbgOut(err);
        }
        if (res) {
            //print the contact list, the result will be inside res.list
            sharedResource.dbgOut(res);
            if (res.list.length > 0) {
                //get the first contact in the list
                contactApi.get_contact(res.list[0].id, (err_get, res_get) => {
                    if (err_get) {
                        sharedResource.dbgOut(err_get);
                    }
                    if (res_get) {
                        //If it was success, dump the related contact data
                        sharedResource.dbgOut(res_get.exportData());
                    }
                });
            }
        }
    })
}

/**
 * This test demostrates how to use update api
 */
function test_update() {
    //List existing contacts
    contactApi.list_contacts((err, res) => {
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            //pick the first contact
            let contact = res.list[0];
            sharedResource.dbgOut(`Before update contact: ` + contact);
            //update it's mdn
            contact.primary_mdn = "17207871234";
            sharedResource.dbgOut(`New primary_mdn: ${contact.primary_mdn}`);
            contactApi.update_contact(contact, (err_update) => {
                sharedResource.dbgOut(err_update ? err_update : `Updated successfully`);
            })
        }
    })
}

/**
 * This test demostrates how to use delete_contact API
 */
function test_delete() {
    //List all existing contacts
    contactApi.list_contacts((err, res) => {
        //If there was any error, we print the error message, otherwise, pick the last contact to delete
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            //pick the last one in the list
            let contact = res.list[res.list.length - 1];
            //call delete_contact API, pass the contact ID and the callback
            contactApi.delete_contact(contact.id, (err_delete) => {
                //If the delete was successful, err_delete will be filled with null, otherwise, it will be the related error message
                if (err_delete) {
                    sharedResource.dbgOut(err_delete);
                } else {
                    sharedResource.dbgOut(`Deleted successfully!`);
                }
            })
        }
    })
}

/**
 * This test demostrates how to use create contact application token API
 */
function test_create_contact_application_token() {
    //List existing contacts
    contactApi.list_contacts((err, res) => {
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            if (res.list.length < 1) {
                //create one contact
                sharedResource.dbgOut("Please create some contact first!");
            } else {
                //We do have existing contact, pick the first one
                let contactId = res.list[0].id;
                //Create application token object
                let at = new ApplicationToken({sender_id_address: sharedResource.getVoiceSender(),
                    message_delivery_provider: 'APN',
                    token: 'dummy'    
                });
                //call create_app_token with the contactId, applicationToken object and callback
                contactApi.create_app_token(contactId, at, (err2, res2) => {
                    if (err2) {
                        sharedResource.dbgOut(err2);
                    } 
                    if (res2) {
                        //If it was successful, dump the creation Id
                        sharedResource.dbgOut(res2.content);
                    }
                })
                
            }
            
        }
    })
}

/**
 * This test shows how to use list_app_tokens, it list all contacts first, then pick the first one to list its application token
 * and then use get_app_token to retrieve the first app token
 */
function test_list_contact_application_token() {
    //List existing contacts
    contactApi.list_contacts((err, res) => {
        if (err) {
            //If there was any error, print the error message
            sharedResource.dbgOut(err);
        }
        if (res) {
            if (res.list.length < 1) {
                //If there is no existing contact, give the related hint
                sharedResource.dbgOut("Please create some contact first!");
            } else {
                //Pick the first contact and take its id
                let contactId = res.list[0].id;
                //list this contact's apolication token
                contactApi.list_app_tokens(contactId, (er2, res2) => {
                    if (er2) {
                        sharedResource.dbgOut(er2);
                    } 
                    if (res2) {
                        //print its tokens
                        sharedResource.dbgOut(res2);
                        if (res2.list.length > 0) {
                            //test get with the first application token
                            let tokenId = res2.list[0].id;
                            contactApi.get_app_token(contactId, tokenId, (err_g, res_g) => {
                                if (err_g) {
                                    sharedResource.dbgOut(err_g);
                                }
                                if (res_g) {
                                    //print the content
                                    sharedResource.dbgOut(res_g.exportData());
                                }
                            })
                        }
                    }
                })
                
            }
            
        }
    })
}

/**
 * This test demostrates how to use delete_app_token, it list all existing contacts, then pick first
 * contact, add application token into it, then delete it
 */
function test_delete_contact_application_token() {
    //List existing contacts
    contactApi.list_contacts((err, res) => {
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            if (res.list.length < 1) {
                //If there is no existing contact, prompt use to create some before running this test
                sharedResource.dbgOut("Please create some contact first!");
            } else {
                //Pick the first contact
                let contactId = res.list[0].id;
                //create applicationToken object
                let at = new ApplicationToken({sender_id_address: sharedResource.getVoiceSender(),
                    message_delivery_provider: 'APN',
                    token: 'dummy'    
                });
                //create the application token with the contact
                contactApi.create_app_token(contactId, at, (er2, res2) => {
                    if (er2) {
                        sharedResource.dbgOut(er2);
                    } 
                    if (res2) {
                        //If it was successful, we delete this application token from this contact
                        sharedResource.dbgOut(res2.content);
                        let tokenId = res2.content.id;
                        //pass contactId, applicationToken Id and callback
                        contactApi.delete_app_token(contactId, tokenId, (err_g) => {
                            sharedResource.dbgOut(err_g ? err_g : 'Deleted!!');
                        })
                    }
                })
                
            }
            
        }
    })
}

/**
 * Test driver, uncomment those tests you wish to run
 */
//Run the test
//test_create();
//test_list();
//test_update();
//test_delete();
//test_create_contact_application_token();
//test_list_contact_application_token();
test_delete_contact_application_token();

