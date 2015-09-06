/*
// Usage
//
// loadr("styles/text", @String css);
// loadr("styles/rules", @Object styles);
// loadr("styles/file", @String URL, @Function callback);
// loadr("styles/files", @String URL, @Function callback);
// loadr("script/text", @String script);
// loadr("script/file", @String URL, @Function callback);
// loadr("script/files", @String URL, @Function callback);
//
// Styles rules object example: {
//     ".myDiv": "color:blue; border:1px solid green;"
// }
*/

var loadr = (function __loadr__ (doc) {
    "use strict";
    var setArrtibute = (function loadr$_forkSetArrtibute () {
            if (typeof document.createElement("div").setAttribute === "function") {
                return function loadr$_setArrtibute (element, name, value) {
                    element.setAttribute(name, value);
                };
            } else {
                return function loadr$_setArrtibute (element, name, value) {
                    element[name] = value;
                };
            }
        }()),
        setAttributes = function loadr$_setAttributes (element, attributes) {
            var name;
            for (name in attributes) {
                if (attributes.hasOwnProperty(name)) {
                    setArrtibute(element, name, attributes[name]);
                }
            }
            return element;
        },
        addRule = function loadr$_addRule (sheet, selector, rules) {
            if (typeof sheet.insertRule === "function") {
                sheet.insertRule(selector + "{" + rules + "}", 1);
            } else if (typeof sheet.addRule === "function") {
                sheet.addRule(selector, rules, 1);
            } else {
                sheet.appendChild(doc.createTextNode(selector + "{" + rules + "}"));
            }
        },
        CSS = {
            create: function loadr$_CSS$create (url) {
                var element = doc.createElement("link"),
                    attributes = {
                        "type": "text/css"
                    };

                if (typeof url === "string") {
                    attributes["rel"] = "stylesheet";
                    attributes["href"] = url;
                }
                return setAttributes(element, attributes);
            },
            element: function loadr$_CSS$element (content) {
                var element = document.createElement("style");
                if (typeof content === "string") {
                    if (typeof element.styleSheet === "object") {
                        element.styleSheet.cssText = content;
                    } else {
                        element.appendChild(doc.createTextNode(content));
                    }
                }
                doc.head.appendChild(element);
                return element;
            },
            rules: function loadr$_CSS$rules (content) {
                var sheet,
                    name;
                if (typeof doc.styleSheets === "object" &&
                        doc.styleSheets.length > 0) {
                    sheet = doc.styleSheets[0];
                } else {
                    sheet = CSS.element();
                }
                for (name in content) {
                    if (content.hasOwnProperty(name)) {
                        addRule(sheet, name, content[name]);
                    }
                }
            },
            reference: function loadr$_CSS$reference (content, callback) {
                var element = CSS.create(content);
                element.onload = callback;
                doc.head.appendChild(element);
            },
            references: function loadr$_CSS$references (array, callback) {
                var loaded = 0;
                array.forEach(function loadr$_CSS$referencesArray (item) {
                    CSS.reference(item, function loadr$_CSS$referencesAdd () {
                        loaded++;
                        if (loaded === array.length && typeof callback === "function") {
                            callback();
                        }
                    });
                });
            }
        },
        JS = {
            create: function loadr$_JS$create (url) {
                var element = doc.createElement("script"),
                    attributes = {
                        "type": "text/javascript"
                    };
                if (typeof url === "string") {
                    attributes["src"] = url;
                }
                setAttributes(element, attributes);
                return element;
            },
            element: function loadr$_JS$element (content) {
                var element = JS.create();
                try {
                    element.appendChild(doc.createTextNode(content));
                } catch (e) {
                    element.text = content;
                }
                doc.head.appendChild(element);
            },
            reference: function loadr$_JS$reference (content, callback) {
                var element = JS.create(content);
                element.onload = callback;
                doc.head.appendChild(element);
            },
            references: function loadr$_JS$references (array, callback) {
                var loaded = 0;
                array.forEach(function loadr$_JS$referencesArray (item) {
                    JS.reference(item, function loadr$_JS$referencesAdd () {
                        loaded++;
                        if (loaded === array.length && typeof callback === "function") {
                            callback();
                        }
                    });
                });
            }
        },
        map = {
            styles: {
                text:  CSS.element,
                rules: CSS.rules,
                file:  CSS.reference,
                files: CSS.references
            },
            script: {
                text:  JS.element,
                file:  JS.reference,
                files: JS.references
            }
        };
    return function loadr (/* type, content, callback */) {
        var action = [].shift.call(arguments).split("/");

        if (typeof map[action[0]] === "object" &&
                typeof map[action[0]][action[1]] === "function") {
            return map[action[0]][action[1]].apply(null, arguments);
        }
        throw new TypeError("Invalid assignment");
    };
} (document));