(function () {

    HAMLToe.Importer = function() {
        var dropZone = document.getElementById('hamltoe-dropzone');
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', handleFileSelect, false);
    };

    function handleFileSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        var files = evt.dataTransfer.files; // FileList object.
        // TODO validate the file is haml
        // TODO can we just get one file from the drop?

        document.getElementById('hamltoe-file').innerText = "editing ".concat(escape(files[0].name));
    }

    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }
})();
