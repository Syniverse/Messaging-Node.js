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
import Channel from '../../lib/model/channel';
import ChannelApi from '../../lib/api/channels';

const sharedResource = require('../shared');

//create channelApi object
const channelApi = new ChannelApi(sharedResource.getAuth(), sharedResource.getService());

/**
 * This test demostrates how to create a new channel
 */
function test_create() {
    //create channel object, please refer to Channel model for the supported fields
    let channel = new Channel({name:'Freeman', description:'Test channel', priority:''});
    //call create_channel with the channel object and call back
    channelApi.create_channel(channel, (err, res) => {
        if (err) {
            //If there is any problem happened, related error message will be shown here
            sharedResource.dbgOut(err);
        }
        if (res) {
            //If it was successful, res will be filled with the channel ID
            sharedResource.dbgOut(res);
        }
    })
}

/**
 * This test shows how to use list_channels API
 */
function test_list() {
    //call list_channels, pass the callback to hold the result
    channelApi.list_channels((err, res) => {
        //If there was any error, the related error message will be filled into err, otherwise, it will be null
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            //If it was successful, the channels will be in the res.list
            sharedResource.dbgOut(`Total channels: ${res.list.length}`);
            //dump all channels
            sharedResource.dbgOut(res);
        }
    })
}

/**
 * This test demostrates how to use update_channel api
 */
function test_update() {
    //List all channels
    channelApi.list_channel((err, res) => {
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            //sharedResource.dbgOut(res);
            if (res.list.length < 1) {
                sharedResource.dbgOut('Please add some channel first');
            } else {
                //Take the first channel
                let chan = res.list[0];
                //update the channel name
                chan.name = chan.name + Date.now();
                //call update_channel API, pass the new updated channel and the callback
                channelApi.update_channel(chan, (err_u, res_u) => {
                    if (err_u) {
                        sharedResource.dbgOut(err_u);
                    }
                    if (res_u) {
                        sharedResource.dbgOut(res_u);
                    }
                })
            }
            
        }
    })
}

/**
 * This test shows how to delete a channel with delete_channel API
 */
function test_delete() {
    //List all channels
    channelApi.list_channel((err, res) => {
        if (err) {
            sharedResource.dbgOut(err);
        }
        if (res) {
            //sharedResource.dbgOut(res);
            if (res.list.length < 1) {
                sharedResource.dbgOut('Please add some channel first');
            } else {
                //Take the first channel
                let chan = res.list[0];
                //delete the channel with the channel id
                channelApi.delete_channel(chan.id, (err_d) => {
                    //if it was successful. err_d will be null, otherwise it will be filled with the related error message
                    sharedResource.dbgOut(res_d ? res_d : 'Deleted successfully');
                })
            }
            
        }
    })
}

/**
 * Test driver, uncomment those tests you want to run
 */
test_list();
//test_create();
//test_update();
//test_delete();