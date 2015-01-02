/****************/
/* Client and Server Routes*/
/****************/
Router.configure({
  layoutTemplate: 'master_layout',
});

Router.route('/',{
  name: 'home_page',
  controller: 'HomepageController'
});
Router.route('/help_confirm',{
  name: 'help_confirm',
  controller: 'HelpConfirmController'
});
Router.route('/alert_buttons',{
  name: 'alert_buttons',
  controller: 'AlertButtonsController'
});
Router.route('/help_chat_main',{
  name: 'help_chat_main',
  controller: 'HelpChatMainController'
})
Router.route('/resident_profile',{
  name: 'resident_profile',
  controller: 'ResidentProfileController'
})
Router.route('/chat_active_list',{
  name: 'chat_active_list',
  controller: 'ChatActiveListController'
})
Router.route('/chat_old_list',{
  name: 'chat_old_list',
  controller: 'ChatOldListController'
})
Router.route('/admin_residents_create',{
  name: 'admin_residents_create',
  controller: 'AdminResidentsCreateController'
})
Router.route('/user_resident_link',{
  name: 'user_resident_link',
  controller: 'UserResidentLinkController'
})
