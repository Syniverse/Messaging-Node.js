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

 //import the required data model and API module
import SenderIdClass from '../../lib/model/senderIdClass';
import SenderIdClassApi from '../../lib/api/senderIdClasses';
const sharedResource = require('../shared');
//create senderIdClass API object
const api = new SenderIdClassApi(sharedResource.getAuth(), sharedResource.getService());

/**
 * This test shows how to use list_senderidclasses API to list existing senderIdClasses and
 * use get_senderidclasses to retrieve a senderIdClass with its id
 */
function test_list() {
    //Call list_senderidclasses API to get existing senderIdClasses, this api take one callback as the parameter
    api.list_senderidclasses((err, res) => {
        if (err) {
            //If problem happened, print the related error message
            sharedResource.dbgOut(err);
        }
        if (res) {
            //Print the list
            sharedResource.dbgOut(`Total items: ${res.list.length}`);
            sharedResource.dbgOut(res);
            if (res.list.length > 0) {
                //Take the first item to try get_senderidclasses API
                let id = res.list[0].id;
                sharedResource.dbgOut(`dump senderIdClass with id ${id}`);
                //call get_senderidclasses API to retrieve the senderIdClass with id
                api.get_senderidclasses(id, (err1, res1) => {
                    if (err1) {
                        //Error happened, print the error message
                        sharedResource.dbgOut(err1);
                    }
                    if (res1) {
                        //print the data of the senderIdClass retrieved
                        sharedResource.dbgOut(res1.exportData());
                    }
                });
            }
        }
    })
}

test_list();