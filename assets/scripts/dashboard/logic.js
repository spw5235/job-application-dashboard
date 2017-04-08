'use strict';

const config = require('../config');
const store = require('../store');
const contactsApi = require('../contacts/api');
const displayContactOptions = require('../templates/contact/option-dropdown-contacts.handlebars');

// Communications API

// const determineTagText = function(category, selectAttribute) {
//   const currentSelectIdText = '#select-option-' + category;
//   const currentId = $(currentSelectIdText).attr(selectAttribute);
//   // let currentId = $("#associate-reminder-with-company").attr("data-current-job-id");
//   //
//   // $("#associate-reminder-with-company").val(currentId);
//   //
//   // let valueString = '#select-option-job-title option[value=' + currentReminderJobId + ']';
//   //
//   // $(valueString).prop('selected',true);
// }

const displayDropdownFail = function() {
  console.log('fail');
}

const displayDropdownSuccess = function(data) {
  console.log(data);
  $(".notification-container").children().text("");
  let classAppend = store.classAppend;
  let dataToAppend;
  let category = store.apiRequestCategory;

  if (category === "contact-category") {
    dataToAppend = displayContactOptions({
      contacts: data.contacts
    });
  }

  $(classAppend).append(dataToAppend);
  // const currentSelectIdText = '#select-option-' + category;
  // let optionValue = $(currentSelectIdText).val();
  // store.categoryIdSaved = optionValue;
  //
  // const currentSelectIdNameText = currentSelectIdText + " option[value=" + optionValue + ']';
  // let selectedText = $(currentSelectIdNameText).text();
  // store.categoryTextSaved = selectedText;

};

const determineApiRequest = function(category) {
  store.apiRequestCategory = category;
  if (category === "contact-category") {
    contactsApi.getContacts()
      .done(displayDropdownSuccess)
      .fail(displayDropdownFail);
  }
};

const calcStoreDefaultVals = function(category) {
  let isContactCategory = (category === "contact-category");
  if (isContactCategory) {
    store.selectedContactId = 0;
    store.selectedContactName = "";
  }
  let dropdownContainer = "#" + store.currentInputId + "-select";
  console.log(dropdownContainer);
  $(dropdownContainer).remove();
};

const tagCheckboxClickedUpdate = function(category, isBoxChecked) {
  console.log('is update form');
  // const storedId = calcStoreId(category, isBoxChecked);
  // const storedName = calcStoreName(category, isBoxChecked);
};


const tagCheckboxClickedCreate = function(category, isBoxChecked) {

  if (!isBoxChecked) {
    calcStoreDefaultVals(category);
  } else {
    determineApiRequest(category);
  }
};

const tagCheckboxClicked = function(category, inputId, isUpdateForm) {
  const inputidString = "#" + inputId;
  const isBoxChecked = $(inputidString).prop("checked");
  store.currentInputId = inputId;
  store.classAppend = "." + inputId + "-container";
  store.currentCategory = category;
  if (isUpdateForm) {
    tagCheckboxClickedUpdate(category, isBoxChecked);
  } else {
    tagCheckboxClickedCreate(category, isBoxChecked);
  }
};

module.exports = {
  tagCheckboxClicked,
  determineApiRequest,
};
