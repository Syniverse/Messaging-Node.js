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

var resourceInstance = require('./resourceInstance');
var processArguments = require('./utils').processArguments;

var ScgResourceContainer = function (client, path) {
    this.client = client;
    this.path = path;
};

ScgResourceContainer.prototype.list = function () {
    var args = processArguments(arguments);
    this.client.list(this.path, args);
};

ScgResourceContainer.prototype.create = function (arg1, arg2) {
    var args = processArguments(arguments),
        callback = args.callback,
        that = this;
    args.callback = function processCreateResult(err, res) {
        if (err) {
            callback(err, res);
        } else {
            callback(err, that.stub(res.id));
        }
    };
    this.client.create(this.path, args);
};

ScgResourceContainer.prototype.stub = function (id) {
    return resourceInstance.stub(this, id);
};

ScgResourceContainer.prototype.get = function (id, callback) {
    this.client.get(this.path + '/' + id, callback);
};

ScgResourceContainer.prototype.delete = function (id, callback) {
    this.client.delete(this.path + '/' + id, callback);
};

ScgResourceContainer.prototype.update = function (id, content, callback) {
    this.client.update(this.path + '/' + id, {callback: callback, params: content});
};

ScgResourceContainer.prototype.replace = function (id, args) {
    this.client.replace(this.path + '/' + id, args);
};

exports.create = function (client, path) { return new ScgResourceContainer(client, path); };
