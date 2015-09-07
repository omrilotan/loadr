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
            if (typeof doc.createElement("div").setAttribute === FUNCTION) {
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
        css_create = function loadr$css_create (url) {
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
        css_element = function loadr$css_element (content) {
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
        css_rules = function loadr$css_rules (content) {
            var sheet = typeof doc.styleSheets === OBJECT &&
                    doc.styleSheets.length > 0 ?
                    doc.styleSheets[0] :
                    css_element(),
                name;
            for (name in content) {
                if (content.hasOwnProperty(name)) {
                    addRule(sheet, name, content[name]);
                }
            }
        },
        css_reference = function loadr$css_reference (content, callback) {
            var element = css_create(content);
            element.onload = callback;
            doc.head.appendChild(element);
        },
        css_references = function loadr$css_references (array, callback) {
            var loaded = 0;
            array.forEach(function loadr$css_referencesArray (item) {
                css_reference(item, function loadr$_CSS$referencesAdd () {
                    loaded++;
                    if (loaded === array.length && typeof callback === FUNCTION) {
                        callback();
                    }
                });
            });
        },

        js_create = function loadr$js_create (url) {
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
        js_element = function loadr$js_element (content) {
            var element = js_create();
            try {
                element.appendChild(doc.createTextNode(content));
            } catch (e) {
                element.text = content;
            }
            doc.head.appendChild(element);
        },
        js_reference = function loadr$js_reference (content, callback) {
            var element = js_create(content);
            element.onload = callback;
            doc.head.appendChild(element);
        },
        js_references = function loadr$js_references (array, callback) {
            var loaded = 0;
            array.forEach(function loadr$_JS$referencesArray (item) {
                js_reference(item, function loadr$js_referencesAdd () {
                    loaded++;
                    if (loaded === array.length && typeof callback === FUNCTION) {
                        callback();
                    }
                });
            });
        },
        map = {
            styles: {
                text:  css_element,
                rules: css_rules,
                file:  css_reference,
                files: css_references
            },
            script: {
                text:  js_element,
                file:  js_reference,
                files: js_references
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