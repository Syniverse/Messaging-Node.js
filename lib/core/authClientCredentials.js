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

var getConfigure = function (credentials, key) {
    var val = credentials[key];
    if (val !== undefined) {
        return val;
    }
    return null;
};

var getRequired = function (credentials, key) {
    var val = getConfigure(credentials, key);
    if (!val) {
        throw new Error('Missing required credential: ' + key);
    } else {
        return val;
    }
};

var ScgAuthClientCredentials = function (service, credentials, request) {
    this.service = service;
    if (request !== undefined) {
        this.request = request;
        this.basePath = '/';
    } else {
        this.request = service.request;
        this.basePath = '/scg-external-api/api/v1';
    }
    this.credentials = {
        consumerKey: getConfigure(credentials, 'key'),
        consumerSecret: getConfigure(credentials, 'secret')
    };
    if (credentials.CompanyId) {
        this.company_id = credentials.CompanyId;
    };
    if (credentials.AppId) {
        this.application_id = credentials.AppId;
    };
    if (credentials.txnId) {
        this.txn_id = credentials.txnId;
    };
    
    if (!credentials.CompanyId && !credentials.AppId) {
        this.setAccessToken(getRequired(credentials, 'token'));
    }
    this.waitingRefreshRequests = [];
};

ScgAuthClientCredentials.prototype.setAccessToken = function (accessToken) {
    this.credentials.accessToken = accessToken;
    this.authorization = 'Bearer ' + this.credentials.accessToken;
};

ScgAuthClientCredentials.prototype.setHeaders = function (headers) {
    if (this.company_id !== undefined) {
        headers['int-companyId'] = this.company_id;
    };
    if (this.application_id !== undefined) {
        headers['int-appId'] = this.application_id;
    };
    if (this.txn_id !== undefined) {
        headers['int-txnId'] = this.txn_id;
    };
    if (this.authorization !== undefined) {
        headers.Authorization = this.authorization;
        return;
    }
    if (this.company_id !== undefined) {
        return; // Internal testing
    }
    throw new Error('Authentication not initialized');
};

ScgAuthClientCredentials.prototype.refresh = function (headers, callback) {
    if (this.company_id) {
        // Functional testing. Skip authorization
        callback();
        return;
    }

    if (headers.Authorization !== this.authorization) {
        // Current token is different than the one in the API call requesting refresh.
        // It should have been just refreshed. Let's give it a try.
        callback();
        return;
    }
    this.waitingRefreshRequests.push(callback);
    if (this.waitingRefreshRequests.length > 1) {
        return;
    }
    var requestOptions = {
        method: 'get',
        qs: {
            consumerkey: this.credentials.consumerKey,
            consumersecret: this.credentials.consumerSecret,
            oldtoken: this.credentials.accessToken
        },
        url: this.basePath + 'apptoken-refresh',
        json: true,
    };
    var that = this;
    this.request(requestOptions, function processRefreshTokenResult(err, response, body) {
        var error;
        if (err) {
            error = {source: 'auth-requester', cause: err};
        } else if (response.statusCode >= 200 && response.statusCode < 300) {
            that.setAccessToken(body.accessToken);
            // error === undefined;
        } else if (response.statusCode >= 400) {
            error = {source: 'auth-response', response: response, body: body};
        } else {
            error = {source: 'unexpected-response', response: response, body: body};
        }

        var callbacks = that.waitingRefreshRequests;
        that.waitingRefreshRequests = [];
        for (var index in callbacks) {
            callbacks[index](error);
        }
    });
};

exports.create = function (service, credentials, request) {
    return new ScgAuthClientCredentials(service, credentials, request);
};
