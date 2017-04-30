var gElementId = 1;
var guestList = [];
var nameToId = {}
var friends = [];
var enemies = [];

function onLoad()
{
   initFileReader();
	createTables();
}

function createTables()
{
   clearTables();
   var numTables = document.getElementById('NumTablesInput').value;
   var numPerTable = document.getElementById('NumPerTableInput').value;

	for (var i = 0; i < numTables; i++)
	{
		createTable(i, numPerTable);
	}
}

function clearTables()
{
   var tablesDiv = document.getElementById("tablesRow");
	clearRowDiv(tablesDiv);
}

function createTable(id, numPerTable)
{
   var name = "table"+id;
   console.log("createTable "+name);
   var newList = "";
   newList += '<div id="'+name+ '" >';
   newList += '<input id="'+name+'" class="listInput" type="number" value="'+numPerTable+'">';
   newList += '<ul class="droplist" ondrop="drop(event)" ondragover="allowDrop(event)"></ul>';

   var row = document.getElementById('tablesRow');
   row.insertAdjacentHTML('beforeend', newList);

	for (var i = 0; i < numPerTable; i++)
	{
      newList += '<li id="empty" class="droplistitem" draggable=true ondragstart="drag(event)"></li>';
		
	}
   newList += '</div>';

   var ulLists = row.querySelectorAll('ul.droplist');
   return ulLists[ulLists.length-1];
}

function setGuestList()
{
   var listHTML = '';
   for (var i = 0; i < guestList.length; i++)
   {
      var name = guestList[i].trim();
      if (name === "") continue;
      listHTML += '<li id="'+name+'" class="droplistitem" draggable=true ondragstart="drag(event)">'+name+'</li>';
   }

   document.getElementById('guestlist').innerHTML = listHTML;
}

function addKeepTogether()
{
   var name = "keepTogether"+gElementId;
   gElementId++;
   //console.log("addKeepTogether "+name);
   var newList = "";
   newList += '<div id="'+name+ '" >';
   newList += '<ul class="droplist" ondrop="drop(event)" ondragover="allowDrop(event)"></ul>';
   newList += '<button id="'+name+'" class="removeButton" onclick="removeKeepTogether(event)">X</button>';
   newList += '</div>';

   var row = document.getElementById('keepTogetherRow');
   row.insertAdjacentHTML('beforeend', newList);

   var ulLists = row.querySelectorAll('ul.droplist');
   return ulLists[ulLists.length-1];
}

function addKeepSeparate()
{
   var name = "keepSeperate"+gElementId;
   gElementId++;
   console.log("addKeepSeparate "+name);
   var newList = "";
   newList += '<div id="'+name+'">';
   newList += '<ul class="droplist" ondrop="drop(event)" ondragover="allowDrop(event)">';
   newList += '</ul>';
   newList += '<button id="'+name+'" class="removeButton" onclick="removeKeepSeparate(event)">X</button>';
   newList += '</div>';

	var row = document.getElementById('keepSeparateRow');
   row.insertAdjacentHTML('beforeend', newList);

   var ulLists = row.querySelectorAll('ul.droplist');
   return ulLists[ulLists.length-1];
}

function allowDrop(ev)
{
   ev.preventDefault();
}

function drag(ev)
{
   ev.dataTransfer.setData("GuestName", ev.target.id);
}

function drop(ev)
{
   ev.preventDefault();
   var guestName = ev.dataTransfer.getData("GuestName");

   var dropTarget = ev.target;
   if (dropTarget.tagName === "LI") dropTarget = dropTarget.parentNode;

   //console.log(guestName+ " "+element.tagName+" "+target.tagName);

   addGuestNameToList(dropTarget, guestName);
}

function addGuestNameToList(ulList, guestName)
{
   var element = document.getElementById(guestName);

   var hasElement = false;
   var liList = ulList.getElementsByTagName('li');
   for (var i = 0; i < liList.length && !hasElement; i++)
   {
      var name = liList[i].id;
      if (name === guestName)
      {
          hasElement = true;
          console.log("Duplicate, ignoring "+name);
      }
   }

   if (!hasElement)
   {
      var newElement = element.cloneNode(true);
      ulList.appendChild(newElement);
   }
}

function clearRowDiv(parent)
{
   while (parent.hasChildNodes())
	{
		parent.removeChild(parent.lastChild);
	}
}

function removeKeepTogether(event)
{
   var divName = event.target.id;
   var parent = document.getElementById("keepTogetherRow");
   //console.log("KEEP TOGETHER "+divName+" "+parent.id);
   var divEle = document.getElementById(divName);
   parent.removeChild(divEle);
}

function removeKeepSeparate(event)
{
   var divName = event.target.id;
   var parent = document.getElementById("keepSeparateRow");
   //console.log("KEEP SEPARATE "+divName+" "+parent.id);
   var divEle = document.getElementById(divName);
   parent.removeChild(divEle);
}

