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

import Message from '../model/message';
import Api from './api';

export default class MessageApi extends Api {
    /**
     * List messages
     * @param {*} cb : the callback function for holding the result, e.g. cb(err, res):
     *  If the call was successful, err will be null, res will contain the list of the
     *  messages, otherwise, err will be filled with the related error message
     */
    list_messages(cb) {
        this.client.messaging.messages.list((err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                var rets = {};
                rets.limit = res.limit;
                rets.list = [];
                for(let i = 0; i < res.total; i ++) {
                    let item = new Message(res.list[i]);
                    rets.list.push(item);
                }
                cb(null, rets);
            }
        })
    }

    /**
     * Retrieve a message via its id
     * @param {*} id : the id of the message to be retrieved
     * @param {*} cb : callback function for holding the result, e.g. cb(err, res):
     *  If the call was successful, err will be null, res will contain the message model object,
     *  otherwise, err will be filled with the related error message
     */
    get_message(id, cb) {
        this.client.messaging.messages.get(id, (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, new Message(res));
            }
        })
    }

    /**
     * Delete a message via its id
     * @param {*} objId : the id of the message to be deleted
     * @param {*} cb : callback function for holding the status result, e.g. cb(err):
     *  If the call was successful, err will be null, otherwise, it will be filled 
     *  with the related error message
     */
    delete_message(objId, cb) {
        this.client.messaging.messages.stub(objId).delete((err) => {
            cb(err);
        })
    }
}