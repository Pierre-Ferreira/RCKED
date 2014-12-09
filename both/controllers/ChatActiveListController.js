
ChatActiveListController = RouteController.extend({
    template: 'chat_active_list',
});
ChatActiveListController.helpers({
     chatsInfo: function() {
         activeChats = HelpChatCollection.find({activeInd: true},{sort: {_id: -1}});
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
             var chatLastPostDate = postsArray[chatPostsCnt-1].datetime;
             var lastPostTime = chatLastPostDate.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
             var lastPostDate = chatLastPostDate.toDateString();
             activeChatsArr[i].dispLastPostDate = "("+lastPostTime+" "+lastPostDate+")";
             activeChatsArr[i].chatPostsCnt = chatPostsCnt;
             var initiatorID = activeChatsArr[i].initiator;
             initiatorCursor = Meteor.users.findOne({_id: initiatorID});
             initiatorName = initiatorCursor.profile.userName;
             initiatorStrNo = initiatorCursor.profile.userAddrNo;
             initiatorStrName = initiatorCursor.profile.userAddrStreet;
             streetAddr = initiatorStrNo+' '+initiatorStrName;
             activeChatsArr[i].streetAddr = streetAddr;
             activeChatsArr[i].initiatorName = initiatorName;
             var initPostTime = activeChatsArr[i].createdDate.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
             var initPostDate = activeChatsArr[i].createdDate.toDateString();
             activeChatsArr[i].dispCreatedDate = "("+initPostTime+" "+initPostDate+")";
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