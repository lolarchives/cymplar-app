export class MainController {
  private userBeautified: string;
  private organizationBeautified: string;
  private organizationMemberBeautified: string;
  /* @ngInject */
  constructor (private toastr: any, private AuthToken: any, 
      private $state: any, private user: any, private organization_member: any, private organization: any) { 
    this.toastr = toastr;
    this.userBeautified = JSON.stringify(this.user, null, 4);
    this.organizationBeautified = JSON.stringify(this.organization, null, 4);
    this.organizationMemberBeautified = JSON.stringify(this.organization_member, null, 4);
  }

  showToastr() {
    this.toastr.info('Welcome');
  }
  
  logout() {
    this.AuthToken.setToken();
    this.AuthToken.setIdO();
    this.$state.go('login');
  }
  
}
