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

var ScgSubResourceContainer = function (client, path, subPath) {
    this.client = client;
    this.path = path;
    this.subPath = subPath;
};

ScgSubResourceContainer.prototype.list = function (id) {
    var args = processArguments(arguments);
    this.client.list(this.path + '/' + id + '/' + this.subPath, args);
};

ScgSubResourceContainer.prototype.create = function (arg1, arg2) {
    var args = processArguments(arguments),
        callback = args.callback,
        that = this;
    args.callback = function processCreateResult(err, res) {
        if (err) {
            callback(err, res);
        } 
        if (res) {
            if (res.errors && Object.keys(res.errors).length > 0) {
                callback(res.errors);
            } else {
                if (res.id || res.subId) {
                    callback(null, that.stub(res.id, res.subId));
                } else {
                    callback(null, res);
                }
            }
        }
    };
    // TODO - check args.id???
    var id = args.params.id;
    delete args.params['id'];
    if (args.subId) {
        id = args.subId;
    }
    this.client.create(this.path + '/' + id + '/' + this.subPath, args, this.subPath);
};

ScgSubResourceContainer.prototype.stub = function (id, subId) {
    return resourceInstance.stub(this, id, subId);
};

ScgSubResourceContainer.prototype.get = function (id, subId, callback) {
    this.client.get(this.path + '/' + id + '/' + this.subPath + '/' + subId, callback);
};

ScgSubResourceContainer.prototype.delete = function (id, subId, callback) {
    this.client.delete(this.path + '/'  + id + '/' + this.subPath + '/' + subId, callback);
};

ScgSubResourceContainer.prototype.update = function (id, subId, content, callback) {
    this.client.update(this.path + '/'  + id + '/' + this.subPath + '/' + subId,
        {callback: callback, params: content});
};

ScgSubResourceContainer.prototype.replace = function (id, subId, args) {
    this.client.replace(this.path + '/'  + id + '/' + this.subPath + '/' + subId, args);
};

exports.create = function (client, path, subPath) { return new ScgSubResourceContainer(client, path, subPath); };
