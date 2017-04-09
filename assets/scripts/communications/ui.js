'use strict';

const store = require('../store');
const displayEditCommunication = require('../templates/communication/update-communication-form.handlebars');
const displayCommunicationDashboard = require('../templates/communication/get-communications.handlebars');
const displayCommunicationDetails = require('../templates/communication/show-communication-record.handlebars');
const displayCommunicationCreateForm = require('../templates/communication/create-communication.handlebars');
const displaySecondaryTable = require('../templates/communication/secondary-get-communications.handlebars');
const communicationsApi = require('./api');

const getCommunicationSuccess = (data) => {
  $(".notification-container").children().text("");
  store.communicationDataForEdit = data;
  console.log(data);

  $(".content").children().remove();

  let communicationDashboard = displayCommunicationDashboard({
    communications: data.communications
  });

  $('.content').append(communicationDashboard);

  let communicationSecondaryTable = displaySecondaryTable({
    communications: data.communications
  });

  $('.content').append(communicationSecondaryTable);


  function removeDuplicateRows($table){
    function getVisibleRowText($row){
        return $row.find('td:visible').text().toLowerCase();
    }

    $table.find('tr').each(function(index, row){
        let $row = $(row);
        $row.nextAll('tr').each(function(index, next){
            let $next = $(next);
            if(getVisibleRowText($next) == getVisibleRowText($row))
                $next.remove();
        })
    });
}

removeDuplicateRows($('.secondary-table'));

  // let secondaryData = data.communications;
  //
  // let newSecondaryObj = {
  //   secondary: []
  // };
  //
  // let storeIdArr = [];
  //
  // for (let i = 0; i < secondaryData.length; i++ ) {
  //   storeIdArr.push(secondaryData[i].contact_ref_id);
  // }
  //
  // let uniqueIds = [];
  //
  // $.each(storeIdArr, function(i, el){
  //   if($.inArray(el, uniqueIds) === -1) {
  //     uniqueIds.push(el);
  //   }
  // });
  //
  // for (let i = 0; i < secondaryData.length; i++ ) {
  //   for (let j = 0; j < uniqueIds.length; j++) {
  //     if (secondaryData[i].contact_ref_id === uniqueIds[j]) {
  //       newSecondaryObj.secondary.push(secondaryData[i]);
  //       continue;
  //     }
  //     continue;
  //   }
  // }


  // for (let i = 0; i < uniqueIds.length; i++ ) {
  //   for (let j = 0; j < secondaryData.length; j++) {
  //     if (secondaryData[j].contact_ref_id === uniqueIds[i]) {
  //       newSecondaryObj.secondary.push(secondaryData[j]);
  //     } else {
  //       continue;
  //     }
  //   }
  // }

  // for (let j = 0; j < uniqueIds.length; j++) {
  //
  //   let currentUniqueId = uniqueIds[j];
  //   console.log(currentUniqueId);
  //   for (let i = 0; i < secondaryData.length; i++ ) {
  //     let currRefIdValue = secondaryData[i].contact_ref_id;
  //     if (currentUniqueId === currRefIdValue) {
  //       newSecondaryObj.secondary.push(secondaryData[i]);
  //       continue;
  //     }
  //     continue;
  //   }
  //   continue;
  // }

  // for (let i = 0; i < secondaryData.length; i++ ) {
  //   let currRefIdValue = secondaryData[i].contact_ref_id;
  //     for (let j = 0; j < uniqueIds.length; j++) {
  //       let currentUniqueId = uniqueIds[j];
  //       if (currentUniqueId === currRefIdValue) {
  //         newSecondaryObj.secondary.push(secondaryData[i]);
  //         continue;
  //       }
  //       continue;
  //     }
  //     continue;
  // }

  // console.log(newSecondaryObj);

};

const showCommunicationRecordSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  store.lastShowCommunicationData = data;

  let communicationDetails = displayCommunicationDetails({
    communication: data.communication
  });
  $('.content').append(communicationDetails);
};

const showCommunicationRecordFailure = () => {
  $(".notification-container").children().text("");
  console.log('failure');
};

const showCommunicationCreateForm = () => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  let showCreateCommunicationForm = displayCommunicationCreateForm();
  $('.content').append(showCreateCommunicationForm);
};

const updateFormGenerator = function() {
  $(".notification-container").children().text("");
  $(".content").children().remove();

  let data = store.lastShowCommunicationData;

  let editCommunication = displayEditCommunication({
    communication: data.communication
  });
  $('.content').append(editCommunication);

};

const getCommunicationFailure = () => {
  $(".notification-container").children().text("");
  console.log('get communication failure');
};

const createCommunicationSuccess = (data) => {
  console.log(data);
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Communication Has Been Successfully Created");

  let showCommunicationDetails = displayCommunicationDetails({
    communication: data.communication
  });
  $(".content").append(showCommunicationDetails);
  $(".current").attr("data-current-communication-id", store.currentCommunicationId);
};

const deleteCommunicationSuccess = () => {
  $(".notification-container").children().text("");
  console.log('delete success');
  communicationsApi.getCommunications()
    .done(getCommunicationSuccess)
    .fail(getCommunicationFailure);
};

const deleteCommunicationFailure = () => {
  $(".notification-container").children().text("");
  console.log('delete fail');
};

const updateCommunicationSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".success-alert").text("Communication Has Been Successfully Updated");
  store.currentCommunicationId = data.communication.id;
  $(".content").children().remove();
  console.log(data);
  communicationsApi.showCommunication()
    .done(showCommunicationRecordSuccess)
    .fail(showCommunicationRecordFailure);
};

module.exports = {
  getCommunicationSuccess,
  showCommunicationRecordSuccess,
  deleteCommunicationSuccess,
  deleteCommunicationFailure,
  updateFormGenerator,
  showCommunicationCreateForm,
  getCommunicationFailure,
  updateCommunicationSuccess,
  showCommunicationRecordFailure,
  createCommunicationSuccess,
};
