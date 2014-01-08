// TODO refacter so all these methods are not exposed!
(function () {
    // FIXME yay global variables!
    var editor;

    HAMLToe.io = function(hamltoeEditor) {
        editor = hamltoeEditor;

        this.run = function() {
            new HAMLToe.Importer();
            new HAMLToe.Exporter();

            $( "#hamltoe-new" ).click(function() {
                $( "#hamltoe-input" ).text( "" );
                $( "#hamltoe-file" ).text( "" );
                editor.refreshPreview();
            });
        };
    };

    HAMLToe.Exporter = function() {

        var exporter = $( "#hamltoe-export" );
        exporter.onclick = function() {
            this.herf = "";
            // TODO test for a file name to use, let the user know if there's not one set and return
            this.href = "data:application/octet-stream,".concat(encodeHaml());
            var name = $( "#hamltoe-file").text();
            this.download = name == "" ? "new.haml" : name;
        };

    };

    function encodeHaml() {
        return encodeURI($( "#hamltoe-input").text());

    };

    HAMLToe.Importer = function() {
        var dropZone = document.getElementById("hamltoe-dropzone");
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', handleFileSelect, false);
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
                $( "#hamltoe-input").text( e.target.result );
                $( "#hamltoe-file").text( theFile.name );
                editor.refreshPreview();
            };
        })(file);

        // Read in the image file as a data URL.
        reader.readAsText(file);
    }

    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        // TODO maybe figure out how to turn this back on
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

})();
