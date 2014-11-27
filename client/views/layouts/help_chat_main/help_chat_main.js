HelpPosts = new Meteor.Collection('helpPosts');
UsersKED = new Meteor.Collection('usersKED');
Template.help_chat_main.helpers({
    posts: function() {
        helpPost = HelpPosts.findOne({_id:'rRvSeRRv8vXp9PDtQ'});
//        console.log(helpPost.posts);
        var initiatorID = helpPost.initiator;
        posts = helpPost.posts;
        postCnt = posts.length;
        for (i=0; i<postCnt; i++) {
            var postUserID = posts[i].userKED;
//             console.log(postUserID);
            //Add to posts array if post was by initiator
            posts[i].initiatorPost = (initiatorID===postUserID);
            //Build post metadata string
            var postUserInfo = UsersKED.findOne({_id:postUserID});
//            console.log('****'+postUserInfo);
            var postUserName = postUserInfo.name;
            var postUserAddr = postUserInfo.address;
            var postTime = posts[i].datetime.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
            var postTimeMin = posts[i].datetime.getMinutes();
            var postDate = posts[i].datetime.toDateString();
            var postDateMM = posts[i].datetime.getMonth();
            var postDateYY = posts[i].datetime.getFullYear();
            var postMetaStr = postUserName +" @ "+postUserAddr+" ("+postTime+" "+postDate+")";
            posts[i].postMetaStr = postMetaStr;
//            console.log(posts[i])
        }
        return posts;
    }
});
//$('#chatBoxMain').bind("DOMSubtreeModified",function(){
//  alert('changed');
//});
Template.help_chat_main.events({
    'change .form-control': function (evt, tmpl){
        console.log("fired");
        $(function(){
            $("#chatInFade").removeClass('hide');
        });
    },
//'click [name=is_done]': function (e,tmpl){}
  'submit form': function (evt, tmpl) {
      console.log("Submitted");
      evt.preventDefault();
      var message = tmpl.find('input').value;
      var userId = Meteor.userId();
      var dateTime = new Date;
      var post = {userKED:userId, datetime: dateTime, postMessage: message};
      HelpPosts.update({_id: 'rRvSeRRv8vXp9PDtQ'},{$push:{posts:post}});
// Clear the form
      var form = tmpl.find('form');
      form.reset();
//      var objDiv = document.getElementById('section');
//      objDiv.scrollTop = (objDiv.scrollHeight+100);

   //   var chatBoxDiv = $('#chat_window_1');
  //         chatBoxDiv.scrollTop(5000);
   //      chatBoxDiv.scrollTop(chatBoxDiv.prop('scrollHeight'));
  //      $('#chat_window_1').scrollTop(1000000);
//        console.log(chatBoxDiv.scrollTop());
//        console.log(chatBoxDiv.prop('scrollHeight'));
//        console.log('scrollHeight');
  }
});