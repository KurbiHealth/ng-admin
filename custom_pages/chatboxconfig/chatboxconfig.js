module.exports = function() {

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
		this.submitForm = function() {

			var apiKey = 'public';

			var data = {
				avatar: this.avatar,
				color: this.color,
				headline: this.headline,
				snippet: this.snippet,
				url: this.url
			};

			$http
			.post(URL,data)
			.then(function(response) {
				// Add snippet to UI
				console.log(response);
				var targetDiv = angular.element(document.getElementById('chatSnippet'));
				targetDiv.text("<script>"+response.data.snippet + "</script>");
				apiKey = response.apiKey;
				return response.data.snippet;
			}, function(err) {
				console.log("There was an error saving.",err);
			})
			.then(function(response){
				// Save form elements and snippet to Stamplay
				var custom = Restangular.one('customization');
				custom.chat_avatar = data.avatar;
				custom.chat_color = data.color;
				custom.chat_headline = data.headline;
				custom.chat_snippet = response;
				custom.chat_url = data.url;
				custom.save()
				.then(function(response) {
					console.log(response);
				}, function(err) {
					console.log("There was an error saving.",err);
				})
			});
		}
	}

	return chatboxConfigController;

}
//export default chatboxConfigController;