export class MainController {
  private userBeautified: string;
  private organizationBeautified: string;
  private organizationMemberBeautified: string;
  /* @ngInject */
  constructor (private toastr: any, private AuthToken: any, 
      private $state: any, private user: any, private organizationMember: any, 
      private organization: any, private companies: any, private leads: any) { 
    this.toastr = toastr;
    this.userBeautified = JSON.stringify(this.user, null, 4);
    this.organizationBeautified = JSON.stringify(this.organization, null, 4);
    this.organizationMemberBeautified = JSON.stringify(this.organizationMember, null, 4);
    
    console.log(user, organizationMember, organization, companies);
    
    
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
