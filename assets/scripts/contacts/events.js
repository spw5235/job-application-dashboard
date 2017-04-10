'use strict';
const contactsApi = require('./api');
const contactsUi = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');
const dashboardLogic = require('../dashboard/logic');

// Contact EVENTS

const onGetContacts = function(event) {
  event.preventDefault();
  contactsApi.getContacts()
    .done(contactsUi.getContactSuccess)
    .fail(contactsUi.getContactFailure);
};

const onShowContactRecord = function(event) {
  event.preventDefault();
  store.currentContactId = $(this).attr("data-current-contact-id");
  contactsApi.showContact()
    .done(contactsUi.showContactRecordSuccess)
    .fail(contactsUi.showContactRecordFailure);
};

const onEditContact = function(event) {
  event.preventDefault();
  store.currentContactId = $(this).attr("data-current-contact-id");
  contactsUi.updateFormGenerator();
};

const onCreateContact = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  store.createContactData = data;
  store.lastShowContactData = data;

  let firstName = $(".contact-first-name").val().trim();
  let lastName = $(".contact-last-name").val().trim();
  let fullName = firstName + " " + lastName;

  data.contact.full_name = fullName;

  let jobSelectionId = $("#select-option-job-category").val();
  // data.contact.job_ref_id= jobSelectionId;

  data.contact.notes = $("#contact-notes-input").val();

  let category = "job-category";

  // let jobName = dashboardLogic.determineTagText(category, jobSelectionId);

  // data.contact.company_name = jobName;

  /// Radio

  let isNumber = parseInt(jobSelectionId);


  if (isNumber === 0) {
    data.contact.job_ref_id = isNumber;
    data.contact.company_name = dashboardLogic.determineTagText(category, jobSelectionId);
  } else if ( isNumber > 0 ) {
    data.contact.job_ref_id = isNumber;
    data.contact.company_name = dashboardLogic.determineTagText(category, jobSelectionId);
  } else {
    data.contact.job_ref_id = 0;
    data.contact.company_name = jobSelectionId;
  }

  if (data.contact.company_name === undefined) {
    data.contact.company_name = "";
  } else if (data.contact.company_name === "Click to Select") {
    data.contact.company_name = "";
  }

  console.log(data);
  contactsApi.createContact(data)
    .done(contactsUi.createContactSuccess)
    .fail(contactsUi.createContactFailure);
};

const onDeleteContact = function(event) {
  event.preventDefault();
  store.currentContactId= $("#contact-record-delete").attr("data-current-contact-id");
  contactsApi.deleteContact(store.currentContactId)
    .done(contactsUi.deleteContactSuccess)
    .fail(contactsUi.deleteContactFailure);
};

const onUpdateContact = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  data.contact.company_ref_id = parseInt($("#select-option-company-name").val());
  data.contact.job_ref_id = parseInt($("#select-option-job-title").val());
  data.contact.note = $("#contact-notes-input").val();
  console.log(data);
  contactsApi.updateContact(data)
    .done(contactsUi.updateContactSuccess)
    .fail(contactsUi.updateContactFailure);
};

const onShowContactCreateForm = function(event) {
  event.preventDefault();
  contactsUi.showContactCreateForm();
};

const onSelectJobDropdown = function(event) {
  event.preventDefault();
  let tagCategory = $(this).attr("class");
  dashboardLogic.determineApiRequest(tagCategory);
};

const onDisplayJobDropdown = function(event) {
  event.preventDefault();
  let thisCheckBoxStatus = $(this).is(':checked');

  let thisRadioStatus = parseInt($(this).val());

  if (thisRadioStatus === 0) {

  }

  if (!thisCheckBoxStatus) {
    $(this).parent().children(".tag-select-container").remove();
  }

  let isUpdateForm;
  // let radioDivName = $(this).attr("name");
  let tagCategory = $(this).attr("class");
  let radioValue = $(this).val();
  let formCategory = "contact";

  console.log(tagCategory);
  console.log(radioValue);

  let updateFormStatus = $(".general-form-container").attr("data-update-form");
  updateFormStatus = parseInt(updateFormStatus);
  if (updateFormStatus === 1) {
    isUpdateForm = true;
  } else {
    isUpdateForm = false;
  }
  dashboardLogic.tagRadioActivated(tagCategory, radioValue, formCategory);
};


const addHandlers = () => {
  $('.content').on('submit', '#new-contact-form', onCreateContact);
  $('.content').on('submit', '#update-contact-form', onUpdateContact);
  $('.content').on('click', '#contact-record-btn-edit', onEditContact);
  $('.content').on('click', '#generate-create-contact-btn', onShowContactCreateForm);
  $('.content').on('click', '.dashboard-contact-record-btn', onShowContactRecord);
  // $('.content').on('click', '#get-contacts-btn', onGetContacts);
  $('#get-contacts-btn').on('click', onGetContacts);
  $('.content').on('click', '#contact-record-delete', onDeleteContact);
  $('.content').on('change', '.job-category', onDisplayJobDropdown);
  $('.content').on('change', '#select-option-job-category', onSelectJobDropdown);

  // $('.content').on('change', '#associate-contact-with-company', onDisplayCompanyDropdown);
  // $('.content').on('change', '#select-option-company-name', onSelectOptionCompanyVal);
  // $('.content').on('click', '#job-back-contact-overview', onShowContactRecord);
};

module.exports = {
  addHandlers,
};
