import '../auth/auth.service';  
/** @ngInject */
export function mainNavbar(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {
      user: '=',
      organizationMember: '=',
      organization: '=',
      companies: '=',

    },
    templateUrl: 'components/navbar/navbar.html',
    controller: NavbarController,
    controllerAs: 'navCtrl',
    transclude: true,
    bindToController: true
  };

}

/** @ngInject */
export class NavbarController {
  public relativeDate: string;
  public creationDate: number;
  private user: any;
  private organizationMember: any;
  private organization: any;
  private leftPanelOpen: boolean;
  private rightPanelOpen: boolean;
  private displayInfo: boolean;
  private console: Console;
  private STATE_WITH_RIGHT_PANEL = ['main.dashboard', 'main.addressBook.newCompany', 'main.addressBook.selectedCompany'];

  constructor(moment: moment.MomentStatic, private $state: any, 
    private $scope: angular.IScope, private AuthToken: any,
    private $AddressBookRESTService: any) {
   
    $scope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
      if (this.STATE_WITH_RIGHT_PANEL.indexOf(toState.name) !== -1) {
        this.displayInfo = false;
      }

      // make sure panel is closed
      this.leftPanelOpen = false;
      this.rightPanelOpen = false;

    });
    if (this.STATE_WITH_RIGHT_PANEL.indexOf($state.current.name) !== -1) {
      this.displayInfo = true;
    }

  }
  logout() {
    this.AuthToken.logout();
    this.$state.go('login');
  }
}
