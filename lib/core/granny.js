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

export class Granny {
    constructor (data) {
        this._data = {}
        if (this.constructor.Field === undefined) {
          throw new Error('Undefined field')
        }
        this._fields = Object.keys(this.constructor.Field)
        this._fields.forEach((field) => {
          this._defineProperty(field);
        });
        if (data) {
          this.setData(data);
        }
      }
    
      /**
       * Define data getter and setter field
       * @param {String} field
       */
      _defineProperty (field) {
        Object.defineProperty(this, field, {
          get: () => this._data[field],
          set: (value) => { this._data[field] = value },
          enumerable: true
        })
      }
    
      /**
       * Set data field
       * @param {String} field
       * @param {Mixed} value
       * @return this
       */
      set (field, value) {
        if (this._fields.indexOf(field) < 0) {
          this._defineProperty(field)
        }
        this[field] = value
        return this;
      }
    
      /**
       * Set multiple data fields
       * @param {Object} data
       * @return this
       */
      setData (data) {
        Object.keys(data).forEach((key) => {
          this.set(key, data[key])
        })
        return this;
      }
    
      /**
       * Export object data
       * @return {Object}
       */
      exportData () {
        return this._data;
      }
}