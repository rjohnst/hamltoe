(function () {

    HAMLToe.Exporter = function() {
        var exporter = document.getElementById("hamltoe-export");

        exporter.onclick = function() {
            this.herf = "";
            // TODO test for a file name to use, let the user know if there's not one set and return
            this.href = "data:application/octet-stream,".concat(encodeHaml());
            this.download = "wakka.txt";
        };

    };

    function encodeHaml() {
        return encodeURI(document.getElementById("hamltoe-input").value);
    };

})();
