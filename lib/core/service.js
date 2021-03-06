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

var request = require('request'),
    client = require('./client'),
    authClientCredentials = require('./authClientCredentials'),
    authInternal = require('./authInternal');

var ScgService = function (param) {
    param = param || "https://beta-api.syniverse.com";   // default base URL
    if (typeof param === 'string') {
        param = request.defaults({ baseUrl: param });
    }
    this.request = param;
};

ScgService.prototype.createAuth = function (auth, request) {
    return authClientCredentials.create(this, auth, request);
};

ScgService.prototype.createInternalAuth = function (param) {
    return authInternal.create(param);
};

ScgService.prototype.createClient = function (auth, request) {
    return client.create(this, auth, request);
};

var create = function (uri) { return new ScgService(uri); };

exports = module.exports; // default service
exports.ScgService = ScgService;
exports.create = create;
