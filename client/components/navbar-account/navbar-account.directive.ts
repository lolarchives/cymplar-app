import '../auth/auth.service';  
/** @ngInject */
export function mainAccountNavbar(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {
      user: '=',
      memberships: '='
    },
    templateUrl: 'components/navbar-account/navbar-account.html',
    controller: NavbarAccountController,
    controllerAs: 'navAccCtrl',
    transclude: true,
    bindToController: true
  };

}

/** @ngInject */
export class NavbarAccountController {
  public relativeDate: string;
  public creationDate: number;
  private user: any;
  private organizationMember: any;
  private organization: any;
  private memberships: any;
  private leftPanelOpen: boolean;
  private rightPanelOpen: boolean;
  private displayInfo: boolean = false; 
  private displaySearchBar: boolean = false;
  private console: Console;
  private STATE_WITH_RIGHT_PANEL = ['main.dashboard', 'main.addressBook.selectedCompany', 'main.lead.selectedLead'];
  private STATE_WITH_SEARCH_BAR = ['main.dashboard', 'main.addressBook.allCompanies'];
  private queryString: string;
  
  constructor(moment: moment.MomentStatic, private $state: any, 
    private $scope: angular.IScope, private AuthToken: any,
    private $AddressBookRESTService: any) {
    this.console = console; 
 
    $scope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
      if (this.STATE_WITH_RIGHT_PANEL.indexOf(toState.name) === -1) {
        this.displayInfo = false;
      } else {
        this.displayInfo = true;
      }
      if (this.STATE_WITH_SEARCH_BAR.indexOf(toState.name) === -1) {
        this.displaySearchBar = false;
      } else {
        this.displaySearchBar = true;
      }
      
      // make sure panel is closed
      this.leftPanelOpen = false;
      this.rightPanelOpen = false;

    });
    if (this.STATE_WITH_RIGHT_PANEL.indexOf($state.current.name) !== -1) {
      this.displayInfo = true;
    }
    if (this.STATE_WITH_SEARCH_BAR.indexOf($state.current.name) !== -1) {
      this.displaySearchBar = true;
    }

  }
  logout() {
    this.AuthToken.logout();
    this.$state.go('login');
  }
  submitQuery() {
    console.log('Query string', this.queryString);
  }
}
