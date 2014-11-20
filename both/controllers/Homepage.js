HomeController = RouteController.extend({
    template: 'Homepage',
});
HomeController.helpers({
     usersKED: function() {
        console.log(UsersKED.find().count());
        return UsersKED.find();
    }
})