HelpConfirmController = RouteController.extend({
    template: 'help_confirm',
});
HelpConfirmController.events({
    
'click #helpConfirmButton': function(evt, tmpl){
    var documentVals = {
        initiator: Meteor.userId(),
        createdDate: new Date,
        activeInd: true
    };
    console.log("documentVals:"+documentVals);
    insertHelpPost(documentVals);
    function insertHelpPost(doc) {
// Get the next _id from helpChat collection.
        while (1) {
            var cursor = HelpChatCollection.find({});
     //       var cursor = HelpChatCollection.find( {}, { _id: 1 } ).sort( { _id: -1 } ).limit(1);
     //       console.log('hasNext(): '+cursor.hasNext());
      //      console.log('next(): '+cursor.next());
            console.log('count(): '+cursor.count());
     //       var seq = cursor.hasNext() ? cursor.next()._id + 1 : 1;
            seq = cursor.count()+1;
            doc._id = seq.toString();
            Session.set("currPostID", seq.toString());
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
        var firstPost = {
            postUserID: Meteor.userId(),
            datetime: new Date,
            postMessage: 'HELP!',
        }
        HelpChatCollection.update({_id: doc._id},{$push:{posts:firstPost}});
    };
// Call the SMS function
    Meteor.call('sendBatchSMS','NOTHING',function(err, results){
        console.log('err: '+err);
        console.log('results: '+JSON.parse(results.content));
    })
//    console.log("type: " + type);
}
});