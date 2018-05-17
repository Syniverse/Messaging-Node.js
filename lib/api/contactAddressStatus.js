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

import ContactAddressStatus from '../model/contactAddressStatus';
import Api from './api';

export default class ContactAddressStatusApi extends Api{
    /**
     * Create new contact address status will the model object
     * @param {*} cas : the content of the contact address status model object
     * @param {*} cb : callback for holding the result, e.g. cb(err, res):
     *  if the call was successful, err will be null, res will contain the related
     *  id of the contact address status, otherwise, err will contain the error message
     */
    create_contact_address_status(cas, cb) {
        this.client.consent.contactAddressStatuses.create(cas.exportData(), (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, res.content);
            }
        })
    }

    /**
     * List contact address status
     * @param {*} cb : callback for holding the result, e.g. cb(err, res):
     *  if the call was successful, err will be null, res will contain the list of existing
     *  contact address status, otherwise, err will contain the related error message
     */
    list_contact_address_status(cb) {
        this.client.consent.contactAddressStatuses.list((err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                var ret = {};
                ret.limit = res.limit;
                ret.list = [];
                for(let i = 0; i < res.total; i ++) {
                    let item = new ContactAddressStatus(res.list[i]);
                    ret.list.push(item);
                }
                cb(null, ret);
            }
        })
    }

    /**
     * Retrieve a contact address status via its id
     * @param {*} id : the id of the contact address status to be retrieved
     * @param {*} cb : callback function for holding the result, e.g. cb(err, res):
     *  if the call was successful, err will be null, res will contain the contact address status
     *  object, otherwise, err will contain the related error message
     */
    get_contact_address_status(id, cb) {
        this.client.consent.contactAddressStatuses.get(id, (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, new ContactAddressStatus(res));
            }
        })
    }

    /**
     * Delete the specific contact address status via its id
     * @param {*} id : the id of the contact address status to be deleted
     * @param {*} cb : callback function for holding the final status, e.g. cb(err):
     *  if the call was successful, err will be null, otherwise, it will containt the
     *  related error message
     */
    delete_contact_address_status(id, cb) {
        this.client.consent.contactAddressStatuses.stub(id).delete((err) => {
            cb(err);
        })
    }

    /**
     * Update a contact address status
     * @param {*} cas : the contact address status object which contains the updated content
     * @param {*} cb : callback function for holding the result, e.g. cb(err):
     *  if the call was successful, err will be null, otherwise, it will be filled with the
     *  related error message
     */
    update_contact_address_status(cas, cb) {
        if (cas.application_id) {
            cas.application_id = undefined;
        }
        if (cas.company_id) {
            cas.company_id = undefined;
        }
        if (cas.created_date) {
            cas.created_date = undefined;
        }
        if (cas.last_updated_date) {
            cas.last_updated_date = undefined;
        }
        if (cas.address_type) {
            cas.address_type = undefined;
        }
        if (cas.address) {
            cas.address = undefined;
        }
        if (cas.sender_id) {
            cas.sender_id = undefined;
        }
        if (cas.from_address) {
            cas.from_address = undefined;
        }
        this.client.consent.contactAddressStatuses.update(cas.id, cas.exportData(), (err) => {
            cb(err);
        });
    }
}