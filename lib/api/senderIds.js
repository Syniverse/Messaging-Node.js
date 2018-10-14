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

import SenderId from '../model/senderId';
import Api from './api';

export default class SenderIdApi extends Api {
    /**
     * 
     * @param {*} obj : the senderId model object SenderId
     * @param {*} cb  : callback function for holding the result, e.g. cb(err, res):
     *  If the call was successful, err will be null, res will contain the id of the object,
     *  otherwise, err will contain the related error message
     */
    create_senderid(obj, cb) {
        this.client.messaging.senderIds.create(obj.exportData(), (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, res.content);
            }
        });
    }

    /**
     * List existing senderId 
     * @param {*} cb : the callback function for holding the result, e.g. cb(err, res):
     *  If the call was successful, err will be null, res will contain the list of senderid retrieved,
     *  otherwise, err will contain the related error message
     */
    list_senderids(cb) {
        this.client.messaging.senderIds.list((err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                var rets = {};
                rets.limit = res.limit;
                rets.list = [];
                for(let i = 0; i < res.total; i ++) {
                    let item = new SenderId(res.list[i]);
                    rets.list.push(item);
                }
                cb(null, rets);
            }
        })
    }

    /**
     * Retrieve senderId according its id
     * @param {*} id : the id of the senderid to be retrieved
     * @param {*} cb : callback function for holding the result, e.g. cb(err, res):
     *  If the call was successful, err will be null, res will contain the model
     *  object retrieved, otherwise, err will contain the related error message
     */
    get_senderid(id, cb) {
        this.client.messaging.senderIds.get(id, (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, new SenderId(res));
            }
        })
    }

    /**
     * Update senderid
     * @param {*} obj : the senderId model object contains the updated content 
     * @param {*} cb : callback function for holding the result, e.g. cb(err):
     *  If the call was successful, err will be null, otherwise, it will contain
     *  the related error message
     */
    update_senderid(obj, cb) {
        
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
        if (obj.class_id) {
            obj.class_id = undefined;
        }
        if (obj.type_id) {
            obj.type_id = undefined;
        }
        if (obj.address) {
            obj.address = undefined;
        }
        if (obj.country) {
            obj.country = undefined;
        }
        if (obj.applied_charges) {
            obj.applied_charges = undefined;
        }
        this.client.messaging.senderIds.update(obj.id, obj.exportData(), (err, res) => {
            cb(err);
        });
    }

    /**
     * 
     * @param {*} objId : the id of the senderid to be deleted
     * @param {*} cb : callback function for holding the result, e.g. cb(err):
     *  If the call was successful, err will be null, otherwise, it will be filled
     *  with the related error message
     */
    delete_senderid(objId, cb) {
        this.client.messaging.senderIds.stub(objId).delete((err) => {
            cb(err);
        })
    }

    set_state(obj, state, args, cb) {
        if (!args) {
            args = {};
        }
        args.version_number = obj.version_number;
        args.state = state;
        this.client.messaging.senderIds.update(obj.id, args, (err, res) => {
            cb(err);
        });
    }

    activate(obj, cb) {
        this.set_state(obj, 'ACTIVE', null, cb);
    }

    deactivate(obj, cb) {
        this.set_state(obj, 'INACTIVE', null, cb);
    }

    init_whatsapp_registration(obj, register_method, cb) {
        this.set_state(obj, 'PENDING_CONFIRMATION', 
            {"register_method": register_method}, 
            cb);
    }

    activate_whatsapp_registration(obj, verification_code, cb) {
        this.set_state(obj, 'ACTIVE', 
            {"verification_code": verification_code},
            cb);
    }
}