var HAMLToe = {};

(function () {
    HAMLToe.Converter = function () {
        this.makeHtml = function (text) {
            return haml.compileHaml(text);
        }
    }

    var util = {},
            position = {},
            ui = {},
            doc = window.document,
            re = window.RegExp,
            nav = window.navigator,
            SETTINGS = { lineLength: 72 },

    // Used to work around some browser bugs where we can't use feature testing.
            uaSniffed = {
                isIE: /msie/.test(nav.userAgent.toLowerCase()),
                isIE_5or6: /msie 6/.test(nav.userAgent.toLowerCase()) || /msie 5/.test(nav.userAgent.toLowerCase()),
                isOpera: /opera/.test(nav.userAgent.toLowerCase())
            };

    HAMLToe.Editor = function (hamltoeConverter) {
        this.getConverter = function () { return hamltoeConverter; }

        var that = this,
                panels;

        this.run = function () {
            if (panels)
                return; // already initialized

            panels = new PanelCollection();

            // TODO add command manager here
            var previewManager = new PreviewManager(hamltoeConverter, panels);
            // TODO add ui manager here

            var forceRefresh = that.refreshPreview = function () { previewManager.refresh(true); };

            forceRefresh();
        }
    }

    function PanelCollection() {
        // TODO this.buttonBar = doc.getElementById("wmd-button-bar");
        this.preview = doc.getElementById("hamltoe-preview");
        this.input = doc.getElementById("hamltoe-input");
    };

    function PreviewManager(converter, panels) {

        var managerObj = this;
        var timeout;
        var elapsedTime;
        var oldInputText;
        var maxDelay = 3000;
        var startType = "delayed"; // The other legal value is "manual"

        var getDocScrollTop = function () {

            var result = 0;

            if (window.innerHeight) {
                result = window.pageYOffset;
            }
            else
            if (doc.documentElement && doc.documentElement.scrollTop) {
                result = doc.documentElement.scrollTop;
            }
            else
            if (doc.body) {
                result = doc.body.scrollTop;
            }

            return result;
        };

        var makePreviewHtml = function () {

            // If there is no registered preview panel
            // there is nothing to do.
            if (!panels.preview)
                return;


            var text = panels.input.value;
            if (text && text == oldInputText) {
                return; // Input text hasn't changed.
            }
            else {
                oldInputText = text;
            }

            var prevTime = new Date().getTime();

            text = converter.makeHtml(text);

            // Calculate the processing time of the HTML creation.
            // It's used as the delay time in the event listener.
            var currTime = new Date().getTime();
            elapsedTime = currTime - prevTime;

            pushPreviewHtml(text);
        };

        // setTimeout is already used.  Used as an event listener.
        var applyTimeout = function () {

            if (timeout) {
                clearTimeout(timeout);
                timeout = undefined;
            }

            if (startType !== "manual") {

                var delay = 0;

                if (startType === "delayed") {
                    delay = elapsedTime;
                }

                if (delay > maxDelay) {
                    delay = maxDelay;
                }
                timeout = setTimeout(makePreviewHtml, delay);
            }
        };

        var getScaleFactor = function (panel) {
            if (panel.scrollHeight <= panel.clientHeight) {
                return 1;
            }
            return panel.scrollTop / (panel.scrollHeight - panel.clientHeight);
        };

        var setPanelScrollTops = function () {
            if (panels.preview) {
                panels.preview.scrollTop = (panels.preview.scrollHeight - panels.preview.clientHeight) * getScaleFactor(panels.preview);
            }
        };

        this.refresh = function (requiresRefresh) {

            if (requiresRefresh) {
                oldInputText = "";
                makePreviewHtml();
            }
            else {
                applyTimeout();
            }
        };

        this.processingTime = function () {
            return elapsedTime;
        };

        var isFirstTimeFilled = true;

        // IE doesn't let you use innerHTML if the element is contained somewhere in a table
        // (which is the case for inline editing) -- in that case, detach the element, set the
        // value, and reattach. Yes, that *is* ridiculous.
        var ieSafePreviewSet = function (text) {
            var preview = panels.preview;
            var parent = preview.parentNode;
            var sibling = preview.nextSibling;
            parent.removeChild(preview);
            preview.innerHTML = text;
            if (!sibling)
                parent.appendChild(preview);
            else
                parent.insertBefore(preview, sibling);
        }

        var nonSuckyBrowserPreviewSet = function (text) {
            panels.preview.innerHTML = text;
        }

        var previewSetter;

        var previewSet = function (text) {
            if (previewSetter)
                return previewSetter(text);

            try {
                nonSuckyBrowserPreviewSet(text);
                previewSetter = nonSuckyBrowserPreviewSet;
            } catch (e) {
                previewSetter = ieSafePreviewSet;
                previewSetter(text);
            }
        };

        var pushPreviewHtml = function (text) {

            var emptyTop = position.getTop(panels.input) - getDocScrollTop();

            if (panels.preview) {
                previewSet(text);
            }

            setPanelScrollTops();

            if (isFirstTimeFilled) {
                isFirstTimeFilled = false;
                return;
            }

            var fullTop = position.getTop(panels.input) - getDocScrollTop();

            if (uaSniffed.isIE) {
                setTimeout(function () {
                    window.scrollBy(0, fullTop - emptyTop);
                }, 0);
            }
            else {
                window.scrollBy(0, fullTop - emptyTop);
            }
        };

        var init = function () {

            makePreviewHtml();

            if (panels.preview) {
                panels.preview.scrollTop = 0;
            }
        };

        init();
    };

})();

