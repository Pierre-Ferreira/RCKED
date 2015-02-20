UserResidentLinkController = RouteController.extend({
  template: 'user_resident_link',
  onBeforeAction: function() {
    // $('#TEST').hide();
    this.next();
  },
});

//Set file variables
var residentFound = false;
var residentStrNo = "";
var residentStrName = "";
var residentLinkID = "";
var userLinkID = "";
var residentFoundDeps = new Deps.Dependency;

UserResidentLinkController.helpers({
  equals: function(val1,val2) {
    return val1 === val2;
  },
  residentLinked: function(){
    var userCursor = Meteor.users.findOne({_id:Meteor.userId()});
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
  },
  residentFound: function(){
    residentFoundDeps.depend();
    return residentFound;
  },
  residentAddr: function(){
    residentFoundDeps.depend();
    var residentAddr = {
      strNo : residentStrNo,
      strName : residentStrName
    }
    return residentAddr;
  },
});

UserResidentLinkController.events({
  'click #searchProfile': function(evt,tmpl){
    evt.preventDefault();
    $(".validCheck").hide();
    var form = tmpl.find('form');
    var fieldsEntered = true;
    var name = $("#residentNames").val();
    var surname = $('#residentSurnames').val();
    var cell = $('#residentCellNos').val();
    //Check if all the fields contain valid info
    if (jQuery.trim(name).length === 0) {$('#residentNameErr').show(); fieldsEntered = false;};
    if (jQuery.trim(surname).length === 0) {$('#residentSurnameErr').show(); fieldsEntered = false;};
    if (jQuery.trim(cell).length === 0) {$('#residentCellNoErr').show(); fieldsEntered = false;};
    if (fieldsEntered) {
      $('#fieldsEnteredErr').hide();
      var residentCursor = Residents.findOne({"profile.name" : name, "profile.surname" : surname, "profile.cell" : cell});
      if (residentCursor != null) {
        $('#notFoundErr').hide();
        var userCollID = residentCursor.profile.userCollID;
        if (userCollID === "" || userCollID === undefined || userCollID === null) {
          $('#profileLinkedErr').hide();
          residentFound = true;
          residentStrNo = residentCursor.profile.addrNo;
          residentStrName = residentCursor.profile.addrStreet;
          residentLinkID = residentCursor._id;
          userLinkID = Meteor.userId();
          residentFoundDeps.changed();
        } else {
          $('#profileLinkedErr').show();
        }
      } else {
        $('#notFoundErr').show();
      }
    } else {
      $('#fieldsEnteredErr').show();
    };
  },
  'click #yesLink': function(evt, tmpl){
    evt.preventDefault();
    //Update the links between the users and residents
    updateProfiles(residentLinkID,userLinkID);
    Router.go('alert_buttons');
    // this.next();
  },
  'click #noLink': function(evt, tmpl){
    evt.preventDefault();
    residentFound = false;
    residentFoundDeps.changed();
    // DELETEME();
  }

});

//Function to update users and resident documents.
function updateProfiles(residentID,userID) {
  //Update the users collection.
  Meteor.users.update( userID, {
    $set: {
      profile: {
        residentID: residentID
      }
    }
  });
  //First read the resident document from file as to not overwrite/lose existing attributes.
  var resident = Residents.findOne({_id:residentID});
  resident.profile.userCollID = userID;
  resident.profile.active = 'true';
  Residents.update( residentID, resident);
};

function DELETEME(){
  console.log("IN DELETEME");
  var userTEMP = Meteor.users.findOne({_id:"h6vEMqcHrkAfLw9dq"});
  userTEMP.profile.type = "ADMIN";
  var userProfile = userTEMP.profile;
  Meteor.users.update({_id:"h6vEMqcHrkAfLw9dq"},{$set:{profile:userProfile}});
  console.log("DELETEME COMPLETED");
  return;
};

function DELETEME2(){
  console.log("IN DELETEME2");
  // var userTEMP = Meteor.users.findOne({_id:"h6vEMqcHrkAfLw9dq"});
  // userTEMP.profile.type = "ADMIN";
  Meteor.users.update({_id:"h6vEMqcHrkAfLw9dq"},{$set:{profile:{type: "ADMIN"}}});
  console.log("DELETEME2 COMPLETED");
  return;
};
