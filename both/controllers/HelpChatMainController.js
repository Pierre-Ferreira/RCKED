HelpChatMainController = RouteController.extend({
  template: 'help_chat_main',

});

HelpChatMainController.helpers({
  posts: function() {
    var helpPost = HelpChatCollection.findOne({_id:Session.get("currPostID")});
//    console.log("get('currPostID')#2 : "+Session.get("currPostID"));
//    console.log(helpPost.posts);
    var initiatorID = helpPost.initiator;
    var posts = helpPost.posts;
    var postCnt = posts.length;
    for (i=0; i<postCnt; i++) {
      var postUserID = posts[i].postUserID;
//       console.log(postUserID);
//Add to posts array if post was by initiator
      posts[i].isInitiatorPost = (initiatorID===postUserID);
//Build post metadata string
      var postUserCursor = Meteor.users.findOne({_id:postUserID});
      var residentID = postUserCursor.profile.residentID;
      var residentCursor = Residents.findOne({_id:residentID});
//      console.log('****'+postUserInfo);
      var postUserName = residentCursor.profile.name;
//      console.log('postUserName* '+postUserName);
      var postUserAddr = residentCursor.profile.addrNo+" "+residentCursor.profile.addrStreet;
//      console.log('postUserAddr* '+postUserAddr);
      var clientPostDate = new Date(clientDispTime(moment(posts[i].datetime)));
      var postTime = clientPostDate.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
//      var postTime = posts[i].datetime
//      console.log('postTime* '+postTime);
//      var postTimeMin = posts[i].datetime.getMinutes();
      var postDate = posts[i].datetime.toDateString();
//      var postDate = posts[i].datetime
//      console.log('postDate* '+postDate);
//      var postDateMM = posts[i].datetime.getMonth();
//      var postDateYY = posts[i].datetime.getFullYear();
      var postMetaStr = postUserName +" @ "+postUserAddr+" ("+postTime+" "+postDate+")";
//      var postMetaStr = postUserName +" @ "+postUserAddr
//      console.log('postMetaStr* '+postMetaStr);
      posts[i].postMetaStr = postMetaStr;
//       console.log("posts[i]: "+posts[i]);
    }
    return posts;
  },
  inPost: function() {
    var helpPost = HelpChatCollection.findOne({_id: Session.get("currPostID")});
    var bgNewColor = helpPost.bgColor;
    var popupText = helpPost.popupText;
    var posts = helpPost.posts;
    var postCnt = posts.length;
    var lastPostUserID = posts[postCnt-1].postUserID;
    if (lastPostUserID !== Meteor.userId()) {
      var inPost = {
        bgColor: bgNewColor,
        popup: popupText
      };
    } else {
      var inPost = {
        bgColor: "",
        popup: ""
      };
    };
    return inPost;
  },
  initialTimeAgo: function () {
    var helpPost = HelpChatCollection.findOne({_id:Session.get("currPostID")});
    var initialPostTime = moment(helpPost.createdDate);
    var timeAgoDate = new Date(timeAgoMoment(initialPostTime));
    var serverTimeDisp = timeAgoDate.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    return "HELP POST: "+serverTimeDisp+" ago.";
  },
  lastPostTimeAgo: function () {
    var helpPost = HelpChatCollection.findOne({_id:Session.get("currPostID")});
    var posts = helpPost.posts;
    var postCnt = posts.length;
//    var lastPostUserID = posts[postCnt-1].postUserID;
//    var lastPostUserInfo = Meteor.users.findOne({_id:lastPostUserID});
//    var lastPostUserName = lastPostUserInfo.profile.userName;
    var lastPostTime = moment(posts[postCnt-1].datetime);
    var timeAgoDate = new Date(timeAgoMoment(lastPostTime));
    var lastPostTimeDisp = timeAgoDate.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    return "LAST POST: "+lastPostTimeDisp+" ago.";
  },
  serverTime: function() {
    var serverFullDate = new Date(TimeSync.serverTime());
    var serverTime = serverFullDate.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    var serverDate = serverFullDate.toDateString();
    return "Server: "+serverTime+ " " +serverDate;
  },
  postID: function() {
    return Session.get("currPostID");
  },
  isInitiator: function() {
    var isInitiator = false;
    var helpPost = HelpChatCollection.findOne({_id:Session.get("currPostID")});
    var initiatorID = helpPost.initiator;
    if(Meteor.userId()===initiatorID){
      var isInitiator = true;
      Session.set("userIsIntiator",true);
    } else {
      var isInitiator = false;
      Session.set("userIsIntiator",false);
    };
    return isInitiator;
  },
  log: function () {
    console.log(this);
    }
});

HelpChatMainController.events({
//'click [name=is_done]': function (e,tmpl){}
  'click #clrMsg': function(evt, tmpl){
    evt.preventDefault();
    var clrSound = new buzz.sound('/sounds/beep5.mp3');
    clrSound.play();
    $(function(){
      tmpl.$("#inputMsg").attr("placeholder", "Cleared!").val('');
      setTimeout(function(){ tmpl.$("#inputMsg").attr("placeholder", "Write your message here...").val(''); }, 1000);
    });
  },
  'click #sendMsg': function (evt, tmpl) {
    console.log("Submitted");
    evt.preventDefault();
//    var message = $.trim(tmpl.find('input').value);
    var message = $.trim(tmpl.$("#inputMsg").val());
    if (message != "") {
      var userId = Meteor.userId();
      var dateTime = new Date(TimeSync.serverTime()); //Rather use the server time instead of client time (i.e. new Date);
      var post = {postUserID:userId, datetime: dateTime, postMessage: message};
      HelpChatCollection.update({_id: Session.get("currPostID")},{
        $push:{posts:post}
      });
// Only the initiators posts must be SMS'ed on Active chats.
      if (Session.get("userIsIntiator")) {Meteor.call("sendPlivoSMS", message, userId)};
// Play sound.
      var sendSound = new buzz.sound('/sounds/beep6.mp3');
      sendSound.play();
// Clear the post text area.
      tmpl.$('textarea#inputMsg').val('');
// Scroll to bottom of chat.
      $("#chat_window_1").animate({
        scrollTop:$("#chat_window_1")[0].scrollHeight - ($("#chat_window_1").height()-55)} ,1000 , 'swing', function(){});
//Update HelpChat collection background color in
      HelpChatCollection.update({_id: Session.get("currPostID")},{$set:{bgColor:"RED",popupText:"***INCOMING***"}});
      setTimeout(function() {HelpChatCollection.update({_id: Session.get("currPostID")},{$set:{bgColor:"",popupText:""}});}, 600);
      // setTimeout(function() {HelpChatCollection.update({_id: Session.get("currPostID")},{$set:{bgColor:"GREEN"}});}, 5000);
      // setTimeout(function() {HelpChatCollection.update({_id: Session.get("currPostID")},{$set:{bgColor:""}});}, 5000);
    }
  },
  'click .btnGuideTxt': function (evt, tmpl) {
// Put the guide text into the message box.
    var inputVal = evt.target.innerText;
    tmpl.$("#inputMsg").val(inputVal);
  }
});
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
