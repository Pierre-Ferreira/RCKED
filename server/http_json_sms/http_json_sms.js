Meteor.methods({
    'sendBatchSMS': function(smsBatchDetails){
        smsBatchDetailsTEST = {            
            "recipientNumber":"27823298718",
            "message":"TEST DATA.",
            "campaign":"e.g Optional campaign name"
//            "dataField":”e.g Optional extra field”,
        }
        return Meteor.http.call('POST','URL: https://zoomconnect.com/zoom/api/rest/v1/sms/send.json?q='+smsBatchDetailsTEST);
    },
        'sendTwillioSMS':function(param1, param2) {
        var accountSid = 'ACe285aba9d097f6e21c2fbe0b126b7fd3';
            var authToken = '206f7e8b5160e942ba99fc32c089b036';

            twilio = Twilio(accountSid, authToken); //this appears to be the issue

            twilio.sendSms({
              to:'+27823298718',
              from: '+27875509063',
              body: 'Hi this is a test from Twilio.'
            }, function(err, responseData) { 
              if (err) { 
                console.log(err)
              }
        });
    },
    'sendPlivoSMS':function(param1, param2) {
         
        
         var PlivoR = Meteor.require('plivo-node');
         plivo = PlivoR.RestAPI({
            authId: "MAMZHIZTNIMDM1NZLKZJ",
            authToken: "MzI1MDFjYWVlNmY2YjZmMzlhMTc5MWM2ZGQ4Y2Nk",
         });
//        var p = plivo.RestAPI(require('./config'));  //A BETTER WAY SO INVESTIGATE https://github.com/plivo/plivo-examples-node/commit/163f28180b99c8af93d97adb1e2e2bd360453760
//        var params = {
//            'src': '27105008055', // Caller Id
//            'dst' : '27721562697', // User Number to Call
//            'text' : param1+' '+i,
//            'type' : "sms",
//        };
//
//        plivo.send_message(params, function (status, response) {
//            console.log('Status: ', status);
//            console.log('API Response:\n', response);
//        });
        var params = {
            'src': '27105008055', // Caller Id
            'dst' : '27823298718', // User Number to Call
            'text' : param1,
            'type' : "sms",
        };

        plivo.send_message(params, function (status, response) {
            console.log('Status: ', status);
            console.log('API Response:\n', response);
        });
    }
})