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

 //import required data model and API module
import Keyword from '../../lib/model/keyword';
import KeywordApi from '../../lib/api/keywords';

const sharedResource = require('../shared');

//Create keywordApi object
const keywordApi = new KeywordApi(sharedResource.getAuth(), sharedResource.getService());

/**
 * This test shows how to use create_keyword API
 */
function test_create() {
    //create keyword model object, refer to Keyword model for the supported fields, make sure the sender_id
    //is the valid one, otherwise the gateway will reject it
    let keyword = new Keyword({"name":"Test Keyword 0516","case":"SENSITIVE",
        "valid_from":4261877, valid_to:5332311,
        "value":"Steven516","sender_id":"7e8tRw37PbtsN0V4EiUlt1"});
    //call create_keyword api to create the keyword, this api take keyword object and callback
    keywordApi.create_keyword(keyword, (err, res) => {
        //If there was any error, we print the error, otherwise, we print its id
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            sharedResource.dbgOut(res);
        }
    })
}

/**
 * This test demostrates how to use list_keywords API and get_keyword API
 */
function test_list() {
    //call list_keywords, it only take one callback as the parameter, this callback shall have two
    //arguments, one for success, other for error
    keywordApi.list_keywords((err, res) => {
        //If there was any problem happened, print the error message
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            //Print total existing keywords
            sharedResource.dbgOut(`Total keywords: ${res.list.length}`);
            //print the list
            sharedResource.dbgOut(res);
            if (res.list.length > 0) {
                //dump the first keyword with the get_keyword api
                let id = res.list[0].id;
                //call get_keyword API, pass the keyword id and callback
                keywordApi.get_keyword(id, (err2, res2) => {
                    if (err2) {
                        //If there was any error, print the error message
                        sharedResource.dbgOut(err2);
                    }
                    if (res2) {
                        //If it was successful, dump the data
                        sharedResource.dbgOut(res2.exportData());
                    }
                })
            }
        }
    })
}

/**
 * This test demostrates how to use update_keyword API
 */
function test_update() {
    //use list_keywords to retrieve existing keywords
    keywordApi.list_keywords((err, res) => {
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            //sharedResource.dbgOut(res);
            if (res.list.length < 1) {
                //If there is no existing keyoword, give a warm hint
                sharedResource.dbgOut('Please add some keyword first');
            } else {
                //take the first one, update its name
                let obj = res.list[0];
                sharedResource.dbgOut(obj);
                obj.name = 'Test_name' + Date.now();
                keywordApi.update_keyword(obj, (err_u) => {
                    //If it was success, err_u will be null, otherwise, it will be the related error message
                    sharedResource.dbgOut(err_u ? err_u : 'Updated successfully');
                })
            }
            
        }
    })
}

/**
 * This test shows how to use delete_keyword API
 */
function test_delete() {
    //list existing keyword
    keywordApi.list_keywords((err, res) => {
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            //sharedResource.dbgOut(res);
            if (res.list.length < 1) {
                //If there isn't any existing keyword, prompt use to add before the test
                sharedResource.dbgOut('Please add some keywords first');
            } else {
                //Take the first keyword, delete it
                let obj = res.list[0];
                sharedResource.dbgOut(obj);
                //delete_keyword API takes the keyword id and one argument callback
                keywordApi.delete_keyword(obj.id, (err_d) => {
                    //If it was successful, err_d will be null, otherwise, it will be filled with related error message
                    sharedResource.dbgOut(err_d ? err_d : 'Deleted successfully');
                })
            }
            
        }
    })
}

/**
 * Test driver, enable the tests you are planning to run before running.
 */
//test_create();
//test_list();
test_update();
//test_delete();
