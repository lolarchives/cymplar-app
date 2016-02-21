import './signup';
import {BACK_END_ROUTE, SignUp} from '../../core/dto';


namespace SignUpServices {

	
	
	/** @ngInject */
    function $SignUpRESTResource($resource: angular.resource.IResourceService): angular.resource.IResourceClass<any> {
		let url = '/api/signup';
		
		let resources: angular.resource.IResourceClass<any> = $resource(url, {}, {

			'getIndustries': {
				method: 'GET',
				url: BACK_END_ROUTE + '/industry/_find'
			},
			'getCountries': {
				method: 'GET',
				url: BACK_END_ROUTE + '/country/_find'
			},
			'getCities': {
				method: 'GET',
				url: BACK_END_ROUTE + '/city/_find'
			},
			'getStates': {
				method: 'GET',
				url: BACK_END_ROUTE + '/state/_find'
			},
			'getRoles': {
				method: 'GET',
				url: BACK_END_ROUTE + '/account-member-role/_find'	
			},
			'isAccountUserExisted': {
				method: 'GET',
				url: BACK_END_ROUTE + '/account-user/_exist'
			},
			'isAccountOrganizationExisted': {
				method: 'GET',
				url: BACK_END_ROUTE + '/account-organization/_exist'
			},
			'isAccountOrganizationMemberExisted': {
				method: 'GET',
				url: BACK_END_ROUTE + '/account-organization-member/_exist'
			},
			'signUp': {
				method: 'POST',
				url: BACK_END_ROUTE + '/signup'
			}

		});

		return resources;
	};


	export class $SignUpRESTService {
		constructor(private $http: angular.IHttpService, private $SignUpRESTResource: any, private $q: any, private $resourceHelper: any) {

		}
		getCountries = (params: any) => {
			return this.$resourceHelper.resourceRESTCall(this.$SignUpRESTResource, 'getCountries', params);
		};
		getIndustries = (params: any) => {
			return this.$resourceHelper.resourceRESTCall(this.$SignUpRESTResource, 'getIndustries', params);
		};
		getStates = (country: any) => {
			return this.$resourceHelper.resourceRESTCall(this.$SignUpRESTResource, 'getStates', {country: country});
		};
		getCities = (state: any) => {
			return this.$resourceHelper.resourceRESTCall(this.$SignUpRESTResource, 'getCities', {state: state});
		};
		getRoles = (params: any) => {
			return this.$resourceHelper.resourceRESTCall(this.$SignUpRESTResource, 'getRoles', params );
		};
		isAccountUserExisted = (username: string) => {
			return this.$resourceHelper.resourceRESTCall(this.$SignUpRESTResource, 'isAccountUserExisted', {username: username});
		};
		isAccountOrganizatioMemberExisted = (email: string) => {
			return this.$resourceHelper.resourceRESTCall(this.$SignUpRESTResource, 'isAccountOrganizationMemberExisted', {email: email});
		};
		isAccountOrganizationExisted = (organizationName: string) => {
			return this.$resourceHelper.resourceRESTCall(this.$SignUpRESTResource, 'isAccountOrganizationExisted', {domain: organizationName });
		};
		signUp = (signUpDetails: SignUp) => {
			return this.$resourceHelper.resourceRESTCall(this.$SignUpRESTResource, 'signUp', signUpDetails, true);
		};

	};

	function get$SignUpRESTServiceInstance($http: angular.IHttpService, $SignUpRESTResource: any, $q: any, $resourceHelper: any) {
        return new $SignUpRESTService($http, $SignUpRESTResource, $q, $resourceHelper);
    }

	angular
		.module('app.signup')
		.factory('$SignUpRESTResource', $SignUpRESTResource)
		.factory('$SignUpRESTService', get$SignUpRESTServiceInstance);
}
