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

import Bridge from '../model/bridge';
import Api from './api';

export default class BridgeApi  extends Api {
    /**
     * create a bridge with the bridge model object
     * @param {*} bridge : the bridge model object
     * @param {*} cb : callback function like cb(err, res)
     *                  if the call was successful, err will be null and res will be filled with the bridge id
     *                  otherwise, res will be undefined and err contain the error
     * 
     */
    create_bridge(bridge, cb) {
        this.client.calling.bridges.create(bridge.exportData(), (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, res.content);
            }
        });
    }

    /**
     * List existing bridges
     * @param {*} cb : callback function like cb(err, res)
     *                  if the call was successful, err will be null and res contain the list of existing list_bridges
     *                  otherwise, err will contain the error message
     */
    list_bridges(cb) {
        this.client.calling.bridges.list((err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                var brdgs = {};
                brdgs.limit = res.limit;
                brdgs.list = [];
                for(let i = 0; i < res.total; i ++) {
                    let item = new Bridge(res.list[i]);
                    brdgs.list.push(item);
                }
                cb(null, brdgs);
            }
        })
    }

    /**
     * Retrieve a bridge via its id
     * @param {*} id : the id of the bridge to be retrieved
     * @param {*} cb : callback function to hold the result like cb(err, res)
     *                  if the call was successful, err will be null and res contain the brige object.
     *                  otherwise, err will contain the error message
     */
    get_bridge(id, cb) {
        this.client.calling.bridges.get(id, (err, res) => {
            if (err) {
                cb(err);
            }
            if (res) {
                cb(null, new Bridge(res));
            }
        })
    }

    /**
     * Update a bridge
     * @param {*} brdg : new bridge model object, the id shall be the existing bridge
     * @param {*} cb   : callback function for holding the result cb(err), if the call was successful,
     *                  err will be null, otherwise, it will be filled with the error message
     */
    update_bridge(brdg, cb) {
        
        if (brdg.application_id) {
            brdg.application_id = undefined;
        }
        if (brdg.company_id) {
            brdg.company_id = undefined;
        }
        if (brdg.created_date) {
            brdg.created_date = undefined;
        }
        if (brdg.last_updated_date) {
            brdg.last_updated_date = undefined;
        }
        this.client.calling.bridges.update(brdg.id, brdg.exportData(), (err, res) => {
            cb(err);
        });
    }

    /**
     * Add calls to bridge
     * @param {*} brdgId : the id of the bridge to be adding the calls
     * @param {*} callids this supposed to be callid array ['id1', 'id2' ...]
     * @param {*} cb call back functions like cb(err, res), if the call was successful, the err
     *              will be null, otherwise, it will be filled with the error message
     */
    add_calls(brdgId, callids, cb) {
        this.client.calling.bridges.update(brdg.id, {bridge_audio: true, call_ids: callids}, (err, res) => {
            cb(err, res);
        });
    }

    /**
     * Delete a bridge via its id
     * @param {*} brdgId : the id of the bridge to be deleted
     * @param {*} cb : callback function for holding the result, cb(err), if it was successful, the err
     *      will be null, otherwise, it will contain the error message
     */
    delete_bridge(brdgId, cb) {
        this.client.calling.bridges.stub(brdgId).delete((err) => {
            cb(err);
        })
    }
}