HomepageController = RouteController.extend({
    template: 'Homepage',
});
HomepageController.helpers({
     usersKED: function() {
        console.log(UsersKED.find().count());
        return UsersKED.find();
    }
})