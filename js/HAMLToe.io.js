(function () {

    HAMLToe.Exporter = function() {
        var exporter = document.getElementById("hamltoe-export");

        exporter.onclick = function() {
            this.herf = "";
            // TODO test for a file name to use, let the user know if there's not one set and return
            this.href = "data:application/octet-stream,".concat(encodeHaml());
            this.download = document.getElementById('hamltoe-file').innerText;
        };

    };

    function encodeHaml() {
        return encodeURI(document.getElementById("hamltoe-input").value);
    };

    // FIXME yay global variables!
    var editor;

    HAMLToe.Importer = function(hamltoeEditor) {
        var dropZone = document.getElementById('hamltoe-dropzone');
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', handleFileSelect, false);
        editor = hamltoeEditor;
    };

    function handleFileSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        var file = evt.dataTransfer.files[0]; // should only ever be one file hopefully
        // TODO validate the file is haml

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                document.getElementById('hamltoe-file').innerText = theFile.name;
                document.getElementById('hamltoe-input').innerText = e.target.result;
                editor.refreshPreview();
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
