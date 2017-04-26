'use strict';

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
  let url = $(".display-url").attr("href").trim();
  if (url === "" || url === "N/A") {
    $(".display-empty-p").text("N/A");
    $(".display-url").remove();
    return;
  }

  let urlArr = url.split("www.");
  let removedPath = urlArr[1].split("/");
  let showPath = "/...";
  let preceding = "www.";
  let fullUrl = preceding + removedPath[0] + showPath;
  $(".display-url").text(fullUrl);
};

module.exports = {
  convertToUrl,
  displayUrl,
  textAreaHeightUpdate,
};
