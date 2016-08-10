module.exports = function(nga,chatroom) {

    // LIST VIEW
    chatroom.listView()
    .fields([
        nga.field('dt_create','datetime')
            .label('Created'),
        nga.field('id')
    ])
    .listActions(['show','edit','delete']);

    // SHOW VIEW
    chatroom.showView()
    .fields([
        nga.field('owner'),
        nga.field('dt_create')
            .label('Created'),
        nga.field('dt_update')
            .label('Last Updated'),
        nga.field('key'),
        nga.field('room'),
        nga.field('sessionID'),
        /*nga.field('messages','embedded_list') // Define a 1-N relationship with the (embedded) comment entity
          .targetFields([ // which comment fields to display in the datagrid / form
              nga.field('message')
          ])*/
        nga.field('messages','json')
    ])

    // CREATION VIEW
    chatroom.creationView()
    .fields([
        nga.field('key')
            //.uploadInformation({ 'url': 'your_url', 'apifilename': 'picture_name' })
            ,
        nga.field('messages'),
        nga.field('room'),
        nga.field('sessionID'),
        nga.field('url')
    ])

    // EDITION VIEW
    chatroom.editionView()
    .fields(chatroom.creationView().fields())

    return chatroom;

};