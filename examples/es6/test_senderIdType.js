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

 //Import the required data model and API module
import SenderIdType from '../../lib/model/senderIdType';
import SenderIdTypeApi from '../../lib/api/senderIdType';
const sharedResource = require('../shared');

//create SenderIdTypeApi API object
const api = new SenderIdTypeApi(sharedResource.getAuth(), sharedResource.getService());

/**
 * This test demostrates how to use list_senderidtypes to list existing senderIdTypes and how to use get_senderidtype
 * to get specific senderIdType with its id
 */
function test_list() {
    //call list_senderidtypes to retrieve existing senderIdTypes
    api.list_senderidtypes((err, res) => {
        if (err) {
            //Print error message if error happened
            sharedResource.dbgOut(err);
        }
        if (res) {
            //Print the total number of senderIdType
            sharedResource.dbgOut(`Total items: ${res.list.length}`);
            //Print the list
            sharedResource.dbgOut(res);
            if (res.list.length > 0) {
                //Pick the first one to try get_senderidtype API
                let id = res.list[0].id;
                sharedResource.dbgOut(`dump senderIdType with id ${id}`);
                //Call get_senderidtype API, this API takes the object ID and callback
                api.get_senderidtype(id, (err1, res1) => {
                    if (err1) {
                        //If problem happened, print the error message
                        sharedResource.dbgOut(err1);
                    }
                    if (res1) {
                        //If it was successful, err1 will be null, res1 will contain the SenderIdType object
                        sharedResource.dbgOut(res1.exportData());
                    }
                });
            }
        }
    })
}

test_list();