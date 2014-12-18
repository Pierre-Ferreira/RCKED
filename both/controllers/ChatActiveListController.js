
ChatActiveListController = RouteController.extend({
    template: 'chat_active_list',
});
ChatActiveListController.helpers({
     chatsInfo: function() {
         var dateNow = new Date();
         console.log("dateNow: "+dateNow);
         var dateLess24hr = new Date(moment(dateNow)-86400000);
         console.log("dateLess24hr: "+dateLess24hr);
//Only get chats
         var activeChats = HelpChatCollection.find({createdDate:{$gte:dateLess24hr}},{sort: {_id: -1}});
//Convert the cursor to an array.
         activeChatsArr = activeChats.fetch();
//Sort the objects in the array by _id with this function.
         activeChatsArr.sort(function(a, b) {
            return b._id - a._id;
         });
//Get the length of the array.
         activeChatsCnt = activeChatsArr.length;
         for(i=0; i< activeChatsCnt; i++){
             console.log("****");
             postsObj = activeChatsArr[i].posts;
             var postsArray = $.map(postsObj, function(value, index) {
                return [value];
             });
             console.log("postsArray: "+postsArray);
             console.log("postsArrayCnt: "+postsArray.length);
             var chatPostsCnt = postsArray.length;
             var chatLastPostDate = new Date(timeAgoMoment(moment(postsArray[chatPostsCnt-1].datetime)));
             var lastPostTimeAgo = chatLastPostDate.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
             activeChatsArr[i].dispLastPostDate = lastPostTimeAgo+" ago";
             activeChatsArr[i].chatPostsCnt = chatPostsCnt;
             var initiatorID = activeChatsArr[i].initiator;
             var initiatorCursor = Meteor.users.findOne({_id: initiatorID});
             var initiatorName = initiatorCursor.profile.userName;
             var initiatorSurname = initiatorCursor.profile.userSurname;
             var initiatorStrNo = initiatorCursor.profile.userAddrNo;
             var initiatorStrName = initiatorCursor.profile.userAddrStreet;
             var streetAddr = initiatorStrNo+' '+initiatorStrName;
             activeChatsArr[i].streetAddr = streetAddr;
             activeChatsArr[i].initiatorName = initiatorName;
             activeChatsArr[i].initiatorSurname = initiatorSurname;
             var chatInitPostDate = new Date(timeAgoMoment(moment(activeChatsArr[i].createdDate)));
             var initPostTimeAgo = chatInitPostDate.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
             activeChatsArr[i].dispCreatedDate = initPostTimeAgo+" ago";
         }
         return activeChatsArr;
    }
//    postCount: function() {
//        return
//    }
});
ChatActiveListController.events({
    'click .chats': function(evt, tmp) {
        console.dir(evt);
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
