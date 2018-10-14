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

/* This is a stand-alone command-line program, run from node, that can
   create and activate Whatsapp senderid's. It's main puropose is to
   demonstrate use of the API methods to do this.

   To view the programs usage information. From the projects root, run:

      $ ./node_modules/.bin/babel-node examples/es6/whatsapp.js
*/

//import the required the data model and API module
import SenderId from '../../lib/model/senderId';
import SenderIdApi from '../../lib/api/senderIds';

var minimist = require('minimist')  

function pretty (obj) {
    return JSON.stringify(obj, null, 4);
}

function dbgOut(text) {
    //print the debug infomation
    if (typeof text === 'string') {
        console.log(text);
    } else {
        //pretty print the object
        console.log(pretty(text));
    }
}

function process_command(cmd, args) {
    let auth = {}
    if (args.auth) {
        auth = require(args.auth)
    } else {
        auth = require('auth.js')
    }

    if (args.api) {
        auth.srv = args.api
    }

    const api = new SenderIdApi(auth, auth.srv);

    if (cmd === 'create') {
        let sid = new SenderId({
            "name": "sender-wa-" +  args['phone-number'],
            "capabilities" : ["WHATSAPP"],
            "class_id": "COMMERCIAL",
            "type_id": "WHATSAPP",
            "address": args['phone-number'],
            "ownership": "PRIVATE",
            "credentials":  {"token": + args['token']}
        });
        //Call create_senderid API to submit the creation request, this api take the newly created
        //senderId model object and the callback
        api.create_senderid(sid, (err, res) => {
            if (err) {
                //If any problem happened, print the error message
                dbgOut(err);
            }
            if (res) {
                //If it was successful, err will be null, res will be filled with the newly created sender id
                dbgOut(res);
            }
        })
    } else if (cmd === 'init') {
        api.get_senderid(args.sender_id, (err, res) => {
            if (err) {
                dbgOut(err);
            }
            if (res) {
                api.init_whatsapp_registration(res, args.register_method, (err, res) => {
                    if (err) {
                        dbgOut(err);
                    }
                })
            }
        });
    } else if (cmd === 'activate') {
        api.get_senderid(args.sender_id, (err, res) => {
            if (err) {
                dbgOut(err);
            }
            if (res) {
                api.activate_whatsapp_registration(res, args.verification_code, (err, res) => {
                    if (err) {
                        dbgOut(err);
                    }
                })
            }
        });
    } else if (cmd === 'deactivate') {
        api.get_senderid(args.sender_id, (err, res) => {
            if (err) {
                dbgOut(err);
            }
            if (res) {
                api.deactivate(res, (err, res) => {
                    if (err) {
                        dbgOut(err);
                    }
                })
            }
        });
    } else if (cmd === 'reactivate') {
        api.get_senderid(args.sender_id, (err, res) => {
            if (err) {
                dbgOut(err);
            }
            if (res) {
                api.activate(res, (err, res) => {
                    if (err) {
                        dbgOut(err);
                    }
                })
            }
        });
    }
}

if (process.argv.length < 3) {
    console.log("Usage:")
    console.log(" %s %s %s", process.argv[0], process.argv[1], "create --phone-number=MDN --token=TOKEN")
    console.log(" %s %s %s", process.argv[0], process.argv[1], "init --sender-id=SID --register-method=sms|voice")
    console.log(" %s %s %s", process.argv[0], process.argv[1], "activate --sender-id=SID --verification-code=CODE")
    console.log(" %s %s %s", process.argv[0], process.argv[1], "deactivate --sender-id=SID")
    console.log(" %s %s %s", process.argv[0], process.argv[1], "reactivate --sender-id=SID")
    process.exit(-1)
}

var args = minimist(process.argv.slice(3), {
    string: 'api',           // --lang xml
    string: 'auth',
    string: 'phone-number',
    string: 'token',
    string: 'sender_id',
    string: 'register_method',
    string: 'verification_code'
  })

if (['create', 'init', 'activate', 'deactivate', 'reactivate'].indexOf(process.argv[2]) < 0) {
    console.log("Unknown command: %s", process.argv[2])
    process.exit(-1)
}

process_command(process.argv[2], args)