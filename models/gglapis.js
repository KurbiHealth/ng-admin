module.exports = function(nga,apis) {

    // LIST VIEW
    apis.listView()
    .fields([
        nga.field('title')
            .cssClasses(['google-apis-discovery-title'])
            .template('<a href="{{entry.values.discoveryRestUrl}}" target="_blank">{{entry.values.title}} - {{entry.values.version}}</a>'),
        nga.field('description')
    ])
    .title('Available Google API\'s')
    .sortField('title');

    return apis;

};