HomepageController = RouteController.extend({
    template: 'home_page',
});
HomepageController.helpers({
     usersKED: function() {
//        console.log(UsersKED.find().count());
//        return UsersKED.find();
    }
})