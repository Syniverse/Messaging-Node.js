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

import MessageRequest from '../model/messageRequest';
import Api from './api';

export default class MessageRequestApi extends Api {
    /**
     * Create message request with a MessageRequest model object
     * @param {*} obj : the messageRequest model object container
     * @param {*} cb : the callback function for holding the result, e.g. cb(err, res):
     *  If the call was successful, err will be null, res will contain the id of the request,
     *  otherwise, err will be filled with the related error message.
     */
    create_message(obj, cb) {
        this.client.messaging.messageRequests.create(obj.exportData(), (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, res.content);
            }
        });
    }

    /**
     * List message requests
     * @param {*} cb : callback function for holding the result, e.g. cb(err, res):
     *  If the call was successful, err will be null, res will contain the list of messages,
     *  otherwise, err will contain the related error message
     */
    list_messages(cb) {
        this.client.messaging.messageRequests.list((err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                var rets = {};
                rets.limit = res.limit;
                rets.list = [];
                for(let i = 0; i < res.total; i ++) {
                    let item = new MessageRequest(res.list[i]);
                    rets.list.push(item);
                }
                cb(null, rets);
            }
        })
    }

    /**
     * Retrieve a message request via its id
     * @param {*} id : the id of the message request to be retrieved
     * @param {*} cb : callback function for holding the result, e.g. cb(err, res):
     *  If the call was successful, err will be null, res will contain the message request model object,
     *  otherwise, err will be filled with the related error message
     */
    get_message(id, cb) {
        this.client.messaging.messageRequests.get(id, (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, new MessageRequest(res));
            }
        })
    }

    /**
     * Delete a message request via its id
     * @param {*} objId : the id of the message request to be deleted
     * @param {*} cb : callback function for holding the result, e.g. cb(err):
     *  If the call was successful, err will be null, otherwise, it will contain
     *  the related error message
     */
    delete_message(objId, cb) {
        this.client.messaging.messageRequests.stub(objId).delete((err) => {
            cb(err);
        })
    }
}