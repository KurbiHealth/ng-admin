module.exports = function(nga,articles) {

    // LIST VIEW
    articles.listView()
    .fields([
        nga.field('dt_create','datetime')
            .label('Created'),
        nga.field('id'),
        nga.field('author')
    ])
    .listActions(['show','edit','delete']);

    // SHOW VIEW
    articles.showView()
    .fields([
        nga.field('owner')
        ,nga.field('dt_create')
            .label('Created')
        ,nga.field('dt_update')
            .label('Last Updated')
        ,nga.field('author')
        ,nga.field('body','wysiwyg')
        /*,nga.field('conversation_id','reference').targetField('messages')*/
    ])

    // CREATION VIEW
    articles.creationView()
    .fields([
        nga.field('author'),
        nga.field('body')
    ])

    // EDITION VIEW
    articles.editionView()
    .fields(articles.creationView().fields())

    return articles;

};