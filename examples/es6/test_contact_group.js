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

 //import required model and APIs
import ContactGroup from '../../lib/model/contactGroup';
import ContactGroupApi from '../../lib/api/contactGroups';
import ContactApi from '../../lib/api/contacts';

const sharedResource = require('../shared');

//create contactGroup API object, the two parameters are the authentication configuration and the gateway server
const cgApi = new ContactGroupApi(sharedResource.getAuth(), sharedResource.getService());

/**
 * This test shows how to create API to create the contact group
 */
function test_create() {
    //create the model object
    let cg = new ContactGroup({"name":"Group Name","description":"Group Description"});
    //call the create api to create the contact group with the model object
    cgApi.create_contact_group(cg, (err, res) => {
        //print the error message if there was any
        if (err) {
            sharedResource.dbgOut(err);
        }
        //If it was success, err will be null, and res will be filled with the contactGroup id we just created
        if (res) {
            sharedResource.dbgOut(res);
        }
    })
}

/**
 * This test demostrates how to use list_contact_group API and get_contact_group API
 */
function test_list() {
    //List existing contactGroup, we just need pass the callback function
    cgApi.list_contact_group((err, res) => {
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            //If it is success, the contactGroup will be in the res.list
            //print the content
            sharedResource.dbgOut(res);
            if (res.list.length > 0) {
                //get the first item in the list
                cgApi.get_contact_group(res.list[0].id, (err1, res1) => {
                    if (err1) {
                        //print the error if there is any
                        sharedResource.dbgOut(err1);
                    }
                    if (res1) {
                        //print the data
                        sharedResource.dbgOut(res1.exportData());
                    }
                })
            }
        }
    })
}

/**
 * This test demostrates how to use delete_contact_group API, it will list all contactGroups, and then delete the first one
 */
function test_delete() {
    //call the list API to enumerate the contact groups
    cgApi.list_contact_group((err, res) => {
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            //print the list
            sharedResource.dbgOut(res);
            if (res.list.length > 0) {
                //delete the first one
                cgApi.delete_contact_group(res.list[0].id, (err1) => {
                    sharedResource.dbgOut(err1 ? err1 : 'Deleted successfully!');
                })
            }
        }
    })
}

/**
 * This test will demostrate how to use update_contact_group, it will list all contactGroups, then update
 * the first one with new name and description, at last it calls get_contact_group to dump the content
 * updated
 */
function test_update() {
    //call list API to list all contact groups
    cgApi.list_contact_group((err, res) => {
        if (err) {
            //If there is any error, print the error message
            sharedResource.dbgOut(err);
        }
        if (res) {
            if (res.list.length > 0) {
                //take the first item in the list
                let cg = res.list[0];
                sharedResource.dbgOut(cg);
                sharedResource.dbgOut(`let's update`);
                cg.name = 'test' + Date.now();
                cg.description = 'desc' + Date.now();
                let id = cg.id;
                //call update_contact_group API, pass the updated object and the callback 
                cgApi.update_contact_group(cg, (err1) => {
                    if (err1) {
                        sharedResource.dbgOut(err1);
                    } else {
                        //updated successful, call get_contact_group API to print the content
                        cgApi.get_contact_group(id, (err1, res1) => {
                            if (err1) {
                                sharedResource.dbgOut(err1);
                            }
                            if (res1) {
                                sharedResource.dbgOut(res1.exportData());
                            }
                        })
                    }
                    
                })
            }
        }
    })
}

/**
 * This test demostrates how to add contact into the contact group
 */
function test_add_contact() {
    //list the contactGroup
    cgApi.list_contact_group((err, res) => {
        if (err) {
            //If there is any error print the error message
            sharedResource.dbgOut(err);
        }
        if (res) {
            if (res.list.length > 0) {
                //create contact array, make sure the contact IDs are valid, gateway will validate each one
                let catIds = ["tGgtT1Xy9vXFaOVtOX1al"];
                //add contact into the contactGroup of the first in the list, you can add multiple contact inside the array
                cgApi.add_contacts(res.list[0].id, catIds, (err1) => {
                    //If it was success, the callback parameter will be null, OTHERWISE, it will be filled with the related message
                    sharedResource.dbgOut(err1 ? err1 : 'Added successfully');
                })
            } else {
                //Doesn't have any contact group, print the hint
                sharedResource.dbgOut('Please add some contactGroup first!');
            }
        }
    })
}

/**
 * This test shows how to use list_contacts API to dump the contacts inside a contactGroup
 */
function test_list_contact() {
    //use list_contact_group to provide existing contactGroup, pass the callback with two arguments
    cgApi.list_contact_group((err, res) => {
        if (err) {
            //If there is any error, print here
            sharedResource.dbgOut(err);
        }
        if (res) {
            if (res.list.length > 0) {
                //List the contact of the first contactGroup in the list
                cgApi.list_contacts(res.list[0].id, (err1, res1) => {
                    if (err1) {
                        sharedResource.dbgOut(err1);
                    }
                    if (res1) {
                        //if it was successful, print all contacts inside this contactGroup
                        sharedResource.dbgOut(res1);
                    }
                })
            } else {
                //There is no contactGroup existing, print hint
                sharedResource.dbgOut('Please add some contactGroup first!');
            }
        }
    })
}

/**
 * This test demostrates how to remove one contact from contact group, this test will use list_contact_group to
 * find the contactGroup to be working on, if there is any, pick the first contactGroup in the list, then use 
 * list_contacts API to search existing contact, pick the first contact and push it into the contacts array, then call
 * add_contacts to add the contact into the contactGroup, if it was added successful, then we remove it
 */
function test_remove_contact() {
    //find the contactGroup we want to test with
    cgApi.list_contact_group((err, res) => {
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            if (res.list.length > 0) {
                let cgId = res.list[0].id;
                //Pick the first contactGroup in the list
                sharedResource.dbgOut(`contact group id: ${cgId}`)
                //create contact API object
                let api = new ContactApi(sharedResource.getAuth(), sharedResource.getService());
                //use contactApi to list contacts
                api.list_contacts((err1, res1) => {
                    if (err1) {
                        sharedResource.dbgOut(err1);
                    }
                    if (res1) {
                        if (res1.list.length > 0) {
                            //If there is any existing contact, pick the first one, push it into the contact array
                            let ctId = res1.list[0].id;
                            sharedResource.dbgOut(`Added contactId: ${ctId} to contactGroup: ${cgId}`);
                            let catIds = [];
                            catIds.push(ctId);
                            //Add the contact array into the contactGroup
                            cgApi.add_contacts(cgId, catIds, (err1) => {
                                if (err1) {
                                    sharedResource.dbgOut(err1);
                                } else {
                                    sharedResource.dbgOut(`let's delete the contact ${ctId}`);
                                    //call remove_contact API to remove the contact from contactGroup
                                    cgApi.remove_contact(cgId, ctId, (err2) => {
                                        sharedResource.dbgOut(err2 ? err2 : 'Deleted successfully!');
                                    })
                                }
                            })
                        } else {
                            //There is no existing contact, prompt user to add before this test
                            sharedResource.dbgOut(`You need add some contact first!`);
                        }
                    }
                });
                
            } else {
                //Cannot find any contactGroup, prompt the user to add before the test
                sharedResource.dbgOut('Please add some contactGroup first!');
            }
        }
    })
}

/**
 * Test drivers, uncomment those you want to run.
 */
//test_create();
//test_list();
//test_delete();
//test_update();
//test_add_contact();
//test_list_contact();
test_remove_contact();