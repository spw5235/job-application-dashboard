'use strict';

const store = require('../store');
const displayEditContact = require('../templates/contact/update-contact-form.handlebars');
const displayContactDashboard = require('../templates/contact/get-contacts.handlebars');
const displayContactDetails = require('../templates/contact/show-contact-record.handlebars');
const displayContactCreateForm = require('../templates/contact/create-contact.handlebars');
const contactsApi = require('./api');
const displayRadioButtonsTemplate = require('../templates/form-template/radio-btn-template.handlebars');
const displayContactOptions = require('../templates/contact/option-dropdown-contacts.handlebars');
const linkLogic = require('../dashboard/link-logic');
const logic = require('../dashboard/logic');

const getContactSuccess = (data) => {
  store.contactDataForEdit = data;

  $(".content").children().remove();

  let dataArr = data.contacts;

  for (let i = 0; i < dataArr.length; i++ ) {
    let unavailable = "N/A";
    let currArrayOptOne = (dataArr[i].job_ref_text);
    let currArrayOptTwo = (dataArr[i].email);
    let currArrayOptThree = (dataArr[i].phone);

    if (currArrayOptOne === "" || currArrayOptOne === null) {
      dataArr[i].job_ref_text = unavailable;
    }
    if (currArrayOptTwo === "" || currArrayOptTwo === null) {
      dataArr[i].email = unavailable;
    }
    if (currArrayOptThree === "" || currArrayOptThree === null) {
      dataArr[i].phone = unavailable;
    }
  }

  let contactDashboard = displayContactDashboard({
    contacts: data.contacts
  });

  $('.content').append(contactDashboard);

};

const showContactRecordSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  store.lastShowContactData = data;

  let contactDetails = displayContactDetails({
    contact: data.contact
  });
  $('.content').append(contactDetails);
  logic.displayUrl();
};

const showContactRecordFailure = () => {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured and the record could not be retrieved.");
};

const showContactCreateForm = () => {
  let listCategory = "job";
  let formCategory = "contact";


  $(".notification-container").children().text("");
  $(".content").children().remove();
  let showCreateContactForm = displayContactCreateForm();
  $('.content').append(showCreateContactForm);

  let radioTemplate = displayRadioButtonsTemplate();
  $("#" + listCategory + "-category-radio-container").append(radioTemplate);

  linkLogic.radioClassIdNameGen(formCategory, listCategory);
  $("#job-category-radio-container").hide();
};


const generateUpdateForm = function(listCategory, formCategory) {
  $(".notification-container").children().text("");
  $(".content").children().remove();

  let data = store.lastShowContactData;

  let editContact = displayEditContact({
    contact: data.contact
  });
  $('.content').append(editContact);

  let listLinkStatusSelector = "." + listCategory + "-tag-status";
  let listRefId = parseInt(store.currentJobRefId);

  if (listRefId > 0) {
    $(listLinkStatusSelector).text("Linked");
  }

  let updateFormId = "#update-" + formCategory + "-form";
  let updateFormStatus = parseInt($(updateFormId).attr("data-update-form"));

  if ( updateFormStatus === 1) {
    let categoryText = "." + listCategory + "-radio-container ";
    $(categoryText).show();
    $(".update-radio-container-btn").hide();
  }

  let currentRefTextValTxt = "." + listCategory + "-update-radio-text";

  if (store.currentJobRefText === "") {
    $(currentRefTextValTxt).text("N/A");
  }

  let divId = "#contact-notes-input";
  logic.textAreaHeightUpdate(divId);
};

const getContactFailure = () => {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured and the records could not be retrieved.");
};

const createContactSuccess = (data) => {
  store.currentContactId = data.contact.id;
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("The record has been successfully created.");

  let showContactDetails = displayContactDetails({
    contact: store.createContactData.contact
  });
  $(".content").append(showContactDetails);
  $(".current").attr("data-current-contact-id", store.currentContactId);
  logic.displayUrl();
};

const deleteContactSuccess = () => {
  $(".notification-container").children().text("");
  $(".success-alert").text("The record has been successfully deleted");
  contactsApi.getContacts()
    .done(getContactSuccess)
    .fail(getContactFailure);
};

const deleteContactFailure = () => {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured and the record could not be deleted.");
};

const updateContactSuccess = (data) => {

  store.currentContactId = data.contact.id;
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("The record has been successfully updated.");

  let showContactDetails = displayContactDetails({
    contact: data.contact
  });
  $(".content").append(showContactDetails);
  $(".current").attr("data-current-contact-id", store.currentContactId);
  logic.displayUrl();
};

const displayContactDropdownSuccess = function(data) {
  $(".notification-container").children().text("");

  let companyOptionDisplay = displayContactOptions({
    contacts: data.contacts
  });

  let dataUpdateFormVal = parseInt($("#update-contact-form").attr("data-update-form"));

  $('.associate-reminder-with-contact-container').append(companyOptionDisplay);

  if (dataUpdateFormVal === 1) {
    let currentContactId = store.currentContactId;
    let valueString = '#select-option-contact-name option[value=' + currentContactId + ']';
    $(valueString).prop('selected', true);
  }
};

const createContactFailure = function() {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured and the record could not be created. Please make sure all required fields are filled");
};

const updateContactFailure = function() {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured and the record could not be updated. Please make sure all required fields are filled");
};

module.exports = {
  getContactSuccess,
  showContactRecordSuccess,
  deleteContactSuccess,
  deleteContactFailure,
  showContactCreateForm,
  getContactFailure,
  updateContactSuccess,
  showContactRecordFailure,
  createContactSuccess,
  displayContactDropdownSuccess,
  displayContactOptions,
  generateUpdateForm,
  createContactFailure,
  updateContactFailure,
};
