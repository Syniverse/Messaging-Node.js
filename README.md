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
        body: "Test SMS message from Nodejs SDK. @" + sharedResource.getTimeString(new Date(Date.now()))
    });
```
Before you call the MessageRequest API, you need create the API object.
```javascript
const auth = require('../auth.js'); 
const api = new MessageRequestApi(auth, "https://api.syniverse.com");
```
Then you can call the API to fire the SMS with callback processing.
```javascript
api.create_message(req, (err, res) => {
    if (err) {
        sharedResource.dbgOut(err);
    }
    if (res) {
        sharedResource.dbgOut(res);
    }
})
```
If the SMS was sent successful, the callback err will be the null, and the res will contain the request id created, if not, the related error message will be inside the err parameter.

The tool sharedResource.dbgOut is for dumping the string and object into the console, it was used in many places in the examples of the SDK, you can also use it for debugging. 

## Dive Deep
For common SCG task, you just need read the example code, the examples under es6 shall be enough for normal usage, if you want to dive deep, you need look into the APIs under lib/api folder, also those
models definition under lib/model folder.
