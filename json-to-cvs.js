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

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
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
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
 }

function download(){
  var structure = {
      title: 'Title'.replace(/,/g, ''), // remove commas to avoid errors
      description: "Description",
      stage: "Stage",
      modified: "Modified",
  };

  var response = document.getElementById("myFile");

  console.log(response);

  loadJSON(function(res) {
     // Parse JSON string into object
     var board = JSON.parse(response);

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

        for(var i in field.options) {
          options[field.options[i].id] = field.options[i].value.text;
        }

       custom_fields[field.id] = {
         name : field.name,
         options : options
       };
       structure[field.name] = field.name;
     });

     console.log(custom_fields);

     var cardsFormatted = [];

     // format the data
     board.cards.forEach((card) => {
       for(var key in card) {
         for(var field in structure) {
           if (card[field] == null){
             card[field] = 'NA'
           }
         }
       };

       var formattedCard = {
        title: card.name.replace(/[^a-zA-Z0-9 ]/g, " "), // remove commas to avoid errors
        description: card.desc.replace(/[^a-zA-Z0-9 ]/g, " "),
        stage: lists[card.idList].replace(/[^a-zA-Z0-9 ]/g, " "),
        modified: card.dateLastActivity
      };

      for (var i in custom_fields) {
        formattedCard[custom_fields[i].name] = '';
      }

      for(var number in card.customFieldItems){
        var current = card.customFieldItems[number];
        if (current.value) {
          formattedCard[custom_fields[current.idCustomField].name] = current.value['date'] || "NA";
        } else {
          formattedCard[custom_fields[current.idCustomField].name] = custom_fields[current.idCustomField].options[current.idValue]|| "NA";
        }
      }

      cardsFormatted.push(formattedCard);
    });

     console.log(cardsFormatted);

     var fileTitle = 'orders'; // or 'my-unique-title'

     exportCSVFile(structure, cardsFormatted, fileTitle); // call the exportCSVFile() function to process the JSON and trigger the download
  });

}
