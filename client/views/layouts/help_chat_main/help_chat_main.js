HelpPosts = new Meteor.Collection('helpPosts');
UsersKED = new Meteor.Collection('usersKED');
Template.help_chat_main.helpers({
    posts: function() {
        helpPost = HelpPosts.findOne({_id:'r7T4wmKnTLRt9SBQM'});
        console.log(helpPost.posts);
        var initiatorID = helpPost.initiator;
        posts = helpPost.posts;
        postCnt = posts.length;
        for (i=0; i<postCnt; i++) {
            var postUserID = posts[i].userKED;
            //Add to posts array if post was by initiator
            posts[i].initiatorPost = (initiatorID===postUserID);
            //Build post metadata string
            userInfo = UsersKED
            console.log(posts[i])
        }
        
        
        return posts;
    }
});

Template.help_chat_main.events({
//'click [name=is_done]': function (e,tmpl){}
  'submit form': function (evt, tmpl) {
      evt.preventDefault();
      var message = tmpl.find('input').value;
      var userId = Meteor.userId();
      var dateTime = new Date;
      var post = {userKED:userId, datetime: dateTime, postMessage: message};
      HelpPosts.update({_id: 'r7T4wmKnTLRt9SBQM'},{$push:{posts:post}});
//      HelpPosts.insert({
//          initiator:
//          createdDate: new Date;
//          posts:{
//            userKED_id:,
//            datetimePosted:,
//            message:
//          }
//      });
      var form = tmpl.find('form');
      form.reset();
  }
});