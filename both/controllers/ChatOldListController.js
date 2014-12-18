
ChatOldListController = RouteController.extend({
    template: 'chat_old_list',
});
ChatOldListController.helpers({
     chatsInfo: function() {
         var dateNow = new Date();
         console.log("dateNow: "+dateNow);
         var dateLess24hr = new Date(moment(dateNow)-86400000);
         console.log("dateLess24hr: "+dateLess24hr);
//Only get chats that are older than 24 hrs since creation.
         var oldChats = HelpChatCollection.find({createdDate:{$lt:dateLess24hr}},{sort: {_id: -1}});
//Convert the cursor to an array.
         var oldChatsArr = oldChats.fetch();
//Sort the objects in the array by _id with this function.
         oldChatsArr.sort(function(a, b) {
            return b._id - a._id;
         });
//Get the length of the array.
         oldChatsCnt = oldChatsArr.length;
         for(i=0; i< oldChatsCnt; i++){
             postsObj = oldChatsArr[i].posts;
             var postsArray = $.map(postsObj, function(value, index) {
                return [value];
             });
             var chatPostsCnt = postsArray.length;
             var chatLastPostDate = new Date(clientDispTime(moment(postsArray[chatPostsCnt-1].datetime)));
             var lastPostTime = chatLastPostDate.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
             var lastPostDate = chatLastPostDate.toDateString();
             oldChatsArr[i].dispLastPostDate = "("+lastPostTime+" "+lastPostDate+")";
             oldChatsArr[i].chatPostsCnt = chatPostsCnt;
             var initiatorID = oldChatsArr[i].initiator;
             var initiatorCursor = Meteor.users.findOne({_id: initiatorID});
             var initiatorName = initiatorCursor.profile.userName;
             var initiatorSurname = initiatorCursor.profile.userSurname;
             var initiatorStrNo = initiatorCursor.profile.userAddrNo;
             var initiatorStrName = initiatorCursor.profile.userAddrStreet;
             var streetAddr = initiatorStrNo+' '+initiatorStrName;
             oldChatsArr[i].streetAddr = streetAddr;
             oldChatsArr[i].initiatorName = initiatorName;
             oldChatsArr[i].initiatorSurname = initiatorSurname;
             var chatInitPostTime = new Date(clientDispTime(moment(oldChatsArr[i].createdDate)));
             var initPostTime = chatInitPostTime.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
             var initPostDate = chatInitPostTime.toDateString();
             oldChatsArr[i].dispCreatedDate = "("+initPostTime+" "+initPostDate+")";
         }
         return oldChatsArr;
    }
//    postCount: function() {
//        return
//    }
});
ChatOldListController.events({
    'click .chatsOld': function(evt, tmp) {
        Session.set("currPostID",evt.currentTarget.id);
    }
})
//This function takes a posted time(which is based on server time) and the clients offset time and calculates the difference. Receives and returns moments.
function timeAgoMoment(postTime){
    var serverTime = moment(TimeSync.serverTime());
    var offsetGMT = 7200000; //to compensate for GMT+2
    //    var offsetServer = TimeSync.serverOffset(); // Offset between server and client times.
    var timeAgo = serverTime-postTime-offsetGMT;
    return timeAgo;
}
//This gives the correct display date for a client based on a posted time(server time) and the client's time.
function clientDispTime(postTime){
    var offsetServer = moment(TimeSync.serverOffset()); // Offset between server and client times.
    var clientTime = postTime-offsetServer;
    return clientTime;
}
