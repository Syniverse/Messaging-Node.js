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

var resourceContainer = require('./resourceContainer');
var subResourceContainer = require('./subResourceContainer');
var fs = require('fs');

var ScgClient = function (service, auth, request) {
    this.service = service;
    this.auth = auth;
    if (request !== undefined) {
        this.request = request;
        this.basePath = '/';
    } else {
        this.request = service.request;
        this.basePath = '/scg-external-api/api/v1/';
    }
    this.maxTokenRefreshAttempts = 1;
    this.messaging = {
        accessTokens: resourceContainer.create(this, 'access_tokens'), 
        attachments: resourceContainer.create(this, 'messaging/attachments'),
        senderIdClasses: resourceContainer.create(this, 'messaging/sender_id_classes'),
        senderIdTypes: resourceContainer.create(this, 'messaging/sender_id_types'),
        senderIds: resourceContainer.create(this, 'messaging/sender_ids'),
        channels: resourceContainer.create(this, 'messaging/channels'),
        messageTemplates: resourceContainer.create(this, 'messaging/message_templates'),
        messageRequests: resourceContainer.create(this, 'messaging/message_requests'),
        messages: resourceContainer.create(this, 'messaging/messages'),
        keywords: resourceContainer.create(this, 'messaging/keywords')
    };
    this.contacts = resourceContainer.create(this, 'contacts');
    this.contactAppTokens = subResourceContainer.create(this, 'contacts', 'application_tokens');
    this.contactGroups = {
        contactGroups: resourceContainer.create(this, 'contact_groups'),
        contacts: subResourceContainer.create(this, 'contact_groups', 'contacts')
    }; 
    
    this.contactsImport = resourceContainer.create(this, 'contactimport');
    this.contactsExport = resourceContainer.create(this, 'contactexport');
    this.contactsFastAccess = resourceContainer.create(this, 'contacts/fast_access');
    this.consent = {
        contactAddressStatuses: resourceContainer.create(this, 'consent/contact_address_statuses'),
        contactAddressHistory: resourceContainer.create(this, 'consent/contact_address_history')
    };
    this.calling = {
        bridges: resourceContainer.create(this, 'calling/bridges'),
        calls: resourceContainer.create(this, 'calling/calls'),
        conferences: resourceContainer.create(this, 'calling/conferences')
    };
};

ScgClient.prototype.list = function (path, args) {
    // @todo: add query params
    var requestOptions = {
        method: 'get',
        url: this.basePath + path,
        json: true,
        headers: {}
    };
    this.sendRequest(requestOptions, args.callback);
};

ScgClient.prototype.create = function (path, args) {
    var requestOptions = {
        method: 'post',
        url: this.basePath + path,
        body: args.params,
        json: true,
        headers: {}
    };
    this.sendRequest(requestOptions, args.callback);
};

ScgClient.prototype.update = ScgClient.prototype.create;

ScgClient.prototype.replace = function (path, args) {
    var requestOptions = {
        method: 'put',
        url: this.basePath + path,
        body: args.params,
        json: true,
        headers: {}
    };
    this.sendRequest(requestOptions, args.callback);
};

ScgClient.prototype.upload = function (path, args) {
    fs.readFile(args.filepath, "utf8", (err, data) => {
        if (data) {
            var req = this.request.post(path, args.callback);
            this.auth.setHeaders(req.headers);
            var form = req.form();
            form.append('file-upload', data, {
                filename: args.filename,
                contentType: args.type,
                header: `--${form.getBoundary()}\r\nContent-Disposition: form-data; name="file-upload"; filename="${args.filename}"; size="${data.length}";\r\nContent-Type: ${args.type}\r\nContent-Length: ${data.length}\r\n\r\n`
            });
        } else {
            args.callback(err);
        }
    });
};

ScgClient.prototype.download = function (path, args) {
    var requestOptions = {
        method: 'get',
        url: path,
        json: false,
        headers: {}
    };
    this.sendRequest(requestOptions, args.callback);
};

ScgClient.prototype.get = function (path, callback) {
    var requestOptions = {
        method: 'get',
        url: this.basePath + path,
        json: true,
        headers: {}
    };
    this.sendRequest(requestOptions, callback);
};

ScgClient.prototype.delete = function (path, callback) {
    var requestOptions = {
        method: 'delete',
        url: this.basePath + path,
        json: true,
        headers: {}
    };
    this.sendRequest(requestOptions, callback);
};

var requestSeq = 0;

ScgClient.prototype.sendRequest = function (requestOptions, callback, seq, counter) {
    seq = seq || ++requestSeq;
    counter = counter || 1;
    var that = this;
    this.auth.setHeaders(requestOptions.headers);
    this.request(requestOptions, function processResponse(err, response, body) {
        if (err) {
            callback({source: 'requester', cause: err});
        } else if (response.statusCode >= 200 && response.statusCode < 300) {
            callback(null, body);
        } else if (response.statusCode === 401) {
            if (counter > that.maxTokenRefreshAttempts) {
                callback({source: 'response', response: response, body: body});
            } else {
                that.auth.refresh(requestOptions.headers, function processAuthRefresh(err) {
                    if (err) {
                        callback(err);
                    } else {
                        that.sendRequest(requestOptions, callback, seq, counter + 1);
                    }
                });
            }
        } else if (response.statusCode >= 400) {
            callback({source: 'response', response: response, body: body});
        } else {
            callback({source: 'unexpected-response', response: response, body: body});
        }
    });
};

exports.ScgClient = ScgClient;
exports.create = function (service, auth, request) { return new ScgClient(service, auth, request); };
