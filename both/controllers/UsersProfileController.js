UsersProfileController = RouteController.extend({
    template: 'users_profile',
});
UsersProfileController.helpers({
    currentUser: function() {
        var userCursor = Meteor.users.findOne({_id:Meteor.userId()});
        var residentID = userCursor.profile.residentID;
        var residentCursor = Resident.findOne({_id:residentID});
        var currentUser = {};
        if (userCursor.profile != null) {
            currentUser = {
                name : userCursor.profile.userName,
                surname : userCursor.profile.userSurname,
                addrNo : userCursor.profile.userAddrNo,
                addrStr : userCursor.profile.userAddrStreet,
                cell : userCursor.profile.userCell,
                gender : userCursor.profile.userGender,
                smsSub : userCursor.profile.userSmsSubscriber
            };
        } else {
            currentUser = {
                name : "",
                surname : "",
                addrNo : "",
                addrStr : "",
                cell : "",
                gender : "",
                smsSub : ""
            };
        };
        return currentUser;
    },
    equals: function(val1,val2) {
        return val1 === val2;
    }
})
UsersProfileController.events({
    'submit form': function(evt, tmpl) {
        evt.preventDefault();
        $(".validCheck").hide();
        var form = tmpl.find('form');
        var allValid = true;
        var name = $("#userName").val();
        var surname = $('#userSurname').val();
        var addrNo = $('#houseNo').val();
        var addrStreet = $('#streetName').val();
        var cell = $('#cellNo').val();
        var gender = $('#gender').val();
        var smsSubscriber = $('#smsSubscriber').is(':checked');
//Check if all the fields contain valid info
        if (jQuery.trim(name).length === 0) {$('#userNameValid').show(); allValid = false;};
        if (jQuery.trim(surname).length === 0) {$('#userSurnameValid').show(); allValid = false;};
        if (jQuery.trim(addrNo).length === 0 || jQuery.trim(addrStreet).length === 0) {$('#addressValid').show(); allValid = false;};
        if (jQuery.trim(cell).length === 0) {$('#cellNoValid').show(); allValid = false;};
        if (jQuery.trim(gender).length === 0) {$('#genderValid').show(); allValid = false;};
        if (allValid) {
//form.reset();
            $('#messageValid').hide();
//Update the users collection.
            userProfile = {
                userid: Meteor.userId(),
                name: name,
                surname: surname,
                addrNo: addrNo,
                addrStreet: addrStreet,
                cell: cell,
                gender: gender,
                smsSubscriber: smsSubscriber
            };
            updateUsersProfile(userProfile);
            $('#messageSuccess').show();
        } else {
            $('#messageSuccess').hide();
            $('#messageValid').show();
        }
//Function to update users collection.
        function updateUsersProfile(userProfile) {
            Meteor.users.update( userProfile.userid, {
                $set: {
                    profile: {
                        userName: userProfile.name,
                        userSurname: userProfile.surname,
                        userAddrNo: userProfile.addrNo,
                        userAddrStreet: userProfile.addrStreet,
                        userCell: userProfile.cell,
                        userGender: userProfile.gender,
                        userSmsSubscriber: userProfile.smsSubscriber
                    }
                }
            });
        }
    }
});
