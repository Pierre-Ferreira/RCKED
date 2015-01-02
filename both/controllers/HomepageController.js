HomepageController = RouteController.extend({
    template: 'home_page',
    onBeforeAction: function() {
      userCursor = Meteor.users.findOne({_id: Meteor.userId()});
      if (userCursor.profile != null) {
        residentID = userCursor.profile.residentID;
        if (residentID != '' || residentID != null) {
          console.log("INSIDE");
          Router.go('alert_buttons');
          return;
        }
      }
      console.log("HELLLOOO");
      Router.go('user_resident_link');
      return;
    },
});
HomepageController.helpers({

})
