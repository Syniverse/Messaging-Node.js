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

import Attachment from '../model/attachment.js';
import Api from './api.js';

export default class AttachmentApi extends Api{
    
    /**
     * Create attachment from attachment object, it will also upload the attachment binary
     * @param {*} attInfo - 
     *        This parameter supposed to be the Attachment model object, inside this object,
     *        user shall provide attachment name, type, filename and filepath
     * @param {*} cb callback API for the result
     *        The callback paramters shall have two arguments, the first one is for
     *        error message if there is any, the second argument will be the attachment
     *        id if the operation was successful
     */
    create_attachment(attInfo, cb) {
        //Step 1: create the attachment information
        let infoBody = {
            name: attInfo.name,
            type: attInfo.type,
            filename: attInfo.filename
        }
        this.client.messaging.attachments.create(infoBody, (err1, res1)=> {
            if (err1) {
                cb(err1);
            } else
            if (res1) {
                const attId = res1.content.id;
                let tokenBody = {
                    resource: 'ATTACHMENT',
                    resource_id: attId
                };
                //create access token
                this.client.messaging.accessTokens.create(tokenBody, (err2, res2) => {
                    if (err2) {
                        cb(err2);
                    } else {
                        const tokenId = res2.content.id;
                        let uri = `/scg-attachment/api/v1/messaging/attachments/${tokenId}/content`;
                        
                        let args = {
                            callback: (err3, res3) => {
                                if (err3) {
                                    cb(err3);
                                } else
                                if (res3) {
                                    if (res3.statusCode >= 200 && res3.statusCode < 300) {
                                        cb(null, {attachment_id: attId});
                                    } else {
                                        cb(res3.body);
                                    }
                                }
                            },
                            filename: attInfo.name,
                            type: attInfo.type,
                            filepath: attInfo.filepath
                        }
                        this.client.upload(uri, args);
                    }
                })
            }
        })
    }

    /**
     * This API will let user download the uploaded attachment
     * @param {*} id: this is the id of the attachment
     * @param {*} cb: callback for the API like cb(err, res). it shall have two arguments, one for
     *          error message, other one is for the result. if it was success,
     *          the first err will be null, the res will contain the binary data downloaded.
     */
    download_attachment(id, cb) {
        this.client.messaging.accessTokens.create({
            resource: 'ATTACHMENT',
            resource_id: id
        }, (err, res) => {
            if (err) {
                cb(err);
            } else {
                const tokenId = res.content.id;
                let uri = `/scg-attachment/api/v1/messaging/attachments/${tokenId}/content`;
                
                let args = {
                    callback: (err2, res2) => {
                        if (err2) {
                            cb(err2);
                        } else
                        if (res2) {
                            if (res2.statusCode >= 200 && res2.statusCode < 300) {
                                cb(null, res2.body);
                            } else {
                                cb(res2.body);
                            }
                        }
                    }
                }
                this.client.download(uri, args);
            }
        })
    }

    /**
     * This api will list attachment
     * @param {*} cb 
     *     cb(err, res): err will be filled with error message if problem happened during calling
     *     if it was successful, err will be null, res will contain the list of attachments.
     */
    list_attachments(cb) {
        this.client.messaging.attachments.list((err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                var atts = {};
                atts.limit = res.limit;
                atts.list = [];
                for(let i = 0; i < res.total; i ++) {
                    let item = new Attachment(res.list[i]);
                    atts.list.push(item);
                }
                cb(null, atts);
            }
        })
    }

    /**
     * Retrieve an attachment via its id.
     * @param {*} id : the id of the attachment to be retrieved
     * @param {*} cb : cb(err, res) if it was successful, err will be null and res will contain
     *              Attachment object, if it was failed, the error message will be inside the err
     */
    get_attachment(id, cb) {
        this.client.messaging.attachments.get(id, (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, new Attachment(res));
            }
        })
    }

    /**
     * Delete an attachment via its id. 
     * @param {*} id : the id of the attachment to be deleted
     * @param {*} cb : callback function like cb(err)
     *          if the deletion was successful, err will be null, otherwise, it will contain the related error object
     */
    delete_attachment(id, cb) {
        this.client.messaging.attachments.stub(id).delete((err) => {
            cb(err);
        })
    }

    /**
     * Update the name of an attachment with its id
     * @param {*} id : id of the attachment to be working on
     * @param {*} name : the new name of the attachment
     * @param {*} cb : callback function like cb(err) if the calling was successful, err will be null
     * otherwise, err will contain the error object.
     */
    update_attachment_name(id, name, cb) {
        this.client.messaging.attachments.get(id, (err, att) => {
            if (err) {
                cb(err);
            }
            if (att) {
                this.client.messaging.attachments.update(id, {name: name, version_number: att.version_number}, (err1, res) => {
                    cb(err1);
                })
            } 
        })
        
    }

}
