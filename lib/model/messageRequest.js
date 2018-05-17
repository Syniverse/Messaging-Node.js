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

export default class MessageRequest extends  Granny{
    static get Field() {
        return Object.freeze({
            id: 'id',
            recipient_count: 'recipient_count',
            sent_count: 'sent_count',
            delivered_count: 'delivered_count',
            read_count: 'read_count',
            converted_count: 'converted_count',
            canceled_count: 'canceled_count',
            failed_count: 'failed_count',
            created_date: 'created_date',
            last_update_date: 'last_update_date',
            state: 'state',
            from: 'from',
            conversation_id: 'conversation_id',
            to: 'to',
            campaign_id: 'campaign_id',
            program_id: 'program_id',
            subject: 'subject',
            application_id: 'application_id',
            external_id: 'external_id',
            attachments: 'attachments',
            body: 'body',
            consent_requirement: 'consent_requirement',
            criteria: 'criteria',
            scheduled_delivery_time: 'scheduled_delivery_time',
            scheduled_delivery_time_zone: 'scheduled_delivery_time_zone',
            expiry_time: 'expiry_time',
            test_message_flag: 'test_message_flag',
            pause_before_transmit: 'pause_before_transmit',
            pause_expiry_time: 'pause_expiry_time',
            contact_delivery_address_priority: 'contact_delivery_address_priority',
            failover: 'failover',
            price_threshold: 'price_threshold',
            sender_id_sort_criteria: 'sender_id_sort_criteria',
            src_language: 'src_language',
            dst_language: 'dst_language',
            translate: 'translate',
            translations_count: 'translations_count',
            translations_failed_count: 'translations_failed_count',
            translations_performed_count: 'translations_performed_count',
            verify_number: 'verify_number',
            provider: 'provider'                       
        });
    }
    
    static getScgName () {
        return 'MessageRequest';
    }
};