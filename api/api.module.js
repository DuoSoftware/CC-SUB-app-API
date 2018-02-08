////////////////////////////////
// App : api
// Owner  : Ishara Gunathilaka
// Last changed date : 2018/02/08
// Version : 6.1.0.11
// Modified By : Kasun
/////////////////////////////////


(function ()
{
	'use strict';

	angular
		.module('app.api', [])
		.config(config);

	/** @ngInject */
	function config($stateProvider, msNavigationServiceProvider, mesentitlementProvider)
	{

		$stateProvider
			.state('app.api', {
				url    : '/api',
				views  : {
					'api@app': {
						templateUrl: 'app/main/api/api.html',
						controller : 'ApiController as vm'
					}
				},
				resolve: {
					security: ['$q','mesentitlement','$timeout','$rootScope','$state','$location', function($q,mesentitlement,$timeout,$rootScope,$state, $location){
						return $q(function(resolve, reject) {

							$timeout(function() {
								if (true) {
									resolve(function () {
										var entitledStatesReturn = mesentitlement.stateDepResolver('api');

										mesentitlementProvider.setStateCheck("api");

										if(entitledStatesReturn !== true){
											return $q.reject("unauthorized");
										}
									});
								} else {
									return $location.path('/guide');
								}
							});
						});
					}]
				},
				bodyClass: 'api'
			});

		msNavigationServiceProvider.saveItem('api', {
			title    : 'API',
			state    : 'app.api',
			weight   : 5
		});
	}
})();
