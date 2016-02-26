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

  inactiveOrLostFilter = (value: any, index: any, array: any[]) => {
   
    return value.status == this.lostStatus || value.status == this.inactiveStatus
  }

  public relativeDate: string;
  public creationDate: number;
  private user: any;
  private organizationMember: any;
  private organization: any;
  private leftPanelOpen: boolean;
  private rightPanelOpen: boolean;
  private displayInfo: boolean = false;
  private displaySearchBar: boolean = false;
  private console: Console;
  private STATE_WITH_RIGHT_PANEL = ['main.dashboard', 'main.addressBook.selectedCompany', 'main.lead.selectedLead'];
  private STATE_WITH_SEARCH_BAR = ['main.dashboard', 'main.addressBook.allCompanies', 'main.lead.selectedLead', 'main.lead.allLeads'];
  private coldStatus: any;
  private opporturnityStatus: any;
  private signedStatus: any;
  private lostStatus: any;
  private inactiveStatus: any;
  private queryString: string;

  constructor(moment: moment.MomentStatic, private $state: any,
    private $scope: angular.IScope, private AuthToken: any,
    private $AddressBookRESTService: any,
    private $LeadRESTService: any) {
   

    for (let i = 0; i < $LeadRESTService.allLeadStatusesCached.length; i++) {
      if ($LeadRESTService.allLeadStatusesCached[i].code == 'COLD') {
        this.coldStatus = $LeadRESTService.allLeadStatusesCached[i]._id
      }

      if ($LeadRESTService.allLeadStatusesCached[i].code == 'OPP') {
        this.opporturnityStatus = $LeadRESTService.allLeadStatusesCached[i]._id
      }
      if ($LeadRESTService.allLeadStatusesCached[i].code == 'SIGN') {
        this.signedStatus = $LeadRESTService.allLeadStatusesCached[i]._id
      }
      if ($LeadRESTService.allLeadStatusesCached[i].code == 'IN') {
        this.inactiveStatus = $LeadRESTService.allLeadStatusesCached[i]._id
      }
      if ($LeadRESTService.allLeadStatusesCached[i].code == 'LOST') {
        this.lostStatus = $LeadRESTService.allLeadStatusesCached[i]._id
      }

    }

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
