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

  let firstName = $(".contact-first-name").val().trim();
  let lastName = $(".contact-last-name").val().trim();
  let fullName = firstName + " " + lastName;

  data.contact.full_name = fullName;
  data.contact.company_ref_id = $("#select-option-company-name").val();
  data.contact.job_ref_id= $("#select-option-job-title").val();


  console.log(data);
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
