module.exports = function(nga,customization) {

    // LIST VIEW
    customization.listView()
    .fields([
        nga.field('id'),
        nga.field('dt_create')
            .label('Created'),
        nga.field('chat_avatar'),
        nga.field('chat_url')
    ])
    .listActions(['show','edit','delete']);

    // SHOW VIEW
    customization.showView()
    .fields([
        nga.field('owner'),
        nga.field('dt_create')
            .label('Created'),
        nga.field('dt_update')
            .label('Last Updated'),
        nga.field('chat_avatar'),
        nga.field('chat_color'),
        nga.field('chat_headline'),
        nga.field('chat_snippet'),
        nga.field('chat_url')
        // relate concept
    ])

    // CREATION VIEW
    customization.creationView()
    .fields([
        nga.field('chat_avatar','file')
            //.uploadInformation({ 'url': 'your_url', 'apifilename': 'picture_name' })
            ,
        nga.field('chat_color'),
        nga.field('chat_headline'),
        nga.field('chat_snippet'),
        nga.field('chat_url')
    ])

    // EDITION VIEW
    customization.editionView()
    .fields(customization.creationView().fields())

    return customization;

};