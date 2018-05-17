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
import Attachment from '../../lib/model/attachment';
import AttachmentApi from '../../lib/api/attachments';

const sharedResource = require('../shared');

const api = new AttachmentApi(sharedResource.getAuth(), sharedResource.getService());

/**
 * test create attachment, pass the attachment object with file path, file name, attachment name and mime type
 * the API calling result will be put in the callback arguments err and res
 */
function test_create() {
    //Create attachment object, you need provide the attachment name, filename, file path so that the API can find it 
    //and upload, and the mime type
    let att = new Attachment({name:'jsf.png', filename: 'jsf.png', 
        filepath:'/lsurf/test/jsf.png', type: 'image/png'});
    
    //call API to create the attachment and upload the media file
    api.create_attachment(att, (err, res) => {
        if (err) {
            //If it was failed, related error message will be shown here
            sharedResource.dbgOut(err);
        }
        if (res) {
            //If it was successful, the related attachment id will show here
            sharedResource.dbgOut(res);
        }
    })
}

/**
 * Test list all attachments
 */
function test_list() {
    api.list_attachments((err, res) => {
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            //display total items of attachments
            sharedResource.dbgOut(`Total attachments: ${res.list.length}`);
            //dump the detail attachments
            sharedResource.dbgOut(res);
        }
    })
}

/**
 * Demostrate on deleting one attachment, the test will list all attachments, find one we uploaded
 * and delete that one
 */
function test_delete() {
    //List all attachments
    api.list_attachments((err, res) => {
        if (err) {
            //error happened, dump the error message
            sharedResource.dbgOut(err);
        }
        if (res) {
            let att;
            //find the one we uploaded
            for (let i = 0; i < res.list.length; i ++) {
                att = res.list[i];
                if (att.filename == 'jsf.png') {
                    break;
                }
            }
            sharedResource.dbgOut(att);
            //Delete the attachment with the id, if it was successful, the err_del will be filled with
            //null, or it will be the detailed failure information
            api.delete_attachment(att.id, (err_del) => {
                sharedResource.dbgOut(err_del ? err_del : 'Deleted successfully');
            })
        }
    })
}

/**
 * This test demostrates how to use update_attachment_name api, it will list all attachments, then find one we 
 * uploaded, change it's name
 */
function test_update() {
    api.list_attachments((err, res) => {
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            let att;
            for (let i = 0; i < res.list.length; i ++) {
                att = res.list[i];
                if (att.filename == 'jsf.png') {
                    break;
                }
            }
           sharedResource.dbgOut(att);
           //Update the attachment name with its id.
            api.update_attachment_name(att.id,`New name ${Date.now()}`, (err_upd) => {
                if (!err_upd) {
                    //If updated successful, we retrieve the detail of the attachment to verify
                    api.get_attachment(att.id, (err_get, natt) => {
                        if (err_get) {
                            sharedResource.dbgOut(err_get);
                        }
                        if (natt) {
                            sharedResource.dbgOut(natt);
                        }
                    });
                } else {
                    sharedResource.dbgOut(err_upd);
                }
            })
        }
    })
}

/**
 * This is a help function to dump buffer content with length
 * @param {* the buffer} buf 
 * @param {* the size to be dump} size 
 */
function dumpBuffer(buf, size) {
    let len = buf.length;
    let str = '';
    for(let i = 0; i < len; i ++) {
        if (i >= size) break;
        str += buf[i];
    }
    return str;
}

/**
 * This test demostrates how to use download_attachment to download the uploaded attachment
 * same as above, it list all the attachments first, then find the one we uploaded and download it
 */
function test_download() {
    api.list_attachments((err, res) => {
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            let att;
            for (let i = 0; i < res.list.length; i ++) {
                att = res.list[i];
                sharedResource.dbgOut(att);
                if (att.filename == 'jsf.png' && att.state == 'UPLOADED') {
                    break;
                }
            }
            //Download the attachment, if it was successful, the binary data will be inside
            //data argument of the callback, if any error happened, related error information will be inside
            //err_dl
            api.download_attachment(att.id, (err_dl, data) => {
                if (err_dl) {
                    sharedResource.dbgOut(err_dl); 
                }
                if (data) {
                    //dump first 16 bytes of the downloaded data
                    sharedResource.dbgOut(dumpBuffer(data, 16));
                }
            })
        }
    })
}

/**
 * Following are the test set to be called, to run specific test, just uncomment it
 */
//run tests
//test_create();
test_list();
//test_delete();
//test_update();
//test_download();