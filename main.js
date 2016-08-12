/***************************************
 * INITIALIZE THE APPLICATION
 ***************************************/

var myApp = angular.module('myApp', 
    [
        'ng-admin',
        'ngSanitize',
        "com.2fdevs.videogular",
            "com.2fdevs.videogular.plugins.controls",
            "info.vietnamcode.nampnq.videogular.plugins.youtube"
    ]
);

/***************************************
 * PRE-RESTANGULAR INTERCEPTOR FUNCTIONS
 ***************************************/

myApp.config(function ($httpProvider) {
    
    // USING 'unshift' TO RUN THESE FUNCTIONS FIRST!!!!
    $httpProvider.interceptors.unshift(addContentTypeToHeader);

    // Angular removes the header 'Content-Type' if request is GET.
    // This function is a hack to add the header back in, because some API's require the header.
    function addContentTypeToHeader() {
        return {
            request : requestInterceptor
        };

        function requestInterceptor(config) {
            if (angular.isDefined(config.headers['Content-Type']) && !angular.isDefined(config.data))
                config.data = '';

            return config;
        }
    }

    // these functions run in regular order (prior to Restangular interceptors)
    $httpProvider.interceptors.push(removeStamplayFields);

    // When NG-Admin does a list GET, it receives all fields for that data model, and those fields
    // persist in the dataStore, even if the editionView only defines a couple of fields. Which means
    // that the un-editable fields in Stamplay must be removed before doing a PUT
    function removeStamplayFields($q) {
        return {
            request : function(config) {
                config = angular.copy(config);

                if(config.method === 'PUT'){
                    delete config.data.__v;
                    delete config.data._id;
                    delete config.data.appId;
                    delete config.data.cobjectId;
                    delete config.data.dt_create;
                    delete config.data.dt_update;
                    delete config.data.id;
                    delete config.data.actions;
                }

                return config || $q.when(config);
            }
        };
    }
});


/***************************************
 * RESTANGULAR INTERCEPTOR FUNCTIONS
 ***************************************/

myApp.config(function(RestangularProvider) {

    var token = window.localStorage.getItem("http://kpadmin-jwt");
    if(typeof token == 'object' && token == null){
        token = '';
    }else{
        token = token.replace(/"/g,'');
        token = token.toString();
    }

    RestangularProvider.setDefaultHeaders({
        "Content-Type": 'application/json; charset=utf-8',
        "x-stamplay-jwt": token
    });
  
    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, 
        headers, params, httpConfig) {
        console.log('url',url); 
        console.log('element: ',element);
        console.log('operation: ',operation);
        console.log('what: ',what);
        //console.log('headers: ',headers);
        //console.log('params: ',params);
        //console.log('httpConfig',httpConfig);

        // FIX PAGINATION
        // STAMPLAY'S FORMAT == n=21&page=2&per_page=10
        if(url.indexOf('stamplay') > -1){
            if (operation == 'getList') {
                params.page = params._page;
                params.per_page = params._perPage;
                if(params._sortField != ''){
                    params.sort = '';
                    if(params._sortDir == 'DESC') params.sort = '-';
                     params.sort += params._sortField;
                }
                delete params._page;
                delete params._perPage;
                delete params._sortField;
                delete params._sortDir;
            }
        }
        if(what == 'apis'){
            delete params._page;
            delete params._perPage;
            delete params._sortField;
            delete params._sortDir;
        }
        return { element: element, params: params };
    });
  
    RestangularProvider.addResponseInterceptor(function(data,operation,what,url,response,deferred){

        var newResponse = response;
        console.log('Response',response);
        //console.log(typeof response.data.data);
        console.log('Data',data);

        // ADJUST STAMPLAY'S STRUCTURE TO MATCH WHAT NG-ADMIN EXPECTS
        if(url.indexOf('stamplay') > -1){
            if('data' in response.data){
                var newData = response.data.data;
                if(newData.length > 0){
                    newResponse = response.data.data;
                }else{
                    newResponse = [];
                }
            }else{
                newResponse = response.data;
            }

            // FIX PAGINATION
            if (operation == "getList") {
                var contentRange = data.pagination.total_elements;
    console.log(contentRange);
                response.totalCount = contentRange;
            }
        }

        if(url.indexOf('googleapis\.com\/discovery') > -1){
            newResponse = data.items;
        }

        return newResponse;

    });

});


/***************************************
 * DEFINE DATA ENTITIES
 ***************************************/

