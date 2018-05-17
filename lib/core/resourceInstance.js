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

var processArguments = require('./utils').processArguments;

var ScgResourceInstance = function (container, content, isStub) {
    this.container = container;
    this.content = content;
    this.isStub = (isStub === true);
};

ScgResourceInstance.prototype.setContent = function (content) {
    this.isStub = false;
    this.content = content;
};

ScgResourceInstance.prototype.get = function (callback) {
    var that = this;
    this.container.get(this.content.id, function processGetResponse(err, res) {
        if (err) {
            callback(err, res);
        } else {
            that.content = res;
            that.isStub = false;
            callback(err, that);
        }
    });
};

ScgResourceInstance.prototype.delete = function (callback) {
    this.container.delete(this.content.id, callback);
};

ScgResourceInstance.prototype.delete_with_id = function (id, subId, callback) {
    this.container.delete(id, subId, callback);
};

ScgResourceInstance.prototype.updateBlackList = {
    id: 1,
    application_id: 1,
    created_date: 1,
    last_updated_date: 1
};

ScgResourceInstance.prototype.getUpdateData = function () {
    var updateData = {};
    for (key in this.content) {
        if (key in this.updateBlackList) {
            continue;
        }
        updateData[key] = this.content[key];
    }
    return updateData;
};

ScgResourceInstance.prototype.update = function (callback) {
    var that = this;
    if (this.isStub) {
        throw new Error('Resource stub cannot be updated. Call get() or setContent() first.');
    }
    this.container.update(this.content.id, this.getUpdateData(), function processUpdateResponse(err, res) {
        if (err) {
            callback(err, res);
        } else {
            ++that.content.version_number;
            callback(err, that);
        }
    });
};

ScgResourceInstance.prototype.replace = function (arg1, arg2) {
    var args = processArguments(arguments),
        that = this,
        callback = args.callback;
    if (this.isStub) {
        throw new Error('Resource stub cannot be updated. Call get() or setContent() first.');
    }
    args.callback = function processReplaceResult(err, res) {
        if (err) {
            callback(err, res);
        } else {
            callback(err, exports.stub(that.container, that.content.id));
        }
    };
    if (typeof args.params.version_number !== 'number') {
        args.params.version_number = this.content.version_number;
    }
    this.container.replace(this.content.id, args);
};

exports.create = function (container, id) { return new ScgResourceInstance(container, id); };
exports.stub = function (container, id) { return new ScgResourceInstance(container, {id: id}, true); };
