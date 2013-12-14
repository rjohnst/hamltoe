(function () {

    HAMLToe.Importer = function() {
        var dropZone = document.getElementById('hamltoe-dropzone');
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', handleFileSelect, false);
    };

    function handleFileSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        var file = evt.dataTransfer.files[0]; // FileList object.
        // TODO validate the file is haml

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                document.getElementById('hamltoe-file').innerText = "editing ".concat(escape(theFile.name));
                document.getElementById('hamltoe-input').innerText = e.target.result;
            };
        })(file);

        // Read in the image file as a data URL.
        reader.readAsText(file);
    }

    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }
})();
