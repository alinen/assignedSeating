function readCSV(f)
{
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
      var dropZone = document.getElementById('drop_zone');
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
