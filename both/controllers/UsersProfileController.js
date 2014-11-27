UsersProfileController = RouteController.extend({
    template: 'users_profile',
});
UsersProfileController.helpers({
     usersKED: function() {
//        console.log(UsersKED.find().count());
//        return UsersKED.find();
    }
})