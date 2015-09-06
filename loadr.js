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

var loadr = (function __loadr__ (doc, FUNCTION, OBJECT, STRING) {
    "use strict";
    var setArrtibute = (function loadr$_forkSetArrtibute () {
            if (typeof duc.createElement("div").setAttribute === FUNCTION) {
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
            if (typeof sheet.insertRule === FUNCTION) {
                sheet.insertRule(selector + "{" + rules + "}", 1);
            } else if (typeof sheet.addRule === FUNCTION) {
                sheet.addRule(selector, rules, 1);
            } else {
                sheet.appendChild(doc.createTextNode(selector + "{" + rules + "}"));
            }
        },
        CSS_create = function loadr$CSS_create (url) {
            var element = doc.createElement("link"),
                attributes = {
                    "type": "text/css"
                };

            if (typeof url === STRING) {
                attributes["rel"] = "stylesheet";
                attributes["href"] = url;
            }
            return setAttributes(element, attributes);
        },
        CSS_element = function loadr$CSS_element (content) {
            var element = doc.createElement("style");
            if (typeof content === STRING) {
                if (typeof element.styleSheet === OBJECT) {
                    element.styleSheet.cssText = content;
                } else {
                    element.appendChild(doc.createTextNode(content));
                }
            }
            doc.head.appendChild(element);
            return element;
        },
        CSS_rules = function loadr$CSS_rules (content) {
            var sheet = typeof doc.styleSheets === OBJECT &&
                    doc.styleSheets.length > 0 ?
                    doc.styleSheets[0] :
                    CSS_element(),
                name;
            for (name in content) {
                if (content.hasOwnProperty(name)) {
                    addRule(sheet, name, content[name]);
                }
            }
        },
        CSS_reference = function loadr$CSS_reference (content, callback) {
            var element = CSS_create(content);
            element.onload = callback;
            doc.head.appendChild(element);
        },
        CSS_references = function loadr$CSS_references (array, callback) {
            var loaded = 0;
            array.forEach(function loadr$CSS_referencesArray (item) {
                CSS_reference(item, function loadr$_CSS$referencesAdd () {
                    loaded++;
                    if (loaded === array.length && typeof callback === FUNCTION) {
                        callback();
                    }
                });
            });
        },

        JS_create = function loadr$JS_create (url) {
            var element = doc.createElement("script"),
                attributes = {
                    "type": "text/javascript"
                };
            if (typeof url === STRING) {
                attributes["src"] = url;
            }
            setAttributes(element, attributes);
            return element;
        },
        JS_element = function loadr$JS_element (content) {
            var element = JS_create();
            try {
                element.appendChild(doc.createTextNode(content));
            } catch (e) {
                element.text = content;
            }
            doc.head.appendChild(element);
        },
        JS_reference = function loadr$JS_reference (content, callback) {
            var element = JS_create(content);
            element.onload = callback;
            doc.head.appendChild(element);
        },
        JS_references = function loadr$JS_references (array, callback) {
            var loaded = 0;
            array.forEach(function loadr$_JS$referencesArray (item) {
                JS_reference(item, function loadr$JS_referencesAdd () {
                    loaded++;
                    if (loaded === array.length && typeof callback === FUNCTION) {
                        callback();
                    }
                });
            });
        },
        map = {
            styles: {
                text:  CSS_element,
                rules: CSS_rules,
                file:  CSS_reference,
                files: CSS_references
            },
            script: {
                text:  JS_element,
                file:  JS_reference,
                files: JS_references
            }
        };
    return function loadr (/* type, content, callback */) {
        var action = [].shift.call(arguments).split("/");

        if (typeof map[action[0]] === OBJECT &&
                typeof map[action[0]][action[1]] === FUNCTION) {
            return map[action[0]][action[1]].apply(null, arguments);
        }
        throw new TypeError("Invalid assignment");
    };
} (document, "function", "object", "string"));