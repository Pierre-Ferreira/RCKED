AdminUsersCreateController = RouteController.extend({
    template: 'admin_users_create',
});
AdminUsersCreateController.helpers({
    resident: function() {
        var residentsID = Session.get('residentID');
        var residentCursor = Residents.findOne({_id:residentsID});
        console.log("residentsID: "+residentsID);
        console.dir(residentCursor);
        var resident = {};
        if ((residentCursor && residentCursor.profile) != null) {
            resident = {
                id: residentsID,
                name : residentCursor.profile.name,
                surname : residentCursor.profile.surname,
                addrNo : residentCursor.profile.addrNo,
                addrStr : residentCursor.profile.addrStreet,
                cell : residentCursor.profile.cell,
                gender : residentCursor.profile.gender
            };
        } else {
            resident = {
                id :residentsID,
                name : "",
                surname : "",
                addrNo : "",
                addrStr : "",
                cell : "",
                gender : ""
            };
        };
        return resident;
    },
    equals: function(val1,val2) {
        return val1 === val2;
    }
})
AdminUsersCreateController.events({
    'click #update': function(evt, tmpl) {
        evt.preventDefault();
        $(".validCheck").hide();
//Create a resident object
        var resident = new Resident();
        var form = tmpl.find('form');
        var allValid = true;
        resident.name = $('#userName').val();
        resident.surname = $('#userSurname').val();
        resident.addrNo = $('#houseNo').val();
        resident.addrStreet = $('#streetName').val();
        resident.cell = $('#cellNo').val();
        resident.gender = $('#gender').val();
        //Check if all the fields contain valid info
        if (jQuery.trim(resident.name).length === 0) {$('#userNameValid').show(); allValid = false;};
        if (jQuery.trim(resident.surname).length === 0) {$('#userSurnameValid').show(); allValid = false;};
        if (jQuery.trim(resident.addrNo).length === 0 || jQuery.trim(resident.addrStreet).length === 0) {$('#addressValid').show(); allValid = false;};
        if (jQuery.trim(resident.cell).length === 0) {$('#cellNoValid').show(); allValid = false;};
        if (jQuery.trim(resident.gender).length === 0) {$('#genderValid').show(); allValid = false;};
        // allValid = true;
        if (allValid) {
            //form.reset();
            $('#messageValid').hide();
            //Update the residents collection.
            updateResidents(resident);
            $('#messageSuccess').show();
        } else {
            $('#messageSuccess').hide();
            $('#messageValid').show();
        }
    },
    'change #userID': function(evt,tmpl){
        var newResidentID = $('#userID').val();
        console.log("newID: "+newResidentID);
        Session.set('residentID',newResidentID);
        $('#messageValid').hide();
        $('#messageSuccess').hide();
    },
    'click #create': function(evt,tmpl) {
        evt.preventDefault();
        var newResident = Residents.insert({});
        var newResidentID = newResident;
        Session.set('residentID',newResidentID);
        $('#messageValid').hide();
        $('#messageSuccess').hide();
    },
    'click #delete': function(evt,tmpl) {
        evt.preventDefault();
        ResidentID = Session.get('residentID');
        Residents.remove({_id:ResidentID});
        Session.set('residentID','');
        $('#messageValid').hide();
        $('#messageSuccess').hide();
    }
});

//Function to update users collection.
function updateResidents(resident) {
    ResidentID = Session.get('residentID');
    Residents.update( {_id: ResidentID}, {
        $set: {
            profile: resident,
        }
    });
}
//Resident constructor
var Resident = function Resident() {
    //Initialize attributes
    var self = this;
    self.userCollID = "";
    self.name = "";
    self.surname = "";
    self.addrNo = "";
    self.addrStreet = "";
    self.cell = "";
    self.gender = "";
    self.active = false;
    self.alertContacts = [];
    for ( var i = 0; i < 3; i++ ) { self.alertContacts.push( {
        cntName : "",
        cntSurname : "",
        cntCell : ""
    } ) };
}
