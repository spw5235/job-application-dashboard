'use strict';

const convertPercentage = function() {
    let allInputs = document.querySelectorAll('.text-input');
    let allInputsLength = allInputs.length;

    for (let i = 0; i < allInputsLength; ++i) {
      let currentVal = allInputs[i].value;
      let currentArr = currentVal.split("");

      for (let j = 0; j < currentArr.length; j++) {
        if (currentArr[j] === "%") {
          currentArr[j] = " percent";
        }
      }

      let revisedValue = currentArr.join("");

      allInputs[i].value = revisedValue;

    }

  };

const defaultDate = function() {
  let d = new Date();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  let output = d.getFullYear() + '-' +
    (month < 10 ? '0' : '') + month + '-' +
    (day < 10 ? '0' : '') + day;
  return output;
};

const onResizeTextarea = function(currentId) {

  // let currentId = $(this).attr("id");

  let MaxHeight = 2000;
  let textarea = document.getElementById(currentId);
  let textareaRows = textarea.value.split("\n");
  let counter;

  if (textareaRows[0] !== "undefined" && textareaRows.length < MaxHeight) {
    counter = textareaRows.length;
  } else if (textareaRows.length >= MaxHeight) {
    counter = MaxHeight;
  } else {
    counter = 1;
  }

  textarea.rows = counter;
};

const textAreaHeightUpdate = function(divId) {
  let text = $(divId).text();
  let tempDiv = $('<div id="temp"></div>');
  let currentTdWidth = $(divId).width();
  let currentTdWidthPx = currentTdWidth.toString() + "px";
  tempDiv.css({
    "width": currentTdWidthPx,
    "white-space": "pre-line",
    "font-size": "15px"
  });

  tempDiv.text(text);
  $('body').append(tempDiv);

  let useHeight = $("#temp").height();

  if (useHeight > 0) {
    let useHeightPx = useHeight.toString() + "px";
    $(divId).css("height", useHeightPx);
  }

  $("#temp").remove();
};

const convertToUrl = function(url) {
  let submittedUrlArr = url.split("");
  let returnUrl;

  if (submittedUrlArr[0] === "w") {
    returnUrl = "http://" + url;
  } else {
    returnUrl = url;
  }

  return returnUrl;
};

const displayUrl = function() {
  let showPath = "/...";
  let preceding = "www.";
  let removedPath;
  let fullUrl;
  let url = $(".display-url").attr("href");
  let urlArr;
  let isWWW = (url.split("www.").length > 1);
  let isHttp = (url.split("http://").length > 1);
  let isHttpS = (url.split("https://").length > 1);
  let isBlank = (url.trim() === "");

  if (isWWW) {
    urlArr = url.split("www.");
    removedPath = urlArr[1].split("/");
    fullUrl = preceding + removedPath[0] + showPath;
    $(".display-url").text(fullUrl);
    $(".display-empty-p").remove();
    return;
  } else if (isHttpS) {
    urlArr = url.split("https://");
    removedPath = urlArr[1].split("/");
    fullUrl = preceding + removedPath[0] + showPath;
    $(".display-url").text(fullUrl);
    $(".display-empty-p").remove();
    return;
  } else if (isHttp) {
    urlArr = url.split("http://");
    removedPath = urlArr[1].split("/");
    fullUrl = preceding + removedPath[0] + showPath;
    $(".display-url").text(fullUrl);
    $(".display-empty-p").remove();
    return;
  } else if (isBlank) {
    $(".display-empty-p").text("N/A");
    $(".display-url").remove();
    return;
  } else {
    $(".display-url").text("link");
    $(".display-empty-p").remove();
    return;
  }
};

module.exports = {
  convertToUrl,
  displayUrl,
  textAreaHeightUpdate,
  onResizeTextarea,
  defaultDate,
  convertPercentage,
  // isDateBlank,
};
