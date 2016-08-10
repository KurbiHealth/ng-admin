module.exports = function(nga,chatbox) {

    // LIST VIEW
    chatbox.listView()
    .fields([
        nga.field('dt_create','datetime')
            .label('Created')
    ])
    .listActions(['show','edit','delete']);

    // SHOW VIEW
    chatbox.showView()
    .fields([
        nga.field('owner'),
        nga.field('dt_create','datetime')
            .label('Created'),
        nga.field('dt_update','datetime')
            .label('Last Updated'),
        nga.field('html'),
        nga.field('css'),
        nga.field('js')
        // relate concept
    ])

    // CREATION VIEW
    chatbox.creationView()
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
    chatbox.editionView()
    .fields(chatbox.creationView().fields())

    return chatbox;

};