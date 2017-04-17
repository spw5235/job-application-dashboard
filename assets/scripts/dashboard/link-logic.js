'use strict';

const jobsApi = require('../jobs/api');
const store = require('../store');
const displayJobOptions =  require('../templates/link/contact-form-job-link.handlebars');
const displayJobContactAltOption = require('../templates/alt-link/contact-form-job-alt-link.handlebars');
const displayJobCommunicationAltOption = require('../templates/alt-link/communication-form-job-alt-link.handlebars');

const altOptionAppend = function(formCategory, listCategory) {
  let displayAltInput;
  if (formCategory === "contact" && listCategory === "job") {
    displayAltInput = displayJobContactAltOption();
  } else if (formCategory === "communication" && listCategory === "job") {
    displayAltInput = displayJobCommunicationAltOption();
  }

  $(".display-alt-job").append(displayAltInput);
};

const obtainOptionVal = function(listCategory) {
  let alternativeEntrySelector = "#alt-input-entry-" + listCategory;
  let alternativeEntryVal = $(alternativeEntrySelector).val();
  let valueSelector = "#select-element-" + listCategory;
  let isRadioCheckedTxt = "#" + listCategory + "-radio-btns-container input";
  let isRadioChecked = $(isRadioCheckedTxt).prop("checked");
  if ( alternativeEntryVal === undefined ) {
    if (!isRadioChecked) {
      return 0;
    } else {
      return parseInt($(valueSelector).val());
    }
  } else {

    return 0;
  }
};

const obtainOptionText = function(listCategory) {
  let textInputDiv = "#alt-input-entry-" + listCategory;
  let alternativeEntrySelector = "#alt-input-entry-" + listCategory;
  let alternativeEntryVal = $(alternativeEntrySelector).val();
  let valueSelector = "#select-element-" + listCategory;
  let linkValue = $(valueSelector).val();

  if ( alternativeEntryVal === undefined ) {
    let textValueSelectDiv = valueSelector + " option[value=" + linkValue + "]";
    return $(textValueSelectDiv).text();
  } else {
    return $(textInputDiv).val();
  }
};


const insertFailure = function() {
  console.log('failure');
};

const jobDropdownDataResults = (data) => {
  let listCategory = store.currentListCategory;
  let formCategory = store.currentFormCategory;

  let containerAppendId = "." + "display-dropdown-" + listCategory;
  let dataDropdown;

  if (listCategory === "job" && formCategory === "contact") {
    dataDropdown = displayJobOptions({
      jobs: data.jobs
    });
  }

  $(containerAppendId).append(dataDropdown);

};

const showDropOptionsCreatePage = function(formCategory, listCategory) {
  store.currentListCategory = listCategory;
  store.currentFormCategory = formCategory;
  if (listCategory === "job" && formCategory ==="contact") {
    jobsApi.getJobs()
      .done(jobDropdownDataResults)
      .fail(insertFailure);
  }
};

const radioClassIdNameGen = function(formCategory, listCategory) {
  let appendingDivIdTxt = listCategory + "-category-radio-container";
  let appendingDivId = "#" + appendingDivIdTxt;

  let radioGroupContainerTxt = listCategory + "-radio-group-container";

  let radioGroupContainerSelector = appendingDivId + " .radio-group-container";

  let radioBtnContainerTxt = listCategory + "-radio-btns-container";
  let radioBtnContainerSelector = appendingDivId + " .radio-btn-container";

  let formCategoryNameTxt = formCategory + "-form-category-name";
  let formCategoryNameSelector = appendingDivId + " .form-category-name";


  let listCategoryNameTxt = listCategory + "-list-category-name";
  let listCategoryNameSelector = appendingDivId + " .list-category-name";

  let radioContainerTxt = "#" + radioBtnContainerTxt;
  let radioInputClassSelector = radioContainerTxt + " input";

  let radioInputClassTxt = listCategory + "-category";

  let radioNameTxt = listCategory + "-category-radio";
  let radioNameSelector = "." + radioInputClassTxt;

  let radioDropContainerTxt = "display-radio-drop-" + listCategory;
  let radioDropContainerSelector = "#" + radioGroupContainerTxt + " .display-radio-drop";

  let formCategoryNameId = "#" + formCategoryNameTxt;
  let listCategoryNameId = "#" + listCategoryNameTxt;

  $(radioGroupContainerSelector).attr("id", radioGroupContainerTxt);
  $(radioBtnContainerSelector).attr("id", radioBtnContainerTxt);
  $(formCategoryNameSelector).attr("id", formCategoryNameTxt);
  $(formCategoryNameId).text(formCategory);
  $(listCategoryNameSelector).attr("id", listCategoryNameTxt);
  $(listCategoryNameId).text(listCategory);
  $(radioInputClassSelector).addClass(radioInputClassTxt);
  $(radioNameSelector).attr("name", radioNameTxt);
  $(radioDropContainerSelector).attr("id", radioDropContainerTxt);
};


const preselectDefault = function(divId, defaultVal) {
  let selectText = $(divId + ' option[value="' + defaultVal + '"]');
  $(selectText).prop('selected', true);
};


module.exports = {
  radioClassIdNameGen,
  showDropOptionsCreatePage,
  altOptionAppend,
  insertFailure,
  jobDropdownDataResults,
  obtainOptionVal,
  obtainOptionText,
  preselectDefault,
};
