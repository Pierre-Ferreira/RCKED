UsersKED = new Meteor.Collection('usersKED');
UsersKED.remove({});
UsersKED.insert({
    _id: 'AYmDNzzafst9iDRqa',
    name: 'Pierre',
    surname: 'Ferreira',
    address: '#37 Veronica'
    }
);
UsersKED.insert({
    _id: '3nyuGjWiAuEi2orSg',
    name: 'John',
    surname: 'Doe',
    address: '#15 Veronica str'
    }
);
UsersKED.insert({
    name:'Bet',
    surname:'fdvcccmf'
    }
);
HelpPostsINIT = new Meteor.Collection('helpPosts');
var exist = HelpPostsINIT.findOne({postNumber: 100001})
if (exist) {
    console.log(exist);
} else {
    userMain = UsersKED.findOne({name:'Pierre'});
    userId = userMain._id;
    HelpPostsINIT.insert({
        postNumber: 100001,
        initiator: userId
    });
}