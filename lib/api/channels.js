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

import Channel from '../model/channel';
import Api from './api';

export default class ChannelApi extends Api {
    /**
     * 
     * @param {*} channel : the channel model object 
     * @param {*} cb : callback function for holding the result, i.g. cb(err, res):
     *  if the call was successful, err will be null and res contain the channel id.
     *  otherwise, err will contain the error message.
     */
    create_channel(channel, cb) {
        this.client.messaging.channels.create(channel.exportData(), (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, res.content);
            }
        });
    }

    /**
     * List existing channels
     * @param {*} cb callback function for holding the result. i.g cb(err, res):
     *      if the call was successful, err will be null, res will contain the channel list.
     *      otherwise, err will contain the error message
     */
    list_channels(cb) {
        this.client.messaging.channels.list((err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                var chans = {};
                chans.limit = res.limit;
                chans.list = [];
                for(let i = 0; i < res.total; i ++) {
                    let item = new Channel(res.list[i]);
                    chans.list.push(item);
                }
                cb(null, chans);
            }
        })
    }

    /**
     * Retrieve a channel via its id
     * @param {*} id : the id of the channel to be retrieved
     * @param {*} cb : callback function for holding the result, i.g. cb(err, res):
     *      if the call was successful, err will be null, res will contain the channel object,
     *      otherwise, err will contain the error message
     */
    get_channel(id, cb) {
        this.client.messaging.channels.get(id, (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, new Channel(res));
            }
        })
    }

    /**
     * Update specific channel via its id
     * @param {*} chan : the channel object contains the updated content, the id shall be the original one
     * @param {*} cb : callback function for holding the result, e.g. cb(err): if the call was successful,
     *  err will be null, otherwise, it will contain the error message
     */
    update_channel(chan, cb) {
        
        if (chan.application_id) {
            chan.application_id = undefined;
        }
        if (chan.company_id) {
            chan.company_id = undefined;
        }
        if (chan.created_date) {
            chan.created_date = undefined;
        }
        if (chan.last_updated_date) {
            chan.last_updated_date = undefined;
        }
        this.client.messaging.channels.update(chan.id, chan.exportData(), (err, res) => {
            cb(err);
        });
    }

    /**
     * Delete the channel with the id
     * @param {*} chanId : the id of the channel to be deleted
     * @param {*} cb : callback function for holding the result, e.g. cb(err):
     * if the call was successful, err will be null, otherwise, it will contain the error message
     */
    delete_channel(chanId, cb) {
        this.client.messaging.channels.stub(chanId).delete((err) => {
            cb(err);
        })
    }
}