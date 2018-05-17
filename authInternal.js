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

var ScgAuthInternal = function (params) {
    this.params = params;
    this.transactionStem = params.companyId.toString() + '-' + params.appId.toString() + '-';
    this.transactionCounter = 0;
};

ScgAuthInternal.prototype.setHeaders = function (headers) {
    ++this.transactionCounter;
    headers['int-companyId'] = this.params.companyId;
    headers['int-appId'] = this.params.appId;
    headers['int-txnId'] = this.transactionStem + this.transactionCounter.toString(32);
};


ScgAuthInternal.prototype.refresh = function (callback) {
    callback({code: 'refresh-not-supported'});
};

exports.create = function (params) { return new ScgAuthInternal(params); };
