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

export default class SenderId extends  Granny{
    static get Field() {
        return Object.freeze({
            id: 'id',
            application_id: 'application_id',
            created_date: 'created_date',
            last_update_date: 'last_update_date',
            version_number: 'version_number',
            parent_id: 'parent_id',
            name: 'name',
            ownership: 'ownership',
            class_id: 'class_id',
            type_id: 'type_id',
            state: 'state',
            address: 'address',
            content_type: 'content_type',
            message_templates: 'message_templates',
            country: 'country',
            operators: 'operators',
            credentials: 'credentials',
            two_way_required: 'two_way_required',
            keep_sender_address: 'keep_sender_address',
            dr_required: 'dr_required',
            consent_managed_by: 'consent_managed_by',
            capabilities: 'capabilities',
            check_whitelist: 'check_whitelist',
            foreign_id: 'foreign_id',
            register_method: 'register_method',
            verification_code: 'verification_code'
        });
    }
    
    static getScgName () {
        return 'SenderId';
    }
};