var app = angular.module('app', ['ui.router', 'ngCookies', 'ui-notification', 'ngDialog', 'angular-virtual-keyboard', 'angular-loading-bar', 'ngclipboard']);

app.config(function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
});

app.config(['$stateProvider', '$urlRouterProvider', 'NotificationProvider', '$qProvider', function($stateProvider, $urlRouterProvider, NotificationProvider, $qProvider){

    NotificationProvider.setOptions({
        maxCount: 5
        //delay: 2000,
        // startTop: 20,
        // startRight: 10,
        // verticalSpacing: 20,
        // horizontalSpacing: 20,
        // positionX: 'right',
        // positionY: 'top'
    });

    $qProvider.errorOnUnhandledRejections(false);

	$urlRouterProvider.otherwise('/home');

	$stateProvider
	.state('login',
	 {
	 	url:'/login',
	 	templateUrl: 'pages/login.html',
	 	controller: 'loginCtrl'
	 })
    .state('login.signup',
     {
        url:'/signup',
        templateUrl: 'pages/signup.html',
        controller: 'signupCtrl',
        resolve: {
            getQuestions: function(userService) {
                return userService.getQuestions();
            }
        }
     })
    .state('login.forgot_password',
     {
        url:'/forgot_password',
        templateUrl: 'pages/forgot_password.html',
        controller: 'forgotPassCtrl'
     })
    .state('home',
     {
        url:'/home',
        templateUrl: 'pages/home.html',
        controller: 'homeCtrl',
        resolve: {
            getDataList: function(ruleService) {
                return ruleService.getDataList();
            },
            allHistory: function(historyService) {
                return historyService.getAllhistory();
            }
        }
     })
    .state('home.rule',
     {
        url:'/rule',
        templateUrl: 'pages/rule.html',
        controller: 'ruleCtrl'
     })
    .state('home.rule.new',
     {
        url:'/new',
        templateUrl: 'pages/new_rule.html',
        controller: 'newRuleCtrl',
        resolve: {
            allCorpus: function(corpusService) {
                return corpusService.getAllCorpus();
            }
        }
     })
    .state('home.history',
     {
        url:'/history',
        templateUrl: 'pages/history.html',
        controller: 'historyCtrl'
     })
    .state('home.history.new',
     {
        url:'/new',
        templateUrl: 'pages/new_history.html',
        controller: 'newHistoryCtrl',
        resolve: {
            allCorpus: function(corpusService) {
                return corpusService.getAllCorpus();
            }
        }
     })
    .state('home.rule.edit',
     {
        url:'/edit/:ruleId',
        templateUrl: 'pages/new_rule.html',
        controller: 'editRuleCtrl',
        resolve: {
            editRule: function(ruleService, $stateParams) {
                return ruleService.editRule($stateParams.ruleId);
            }
        }
     })
    .state('home.combination',
     {
        url:'/combination',
        templateUrl: 'pages/combination.html',
        controller: 'combinationCtrl'
     })
    .state('home.combination.new',
     {
        url:'/new',
        templateUrl: 'pages/new_combination.html',
        controller: 'newCombinationCtrl'
     })
    .state('home.corpus',
     {
        url:'/corpus',
        templateUrl: 'pages/corpus.html',
        controller: 'corpusCtrl'
     })
    .state('home.corpus.new',
     {
        url:'/new',
        templateUrl: 'pages/new_corpus.html',
        controller: 'newCorpusCtrl',
        resolve: {
            getCorpusData: function(corpusService) {
                return corpusService.getCorpusData();
            },
            allCorpus: function(corpusService) {
                return corpusService.getAllCorpus();
            }
        }
     })
    .state('home.combination.edit',
     {
        url:'/edit/:combinationId',
        templateUrl: 'pages/new_combination.html',
        controller: 'editCombinationCtrl',
        resolve: {
            editCombination: function(combinationService, $stateParams) {
                return combinationService.editCombination($stateParams.combinationId);
            }
        }
     });

}]);

app.config(["$locationProvider", function($locationProvider) {
    //$locationProvider.html5Mode(false);
    //$locationProvider.hashPrefix('');
}]);

app.run(function($rootScope, $state, clientMiddleware){

	$rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {

        clientMiddleware.check(e, toState.name);

    });

    // $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    //   event.preventDefault();
    //   $state.go('bad_request');
    // });

    // $rootScope.$on('$routeChangeError', function(arg1, arg2, arg3, arg4){
    //     if(arg4.status == 404) {
    //         $state.go('bad_request');
    //     }
    // });

});