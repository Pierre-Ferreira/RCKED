/****************/
/* Client and Server Routes*/
/****************/
Router.configure({
    layoutTemplate: 'MasterLayout',
    data: function() {
            return UsersKED.findOne({name: 'Pierre'})
        }
});

Router.route('/home_page',{
    name: 'home_page',
    controller: 'HomepageController'
});
Router.route('/',{
    name: 'alert_buttons',
    controller: 'AlertButtonsController'
});
Router.route('/help_confirm',{
    name: 'help_confirm',
    controller: 'HelpConfirmController'
});
Router.route('/help_chat_main',{
    name: 'help_chat_main',
    controller: 'HelpChatMainController'
})
Router.route('/users_profile',{
    name: 'users_profile',
    controller: 'UsersProfileController'
})