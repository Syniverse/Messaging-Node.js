
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

import Call from '../model/call';
import Api from './api';

export default class CallApi extends Api {
    /**
     * Create a calling object
     * @param {*} call : the call model object for the new call
     * @param {*} cb : callback function for holding the result cb(err, res)
     *              if it was successful, err will be null, res will contain the call id
     *              otherwise, err will contain the error message
     */
    create_call(call, cb) {
        this.client.calling.calls.create(call.exportData(), (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, res.content);
            }
        });
    }

    /**
     * This api implemented the accept_call
     * @param {*} callId : the id of calling to be accepted
     * @param {*} cb : callback for the result: cb(err) if the call was not successful, err will be filled with
     *              the related error message, otherwise, it will be null 
     */
    accept_call(callId, cb) {
        this.client.calling.calls.update(callId, {state: 'ACTIVE'}, (err) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null);
            }
        })
    }

    /**
     * Hangup a call
     * @param {*} callId : the calling id to be Hangup
     * @param {*} cb : callback function for holding the result: cb(err): if it was successful, err will be null,
     *          otherwise, it will be filled with the error message
     */
    hangup_call(callId, cb) {
        this.client.calling.calls.update(callId, {state: 'COMPLETED'}, (err) => {
            if (err) {
                cb(err);
            } else {
                cb(null);
            }
        })
    }

    /**
     * This API will create a conference object
     * @param {*} from : the address of the sponsor
     * @param {*} cb : callback for holding the result like cb(err, res): if the API was successful,
     *      err will be null, res will be filled with the conference id, otherwise, err will contain
     *      the error message
     */
    create_conference(from, cb) {
        this.client.calling.conferences.create({from: from}, (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, res.content);
            }
        });
    }

    /**
     * 
     * @param {*} cb : callback function for holding the result: cb(err, res):
     *      if the call was successful, err will be null, res will contain the list
     *      of existing calling object, otherwise, err will be filled with related error message 
     */
    list_call(cb) {
        this.client.calling.calls.list((err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                var calls = {};
                calls.limit = res.limit;
                calls.list = [];
                for(let i = 0; i < res.total; i ++) {
                    let item = new Call(res.list[i]);
                    calls.list.push(item);
                }
                cb(null, calls);
            }
        })
    }

    /**
     * 
     * @param {*} id : the id of a calling object to be retrieved
     * @param {*} cb : callback function for holding the result cb(err, res),
     *      if the call was successful, err will be null and res will contain 
     *      the calling object, otherwise, err will contain the error message
     */
    get_call(id, cb) {
        this.client.calling.calls.get(id, (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, new Call(res));
            }
        })
    }

    /**
     * 
     * @param {*} call : the call model which contains the updated content
     * @param {*} cb : callback for holding the result: cb(err): if it was
     *  successful, err will be null, otherwise, err will contain the related
     *  error message
     */
    update_call(call, cb) {
        
        if (call.application_id) {
            call.application_id = undefined;
        }
        if (call.company_id) {
            call.company_id = undefined;
        }
        if (call.created_date) {
            call.created_date = undefined;
        }
        if (call.last_updated_date) {
            call.last_updated_date = undefined;
        }
        this.client.calling.calls.update(call.id, call.exportData(), (err, res) => {
            cb(err);
        });
    }

    /**
     * Delete specific calling object via its id.
     * @param {*} callId : the id of the calling object to be deleted
     * @param {*} cb : callback function for holding the result cb(err): if
     *  it was successful, err will be null, otherwise, it will contain the error
     *  messgae
     */
    delete_call(callId, cb) {
        this.client.calling.calls.stub(callId).delete((err) => {
            cb(err);
        })
    }
}