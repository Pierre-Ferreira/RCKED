/****************/
/* Client and Server Routes*/
/****************/
Router.configure({
    layoutTemplate: 'MasterLayout'
});

//Router.map(function() {
//    this.route('Homepage  ',{path: '/'})
//});

Router.route('/',{
    name: 'home',
    controller: 'HomeController'
});
Router.route('/help-confirm',{
    name: 'help-confirm',
    controller: 'HelpConfirmController'
});