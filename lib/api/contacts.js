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

import Contact from '../model/contact';
import ApplicationToken from '../../lib/model/applicationToken';
import Api from './api';

export default class ContactApi extends Api{
    
    /**
     * Create contact from contact model object
     * @param {*} contact : the contact model object
     * @param {*} cb : callback function for holding the result, e.g. cb(err, res):
     *  If the call was successful, err will be null, res will contain the id of the contact,
     *  otherwise, err will contain the related error message.
     */
    create_contact(contact, cb) {
        this.client.contacts.create(contact.exportData(), (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, res.content);
            }
        });
    }

    /**
     * get all existing contact list
     * @param {*} cb : the callback function for the container of the results, e.g. cb(err, res):
     *  If the call was successful, err will be null, res will contain the list of the contacts,
     *  otherwise, err will contain the related error message
     */
    list_contacts(cb) {
        this.client.contacts.list((err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                var contacts = {};
                contacts.limit = res.limit;
                contacts.list = [];
                for(let i = 0; i < res.total; i ++) {
                    let item = new Contact(res.list[i]);
                    contacts.list.push(item);
                }
                cb(null, contacts);
            }
        })
    }

    /**
     * Retrieve a contact model object via its id
     * @param {*} id : the id of the contact to be retrieved
     * @param {*} cb : callback function for holding the result, e.g. cb(err, res):
     *  if the call was successful, err will be null, res will contain the contact object,
     *  otherwise, err will contain the related error message
     */
    get_contact(id, cb) {
        this.client.contacts.get(id, (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, new Contact(res));
            }
        })
    }

    /**
     * Update a contact with model object
     * @param {*} contact : the contact model object with updated content
     * @param {*} cb : callback function for holding the status result, e.g. cb(err):
     *  If the call was successful, err will be null, otherwise, it will contain
     *  the related error message
     */
    update_contact(contact, cb) {
        
        if (contact.application_id) {
            contact.application_id = undefined;
        }
        if (contact.company_id) {
            contact.company_id = undefined;
        }
        if (contact.created_date) {
            contact.created_date = undefined;
        }
        if (contact.last_updated_date) {
            contact.last_updated_date = undefined;
        }
        this.client.contacts.update(contact.id, contact.exportData(), (err, res) => {
            cb(err);
        });
    }

    /**
     * Delete a contact via its id
     * @param {*} contactId : the id of the contact to be deleted
     * @param {*} cb : callback function for holding the status result, e.g. cb(err):
     *  if the call was successful, err will be null, otherwise, it will be filled with
     *  the related error message
     */
    delete_contact(contactId, cb) {
        this.client.contacts.stub(contactId).delete((err) => {
            cb(err);
        })
    }

    /**
     * Create application token of a contact
     * @param {*} contactId : the id of the contact to be creating application token 
     * @param {*} at : application token model object
     * @param {*} cb : callback function for holding the result, e.g. cb(err, res):
     *  If the call was successful, err will be null, res will contain the token id,
     *  otherwise, err will contain the related error message
     */
    create_app_token(contactId, at, cb) {
        this.client.contactAppTokens.create(contactId, at.exportData(), (err, res) => {
            cb(err, res);
        })
    }

    /**
     * List applicationToken of a contact
     * @param {*} contactId : the id of the contact to be listing the applicationToken
     * @param {*} cb : callback function for holding the result, e.g. cb(err, res):
     *  If the call was successful, err will be null, res will contain the list of applicationToken
     *  of the contact, otherwise, err will contain the related error message
     */
    list_app_tokens(contactId, cb) {
        this.client.contactAppTokens.list(contactId, (err, res) => {
            cb(err, res);
        })
    }

    /**
     * Retrieve specific application token of a contact
     * @param {*} contactId : the id of the contact to be retrieving the app token
     * @param {*} tokenId : the application token Id of the app token
     * @param {*} cb : callback function for holding the result, e.g. cb(err, res):
     *  If the call was successful, err will be null, res will contain the applicationToken object,
     *  otherwise, err will be filled with the related error message
     */
    get_app_token(contactId, tokenId, cb) {
        this.client.contactAppTokens.get(contactId, tokenId, (err, res) => {
            if (res) {
                cb(null, new ApplicationToken(res));
            } else {
                cb(err, res);
            }
        })
    }

    /**
     * Delete specific application token of a contact
     * @param {*} contactId : the id of the contact to be deleting a application token
     * @param {*} tokenId : the id of the applicationToken to be deleted
     * @param {*} cb : callback function for holding the status result, e.g. cb(err):
     *  If the call was successful, err will be null, otherwise, it will be filled
     *  with the related error message
     */
    delete_app_token(contactId, tokenId, cb) {
        this.client.contactAppTokens.stub(contactId).delete_with_id(contactId, tokenId, (err) => {
            cb(err);
        })
    }
}
