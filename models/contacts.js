module.exports = function(nga,contacts) {

    // LIST VIEW
    contacts.listView()
    .fields([
        nga.field('dt_create','datetime')
            .label('Created')
            .format('short'),
        nga.field('email')
    ])
    .listActions(['show','delete']);

    // SHOW VIEW
    contacts.showView()
    .fields([
        nga.field('owner'),
        nga.field('dt_create')
            .label('Created'),
        nga.field('email')
    ])

    return contacts;

};