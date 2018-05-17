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

import Keyword from '../model/keyword';
import Api from './api';

export default class KeywordApi extends Api {
    /**
     * Create a keyword with the model object
     * @param {*} obj : the keyword model object container
     * @param {*} cb : callback function for holding the result, e.g. cb(err, res):
     *  If the call was successful, err will be null, res will contain the id of the newly
     *  created keyword, otherwise, err will contain the related error message.
     */
    create_keyword(obj, cb) {
        this.client.messaging.keywords.create(obj.exportData(), (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, res.content);
            }
        });
    }

    /**
     * List keywords
     * @param {*} cb : the callback function for holding the result, e.g. cb(err, res):
     *   If the call was successful, err will be null, res will contain the list of
     *   keywords, otherwise, err will contain the related error message
     */
    list_keywords(cb) {
        this.client.messaging.keywords.list((err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                var rets = {};
                rets.limit = res.limit;
                rets.list = [];
                for(let i = 0; i < res.total; i ++) {
                    let item = new Keyword(res.list[i]);
                    rets.list.push(item);
                }
                cb(null, rets);
            }
        })
    }

    /**
     * Retrieve a keyword via its id
     * @param {*} id : the id of the keyword to be retrieved
     * @param {*} cb : callback function for holding the result, e.g. cb(err, res):
     *  If the call was successful, err will be null, res will contain the keyword model object,
     *  otherwise, err will contain the related error message
     */
    get_keyword(id, cb) {
        this.client.messaging.keywords.get(id, (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, new Keyword(res));
            }
        })
    }

    /**
     * Update a keyword
     * @param {*} obj : keyword model object contains the updated content
     * @param {*} cb : callback function for holding the ressult, e.g. cb(err):
     *  If the call was successful, err will be null, otherwise, it will be filled
     *  with the related error message
     */
    update_keyword(obj, cb) {
        
        if (obj.application_id) {
            obj.application_id = undefined;
        }
        if (obj.company_id) {
            obj.company_id = undefined;
        }
        if (obj.created_date) {
            obj.created_date = undefined;
        }
        if (obj.last_updated_date) {
            obj.last_updated_date = undefined;
        }
        if (obj.type) {
            obj.type = undefined;
        }
        if (obj.sender_id) {
            obj.sender_id = undefined;
        }
        if (obj.actions) {
            obj.actions = undefined;
        }
        this.client.messaging.keywords.update(obj.id, obj.exportData(), (err, res) => {
            cb(err);
        });
    }

    /**
     * Delete a keyword via its id
     * @param {*} objId : the id of the keyword to be deleted
     * @param {*} cb : callback function for holding the status result, e.g. cb(err):
     *  If the call was successful, err will be null, otherwise, it will be filled
     *  with the related error message
     */
    delete_keyword(objId, cb) {
        this.client.messaging.keywords.stub(objId).delete((err) => {
            cb(err);
        })
    }
}