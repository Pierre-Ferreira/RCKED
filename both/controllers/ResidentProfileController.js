ResidentProfileController = RouteController.extend({
  template: 'resident_profile',
});

ResidentProfileController.helpers({
currentUser: function() {
  var userCursor = Meteor.users.findOne({_id:Meteor.userId()});
  var residentID = userCursor.profile.residentID;
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
})
ResidentProfileController.events({

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
    var residentObj = {
      userCollID: Meteor.userId(),
      name: name,
      surname: surname,
      addrNo: addrNo,
      addrStreet: addrStreet,
      cell: cell,
      gender: gender
    };
    updateResident(residentObj,residentID);
    $('#messageSuccess').show();
  } else {
    $('#messageSuccess').hide();
    $('#messageValid').show();
  }
  }
 });

//Function to update users and resident documents.
function updateResident(residentObj, residentID) {
//First read the resident document from file as to not overwrite/lose existing attributes.
  var resident = Residents.findOne({_id:residentID});
  resident.profile.name = residentObj.name;
  resident.profile.surname = residentObj.surname;
  resident.profile.addrNo = residentObj.addrNo;
  resident.profile.addrStreet = residentObj.addrStreet;
  resident.profile.cell = residentObj.cell;
  resident.profile.gender = residentObj.gender;
  Residents.update( residentID, resident);
}
