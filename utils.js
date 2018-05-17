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

var processArguments = function processArguments(args) {
    var res = {};
    if (typeof args[0] === 'function') {
        res.callback = args[0];
        res.params = args[1];
    } else if (typeof args[1] === 'function') {
        res.callback = args[1];
        res.params = args[0];
    } else if (typeof args[2] === 'function') {
        res.callback = args[2];
        res.params = args[1];
        res.subId = args[0];
    } else {
        throw new Error('SCG Resource: no callback provided');
    }
    res.params = res.params || {};
    return res;
};

exports.processArguments = processArguments;
