(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function () {

	function chatboxConfigController($stateParams, notification, Restangular, $http, chatServerURL) {

		// URL is the location of the chat endpoints
		var URL = chatServerURL;
		console.log(URL);
		// notification is the service used to display notifications on the top of the screen
		this.notification = notification;

		// Check to see if there is a recent customization record available; if there is, load it and put values into form fields
		// @TODO
		// FIELDS: avatar, color, headline, url (snippet is saved below after receiving it from backend)
		this.avatar = '';
		this.color = '';
		this.headline = '';
		this.url = '';

		// the function is called from the template (file 'chatboxconfigtemplate.js')
		this.submitForm = function () {

			var apiKey = 'public';

			var data = {
				avatar: this.avatar,
				color: this.color,
				headline: this.headline,
				snippet: this.snippet,
				url: this.url
			};

			$http.post(URL, data).then(function (response) {
				// Add snippet to UI
				console.log(response);
				var targetDiv = angular.element(document.getElementById('chatSnippet'));
				targetDiv.text("<script>" + response.data.snippet + "</script>");
				apiKey = response.apiKey;
				return response.data.snippet;
			}, function (err) {
				console.log("There was an error saving.", err);
			}).then(function (response) {
				// Save form elements and snippet to Stamplay
				var custom = Restangular.one('customization');
				custom.chat_avatar = data.avatar;
				custom.chat_color = data.color;
				custom.chat_headline = data.headline;
				custom.chat_snippet = response;
				custom.chat_url = data.url;
				custom.save().then(function (response) {
					console.log(response);
				}, function (err) {
					console.log("There was an error saving.", err);
				});
			});
		};
	}

	return chatboxConfigController;
};
//export default chatboxConfigController;

},{}],2:[function(require,module,exports){
module.exports = function () {

    var chatboxConfigControllerTemplate = '<style>input{margin-bottom:10px;}.dont-break-out{overflow-wrap: break-word;word-wrap: break-word;-ms-word-break: break-all;word-break: break-all;word-break: break-word;}</style>' + '<div class="row"><div class="col-lg-12">' + '<ma-view-actions><ma-back-button></ma-back-button></ma-view-actions>' + '<div class="page-header">' + '<h1>Configure your Chat Box</h1>' + '</div>' + '</div></div>' + '<div class="row">' + '<div class="col-lg-6">' + '<h4>Modify This</h4>' + '<input type="text" size="10" ng-model="controller.avatar" class="form-control" placeholder="avatar"/>' + '<input type="text" size="10" ng-model="controller.color" class="form-control" placeholder="color"/>' + '<input type="text" size="10" ng-model="controller.headline" class="form-control" placeholder="headline"/>' + '<input type="text" size="10" ng-model="controller.url" class="form-control" placeholder="url"/>' + '<a class="btn btn-default" ng-click="controller.submitForm()">Save</a>' + '</div>' + '<div class="col-lg-6">' + '<h4>Instructions</h4>' + '<p><i>When the snippet appears, copy it and then paste it into your website\'s html or content management system.</i></p>' + '<h4>Snippet Display</h4>' + '<div id="chatSnippet" class="dont-break-out" style="width:100%;display:block;border:1px solid grey;border-radius:3px;min-height:33px;padding:20px;margin-bottom:20px;"></div>' + '</div>' + '</div>';

    return chatboxConfigControllerTemplate;
};

},{}],3:[function(require,module,exports){
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/***************************************
 * INITIALIZE THE APPLICATION
 ***************************************/

var myApp = angular.module('myApp', ['ng-admin', 'ngSanitize', "com.2fdevs.videogular", "com.2fdevs.videogular.plugins.controls", "info.vietnamcode.nampnq.videogular.plugins.youtube"]);

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
            request: requestInterceptor
        };

        function requestInterceptor(config) {
            if (angular.isDefined(config.headers['Content-Type']) && !angular.isDefined(config.data)) config.data = '';

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
            request: function request(config) {
                config = angular.copy(config);

                if (config.method === 'PUT') {
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

myApp.config(function (RestangularProvider) {

    var token = window.localStorage.getItem("http://kpadmin-jwt");
    if ((typeof token === 'undefined' ? 'undefined' : _typeof(token)) == 'object' && token == null) {
        token = '';
    } else {
        token = token.replace(/"/g, '');
        token = token.toString();
    }

    RestangularProvider.setDefaultHeaders({
        "Content-Type": 'application/json; charset=utf-8',
        "x-stamplay-jwt": token
    });

    RestangularProvider.addFullRequestInterceptor(function (element, operation, what, url, headers, params, httpConfig) {
        console.log('url', url);
        console.log('element: ', element);
        console.log('operation: ', operation);
        console.log('what: ', what);
        //console.log('headers: ',headers);
        //console.log('params: ',params);
        //console.log('httpConfig',httpConfig);

        // FIX PAGINATION
        // STAMPLAY'S FORMAT == n=21&page=2&per_page=10
        if (url.indexOf('stamplay') > -1) {
            if (operation == 'getList') {
                params.page = params._page;
                params.per_page = params._perPage;
                if (params._sortField != '') {
                    params.sort = '';
                    if (params._sortDir == 'DESC') params.sort = '-';
                    params.sort += params._sortField;
                }
                delete params._page;
                delete params._perPage;
                delete params._sortField;
                delete params._sortDir;
            }
        }
        if (what == 'apis') {
            delete params._page;
            delete params._perPage;
            delete params._sortField;
            delete params._sortDir;
        }
        return { element: element, params: params };
    });

    RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {

        var newResponse = response;
        console.log('Response', response);
        //console.log(typeof response.data.data);
        console.log('Data', data);

        // ADJUST STAMPLAY'S STRUCTURE TO MATCH WHAT NG-ADMIN EXPECTS
        if (url.indexOf('stamplay') > -1) {
            if ('data' in response.data) {
                var newData = response.data.data;
                if (newData.length > 0) {
                    newResponse = response.data.data;
                } else {
                    newResponse = [];
                }
            } else {
                newResponse = response.data;
            }

            // FIX PAGINATION
            if (operation == "getList") {
                var contentRange = data.pagination.total_elements;
                console.log(contentRange);
                response.totalCount = contentRange;
            }
        }

        if (url.indexOf('googleapis\.com\/discovery') > -1) {
            newResponse = data.items;
        }

        return newResponse;
    });
});

/***************************************
 * DEFINE DATA ENTITIES
 ***************************************/

//import Field from 'admin-config/lib/Field/Field';
myApp.config(['NgAdminConfigurationProvider', function (nga) {

    // create the default admin application
    // ==================================================

    var admin = nga.application('Kurbi Provider Admin').baseApiUrl('https://kurbi.stamplayapp.com/api/cobject/v1/');

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

    admin.addEntity(createUser(nga, userEntity));
    admin.addEntity(createCustomization(nga, customization));
    admin.addEntity(createChatbox(nga, chatbox));
    admin.addEntity(createChatroom(nga, chatroom));
    admin.addEntity(createArticles(nga, articles));
    admin.addEntity(createGglapis(nga, gglApis));
    admin.addEntity(createContacts(nga, contacts));

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
    myApp.config(function ($stateProvider) {
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

    admin.menu(nga.menu().addChild(nga.menu().title('Dashboard').icon('<span class="glyphicon glyphicon-calendar"></span>&nbsp;').link('/dashboard')).addChild(nga.menu(nga.entity('users')).title('Users').icon('<span class="glyphicon glyphicon-user"></span>&nbsp;')).addChild(nga.menu(nga.entity('contacts')).title('Contact Form').icon('<span class="glyphicon glyphicon-user"></span>&nbsp;')).addChild(nga.menu().title('Chat').icon('<span class="glyphicon glyphicon-education"></span>&nbsp;').addChild(nga.menu(nga.entity('chatroom')).title('Conversations').icon('<img src="/img/conversation_icon.png" width="14" height="14" />&nbsp;')).addChild(nga.menu(nga.entity('customization')).title('ChatBox History').icon('<span class="glyphicon glyphicon-lamp"></span>&nbsp;')).addChild(nga.menu().title('ChatBox Customize').icon('<span class="glyphicon glyphicon-lamp"></span>&nbsp;').link('/chatbox_config')).addChild(nga.menu(nga.entity('articles')).title('Articles').icon('<span class="glyphicon glyphicon-education"></span>&nbsp;'))).addChild(nga.menu(nga.entity('apis')).title('Google API List').icon('<span class="glyphicon glyphicon-education"></span>&nbsp;')));

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
                $translate('STATE_CHANGE_ERROR', { message: error.message }).then(function (text) {
                    return notification.log(text, { addnCls: 'humane-flatty-error' });
                });
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

},{"./custom_pages/chatboxconfig/chatboxconfig":1,"./custom_pages/chatboxconfig/chatboxconfigtemplate":2,"./models/articles":4,"./models/chatbox":5,"./models/chatroom":6,"./models/contacts":7,"./models/customization":8,"./models/gglapis":9,"./models/users":10}],4:[function(require,module,exports){
module.exports = function (nga, articles) {

    // LIST VIEW
    articles.listView().fields([nga.field('dt_create', 'datetime').label('Created'), nga.field('id'), nga.field('author')]).listActions(['show', 'edit', 'delete']);

    // SHOW VIEW
    articles.showView().fields([nga.field('owner'), nga.field('dt_create').label('Created'), nga.field('dt_update').label('Last Updated'), nga.field('author'), nga.field('body', 'wysiwyg')
    /*,nga.field('conversation_id','reference').targetField('messages')*/
    ]);

    // CREATION VIEW
    articles.creationView().fields([nga.field('author'), nga.field('body')]);

    // EDITION VIEW
    articles.editionView().fields(articles.creationView().fields());

    return articles;
};

},{}],5:[function(require,module,exports){
module.exports = function (nga, chatbox) {

    // LIST VIEW
    chatbox.listView().fields([nga.field('dt_create', 'datetime').label('Created')]).listActions(['show', 'edit', 'delete']);

    // SHOW VIEW
    chatbox.showView().fields([nga.field('owner'), nga.field('dt_create', 'datetime').label('Created'), nga.field('dt_update', 'datetime').label('Last Updated'), nga.field('html'), nga.field('css'), nga.field('js')
    // relate concept
    ]);

    // CREATION VIEW
    chatbox.creationView().fields([nga.field('chat_avatar', 'file')
    //.uploadInformation({ 'url': 'your_url', 'apifilename': 'picture_name' })

    , nga.field('chat_color'), nga.field('chat_headline'), nga.field('chat_snippet'), nga.field('chat_url')]);

    // EDITION VIEW
    chatbox.editionView().fields(chatbox.creationView().fields());

    return chatbox;
};

},{}],6:[function(require,module,exports){
module.exports = function (nga, chatroom) {

    // LIST VIEW
    chatroom.listView().fields([nga.field('dt_create', 'datetime').label('Created'), nga.field('id')]).listActions(['show', 'edit', 'delete']);

    // SHOW VIEW
    chatroom.showView().fields([nga.field('owner'), nga.field('dt_create').label('Created'), nga.field('dt_update').label('Last Updated'), nga.field('key'), nga.field('room'), nga.field('sessionID'),
    /*nga.field('messages','embedded_list') // Define a 1-N relationship with the (embedded) comment entity
      .targetFields([ // which comment fields to display in the datagrid / form
          nga.field('message')
      ])*/
    nga.field('messages', 'json')]);

    // CREATION VIEW
    chatroom.creationView().fields([nga.field('key')
    //.uploadInformation({ 'url': 'your_url', 'apifilename': 'picture_name' })

    , nga.field('messages'), nga.field('room'), nga.field('sessionID'), nga.field('url')]);

    // EDITION VIEW
    chatroom.editionView().fields(chatroom.creationView().fields());

    return chatroom;
};

},{}],7:[function(require,module,exports){
module.exports = function (nga, contacts) {

    // LIST VIEW
    contacts.listView().fields([nga.field('dt_create', 'datetime').label('Created').format('short'), nga.field('email')]).listActions(['show', 'delete']);

    // SHOW VIEW
    contacts.showView().fields([nga.field('owner'), nga.field('dt_create').label('Created'), nga.field('email')]);

    return contacts;
};

},{}],8:[function(require,module,exports){
module.exports = function (nga, customization) {

    // LIST VIEW
    customization.listView().fields([nga.field('id'), nga.field('dt_create').label('Created'), nga.field('chat_avatar'), nga.field('chat_url')]).listActions(['show', 'edit', 'delete']);

    // SHOW VIEW
    customization.showView().fields([nga.field('owner'), nga.field('dt_create').label('Created'), nga.field('dt_update').label('Last Updated'), nga.field('chat_avatar'), nga.field('chat_color'), nga.field('chat_headline'), nga.field('chat_snippet'), nga.field('chat_url')
    // relate concept
    ]);

    // CREATION VIEW
    customization.creationView().fields([nga.field('chat_avatar', 'file')
    //.uploadInformation({ 'url': 'your_url', 'apifilename': 'picture_name' })

    , nga.field('chat_color'), nga.field('chat_headline'), nga.field('chat_snippet'), nga.field('chat_url')]);

    // EDITION VIEW
    customization.editionView().fields(customization.creationView().fields());

    return customization;
};

},{}],9:[function(require,module,exports){
module.exports = function (nga, apis) {

    // LIST VIEW
    apis.listView().fields([nga.field('title').cssClasses(['google-apis-discovery-title']).template('<a href="{{entry.values.discoveryRestUrl}}" target="_blank">{{entry.values.title}} - {{entry.values.version}}</a>'), nga.field('description')]).title('Available Google API\'s').sortField('title');

    return apis;
};

},{}],10:[function(require,module,exports){
module.exports = function (nga, users) {

    // LIST VIEW
    users.listView().fields([nga.field('id'), nga.field('displayName'), nga.field('email')]).listActions(['show', 'edit', 'delete']);

    // SHOW VIEW
    users.showView().fields([nga.field('id'), nga.field('dt_create'), nga.field('dt_update'), nga.field('firstName'), nga.field('lastName'), nga.field('displayName'), nga.field('email'), nga.field('givenRole'), nga.field('pictures', 'embedded_list').targetFields([nga.field('google'), nga.field('facebook')]), nga.field('identities', 'embedded_list').targetFields([nga.field('google'), nga.field('facebook')])]);

    // CREATION VIEW
    users.creationView().fields([nga.field('firstName'), nga.field('lastName'), nga.field('displayName'), nga.field('email')]);

    // EDITION VIEW
    users.editionView().fields(users.creationView().fields());

    return users;
};

},{}]},{},[3]);
