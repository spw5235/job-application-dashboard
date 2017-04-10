'use strict';

const store = require('../store');
const displayContactOptions = require('../templates/contact/option-dropdown-contacts.handlebars');
const contactsApi = require('../contacts/api');
const jobApi = require('../jobs/api');
const displayJobOptions = require('../templates/job/option-dropdown-jobs.handlebars');

// const determineTagId = function(category, id) {
//   let communicationTextSelected = $("#select-option-" + category + " option[value=" + id + "]").text();
//   let idSelected = $("#select-option-" + category).val();
//   if ( communicationTextSelected === "" ) {
//     return idSelected;
//   } else {
//     return idSelected;
//   }
// };

const shortDisplayedUrl = function(urlType, urlVal) {
  let splitUrl = urlVal.split(urlType);
  let revisedUrl = splitUrl[0] + urlType + "/...";
  return revisedUrl;
};

const urlArrIdentifier = function(url) {
  let possibleDomains = [".com", ".net", ".org", ".biz", ".info", ".gov", ".edu"];
  let urlSplit;
  let splitContent;
  let tempArrayItem;
  for ( let i = 0 ; i < possibleDomains.length; i++ ) {
    tempArrayItem = possibleDomains[i].toString();
    splitContent = '"' + tempArrayItem + '"';
    urlSplit = url.split(possibleDomains[i]);
    console.log(urlSplit);

    if (urlSplit.length > 1) {
      let revisedUrl = urlSplit[0] + possibleDomains[i] + "/...";
      return revisedUrl;
      //
      // console.log(urlSplit);
      // // let domainType = possibleDomains[i];
      // // shortDisplayedUrl(urlSplit, domainType);
      // console.log(possibleDomains[i]);
      // return possibleDomains[i];
    }
  }
};

const isDefaultCMethod = function (currentCMethod) {

  let compareDocType = currentCMethod.toString();

  let defaultValues = ["Email", "Phone", "Linkedin", "Meeting", "Other"];

  for ( let i = 0; i < defaultValues.length; i++ ) {
    let defaultValString = defaultValues[i].toString();
    if (defaultValString === compareDocType) {
      console.log('true');
      return true;
    }
  }

  return false;
};

const isDefaultDocType = function (currentDocType) {

  let compareDocType = currentDocType.toString();

  let defaultValues = ["Resume", "Cover Letter"];

  for ( let i = 0; i < defaultValues.length; i++ ) {
    let defaultValString = defaultValues[i].toString();
    if (defaultValString === compareDocType) {
      console.log('true');
      return true;
    }
  }

  return false;
};

const removeDuplicateRows = function ($table) {
  function getVisibleRowText($row){
      return $row.find('td:visible').text().toLowerCase();
  }

  $table.find('tr').each(function(index, row){
      let $row = $(row);
      $row.nextAll('tr').each(function(index, next){
          let $next = $(next);
          if (getVisibleRowText($next) === getVisibleRowText($row)) {
            $next.remove();
          }
      });
  });
};

const preselectDefault = function(divId, defaultVal) {
  console.log(defaultVal);

  let selectText = $(divId + ' option[value="' + defaultVal + '"]');
  $(selectText).prop('selected', true);
};

const determineTagText = function(category, id) {
  let communicationTextSelected = $("#select-option-" + category + " option[value=" + id + "]").text();
  console.log(communicationTextSelected);
  return communicationTextSelected;
};

// Communications API

// const determineTagText = function(category, selectAttribute) {
//   const currentSelectIdText = '#select-option-' + category;
//   const currentId = $(currentSelectIdText).attr(selectAttribute);
//   // let currentId = $("#associate-reminder-with-job").attr("data-current-job-id");
//   //
//   // $("#associate-reminder-with-job").val(currentId);
//   //
//   // let valueString = '#select-option-job-title option[value=' + currentReminderJobId + ']';
//   //
//   // $(valueString).prop('selected',true);
// }

const displayDropdownFail = function() {
  console.log('fail');
};

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
  } else if (category === "job-category") {
    dataToAppend = displayJobOptions({
      jobs: data.jobs
    });
  }

  $(classAppend).append(dataToAppend);

  let isUpdateForm = parseInt($(".general-form-class").attr("data-update-form"));

  if (isUpdateForm === 1) {
  let divIdSelector = "#" + store.currentUpdateInputId;
  let idValue = parseInt($(divIdSelector).val());
  let communicationTextSelect = '#select-option-' + category + ' option[value=' + idValue + ']';
  $(communicationTextSelect).prop('selected', true);

  } else {
    return;
  }

};

const determineApiRequest = function(category, isUpdate, checkboxId) {
  console.log(category);
  console.log(isUpdate);

  let checkDivId = checkboxId;
  store.apiRequestCategory = category;

  if (isUpdate) {
    $(checkDivId).click();
  } else {
    if (category === "contact-category") {
      contactsApi.getContacts()
        .done(displayDropdownSuccess)
        .fail(displayDropdownFail);
    } else if ( category === "job-category" ) {
      jobApi.getJobs()
        .done(displayDropdownSuccess)
        .fail(displayDropdownFail);
    }
  }
};

const calcStoreDefaultVals = function(category) {
  let isContactCategory = (category === "contact-category");
  let isJobCategory = (category === "contact-category");
  if (isContactCategory) {
    store.selectedContactId = 0;
    store.selectedContactName = "";
  } else if ( isJobCategory ) {
    store.selectedJobId = 0;
    store.selectedJobName = "";
  }
  let dropdownContainer = "#" + store.currentInputId + "-select";
  console.log(dropdownContainer);
  $(".select-option-value").val(0);
  $(dropdownContainer).remove();
  return;
};


const tagCheckboxClickedCreate = function(category, isBoxChecked) {
  let isUpdate = false;
  if (!isBoxChecked) {
    calcStoreDefaultVals(category);
  } else {
    determineApiRequest(category, isUpdate);
  }
};

const tagCheckboxClicked = function(category, inputId) {
  const inputidString = "#" + inputId;
  const isBoxChecked = $(inputidString).prop("checked");
  store.currentInputId = inputId;
  store.classAppend = "." + inputId + "-container";
  store.currentCategory = category;
  tagCheckboxClickedCreate(category, isBoxChecked);
};

const tagCheckboxUpdate = function(category) {
  const isUpdate = true;
  const checkboxIdText = "." + category;
  const checkboxIdVal = $(checkboxIdText).attr("id");
  const checkboxId = "#" + checkboxIdVal;

  console.log(checkboxId);

  store.currentUpdateInputId = checkboxIdVal;
  const isExistingId = parseInt($(checkboxId).val());

  console.log(category);
  console.log(isExistingId);
  if ( isExistingId > 0 ) {
    determineApiRequest(category, isUpdate, checkboxId);
  } else {
    calcStoreDefaultVals(category);
  }
};

module.exports = {
  tagCheckboxClicked,
  determineApiRequest,
  tagCheckboxUpdate,
  determineTagText,
  calcStoreDefaultVals,
  removeDuplicateRows,
  preselectDefault,
  isDefaultDocType,
  isDefaultCMethod,
  urlArrIdentifier,
  shortDisplayedUrl,
};
