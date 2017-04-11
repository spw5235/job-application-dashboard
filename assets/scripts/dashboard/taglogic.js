'use strict';

// const store = require('../store');

const IdClassGenTagHandlebars = function(formCategory, listCategory) {

  let appendingDivIdTxt = listCategory + '-dropdown-in-' + formCategory +"-form";
  let appendingDivId = "#" + appendingDivIdTxt;

  let selectContainerIdDefTxt = formCategory + "-select-container-" + listCategory;
  let categoryIdent = appendingDivId + " .category-identifier";
  $(categoryIdent).attr("id", selectContainerIdDefTxt);

  let selectElDivIdText = formCategory + "-category-select-" + listCategory;
  let selectElement = appendingDivId + " .select-element";
  $(selectElement).attr("id", selectElDivIdText);

  // Options

  let optionElement = appendingDivId + " .option-element";
  let addOptionClass = formCategory + "-option-" + listCategory;
  $(optionElement).addClass(addOptionClass);

  let sampleHTML = $(appendingDivId).html();

};



module.exports = {
  IdClassGenTagHandlebars,
};
