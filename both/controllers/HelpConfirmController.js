HelpConfirmController = RouteController.extend({
    template: 'help_confirm',
});
HelpConfirmController.events({
    
'click #helpConfirmButton': function(evt, tmpl){
    var documentVals = {
        initiator: Meteor.userId(),
        createdDate: new Date(TimeSync.serverTime()), //Rather use the server time instead of client tiem (i.e. new Date);
        activeInd: true
    };
    console.log("documentVals:"+documentVals);
    insertHelpPost(documentVals);
    function insertHelpPost(doc) {
// Get the next _id from helpChat collection.
        while (1) {
            var cursor = HelpChatCollection.find({});
            console.log('count(): '+cursor.count());
            seq = cursor.count()+1;
            doc._id = seq.toString();
            Session.set("currPostID", doc._id);
            console.log('Session.set("currPostID"):'+Session.get("currPostID"));
            var results = HelpChatCollection.insert(doc);
    //        if( results.hasWriteError() ) {
    //            if( results.writeError.code == 11000 /* dup key */ )
    //                console.log("results.writeError.code: "+results.writeError.code);
    ////                continue;
    //            else
    //                print( "unexpected error inserting data: " + tojson( results ) );
    //        }
            break;
        };
        var postMessage = 'HELP!!';
        var firstPost = {
            postUserID: Meteor.userId(),
            datetime: new Date(TimeSync.serverTime()),
            postMessage: postMessage,
        }
        HelpChatCollection.update({_id: doc._id},{$push:{posts:firstPost}});
// Call the SMS function
        var smsMessage = 'HELP!! \n ***(for more info follow chat #'+doc._id+' on community app)***';
        Meteor.call("sendPlivoSMS", smsMessage, Meteor.userId());
    };

//    Meteor.call('sendBatchSMS','NOTHING',function(err, results){
//        console.log('err: '+err);
//        console.log('results: '+JSON.parse(results.content));
//    })
//    console.log("type: " + type);
}
});