(function ()
{
	'use strict';

	angular
		.module('app.api')
		.controller('ApiController',  ApiController)
		.filter('capitalize', function() {
			return function(input) {
				return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
			}
		});

	/** @ngInject */
	function ApiController( $scope,$http,$charge, $timeout, logHelper)
	{
		var vm = this;
		var originatorEv;

		vm.openMenu = function($mdMenu, ev) {
			originatorEv = ev;
			$mdMenu.open(ev);
		};

		function gst(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') c = c.substring(1, c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
			}
			//debugger;
			return null;
		}

		function getCurrentDomain() {
			var cd = gst('currentDomain');
			var d = gst('domain');
			return (cd != null) ? cd : d;
		}

		// $scope.$watch(function () {
		// 	// if(document.getElementById('swagger-ui'))
		// 	// {
		// 	// 	var mainElemWidth = document.getElementById('swagger-ui').offsetWidth;
		// 	// 	if(document.getElementsByClassName('topbar').length>0)document.getElementsByClassName('topbar')[0].setAttribute('style','width:'+mainElemWidth+'px!important');
		// 	// }
		// });

		$scope.idToken= gst('securityToken');
		// $scope.idToken= "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsifQ.eyJleHAiOjE1MDc3ODQwMzMsIm5iZiI6MTUwNzcwMTIzMywidmVyIjoiMS4wIiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5taWNyb3NvZnRvbmxpbmUuY29tL2MxZjlmOGU2LTM0NjktNGQ1Zi1hMzI2LTgzZTk5MGE5OTI2YS92Mi4wLyIsInN1YiI6ImM1YzA1MmUxLWY0NjQtNDgzYS04OTRiLTRlNWRiOGQ4ZjFjNCIsImF1ZCI6ImQwODRhMjI3LWJiNTItNDk5Mi04ODlkLTZlNDgzNTYxMGU3NiIsIm5vbmNlIjoiZGVmYXVsdE5vbmNlIiwiaWF0IjoxNTA3NzAxMjMzLCJhdXRoX3RpbWUiOjE1MDc3MDEyMzMsIm9pZCI6ImM1YzA1MmUxLWY0NjQtNDgzYS04OTRiLTRlNWRiOGQ4ZjFjNCIsImdpdmVuX25hbWUiOiJjaGlubyIsIm5hbWUiOiJuaWNvZGVtdXMiLCJjb3VudHJ5IjoiU3JpIExhbmthIiwiZXh0ZW5zaW9uX21vZGUiOiJ0ZXN0IiwiZXh0ZW5zaW9uX0RvbWFpbiI6Im5pY29kZW11cy5hcHAuY2xvdWRjaGFyZ2UuY29tIiwiZmFtaWx5X25hbWUiOiJmcmVlX3RyaWFsIiwiam9iVGl0bGUiOiJhZG1pbiIsImVtYWlscyI6WyJjaGluby5uaWNvZGVtdXNAb291LnVzIl0sInRmcCI6IkIyQ18xX0RlZmF1bHRQb2xpY3kifQ.omLBXMvaSq7p3DGB9csxnzo9SSMQ7xtnDT2J2ZPbw3RVGJHfOOvTLEv4s1Ie59Yw6aKZ9LAGh1KbPvnyZCOGNE7rZ9ezSwruloVwDet9e6PUQI_enk7dDkUeRkbIuzoFD7_Cne3zxi1TDkAGEGs7pbYr9XHiDT2pbpe3QXE_chKcnk5BtoZY11voReycBF23U0AwyixOT0tI_RNKPy9yF6iSHxoP_77RdKirGo7dU_VBqfmc9ea7fIg8WIdqgaWR73cVsI_Tj9NkDgpWQQLpRsjvcgh7e2e2u8BX0rd20uJi5jp13Sy4HPEvIrkCG4GKV4MC3yTm-e6iaGBIk2FDjw";


		vm.appInnerState = "add";
		//vm.displayError = '';
		vm.apiList = ['profile','tax','card'];

		//Get category
		var accountCategory = null;

			// init form
		//$scope.isLoading = false;
		//$scope.url = $scope.swaggerUrl = '';
		//$scope.selectedUrl = '';
		//// error management
		//$scope.myErrorHandler = function(message, code){
		//  alert(swaggerTranslator.translate('error', {
		//    code: code,
		//    message: message
		//  }));
		//};
		$scope.isApiListLoaded = true;

		(function (){
			$scope.isApiListLoaded = false;
			accountCategory = gst('category');

			$charge.apiengine().getAllApisForProduct(accountCategory).success(function (response) {
				//console.log(response);
				vm.apiList = response.value;
				$scope.isApiListLoaded = true;

			}).error(function(data) {
				$scope.isApiListLoaded = true;
				// console.log(data);
			});



			// $charge.apiengine().getAllApis().success(function (response) {
			// 	//console.log(response);
			// 	vm.apiList = response.value;
			// 	$scope.isApiListLoaded = true;
			//
			// }).error(function(data) {
			// 	$scope.isApiListLoaded = true;
			// 	// console.log(data);
			// });
		})();

		$scope.apiDescription = [{
			name:"Card API",
			desc:"Load form method returns a HTML code which is used to add a new card to a profile. Card type depends on the chosen payment gateway."
		},{
			name:"Email API",
			desc:"Email API is used to send emails."
		},{
			name:"Ledger API",
			desc:"This API contains methods to retrieve ledger details of an account and retreive ledger sum of an account."
		},{
			name:"Profile API",
			desc:"This API can be used to manage customers. Create new customers, update customer details and retrieve are the main methods. Before adding a subscription, profile details should be available in CloudCharge."
		},{
			name:"Subscription API",
			desc:"This API contains methods to manage all subscriptions. Add, change, stop and view subscriptions. If the plan associated with a payment gateway. CloudCharge will credit/debit from the customer's card instantly."
		}];

		$scope.loadingAPI = false;
		$scope.hideInformMsg = false;
		var portalBaseURL = null;
		$scope.selectedUrl_ = function(api){
			$scope.loadingAPI = true;
			vm.isAllCollapse = true;
			$scope.selectedUrl = api.name;

			// debugger;

			$http({
				method:'GET',
				url:'app/core/cloudcharge/js/config.json'
			}).then(function (response) {
				portalBaseURL = response.data.getAllAPI.domain;
				var id = api.id;
				id = id.replace("/apis/","");

				$scope.url = portalBaseURL+'/docs/services/'+id+'/export?DocumentFormat=Swagger&ApiName='+api.name;

				// const ui = SwaggerUIBundle({
				// 	url: $scope.url,
				// 	dom_id: '#swagger-ui',
				// 	presets: [
				// 		SwaggerUIBundle.presets.apis,
				// 		SwaggerUIStandalonePreset
				// 	],
				// 	plugins: [
				// 		SwaggerUIBundle.plugins.DownloadUrl
				// 	],
				// 	layout: "StandaloneLayout"
				// });

				// window.ui = ui;

				$http({
					method: 'GET',
					url: $scope.url
				}).then(function (response) {
					var index = 0;
					var swagJSon = response.data;
					$scope.dummySwaggerData = response.data;
					// console.log(JSON.stringify($scope.dummySwaggerData));
					var toArray = angular.copy($scope.dummySwaggerData.paths);
					$scope.dummySwaggerData.paths = {};
					$scope.dummySwaggerData.paths = Object.values(toArray);
					for (var method in toArray) {
						var item = toArray[method];
						for(var body in item){
							$scope.dummySwaggerData.paths[index].method = body;
							$scope.dummySwaggerData.paths[index].body = item[body];
							delete $scope.dummySwaggerData.paths[index][body];
						}
						$scope.dummySwaggerData.paths[index].title = method;
						$scope.dummySwaggerData.paths[index].isOpen = false;
						$scope.dummySwaggerData.paths[index].showResponseForMethod = false;
						$scope.dummySwaggerData.paths[index].isBlockFull = false;
						$scope.dummySwaggerData.paths[index].isResponseFull = false;
						$scope.dummySwaggerData.paths[index].selectedSampleCode = 0;
						index ++;
					}
					for(var required in $scope.dummySwaggerData.definitions){
						var para = $scope.dummySwaggerData.definitions[required].required;
						var prop = $scope.dummySwaggerData.definitions[required].properties;
						var obj = {};
						for(var i=0;i<para.length;i++){
							if(prop[para[i]].type == 'integer' || prop[para[i]].type == 'double' || prop[para[i]].type == 'float'){
								obj[para[i]] = 0;
							}else if(prop[para[i]].type == 'array'){
								obj[para[i]] = [];
							}else if(prop[para[i]].type == 'object'){
								obj[para[i]] = {};
							}else{
								obj[para[i]] = "";
							}
						}
						para = {};
						para = obj;
						$scope.dummySwaggerData.definitions[required].required = JSON.stringify(para, null, 4);
					}
					angular.forEach($scope.apiDescription, function (api) {
						if(api.name == $scope.dummySwaggerData.info.title){
							$scope.dummySwaggerData.info.desc = api.desc;
							return -1;
						}
					});
					$scope.loadingAPI = false;
					$scope.hideInformMsg = true;
				}, function (errorResponse) {
					// console.log(errorResponse);
					$scope.loadingAPI = false;
				});
			}, function (error) {});
		};

		// Kasun_Wijeratne_2017_JUL
		/** Properties */
		var tabElem = document.getElementsByClassName('md-tab-content');
		$scope.dymmyResponseBody = JSON.stringify({
			"title": "Mr",
			"gender": "Male",
			"firstName": "Testfname",
			"lastName": "Testlname",
			"ssn": "123123123v",
			"phone": "0123123123",
			"email": "nonaneka@10vpn.info",
			"address": {
				"zipcode": "",
				"number": "",
				"street": "",
				"city": "",
				"province": "",
				"country": ""
			}
		}, null, 4);
		$scope.sampleCodes = [{
			language:'C#',
			code:'using System;using System.Net.Http.Headers;using System.Text;using System.Net.Http;using System.Web;namespace CSHttpClientSample{ static class Program { static void Main() { MakeRequest(); Console.WriteLine("Hit ENTER to exit..."); Console.ReadLine(); } static async void MakeRequest() { var client = new HttpClient(); var queryString = HttpUtility.ParseQueryString(string.Empty); /* OAuth2 is required to access this API. For more information visit: https://msdn.microsoft.com/en-us/office/office365/howto/common-app-authentication-tasks */ // Specify values for the following required parametersqueryString["api-version"] = "1.6";// Specify values for optional parameters, as needed// queryString["$filter"] = "startswith(displayName,'+'A'+')"; // Specify values for path parameters (shown as {...}) var uri = "https://graph.windows.net/myorganization/users?" + queryString; var response = await client.GetAsync(uri); if (response.Content != null) { var responseString = await response.Content.ReadAsStringAsync(); Console.WriteLine(responseString); } } }}'
		},{
			language:'Curl',
			code:'@ECHO OFFREM OAuth2 is required to access this API. For more information visit: https://msdn.microsoft.com/en-us/office/office365/howto/common-app-authentication-tasksREM Specify values for path parameters (shown as {...}), values for query parameterscurl -v -X GET "https://graph.windows.net/myorganization/users?api-version=1.6&amp;$filter=startswith(displayName%2c%27A%27)&amp;"^'
		},{
			language:'Java',
			code:''
		},{
			language:'Javascript',
			code:''
		},{
			language:'ObjC',
			code:''
		},{
			language:'PHP',
			code:''
		},{
			language:'Python',
			code:''
		},{
			language:'Ruby',
			code:""
		}];
		$scope.isOpen = false;
		vm.isAllCollapse = true;
		$scope.isBlockFull = false;
		$scope.activeAPI = {
			reqHead:{
				"mode":null,
				"Ocp-Apim-Subscription-Key":null,
				"Content-Type":"application/json"
			}
		};
		$scope.apiHelper = [];
		// $scope.apiHelper = [{
		// 	name:'/getCustomer',
		// 	hasParams : false,
		// 	method:'get',
		// 	requestURL:'https://cloudcharge.azure-api.net/Cards/getCustomer?',
		// 	reqHead:{
		// 		"mode":"",
		// 		"Ocp-Apim-Subscription-Key":$scope.primaryKeyForAPI
		// 	}
		// },{
		// 	name:'/loadForm',
		// 	hasParams : false,
		// 	method:'post',
		// 	requestURL:'https://cloudcharge.azure-api.net/Cards/loadForm',
		// 	reqHead:{
		// 		"mode":"",
		// 		"Ocp-Apim-Subscription-Key":$scope.primaryKeyForAPI,
		// 		"Content-Type":"application/json"
		// 	},
		// 	reqBody:{
		// 		"profileId": "",
		// 		"redirectUrl": "",
		// 		"action": ""
		// 	}
		// },{
		// 	name:'Payment',
		// 	hasParams : false,
		// 	method:'post',
		// 	requestURL:'https://cloudcharge.azure-api.net/Cards/payment',
		// 	reqHead:{
		// 		"mode":"",
		// 		"Ocp-Apim-Subscription-Key":$scope.primaryKeyForAPI,
		// 		"Content-Type":"application/json"
		// 	},
		// 	reqBody:{
		// 		"amount": 0,
		// 		"customerId": "string",
		// 		"currency": "string",
		// 		"gateway": "string"
		// 	}
		// },{
		// 	name:'/sendMail',
		// 	hasParams : true,
		// 	method:'get',
		// 	requestURL:'https://cloudcharge.azure-api.net/Email/sendMail?',
		// 	reqHead:{
		// 		"mode":"",
		// 		"Ocp-Apim-Subscription-Key":$scope.primaryKeyForAPI
		// 	},
		// 	reqParams:{
		// 		"app":"",
		// 		"id":""
		// 	}
		// },{
		// 	name:'/getLedgersForAccount/',
		// 	hasParams : true,
		// 	method:'get',
		// 	requestURL:'https://cloudcharge.azure-api.net/Ledger/getLedgersForAccount/?',
		// 	reqHead:{
		// 		"mode":"",
		// 		"Ocp-Apim-Subscription-Key":$scope.primaryKeyForAPI
		// 	},
		// 	reqParams:{
		// 		"accountID":"",
		// 		"order":"",
		// 		"skip":"",
		// 		"take":""
		// 	}
		// },{
		// 	name:'/getLedgerSumForAccount/',
		// 	hasParams : true,
		// 	method:'get',
		// 	requestURL:'https://cloudcharge.azure-api.net/Ledger/getLedgerSumForAccount/?',
		// 	reqHead:{
		// 		"mode":"",
		// 		"Ocp-Apim-Subscription-Key":$scope.primaryKeyForAPI
		// 	},
		// 	reqParams:{
		// 		"accountID":"",
		// 		"flow":""
		// 	}
		// },{
		// 	name:'/inactivatePlan',
		// 	hasParams : false,
		// 	method:'get',
		// 	requestURL:'https://cloudcharge.azure-api.net/Plan/inactivatePlan?',
		// 	reqHead:{
		// 		"mode":"",
		// 		"Ocp-Apim-Subscription-Key":$scope.primaryKeyForAPI
		// 	}
		// },{
		// 	name:'/update',
		// 	hasParams : true,
		// 	method:'post',
		// 	requestURL:'https://cloudcharge.azure-api.net/profile/update',
		// 	reqHead:{
		// 		"mode":"",
		// 		"Ocp-Apim-Subscription-Key":$scope.primaryKeyForAPI
		// 	},
		// 	reqParams:{
		// 		"email":"",
		// 		"country":"",
		// 		"firstName":"",
		// 		"lastName":""
		// 	}
		// },{
		// 	name:'/updateProfileStatus/',
		// 	hasParams : true,
		// 	method:'get',
		// 	requestURL:'https://cloudcharge.azure-api.net/profile/updateProfileStatus/?',
		// 	reqHead:{
		// 		"mode":"",
		// 		"Ocp-Apim-Subscription-Key":$scope.primaryKeyForAPI
		// 	},
		// 	reqParams:{
		// 		"email":"",
		// 		"status":""
		// 	}
		// },{
		// 	name:'/updateProfileStatus/',
		// 	hasParams : true,
		// 	method:'get',
		// 	requestURL:'https://cloudcharge.azure-api.net/profile/updateProfileStatus/?',
		// 	reqHead:{
		// 		"mode":"",
		// 		"Ocp-Apim-Subscription-Key":$scope.primaryKeyForAPI
		// 	},
		// 	reqParams:{
		// 		"email":"",
		// 		"status":""
		// 	}
		// }];
		$http({
			method: 'GET',
			url: 'app/main/api/data/api-helper.json'
		}).then(function (apiHelper) {
			angular.forEach(apiHelper.data, function (method) {
				method.reqBody = JSON.stringify(method.reqBody, null, 4);
				$scope.apiHelper.push(method);
			});
		}, function (error) {

		});
		$scope.responseHelper = [{
			title:'Body',
			body:null
		}
		// ,{
		// 	title:'Header',
		// 	body:null
		// }
		]
		$scope.primaryKeyForAPI = '3f5da1c2de944584ae61525e10ae1f20';
		$scope.response = {
			statusCode:null,
			statusText:null
		};
		$scope.authView = false;
		$scope.keySet = false;


		/** Methods */
		(function (){
			$http({method:'GET',url:'app/core/cloudcharge/js/config.json'}).then(function (response) {
				$scope.globalURLs = response.data;

				$http({
					method: 'GET',
					url: $scope.globalURLs.sites.getSubKeyByTenant+"?tenant="+getCurrentDomain(),
					headers: {
						'id_token': $scope.idToken,
						'Content-Type': 'application/json'
					}})
					.then(function (res) {
						res.data.Result != "" ? $scope.primaryKeyForAPI = res.data.Result.primaryKey : $scope.primaryKeyForAPI = null;
					});
			}, function () {
				notifications.toast('Error getting Subscription key', 'error');
			});
			// $charge.myAccountEngine().getSubscriptionInfo().success(function (response) {
			// 	response.Result != "" ? $scope.primaryKeyForAPI = response.Result.primaryKey : $scope.primaryKeyForAPI = null;
			// }).error(function(data) {
			// 	// console.log(data);
			// });

		})();
		$scope.$watch(function (tabElem) {
			if(tabElem.length > 0){
				angular.forEach(tabElem, function (elem) {
					elem.addClass('ms-scroll');
				});
			};
		});

		$scope.toggleMethod = function (index, title) {
			// console.log(title);
			$scope.dummySwaggerData.paths[index].isOpen = !$scope.dummySwaggerData.paths[index].isOpen;
			$timeout(function () {
				var codeElem = document.getElementsByTagName('code');
				angular.forEach(codeElem, function (code) {
					hljs.highlightBlock(code);
				});
			}, 0);
		};

		$scope.toggleAllMethods = function (status) {
			vm.isAllCollapse = status;
			if(vm.isAllCollapse){
				angular.forEach($scope.dummySwaggerData.paths, function (method) {
					method.isOpen = false;
					method.showResponseForMethod = false;
				});
			}else{
				angular.forEach($scope.dummySwaggerData.paths, function (method) {
					method.isOpen = true;
				});
				codeFormatter();
			}
		};

		$scope.tryThisMethod = function (index, method, title, endpoint, form, url) {
			var form = document.getElementsByName('vm.apiForm'+index)[0];
			if(form.classList.contains('ng-invalid')) {

			}else{
				$scope.responseDone = false;
				$scope.dummySwaggerData.paths[index].showResponseForMethod = true;

				// angular.forEach($scope.apiHelper, function (activeAPI) {
				// 	if (title === activeAPI.name) {
				// 		$scope.activeAPI = activeAPI;
				// 		return -1;
				// 	}
				// });

				if(url.indexOf('?') > -1){
					var URL = 'https://'+url.split('?')[0]+'?';
				}else{
					var URL = 'https://'+url;
				}

				if (method == 'get') {
					// var URL = $scope.activeAPI.requestURL;
					var queryForm = angular.element('#apiForm' + index);
					var queryString = queryForm.serialize();

					//Set mode for header
					var mode = queryString.split("&");
					mode = mode[mode.length - 1].split("=")[1];
					$scope.activeAPI.reqHead.mode = mode;
					$scope.activeAPI.reqHead["Ocp-Apim-Subscription-Key"] = $scope.primaryKeyForAPI;

					//Set request URL
					queryString = queryString.replace("&mode=" + mode, "");
					URL = URL + queryString;

					$http({
						method: 'GET',
						url: URL,
						headers: $scope.activeAPI.reqHead
					}).then(function (response) {
						$timeout(function () {
							if(response.data.constructor == String){
								$scope.responseHelper[0].body = response.data;
							}else{
								$scope.responseHelper[0].body = JSON.stringify(response.data, null, 4);
							}
							// $scope.responseHelper[1].body = JSON.stringify(response.headers, null, 4);
							$scope.response.statusCode = response.status;
							$scope.response.statusText = response.statusText;
							$scope.responseDone = true;
						});
					}, function (errorResponse) {
						$timeout(function () {
							$scope.responseHelper[0].body = JSON.stringify(errorResponse.data, null, 4);
							// $scope.responseHelper[1].body = JSON.stringify({status: errorResponse.headers.status,statusText:errorResponse.headers.statusText} , null, 4);
							$scope.response.statusCode = errorResponse.status;
							$scope.response.statusText = errorResponse.statusText;
							$scope.responseDone = true;
						});
					});
					codeFormatter();
				}
				else if (method == 'post') {
					// var URL = $scope.activeAPI.requestURL;
					var reqBody = angular.element('.req-body'+index)[0];
					reqBody = JSON.parse(reqBody.value);
					var queryForm = angular.element('#apiForm' + index);
					var queryString = queryForm.serialize();

					//Set mode for header
					var mode = queryString.split("&");
					angular.forEach(mode, function (cut) {
						if(cut.split('=')[0] == 'mode'){
							mode = cut.split('=')[1]
						}
					});
					//mode = mode[mode.length - 1].split("=")[1];
					$scope.activeAPI.reqHead.mode = mode;
					$scope.activeAPI.reqHead["Ocp-Apim-Subscription-Key"] = $scope.primaryKeyForAPI;

					//Set request URL
					//queryString = queryString.replace("&mode=" + mode, "");
					// URL = URL + queryString;

					$http({
						method: 'POST',
						url: URL,
						headers: $scope.activeAPI.reqHead,
						data:reqBody
					}).then(function (response) {
						$timeout(function () {
							if(response.data.constructor == String){
								$scope.responseHelper[0].body = response.data;
							}else{
								$scope.responseHelper[0].body = JSON.stringify(response.data, null, 4);
							}
							// $scope.responseHelper[1].body = JSON.stringify(response.headers, null, 4);
							$scope.response.statusCode = response.status;
							$scope.response.statusText = response.statusText;
							$scope.responseDone = true;
						});
					}, function (errorResponse) {
						$timeout(function () {
							$scope.responseHelper[0].body = JSON.stringify(errorResponse.data, null, 4);
							// $scope.responseHelper[1].body = JSON.stringify({status: errorResponse.headers.status,statusText:errorResponse.headers.statusText} , null, 4);
							$scope.response.statusCode = errorResponse.status;
							$scope.response.statusText = errorResponse.statusText;
							$scope.responseDone = true;
						});
					});
					codeFormatter();
				}
			}
		};

		function codeFormatter() {
			$timeout(function () {
				var codeElem = document.getElementsByTagName('code');
				angular.forEach(codeElem, function (code) {
					hljs.highlightBlock(code);
				});
			},100);
		}

		$scope.setBlockFull = function (index) {
			$scope.dummySwaggerData.paths[index].isBlockFull = !$scope.dummySwaggerData.paths[index].isBlockFull;
		};

		$scope.setResponseFull = function (index) {
			$scope.dummySwaggerData.paths[index].isResponseFull = !$scope.dummySwaggerData.paths[index].isResponseFull;
		};

		// $scope.runCodeHighlighter = function () {
		// 	$timeout(function () {
		// 		var codeElem = document.getElementById('sample-code');
		// 		hljs.highlightBlock(codeElem);
		// 	}, 2000);
		// };

		$scope.codeCopied = false;
		$scope.copyToClipboard = function (idPart1, idPart2) {
			var id = idPart1+idPart2;
			$scope.coppiedTimeout = false;
			$scope.copyStarted = true;
			window.getSelection().empty();
			var copyField = document.getElementById(id);
			var range = document.createRange();
			range.selectNode(copyField);
			window.getSelection().addRange(range);
			document.execCommand('copy');
			$timeout(function(){
				$scope.coppiedTimeout = true;
			},2000);
		};

		$scope.showAuthPanel = function () {
			$scope.authView = !$scope.authView;
		};

		$scope.setAuthKey = function (key) {
			if(vm.authKeyForm.$valid){
				$scope.primaryKeyForAPI = key;
				$scope.keySet = true;
				$scope.showAuthPanel();
			}
		};
		// Kasun_Wijeratne_2017_JUL

		$scope.editApiSettings = false;
		$scope.apisettings = function () {
			$scope.editApiSettings = !$scope.editApiSettings;
		}


		$scope.accAccessKeysLoaded = false;
		(function (){

			try{

				var domain = gst('currentDomain');
				if(!domain)
				{
					domain = gst('domain');
				}
				$charge.tenantEngine().getSubscriptionIdByTenantName(domain).success(function (response) {

					if(response.status) {
						var subscriptionID = response.data["0"].subscriptionID;

						if (subscriptionID) {

							$charge.myAccountEngine().getSubscriptionInfoByID(subscriptionID).success(function (data) {

								$scope.access_keys = [{
									name: "Primary key",
									key: data.Result.primaryKey
								}, {
									name: "Secondary key",
									key: data.Result.secondaryKey
								}];
								$scope.accAccessKeysLoaded = true;

							}).error(function (data) {
								// console.log(data);
								$scope.accAccessKeysLoaded = true;
							});

						} else {
							$scope.accAccessKeysLoaded = true;
						}
					} else {
						$scope.accAccessKeysLoaded = true;
					}

				}).error(function(data) {
					// console.log(data);
					$scope.accAccessKeysLoaded = true;

					ex.app = "myAccount";
					logHelper.error(ex);

				});


			}catch(ex){

				$scope.accAccessKeysLoaded = true;

				ex.app = "myAccount";
				logHelper.error(ex);
			}
		})();

		$scope.xfiedKey = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
		$scope.keyIndex = 0;
		$scope.currentlyOn = "";

		$scope.resetKey = function(key){
			$scope.isKeyResetting = true;
		};

		$scope.showAccessKey = function(key, index){
			$scope.keyIndex = index;
			$scope.isKeyHidden = true;
			document.getElementsByClassName('access-key')[index].innerHTML=key.key;
			document.querySelector('.keyDisplay'+key.key+' #show').style.display='none';
			document.querySelector('#copyKey'+key.key).removeAttribute('disabled');
			document.querySelector('.keyDisplay'+key.key+' #hide').style.display='block';
		}

		$scope.hideAccessKey = function(key, index){
			window.getSelection().empty();
			$scope.keyIndex = index;
			var length = key.key.length;
			$scope.isKeyHidden = false;
			document.getElementsByClassName('access-key')[index].innerHTML=$scope.xfiedKey.substring(0, length);
			document.querySelector('#copyKey'+key.key).setAttribute('disabled','disabled');
			document.querySelector('.keyDisplay'+key.key+' #show').style.display='block';
			document.querySelector('.keyDisplay'+key.key+' #hide').style.display='none';
		};

		$scope.copyToClipboard = function (id, elem) {
			$scope.coppiedTimeout = false;
			$scope.copyStarted = true;
			$scope.secondaryCopied = false;
			$scope.primaryCopied = false;
			window.getSelection().empty();
			var ID = "#"+id;
			// var notifParent = document.getElementById(id);
			// var notif = notifParent.getElementsByClassName('copied-to-clipboard')[0];
			var copyField = document.getElementById(id);
			var range = document.createRange();
			range.selectNode(copyField);
			window.getSelection().addRange(range);
			document.execCommand('copy');
			if(elem.split(' ')[0].toLowerCase() == 'primary'){
				$timeout(function(){
					$scope.primaryCopied = true;
				});
			}else{
				$timeout(function() {
					$scope.secondaryCopied = true;
				});
			}
			$timeout(function(){
				$scope.coppiedTimeout = true;
			},2000);
			// if(notif != null || notif != undefined){
			// 	notif.remove();
			// 	copyField.insertAdjacentHTML('beforeend', '<span class="copied-to-clipboard">Copied</span>');
			// }else{
			// 	copyField.insertAdjacentHTML('beforeend', '<span class="copied-to-clipboard">Copied</span>');
			// }
		}

	}
})();
