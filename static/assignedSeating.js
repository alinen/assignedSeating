var guestList = [];
var friends = [];
var enemies = [];

function readCSV(f)
{
   guestList = [];
   if (f.type.match('text/csv')) 
   {
      var reader = new FileReader();
      reader.onload = (function(fileContents) 
      {
         return function(e) 
         {
            var output = e.target.result.split('\n');
            var listHTML = '<ul>';
            for (var i = 0; i < output.length; i++)
            {
               var name = output[i].trim();
               if (name === "") continue;
               listHTML += '<li><strong>'+name+'</strong></li>';
               guestList.push(name);
               friends.push([]);
               enemies.push([]);
            }
            listHTML += '</ul>';
            document.getElementById('list').innerHTML = listHTML;
         };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsText(f);
   }
   else
   {
      alert("Only CSV files are supported.");
   }
}

function handleFileSelect(evt) 
{
   var files = evt.target.files; // FileList object
   if (files.length > 0)
   {
      readCSV(files[0]);
   }
}

function handleFileDrag(evt) 
{
   evt.stopPropagation();
   evt.preventDefault();

   var files = evt.dataTransfer.files; // FileList object.
   if (files.length > 0)
   {
      readCSV(files[0]);
   }
}

function handleDragOver(evt) 
{
   evt.stopPropagation();
   evt.preventDefault();
   evt.dataTransfer.dropEffect = 'upload'; // Explicitly show this is a copy.
}

function onLoad()
{
   // Check for the various File API support.
   if (window.File && window.FileReader && window.FileList && window.Blob) 
   {
      // Setup the dnd listeners.
      var dropZone = document.getElementById('dropZone');
      dropZone.addEventListener('dragover', handleDragOver, false);
      dropZone.addEventListener('drop', handleFileDrag, false);

      var fileButton = document.getElementById('files');
      fileButton.addEventListener('change', handleFileSelect, false);
   } 
   else 
   {
      alert('AssignedSeating requires File APIs (not fully supported in this browser).');
   }   
}

function areFriends(i, j)
{
   for (var ii = 0; ii < friends[i].length; ii++)
   {
      if (guestList[i] === friends[i][ii]) return true;
   }
   return false;
}

function areEnemies(i, j)
{
   for (var ii = 0; ii < enemies[i].length; ii++)
   {
      if (guestList[i] === enemies[i][ii]) return true;
   }
   return false;
}

function onAssign()
{
   if (guestList.length === 0)
   {
      alert('No guest list loaded');
      return;
   }

   var numTables = document.getElementById('NumTablesInput').value;
   var numPerTable = document.getElementById('NumPerTableInput').value;
   var requestUrl = 'aseat/api/v1.0/assign/'+numTables+':'+numPerTable+':'+guestList.length+':';
   //console.log(requestUrl);

   for (var i = 0; i < guestList.length; i++)
   {
      for (var j = 0; j < guestList.length; j++)
      {
         if (areFriends(i,j)) requestUrl += '1'; 
         else if (areEnemies(i,j)) requestUrl += '-1';
         else requestUrl += '0';
      }
   }
   var request = new XMLHttpRequest();
   request.open('GET', requestUrl, true);
   request.send(null);
   request.onreadystatechange = function () {
       if (request.readyState === 4 && request.status === 200) {
           var type = request.getResponseHeader('Content-Type');
           var tokens = request.responseText.split(':');

           //console.log(tokens[0]+' '+tokens[1]+' '+tokens[2]+' '+tokens[3]);
           
           // TODO: Safety and attribute checking
           var numTables = parseInt(tokens[0]);
           var numPerTable = parseInt(tokens[1]);
           var numGuests = parseInt(tokens[2]);
           var tableIds = tokens[3].split(',');
           //console.log(numTables+" "+numPerTable+" "+numGuests);

           tables = []
           for (var i = 0; i < numTables; i++)
           {
              tables.push('<ul>');
           }

           for (var i = 0; i < tableIds.length; i++)
           {
              var tableId = parseInt(tableIds[i]);
              tables[tableId] += '<li><strong>'+guestList[i]+'</strong></li>';
           }
           for (var i = 0; i < numTables; i++)
           {
              tables[i] += '</ul>';
           }
           //console.log(tables.join(' '));
           document.getElementById('list').innerHTML = tables.join(' ');           
       }
   }
}
