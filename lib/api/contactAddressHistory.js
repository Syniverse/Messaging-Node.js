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

"use strict";

import ContactAddressHistory from '../model/contactAddressHistory';
import Api from './api';

export default class ContactAddressHistoryApi extends Api{
    /**
     * List existing contact address history
     * @param {*} cb : the callback function for holding the result, e.g. cb(err, res):
     *  if the call was successful, err will be null and res will contain the list of the
     *  contact address history objects, otherwise, err will contain the related error message.
     */
    list_contact_address_history(cb) {
        this.client.consent.contactAddressHistory.list((err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                var ret = {};
                ret.limit = res.limit;
                ret.list = [];
                for(let i = 0; i < res.total; i ++) {
                    let item = new ContactAddressHistory(res.list[i]);
                    ret.list.push(item);
                }
                cb(null, ret);
            }
        })
    }

}