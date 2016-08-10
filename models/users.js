module.exports = function(nga,users) {

    // LIST VIEW
    users.listView()
    .fields([
        nga.field('id'),
        nga.field('displayName'),
        nga.field('email')
    ])
    .listActions(['show','edit','delete']);

    // SHOW VIEW
    users.showView()
    .fields([
        nga.field('id'),
        nga.field('dt_create'),
        nga.field('dt_update'),
        nga.field('firstName'),
        nga.field('lastName'),
        nga.field('displayName'),
        nga.field('email'),
        nga.field('givenRole'),
        nga.field('pictures','embedded_list')
            .targetFields([
                nga.field('google'),
                nga.field('facebook')
            ]),
        nga.field('identities','embedded_list')
            .targetFields([
                nga.field('google'),
                nga.field('facebook')
            ])
    ]);

    // CREATION VIEW
    users.creationView()
    .fields([
        nga.field('firstName'),
        nga.field('lastName'),
        nga.field('displayName'),
        nga.field('email')
    ]);

    // EDITION VIEW
    users.editionView()
    .fields(users.creationView().fields());

    return users;

};