
ChatOldListController = RouteController.extend({
  template: 'chat_old_list',
  onBeforeAction: function() {
    userCursor = Meteor.users.findOne({_id: Meteor.userId()});
    if (userCursor.profile != null) {
      residentID = userCursor.profile.residentID;
      if (residentID != '' || residentID != null) {
        console.log("INSIDE");
        Router.go('chat_old_list');
        this.next();
        return;
      }
    }
    console.log("HELLLOOO");
    Router.go('user_resident_link');
    this.next();
    return;
  },
});
ChatOldListController.helpers({
   chatsInfo: function() {
     var dateNow = new Date();
     var dateLess24hr = new Date(moment(dateNow)-86400000);
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
       console.log("initiatorID: "+initiatorID);
       var userCursor = Meteor.users.findOne({_id: initiatorID});
       var residentID = userCursor.profile.residentID;
       console.log("residentID: "+residentID);
       var initiatorCursor = Residents.findOne({_id: residentID});
       console.dir(initiatorCursor);
       var initiatorName = initiatorCursor.profile.name;
       var initiatorSurname = initiatorCursor.profile.surname;
       var initiatorStrNo = initiatorCursor.profile.addrNo;
       var initiatorStrName = initiatorCursor.profile.addrStreet;
      //  var initiatorCursor = Meteor.users.findOne({_id: initiatorID});
      //  var initiatorName = initiatorCursor.profile.userName;
      //  var initiatorSurname = initiatorCursor.profile.userSurname;
      //  var initiatorStrNo = initiatorCursor.profile.userAddrNo;
      //  var initiatorStrName = initiatorCursor.profile.userAddrStreet;
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
//  postCount: function() {
//    return
//  }
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
  //  var offsetServer = TimeSync.serverOffset(); // Offset between server and client times.
  var timeAgo = serverTime-postTime-offsetGMT;
  return timeAgo;
}
//This gives the correct display date for a client based on a posted time(server time) and the client's time.
function clientDispTime(postTime){
  var offsetServer = moment(TimeSync.serverOffset()); // Offset between server and client times.
  var clientTime = postTime-offsetServer;
  return clientTime;
}
