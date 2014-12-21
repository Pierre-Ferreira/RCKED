UsersProfileController = RouteController.extend({
    template: 'users_profile',
});
UsersProfileController.helpers({
    currentUser: function() {
        var userCursor = Meteor.users.findOne({_id:Meteor.userId()});
        console.dir(userCursor);
        var residentID = userCursor.profile.residentID;
        console.log("residentID: "+residentID);
        var residentCursor = Residents.findOne({_id:residentID});
        var currentUser = {};
        if (residentCursor.profile != null) {
            currentUser = {
                residentID : residentID,
                name : residentCursor.profile.name,
                surname : residentCursor.profile.surname,
                addrNo : residentCursor.profile.addrNo,
                addrStr : residentCursor.profile.addrStreet,
                cell : residentCursor.profile.cell,
                gender : residentCursor.profile.gender
            };
        } else {
            currentUser = {
                name : "",
                surname : "",
                addrNo : "",
                addrStr : "",
                cell : "",
                gender : ""
            };
        };
        return currentUser;
    },
    equals: function(val1,val2) {
        return val1 === val2;
    },
    residentLinked: function(){
        var userCursor = Meteor.users.findOne({_id:Meteor.userId()});
        console.dir(userCursor);
        return ((userCursor.profile.residentID != null) ? true : false );
    },
    residentNames: function(){
        var namesARR = [];
        namesARR = Residents.find({}).map( function(u) { return {name : u.profile.name} } );
        var namesUniqObjs = _.uniq(namesARR, function(resident) {return resident.name;});
        return namesUniqObjs;
    },
    residentSurnames: function(){
        var surnamesARR = [];
        surnamesARR = Residents.find({}).map( function(u) { return {surname : u.profile.surname} } );
        var surnameUniqObjs = _.uniq(surnamesARR, function(resident) {return resident.surname;});
        return surnameUniqObjs;
    },
    residentCellNos: function(){
        var cellARR = [];
        cellNoARR = Residents.find({}).map( function(u) { return {cellNo : u.profile.cell} } );
        var cellNoUniqObjs = _.uniq(cellNoARR, function(resident) {return resident.cellNo;});
        return cellNoUniqObjs;
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
        var residentID = $('#residentID').text();
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
                userCollID: Meteor.userId(),
                name: name,
                surname: surname,
                addrNo: addrNo,
                addrStreet: addrStreet,
                cell: cell,
                gender: gender
            };
            updateProfiles(userProfile,residentID,Meteor.userId());
            $('#messageSuccess').show();
        } else {
            $('#messageSuccess').hide();
            $('#messageValid').show();
        }
    }
});
//Function to update users collection.
function updateProfiles(residentProfile,residentID,userID) {
    Meteor.users.update( userID, {
        $set: {
            profile: {
                residentID: residentID
            }
        }
    });
//First read the resident record from file as to not overwrite/lose existing attributes
    var resident = Residents.findOne({_id:residentID});
    resident.profile.userCollID = residentProfile.userCollID;
    resident.profile.name = residentProfile.name;
    resident.profile.surname = residentProfile.surname;
    resident.profile.addrNo = residentProfile.addrNo;
    resident.profile.addrStreet = residentProfile.addrStreet;
    resident.profile.cell = residentProfile.cell;
    resident.profile.gender = residentProfile.gender;
    resident.profile.active = 'true';
    Residents.update( residentID, resident);
}
