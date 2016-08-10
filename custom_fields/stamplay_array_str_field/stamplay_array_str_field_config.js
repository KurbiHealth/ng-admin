module.exports = function() {

    var EmbeddedListField = require('admin-config/lib/Field/EmbeddedListField');

    class StamplayArrayStrField extends EmbeddedListField {
        constructor(name) {
            super(name);
            this._jsonParse = false;
            this._type = "stamplayarraystrings";
        }

        // attempt to convert all strings to objects, true or false
        jsonParse(trueFalse) {
            if (!arguments.length) return this._jsonParse;
            this._jsonParse = trueFalse;
            return this;
        }

        // add css attribs based on an object key/value
        cssFieldAttrib(field,css){

            return this;
        }
    }

    return StamplayArrayStrField;

}