// Todo:
// - Create card class with all fields needed
// - Need to handle Custom fields correctly (probably dynamically create columns for each custom field)
// - Decide what data is needed
// - Decide what we want the table layout to actually do, want a webpage or just output a spreadsheet

// Could host on the stream PC and hold last updated


function convertToCSV(objArray) {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';

  for (var i = 0; i < array.length; i++) {
    var line = '';
    for (var index in array[i]) {
      if (line != '') line += ','

      line += array[i][index];
    }

    str += line + '\r\n';
  }

  return str;
}

function exportCSVFile(headers, items, fileTitle) {
  if (headers) {
    items.unshift(headers);
  }

  // Convert Object to JSON
  var jsonObject = JSON.stringify(items);

  var csv = this.convertToCSV(jsonObject);

  var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

  var blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;'
  });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'trello_export.json', true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

function download(response) {
  var structure = {
    title: 'Title'.replace(/,/g, ''), // remove commas to avoid errors
    description: "Description",
    stage: "Stage",
    modified: "Modified",
    label: "Label 1"
  };

  // Parse JSON string into object
  var board = response

  // Get lists titles
  var lists = [];

  board.lists.forEach((list) => {
    lists[list.id] = list.name;
  });

  // Get people
  var members = {};

  board.members.forEach((member) => {
    members[member.id] = member.fullName;
  });

  // Get labels
  var labels = {};

  board.labels.forEach((label) => {
    labels[label.id] = label.name;
  });

  var custom_fields = {};

  board.customFields.forEach((field) => {
    var options = {};

    for (var i in field.options) {
      options[field.options[i].id] = field.options[i].value.text;
    }

    custom_fields[field.id] = {
      name: field.name,
      options: options
    };
    structure[field.name] = field.name;
  });

  console.log(custom_fields);

  var cardsFormatted = [];

  // format the data
  board.cards.forEach((card) => {
    for (var key in card) {
      for (var field in structure) {
        if (card[field] == null) {
          card[field] = 'NA'
        }
      }
    };

    if (!card.labels[0]){
      card.labels[0] = {};
      card.labels[0].name = '';
    }

    var formattedCard = {
      title: card.name.replace(/[^a-zA-Z0-9 ]/g, " "), // remove commas to avoid errors
      description: card.desc.replace(/[^a-zA-Z0-9 ]/g, " "),
      stage: lists[card.idList].replace(/[^a-zA-Z0-9 ]/g, " "),
      modified: card.dateLastActivity,
      label: card.labels[0].name
    };

    for (var i in custom_fields) {
      formattedCard[custom_fields[i].name] = '';
    }

    for (var number in card.customFieldItems) {
      var current = card.customFieldItems[number];
      if (current.value) {
        formattedCard[custom_fields[current.idCustomField].name] = current.value['date'] || "NA";
      } else {
        formattedCard[custom_fields[current.idCustomField].name] = custom_fields[current.idCustomField].options[current.idValue] || "NA";
      }
    }

    cardsFormatted.push(formattedCard);
  });

  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + "-" + today.getMinutes()
  var dateTime = date+' '+time;

  var fileTitle = 'Trello_Export_' + dateTime;

  exportCSVFile(structure, cardsFormatted, fileTitle); // call the exportCSVFile() function to process the JSON and trigger the download

}

(function() {

  function onChange(event) {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
  }

  function onReaderLoad(event) {
    var obj = JSON.parse(event.target.result);
    download(obj);
  }

  document.getElementById('file').addEventListener('change', onChange);

}());
