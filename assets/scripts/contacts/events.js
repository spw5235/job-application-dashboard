'use strict';
const contactsApi = require('./api');
const contactsUi = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');

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

  data.contact.company_ref_id = $("#select-option-company-name").val();
  data.contact.job_ref_id= $("#select-option-job-title").val();

  contactsApi.createContact(data)
    .then((response) => {
      store.currentContactId = response.contact.id;
      return store.currentContactId;
    })
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
  contactsApi.updateContact(data)
    .done(contactsUi.updateContactSuccess)
    .fail(contactsUi.updateContactFailure);
};

const onShowContactCreateForm = function(event) {
  event.preventDefault();
  contactsUi.showContactCreateForm();
};


//
//
// const onDisplayCompanyDropdown = function() {
//
//   // let isUpdateForm = $(".reminder-form").attr("data-update-form");
//
//   let isCompanyChecked = $("#associate-contact-with-company").prop("checked");
//
//   if (!isCompanyChecked) {
//     store.selectedCompanyId = 0;
//     store.selectedCompanyName = "";
//   }
//
//   if (this.checked) {
//     let currentReminderCompanyId = $("#associate-contact-with-company").attr("data-current-company-id");
//
//     if ( currentReminderCompanyId === 0 ) {
//       $("#company-select-options").remove();
//       $("#job-select-options").remove();
//       $(".display-job-title").children().remove();
//       return;
//     }
//
//     companiesApi.getCompanies()
//       .done(remindersUi.displayCompanyDropdownSuccess)
//       .fail(remindersUi.displayCompanyDropdownFail);
//   } else {
//     $("associate-reminder-with-company").val(0);
//     $("#company-select-options").remove();
//     $("#job-select-options").remove();
//     $(".display-job-title").children().remove();
//     $(".association-job-insert").remove();
//   }
//
//   let selectedVal = $("#select-option-company-name").val();
//   let selectedValInt = parseInt(selectedVal);
//
//   if (selectedValInt > 0) {
//       $("#company-select-options").append('<div class="form-group"><label>Associate Reminder With Specific Job?</label><div class="form-group associate-reminder-with-job-container"><span>Check Box for Yes</span><input id="associate-reminder-with-job" type="checkbox" value=""></div></div>');
//   }
// };
//
// const onSelectOptionCompanyVal = function() {
//   let obtainVal = $(this).val();
//
//   if (obtainVal === 0 || obtainVal === "0") {
//     let valueString = '#select-option-job-title option[value=0]';
//     $(valueString).prop('selected',true);
//     store.selectedCompanyId = 0;
//     store.selectedCompanyName = "";
//     // $("#job-select-options").remove();
//     // store.selectedJobId = 0;
//     // store.selectedJobTitle = 0;
//     $("#associate-reminder-with-job").prop("checked", false);
//     $(".association-job-insert").remove();
//   }
//
//   let obtainValString = '#select-option-company-name option[value="' + obtainVal + '"]';
//   let companyName = $(obtainValString).text();
//
//   store.selectedCompanyId = obtainVal;
//   store.selectedCompanyName = companyName;
//
//   if (obtainVal > 0) {
//     $("#company-select-options").append('<div class="form-group association-job-insert"><label>Associate Reminder With Specific Job?</label><div class="form-group associate-reminder-with-job-container"><span>Check Box for Yes</span><input id="associate-reminder-with-job" type="checkbox" value=""></div></div>');
//   }
// };


const addHandlers = () => {
  $('.content').on('submit', '#new-contact-form', onCreateContact);
  $('.content').on('submit', '#update-contact-form', onUpdateContact);
  $('.content').on('click', '#contact-record-btn-edit', onEditContact);
  $('.content').on('click', '#generate-create-contact-btn', onShowContactCreateForm);
  $('.content').on('click', '.dashboard-contact-record-btn', onShowContactRecord);
  $('.content').on('click', '#get-contacts-btn', onGetContacts);
  $('.content').on('click', '#contact-record-delete', onDeleteContact);

  // $('.content').on('change', '#associate-contact-with-company', onDisplayCompanyDropdown);
  // $('.content').on('change', '#select-option-company-name', onSelectOptionCompanyVal);
  // $('.content').on('click', '#job-back-contact-overview', onShowContactRecord);
};

module.exports = {
  addHandlers,
};
