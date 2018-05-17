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

'use strict';

import SenderIdType from '../model/senderIdType';
import Api from './api';

export default class SenderIdTypeApi extends Api {
    
    /**
     * List existing senderId type
     * @param {*} cb : callback function for holding the result, e.g. cb(err, res):
     *  If the call was successful, err will be null, res will contain the list of
     *  senderIdType, otherwise, err will contain the related error message
     */
    list_senderidtypes(cb) {
        this.client.messaging.senderIdTypes.list((err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                var rets = {};
                rets.limit = res.limit;
                rets.list = [];
                for(let i = 0; i < res.total; i ++) {
                    let item = new SenderIdType(res.list[i]);
                    rets.list.push(item);
                }
                cb(null, rets);
            }
        })
    }

    /**
     * Retrieve senderIdtype via its id
     * @param {*} id : the id of the senderidType to be retrieved
     * @param {*} cb : callback function for holding the result, e.g. cb(err, res):
     *  If the call was successful, err will be null, res will contain the senderIdtype
     *  object retrieved, otherwise, err will contain the related error message
     */
    get_senderidtype(id, cb) {
        this.client.messaging.senderIdTypes.get(id, (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, new SenderIdType(res));
            }
        })
    }
}