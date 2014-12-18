/****************/
/* Client and Server Routes*/
/****************/
Router.configure({
    layoutTemplate: 'MasterLayout',
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
Router.route('/chat_active_list',{
    name: 'chat_active_list',
    controller: 'ChatActiveListController'
})
Router.route('/chat_old_list',{
    name: 'chat_old_list',
    controller: 'ChatOldListController'
})
Router.route('/admin_users_create',{
    name: 'admin_users_create',
    controller: 'AdminUsersCreateController'
})
