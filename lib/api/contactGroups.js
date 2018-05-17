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

import ContactGroup from '../model/contactGroup';
import Api from './api';

export default class ContactGroupApi extends Api{

    /**
     * Create a contact group with contactgroup model objectg
     * @param {*} cg : contact group model object
     * @param {*} cb : callback function for holding the result, e.g. cb(err, res):
     *  if the call was successful, err will be null, res will contain the newly created contact group id,
     *  otherwise, err will contain the related error message
     */
    create_contact_group(cg, cb) {
        this.client.contactGroups.contactGroups.create(cg.exportData(), (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, res.content);
            }
        })
    }

    /**
     * List existing contact group
     * @param {*} cb : the callback function for holding the result, e.g. cb(err, res):
     *  if the call was successful, err will be null, res will contain the list of the contact group
     *  retrieved, otherwise, err will contain the related error message
     */
    list_contact_group(cb) {
        this.client.contactGroups.contactGroups.list((err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                var ret = {};
                ret.limit = res.limit;
                ret.list = [];
                for(let i = 0; i < res.total; i ++) {
                    let item = new ContactGroup(res.list[i]);
                    ret.list.push(item);
                }
                cb(null, ret);
            }
        })
    }

    /**
     * Retrieve specific contactGroup via its id
     * @param {*} id : the id of the contact group to be retrieved
     * @param {*} cb : callback function for holding the result, e.g. cb(err, res):
     *  If the call was successful, err will be null, res will contain the contactGroup
     *  object, otherwise, err will contain the related error message.
     */
    get_contact_group(id, cb) {
        this.client.contactGroups.contactGroups.get(id, (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, new ContactGroup(res));
            }
        })
    }

    /**
     * Delete a contactgroup with its id
     * @param {*} id : the id of the contactGroup to be deleted
     * @param {*} cb : callback for holding the result, e.g. cb(err):
     *     if the call was successful, err will be null, otherwise,
     *     it will be filled with the related error message
     */
    delete_contact_group(id, cb) {
        this.client.contactGroups.contactGroups.stub(id).delete((err) => {
            cb(err);
        })
    }

    /**
     * Update a contactgroup
     * @param {*} cas : the updated contactGroup model object
     * @param {*} cb : callback for holding the status result, e.g. cb(err):
     *  if the call was successful, err will be null, otherwise, it will contain
     *  the related error message
     */
    update_contact_group(cas, cb) {
        if (cas.application_id > -1) {
            cas.application_id = undefined;
        }
        if (cas.company_id > -1) {
            cas.company_id = undefined;
        }
        if (cas.created_date) {
            cas.created_date = undefined;
        }
        if (cas.last_updated_date) {
            cas.last_updated_date = undefined;
        }
        if (cas.type) {
            cas.type = undefined;
        }
        if (cas.state) {
            cas.state = undefined;
        }
        if (cas.member_count > -1) {
            cas.member_count = undefined;
        }
        this.client.contactGroups.contactGroups.update(cas.id, cas.exportData(), (err) => {
            cb(err);
        });
    }

    /**
     * Add contact/contacts into a contact group
     * @param {*} id : the id of the contactGroup to be adding contact
     * @param {*} contact_ids : the contact Id array of contacts to be added
     * @param {*} cb callback function for holding the result, e.g. cb(err):
     *  if the call was successful, err will be null, otherwise, it will be 
     *  filled with the related error message.
     */
    add_contacts(id, contact_ids, cb) {
        this.client.contactGroups.contacts.create(id, {contacts: contact_ids}, (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null);
            }
        });
    }

    /**
     * List contacts of a contactGroup
     * @param {*} id : the id of the contactGroup to be listing the contacts
     * @param {*} cb : callback function for holding the result, e.g. cb(err, res):
     *  if the call was successful, err will be null, res will contain the list of
     * contacts of the contactGroup, otherwise, err will contain the related error message
     */
    list_contacts(id, cb) {
        this.client.contactGroups.contacts.list(id, (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, res);
            }
        })
    }
    
    /**
     * Remove a contact from a contact group
     * @param {*} id : the id of the contactGroup to be removing contact
     * @param {*} contactId : the contact id to be removed
     * @param {*} cb : callback function for holding the result, e.g. cb(err):
     *  if the call was successful, err will be null, otherwise, it will contain
     *  the related error message
     */
    remove_contact(id, contactId, cb) {
        this.client.contactGroups.contacts.stub(id).delete_with_id(id, contactId, (err) => {
            cb(err);
        })
    }

}