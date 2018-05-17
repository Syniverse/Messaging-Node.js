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

export default class Contact extends  Granny{
    static get Field() {
        return Object.freeze({
            id: 'id',
            application_id: 'application_id',
            version_number: 'version_number',
            external_id: 'external_id',
            first_name: 'first_name',
            last_name: 'last_name',
            birth_date: 'birth_date',
            first_acquisition_date: 'first_acquisition_date',
            last_acquisition_date: 'last_acquisition_date',
            primary_mdn: 'primary_mdn',
            primary_addr_line1: 'primary_addr_line1',
            primary_addr_line2: 'primary_addr_line2',
            primary_addr_city: 'primary_addr_city',
            primary_addr_zip: 'primary_addr_zip',
            primary_addr_state: 'primary_addr_state',
            primary_email_addr: 'primary_email_addr',
            primary_social_handle: 'primary_social_handle',
            address_list: 'address_list',
            account_list: 'account_list',
            device_list: 'device_list',
            interest_list: 'interest_list',
            demographic_list: 'demographic_list',
            extended_attributes: 'extended_attributes',
            voice_preference: 'voice_preference',
            preferred_language: 'preferred_language',
            social_handles: 'social_handles'                         
        });
    }

    
    static getScgName () {
        return 'Contact'
      }
};