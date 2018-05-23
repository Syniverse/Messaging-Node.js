## Structure of SCG SDK
This SDK provides the APIs to access Syniverse Common Gateway, since it was implemented with ES2015(ES6), you need nodejs 6.3+ for this SDK. Before you implementing your tasks with this SDK, you need run 

```
 npm install
```

to install the dependence libraries, then you need get access token and fill the related value in the/auth.js.

There are detail usage of each API in the examples folder, and you can check out the data models under /lib/model and related APIs under /lib/api 

```
---|---examples      //the examples folder of the SDK
   |    |
   |    ---es6       //ES6 examples 
   |    |
   |    |
   |    ---shared.js     //Some utility tools for those examples.
   |
   |---lib
   |    |- api       //APIs
   |    |- core      //Some internal APIs you can ignore
   |    |- model     //This folder contains all data models
   |
   |---auth.js       //The file contains the access token and gateway server url
   |---node_modules //This folder will be filled after running 'npm install'
   |---index.js     //The harness of the SDK
   |---package.json //dependency configurations
   |---readme.md    //This file

```

## How to use SCG SDK
After you got the dependencies installed and filled the auth.js with the correct token, you can start write your own code with the SDK.

If you want to use one feature of the SDK, first, you need import the related model and API
```javascript
import MessageRequest from '../../lib/model/messageRequest';
import MessageRequestApi from '../../lib/api/messageRequests';

```
Then you need create the related model object, for example, I want to send SMS
```javascript
let req = new MessageRequest({from: '', //The sender_id, you also need get the sender_id
        to: '', // The SMS receiver
        verify_number: false,
        body: "Test SMS message from Nodejs SDK."
    });
```
Before you call the MessageRequest API, you need create the API object.
```javascript
const auth = require('../auth.js'); //point to right auth.js file which contains the token 
const api = new MessageRequestApi(auth, "https://api.syniverse.com");
```
Then you can call the API to fire the SMS with callback processing.
```javascript
api.create_message(req, (err, res) => {
    if (err) {
        console.log(err);
    }
    if (res) {
        console.log(res);
    }
})
```
If the SMS was sent successful, the callback err will be the null, and the res will contain the request id created, if not, the related error message will be inside the err parameter.

The tool sharedResource.dbgOut is for dumping the string and object into the console, it was used in many places in the examples of the SDK, you can also use it for debugging. 

