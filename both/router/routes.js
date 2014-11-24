/****************/
/* Client and Server Routes*/
/****************/
Router.configure({
    layoutTemplate: 'MasterLayout',
    data: function() {
            return UsersKED.findOne({name: 'Pierre'})
        }
});

//Router.map(function() {
//    this.route('Homepage  ',{path: '/'})
//});

Router.route('/',{
    name: 'home',
    controller: 'HomepageController'
});
Router.route('/help_confirm',{
    name: 'help_confirm',
    controller: 'HelpConfirmController'
});
Router.route('/help_chat_main',{
    name: 'help_chat_main',
    controller: 'HelpChatMainController'
})