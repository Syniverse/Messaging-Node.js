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

 /**
  * This file defined some help functions for the example
  */
'use strict';

//refer to the json auth file, make sure the token is correct
var authConfig = require('./auth_nj.js');

module.exports = {
    getAuth: function() {
        return authConfig;
    },
    getService: function() {
        var srv = authConfig.srv;
        if (!srv) {
            srv = `http://127.0.0.1:8080`;
        }
        console.log(`server: ${srv}`);
        return srv;
    },
    getTestSender: function() {
        return authConfig.from;
    },
    getVoiceSender: function() {
        return this.getTestSender();
    },
    getTestSMSRecv: function() {
        return ["+17205368411"];
    },
    getTimeString: function(dt) {
        return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate() + " " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    },
    pretty: function (obj) {
        return JSON.stringify(obj, null, 4);
    },
    /**
     * dbgOut: print the input text or object
     */
    dbgOut: function (text) {
        //print the debug infomation
        if (typeof text === 'string') {
            console.log(text);
        } else {
            //pretty print the object
            console.log(this.pretty(text));
        }
    }
}