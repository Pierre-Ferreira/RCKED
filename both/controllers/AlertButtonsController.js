AlertButtonsController = RouteController.extend({
  template: 'alert_buttons',
  onBeforeAction: function() {
    userCursor = Meteor.users.findOne({_id: Meteor.userId()});
    if (userCursor.profile != null) {
      residentID = userCursor.profile.residentID;
      if (residentID != '' || residentID != null) {
        console.log("INSIDE");
        Router.go('alert_buttons');
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
AlertButtonsController.helpers({
  isAdmin: function() {
    userCursor = Meteor.users.findOne({_id: Meteor.userId()});
    if (userCursor.profile != null) {
      type = userCursor.profile.type;
      if (type != '' || type != null) {
        if (type === 'ADMIN') {
          return true;
        }
      }
    }
    return false;
  },
})
