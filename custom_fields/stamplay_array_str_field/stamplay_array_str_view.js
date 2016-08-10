/*export default {
	// displayed in listView and showView
    getReadWidget:   () => '<pagezone-list field="::field" datastore="::datastore" value="::entry.values[field.name()]"></pagezone-list>',
    // displayed in listView and showView when isDetailLink is true
    getLinkWidget:   () => '<a ng-click="gotoDetail()">' + module.exports.getReadWidget() + '</a>',
    // displayed in the filter form in the listView
    getFilterWidget: () => '<ma-input-field type="number" field="::field" value="values[field.name()]"></ma-input-field>',
    // displayed in editionView and creationView
    getWriteWidget:  () => '<ma-input-field type="number" field="::field" value="entry.values[field.name()]"></ma-input-field>'
}*/

//export default 

module.exports = function() {

	var returnObj = {
	    getReadWidget:   () => '<stamplay-arr-strings field="::field" value="::value" datastore="::datastore"></ma-embedded-list-column>',
	    getLinkWidget:   () => 'error: cannot display referenced_list field as linkable',
	    getFilterWidget: () => 'error: cannot display referenced_list field as filter',
	    getWriteWidget:  () => '<stamplay-arr-strings field="::field" value="value" datastore="::datastore"></ma-embedded-list-field>'
	}

	return returnObj;

}