## Some examples
# Listing Sender Id's
If you want to list available Sender Ids, it can be dibe as easy as:
```javascript
//Import sender id data model
import SenderId from '../../lib/model/senderId';
//Import SendIdApi
import SenderIdApi from '../../lib/api/senderIds';
//get auth object
const auth = require('../auth.js');
//create senderIdApi object, pass the auth object and the API gateway url
const senderIdApi = new SenderIdApi(auth, 'https://api.syniverse.com');
//call list_senderids API, pass the callback as the sink to result
senderIdApi.list_senderids((err, res) => {
    //err: contain the error message if any problem happened
    //res: if it was successful, res will contain the list of available senderId
    if (res && res.list.length > 0) {
        foreach(let item : res.list) {
            console.log(`Sender id ${item.id} has capabilities ${item.capabilities}`);
        }
    }
}
```
This should produce output like:
```
Sender id oX1iQToXaWAXY6u3yLhja4 has capabilities [WECHAT]
Sender id m2sb4eA3mlEConWJzsfYq6 has capabilities [FACEBOOK]
Sender id ln9sk9JF6insXcJ5nUzKK3 has capabilities [SMS]
Sender id AE0vtyghu8dIrrpXesXPK1 has capabilities [MMS, SMS]
Sender id 3hTOgeTWYlflMB2zmYNoP has capabilities [SMS]
Sender id dY2GycQpj6OE1x2mH1Ezc6 has capabilities [VOICE]
Sender id KdNRN6dl5IkwIH5B829XJ2 has capabilities [MMS, SMS]
Sender id tcS8h40LXgvJsGMQI93WK4 has capabilities [MMS, SMS]
```
# Adding and updating a Contact
```javascript
//Import contact data model
import Contact from '../../lib/model/contact';
//Import contactApi
import ContactApi from '../../lib/api/contacts';
//get auth object
const auth = require('../auth.js');
//create contactApi object, pass the auth configuration and the Gateway url
const contactApi = new ContactApi(auth, 'https://api.syniverse.com');
//Create a new contact
let contact = new Contact({first_name:'John', last_name:'Doe', primary_mdn:'18131117121'});
//call create_contact API with contact object and callback to create the contact
contactApi.create_contact(contact, (err, res) => {
    //If the operate was success, err will be filled with null, res will be filled with the contact ID
    if (err) {
        //If there was any error, print the error message
        console.log(err);
    }
    if (res) {
        //If it was successful, print the contact id in the response.
        console.log(res);
        //let's update
        let id = res.id;
        contactApi.get_contact(id, (err1, res1) => {
            if (err1) {
                console.log(err1);
            }
            if (res1) {
                //res1 is the contact object, let's update the primary mdn
                let contact_ = res1;
                contact_.primary_mdn = "17201112311";
                //call update API
                contactApi.update_contact(contact_, (err_update) => {
                    //if update was successful, err_update will be null
                    //else it will contain the related error information
                })
            }
        })
    }
})
```
# Sending a SMS to a GSM number
```javascript
//Import messagrequest data model
import MessageRequest from '../../lib/model/messageRequest';
//Import messagerequest API interface
import MessageRequestApi from '../../lib/api/messageRequests';
//get auth object
const auth = require('../auth.js');
//create the API object 
const api = new MessageRequestApi(auth, 'https://api.syniverse.com');
//Create the messageRequest object, you need get your own sender_id for this API
let recv = '123456789';
let req = new MessageRequest({from:`sender_id:tcS8h40LXgvJsGMQI93WK4`, to:recv,
    body:'Hello World!'});
api.create_message(req, (err, res) => {
    if (err) {
        //If there was any problem happened, print the error message
        console.log(err);
    }
    if (res) {
        //If it was successful, print the request id
        console.log(`Sent message request ${res.id}`);
    }
})

```
This should produce output similar to:
```
Sent message request aQWY9PeMCO01TEH9bk1ek5
```
# Sending a Message to a Contact
This works as above, except for the recv value change to something like this 
```javascript
let contactId = '<Id of an existing contact>';
let recv = `contact:${contactId}`;
```
# Sending a Message to a Group
This works as sending a SMS to a GSM number, except for the recv value change to something like this 
```javascript
let groupId = '<Id of an existing contact group Id>';
let recv = `group:${groupId}`;
```
# Sending a MMS with an attachment
```javascript
//Import attachment model data
import Attachment from '../../lib/model/attachment';
//Import attachmentApi
import AttachmentApi from '../../lib/api/attachments';
//Import messagrequest data model
import MessageRequest from '../../lib/model/messageRequest';
//Import messagerequest API interface
import MessageRequestApi from '../../lib/api/messageRequests';
//get auth object
const auth = require('../auth.js');
//create the MessageRequest API object 
const messageApi = new MessageRequestApi(auth, 'https://api.syniverse.com');
//create attchment API object
const attachmentApi = new AttachmentApi(auth, 'https://api.syniverse.com');
//Step 1 we upload attachment
//prepare for the attachment, make sure '/nodejs/test/jsf.png' physical existed, and the file is png, you can also try jpeg whatsoever
let att = new Attachment({name:'jsf.png', filename: 'jsf.png', 
        filepath:'/nodejs/test/jsf.png', type: 'image/png'});
attachmentApi.create_attachment(att, (err, res) => {
    if (err) {
        //If it was failed, related error message will be shown here
        console.log(err);
    }
    if (res) {
        //If it was successful, we take the attachment id
        console.log(`Uploaded attachment ${res.id}`);
        let attachmentIds = [];
        attachmentIds.push(res.id);
        //Create MMS request
        let req = new MessageRequest({from: 'sender_id:tcS8h40LXgvJsGMQI93WK4',
            to: "123456789",
            verify_number: false,
            attachments: attachmentIds,
            body: "Hello World"
        });
        //Fire the request, again, you need replace the sender_id to the correct one you have
        messageApi.create_message(req, (err, res) => {
            if (err) {
                //If there was any problem, dump the error message
                console.log(err);
            }
            if (res) {
                //If the MMS was sent out successfully, dump the messageRequest id
                console.log(`Sent message request ${res.id}`);
            }
        })
        
    }
})
```
This should produce output similar to:
```
Uploaded attachment wMjURamVl9ITSXRJSkMoR4
Sent message request 9NeqCbNXBYvRO73jC2rbc5
```
# Checking the state of a Message Request
```javascript
//Import messagrequest data model
import MessageRequest from '../../lib/model/messageRequest';
//Import messagerequest API interface
import MessageRequestApi from '../../lib/api/messageRequests';
//get auth object
const auth = require('../auth.js');
//create the MessageRequest API object 
const messageApi = new MessageRequestApi(auth, 'https://api.syniverse.com');
//suppose you already have the message request id
let msgId = 'qteDxVrAhlMlmTwDrMAvMM';
messageApi.get_message(msgId, (err, res) => {
    if (err) {
        console.log(err);
    }
    if (res) {
        //if it was successful, print the message content data
        console.log("Message Request " + res.id
        + " is in state " + res.state
        + " with " + res.delivered_count
        + " delivered and " + res.failed_count
        + "failed messages")
    }
});
```
This should produce output similar to:
```
Message Request qteDxVrAhlMlmTwDrMAvMM is in state COMPLETED with 2 delivered and 0 failed messages
```
## Dive Deep
Above examples provided the basic usage of this SDK, the code in examples folder provided more usages, if you want to dive deep, you need look into the APIs under lib/api folder, also those models definition under lib/model folder.
