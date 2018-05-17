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

export default class Message extends  Granny{
    static get Field() {
        return Object.freeze({
            id: 'id',
            message_request_id: 'message_request_id',
            external_transaction_ids: 'external_transaction_ids',
            external_message_request_id: 'external_message_request_id',
            application_id: 'application_id',
            application_tracking_id: 'application_tracking_id',
            conversation_id: 'conversation_id',
            campaign_id: 'campaign_id',
            direction: 'direction',
            customer_sender_id: 'customer_sender_id',
            from_address: 'from_address',
            to_address: 'to_address',
            state: 'state',
            failure_code: 'failure_code',
            failure_details: 'failure_details',
            subject: 'subject',
            body: 'body',
            sent_date: 'sent_date',
            delivered_date: 'delivered_date',
            converted_date: 'converted_date',
            conversion_info_source: 'conversion_info_source',
            reply_to: 'reply_to',
            attachments: 'attachments',
            type: 'type',
            message_delivery_provider: 'message_delivery_provider',
            contact_id: 'contact_id',
            price: 'price',
            language: 'language',
            failed_translation: 'failed_translation',
            failed_origin_id: 'failed_origin_id',
            failover: 'failover',
            scheduled_delivery_time: 'scheduled_delivery_time',
            expiry_time: 'expiry_time',
            created_date: 'created_date',
            last_update_date: 'last_update_date',
            verify_number: 'verify_number',
            provider: 'provider'              
        });
    }
    
    static getScgName () {
        return 'Message';
    }
};