function readGuestListCSV(f)
{
    //ASN TODO: The following is not cross platform
   //if (f.type.match('text/csv')) 
   {
      guestList = [];
		nameToId = {};
      togetherConstraints = [];
      separatedConstraints = [];
      var reader = new FileReader();
      reader.onload = (function(fileContents) 
      {
         return function(e) 
         {
            var output = e.target.result.split('\n');
            for (var i = 0; i < output.length; i++)
            {
               var name = output[i].trim();
               if (name === "") continue;
               if (name[0] === '+') togetherConstraints.push(name);
               else if (name[0] === '-') separatedConstraints.push(name);
               else 
               {
                  guestList.push(name);
						nameToId[name] = guestList.length-1;
               }
            }
            setGuestList();

   			var keepTogether = document.getElementById("keepTogetherRow");
            clearRowDiv(keepTogether);
            for (var i = 0; i < togetherConstraints.length; i++)
            {
					addKeepTogetherConstraint(togetherConstraints[i]);
				}

   			var keepSeparate = document.getElementById("keepSeparateRow");
            clearRowDiv(keepSeparate);
            for (var i = 0; i < separatedConstraints.length; i++)
            {
					addKeepSeparatedConstraint(separatedConstraints[i]);
				}
         };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsText(f);
   }
   //else
   //{
      //alert("Only CSV files are supported.");
   //}
}

function handleBrowseGuestList(evt) 
{
   var files = evt.target.files; // FileList object
   if (files.length > 0)
   {
      readGuestListCSV(files[0]);
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

function initFileReader()
{
   // Check for the various File API support.
   if (window.File && window.FileReader && window.FileList && window.Blob) 
   {
      var fileButton = document.getElementById('browseButton');
      fileButton.addEventListener('change', handleBrowseGuestList, false);
   } 
   else 
   {
      alert('AssignedSeating requires File APIs (not fully supported in this browser).');
   }   
}

function getConstraints(rowDiv)
{
	constraints = [];
   for (var i = 0; i < rowDiv.children.length; i++)
	{
		var div = rowDiv.children[i];
      var names = div.querySelectorAll("li.droplistitem");
      if (names.length < 2) continue; 
      
      for (var ii = 0; ii < names.length; ii++)
		{
			var namei = names[ii].id;
			var idi = nameToId[namei];
      	for (var jj = ii+1; jj < names.length; jj++)
			{
            var namej = names[jj].id; 
				var idj = nameToId[namej];
				constraints.push([idi, idj]);
			}
		}
	}
	return constraints;
}

function getConstraintString(rowDiv, prefix)
{
   var contents = "";
   for (var i = 0; i < rowDiv.children.length; i++)
	{
		var div = rowDiv.children[i];
      var names = div.querySelectorAll("li.droplistitem");
      if (names.length < 2) continue; 
      contents += prefix; // todo: get strength from list
      for (var j = 0; j < names.length; j++)
		{
			contents += ","+names[j].id;
		}
      contents += "\n";
	}
	return contents;
}

function onSaveConstraints()
{
   if (guestList.length < 2) return;

   // Output guest list and constraints
   // They both can be reloaded together on next Browse load
	var contents = "";
   for (var i = 0; i < guestList.length; i++)
	{
		contents += guestList[i]+"\n";
	}

   var keepTogetherRow = document.getElementById("keepTogetherRow");
   contents += getConstraintString(keepTogetherRow, "+1");

   var keepSeparateRow = document.getElementById("keepSeparateRow");
   contents += getConstraintString(keepSeparateRow, "-1");

   var blob = new Blob([contents], {type: "text/csv;charset=utf-8"});
   var a = document.createElement("a");
   var url = URL.createObjectURL(blob);
   a.href = url;
   a.download = "guestsWithConstraints.csv";
   document.body.appendChild(a);
   a.click();
   setTimeout(function() {
       document.body.removeChild(a);
       window.URL.revokeObjectURL(url);
   }, 0);
}

function addKeepSeparatedConstraint(constraintStr)
{
	var ulList = addKeepSeparate();

   // tokenize string by comma
   var tokens = constraintStr.split(",");
   // TODO: First item is the strength of the constraint +1, +2
   for (var i = 1; i < tokens.length; i++)
	{
		addGuestNameToList(ulList, tokens[i]);
	}	
}

function addKeepTogetherConstraint(constraintStr)
{
	var ulList = addKeepTogether();

   // tokenize string by comma
   var tokens = constraintStr.split(",");
   // TODO: First item is the strength of the constraint +1, +2
   for (var i = 1; i < tokens.length; i++)
	{
		addGuestNameToList(ulList, tokens[i]);
	}	
}

function fetchTableSizes()
{
	var tablesRow = document.getElementById("tablesRow");
   var tableSizes = tablesRow.querySelectorAll("input.listInput");
   if (tableSizes.length === 0)
	{
		console.log("WARNING: tableSizes is empty");
		return "";
	}

   var sizeArrayStr = tableSizes[0].value;
   for (var s = 1; s < tableSizes.length; s++)
	{
		sizeArrayStr += "," + tableSizes[s].value;
	}
	return sizeArrayStr;
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
   var requestUrl = 'aseat/api/v1.0/assign/'+numTables+':'+fetchTableSizes()+':'+guestList.length+':';
   //console.log(requestUrl);

   var keepTogetherRow = document.getElementById("keepTogetherRow");
   var keepTogetherConstraints = getConstraints(keepTogetherRow);
	requestUrl += keepTogetherConstraints.length+':';
   for (var i = 0; i < keepTogetherConstraints.length; i++)
   {
       requestUrl += keepTogetherConstraints[i][0]+',';
       requestUrl += keepTogetherConstraints[i][1]+',';
   }

   var keepSeparateRow = document.getElementById("keepSeparateRow");
   var keepSeparateConstraints = getConstraints(keepSeparateRow);
	requestUrl += ':'+keepSeparateConstraints.length+':';
   for (var i = 0; i < keepSeparateConstraints.length; i++)
   {
       requestUrl += keepSeparateConstraints[i][0]+',';
       requestUrl += keepSeparateConstraints[i][1]+',';
   }

	//console.log(requestUrl);

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