//import Field from 'admin-config/lib/Field/Field';
myApp.config(['NgAdminConfigurationProvider', function(nga) {

    // create the default admin application
    // ==================================================
    
    var admin = nga
        .application('Kurbi Provider Admin')
        .baseApiUrl('https://kurbi.stamplayapp.com/api/cobject/v1/');


    // add entities
    // ==================================================

    // users (https://bkschool.stamplayapp.com/api/user/v1/)
    var createUser = require('./models/users');
    var userEntity = nga.entity('users').baseApiUrl('https://kurbi.stamplayapp.com/api/user/v1/');

    // customization (of chatbox)
    var createCustomization = require('./models/customization');
    var customization = nga.entity('customization');

    // chatbox
    var createChatbox = require('./models/chatbox');
    var chatbox = nga.entity('chatbox');

    // chatroom
    var createChatroom = require('./models/chatroom');
    var chatroom = nga.entity('chatroom');
    
    // articles
    var createArticles = require('./models/articles');
    var articles = nga.entity('articles');
    
    // google api list
    var createGglapis = require('./models/gglapis');
    var gglApis = nga.entity('apis').baseApiUrl('https://www.googleapis.com/discovery/v1/');
    
    // contacts
    var createContacts = require('./models/contacts');
    var contacts = nga.entity('contacts');

    admin.addEntity(createUser(nga,userEntity));
    admin.addEntity(createCustomization(nga,customization));
    admin.addEntity(createChatbox(nga,chatbox));
    admin.addEntity(createChatroom(nga,chatroom));
    admin.addEntity(createArticles(nga,articles));
    admin.addEntity(createGglapis(nga,gglApis));
    admin.addEntity(createContacts(nga,contacts));


/***************************************
 * CUSTOM PAGES
 * ----
 * http://ng-admin-book.marmelab.com/doc/Custom-pages.html
 ***************************************/

myApp.constant('chatServerURL', 'http://chat.gokurbi.com/chatbox');
//myApp.constant('chatServerURL', 'http://kchat:8080/chatbox');

// CHATBOX CUSTOMIZATION PAGE
var chatboxConfigController = require('./custom_pages/chatboxconfig/chatboxconfig')();
var chatboxConfigControllerTemplate = require('./custom_pages/chatboxconfig/chatboxconfigtemplate')();
myApp.config(function($stateProvider) {
    $stateProvider.state('chatbox-config', {
        parent: 'main',
        url: '/chatbox_config',
        controller: chatboxConfigController,
        controllerAs: 'controller',
        template: chatboxConfigControllerTemplate
    });
});

/***************************************
 * CUSTOM FIELDS
 * ----
 * http://ng-admin-book.marmelab.com/doc/Custom-types.html
 ***************************************/

// NOTE: MUST USE 'import' here instead of require(), or the field config will come through as an object, 
// rather then a function, which will trigger an error message
// http://stackoverflow.com/questions/36451969/custom-type-the-field-class-is-injected-as-an-object-not-a-function
//import StamplayArrayStrField from './custom_fields/stamplay_array_str_field/stamplay_array_str_field_config';
/*var StamplayArrayStrField = require('./custom_fields/stamplay_array_str_field/stamplay_array_str_field_config')();
myApp.config(['NgAdminConfigurationProvider', function(nga) {
    nga.registerFieldType('stamplayarraystrings', StamplayArrayStrField)
}]);

//import StamplayArrayStrFieldView from './custom_fields/stamplay_array_str_field/stamplay_array_str_view';
var StamplayArrayStrFieldView = require('./custom_fields/stamplay_array_str_field/stamplay_array_str_view')();
myApp.config(['FieldViewConfigurationProvider', function(fvp) {
    fvp.registerFieldView('stamplayarraystrings', StamplayArrayStrFieldView);
}]);

//import stamplayArrayOfStringsDirective from './custom_fields/stamplay_array_str_field/stamplay_array_str_directive';
var stamplayArrayOfStringsDirective = require('./custom_fields/stamplay_array_str_field/stamplay_array_str_directive')();
myApp.directive('stamplayArrStrings', stamplayArrayOfStringsDirective);
*/

/***************************************
 * CUSTOM MENU
 ***************************************/

    admin.menu(nga.menu()
        .addChild(nga.menu().title('Dashboard').icon('<span class="glyphicon glyphicon-calendar"></span>&nbsp;').link('/dashboard'))
        .addChild(nga.menu(nga.entity('users')).title('Users').icon('<span class="glyphicon glyphicon-user"></span>&nbsp;'))
        .addChild(nga.menu(nga.entity('contacts')).title('Contact Form').icon('<span class="glyphicon glyphicon-user"></span>&nbsp;'))
        .addChild(nga.menu().title('Chat').icon('<span class="glyphicon glyphicon-education"></span>&nbsp;')
            .addChild(nga.menu(nga.entity('chatroom')).title('Conversations').icon('<img src="/img/conversation_icon.png" width="14" height="14" />&nbsp;'))
            .addChild(nga.menu(nga.entity('customization')).title('ChatBox History').icon('<span class="glyphicon glyphicon-lamp"></span>&nbsp;'))
            .addChild(nga.menu().title('ChatBox Customize').icon('<span class="glyphicon glyphicon-lamp"></span>&nbsp;').link('/chatbox_config'))
            .addChild(nga.menu(nga.entity('articles')).title('Articles').icon('<span class="glyphicon glyphicon-education"></span>&nbsp;'))
        )
        .addChild(nga.menu(nga.entity('apis')).title('Google API List').icon('<span class="glyphicon glyphicon-education"></span>&nbsp;'))
    );

/***************************************
 * CUSTOM HEADER
 ***************************************/


/***************************************
 * CUSTOM DASHBOARD
 * http://ng-admin-book.marmelab.com/doc/Dashboard.html
 ***************************************/


/***************************************
 * CUSTOM ERROR MESSAGES
 ***************************************/

    // Experimental Error Handler
    function appErrorHandler(response) {
console.log('in appErrorHandler');
        return 'Global error: ' + response.status + '(' + response.data + ')';
    }
    admin.errorMessage(appErrorHandler);

    function errorHandler($rootScope, $state, $translate, notification) {
        $rootScope.$on("$stateChangeError", function handleError(event, toState, toParams, fromState, fromParams, error) {
            if (error.status == 404) {
                $state.go('ma-404');
                event.preventDefault();
            } else {
console.log('in first error handler');
                $translate('STATE_CHANGE_ERROR', { message: error.message }).then(text => notification.log(text, { addnCls: 'humane-flatty-error' }));
                throw error;
            }
        });
    }

    myApp.run(errorHandler);

    myApp.config(['$translateProvider', function ($translateProvider) {
        $translateProvider.translations('en', {
          'STATE_CHANGE_ERROR': 'Error: {{ message }}'
        });
        //$translateProvider.preferredLanguage('en');
    }]);


/***************************************
 * ATTACH ADMIN APP TO DOM & RUN
 ***************************************/

    nga.configure(admin);

}]);