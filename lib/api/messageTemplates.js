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

import MessageTemplate from '../model/messageTemplate';
import Api from './api';

export default class MessageTemplateApi extends Api {
    /**
     * Create message template
     * @param {*} obj : the messageTemplate model object of MessageTemplate
     * @param {*} cb : callback function for holding the result, e.g. cb(err, res):
     *  If the call was successful, err will be null, res will contain the id of
     *  the newly created messageTemplate, otherwise, err will be filled with the 
     *  related error message.
     */
    create_messageTemplate(obj, cb) {
        this.client.messaging.messageTemplates.create(obj.exportData(), (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, res.content);
            }
        });
    }

    /**
     * List messageTemplate
     * @param {*} cb : the callback function for holding the result, e.g. cb(err, res):
     *  If the call was successful, err will be null, res will contain the list of the
     *  messageTemplate, otherwise, err will be filled with the related error message.
     */
    list_messageTemplate(cb) {
        this.client.messaging.messageTemplates.list((err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                var rets = {};
                rets.limit = res.limit;
                rets.list = [];
                for(let i = 0; i < res.total; i ++) {
                    let item = new MessageTemplate(res.list[i]);
                    rets.list.push(item);
                }
                cb(null, rets);
            }
        })
    }

    /**
     * Retrieve the messageTemplate via its id
     * @param {*} id : the id of the messageTemplate to be retrieved
     * @param {*} cb : callback function for holding the result, e.g. cb(err, res):
     *  If the call was successful, err will be null, res will contain the messageTemplate object retrieved,
     *  otherwise, err will be filled with the related error message
     */
    get_messageTemplate(id, cb) {
        this.client.messaging.messageTemplates.get(id, (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, new MessageTemplate(res));
            }
        })
    }

    /**
     * 
     * @param {*} obj : the messageTemplate model object contains the updated content
     * @param {*} cb : callback function for holding the result, e.g. cb(err):
     *  If the call was successful, err will be null, otherwise err will be filled with
     *  the related error message
     */
    update_messageTemplate(obj, cb) {
        
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
        if (obj.last_updated_date) {
            obj.last_updated_date = undefined;
        }
        if (obj.ownership) {
            obj.ownership = undefined;
        }
        this.client.messaging.messageTemplates.update(obj.id, obj.exportData(), (err, res) => {
            cb(err);
        });
    }

    /**
     * Delete message template via its id
     * @param {*} objId : the id of the messageTemplate to be deleted
     * @param {*} cb : callback function for holding the status result, e.g. cb(err):
     *  If the call was successful, err will be null, otherwise, it will be filled with
     *  the related error message
     */
    delete_messageTemplate(objId, cb) {
        this.client.messaging.messageTemplates.stub(objId).delete((err) => {
            cb(err);
        })
    }
}