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

import { Granny } from '../core/granny'

export default class Call extends  Granny{
    static get Field() {
        return Object.freeze({
            id: 'id',
            external_id: 'external_id',
            start_time: 'start_time',
            answer_time: 'answer_time',
            end_time: 'end_time',
            chargeable_duration: 'chargeable_duration',
            failure_code: 'failure_code',
            failure_details: 'failure_details',
            last_updated_date: 'last_updated_date',
            version_number: 'version_number',
            from: 'from',
            from_address: 'from_address',
            to: 'to',
            answer_timeout: 'answer_timeout',
            state: 'state',
            direction: 'direction',
            bridge_id: 'bridge_id'                
        });
    }
    
    static getScgName () {
        return 'Call'
    }
};