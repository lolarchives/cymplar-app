export class MainAccountController {
  
  private userBeautified: string;
  
  constructor (private toastr: any, private AuthToken: any, 
      private $state: any, private user: any, private memberships: any) { 
    this.toastr = toastr;
    this.userBeautified = JSON.stringify(user, null, 4);
    console.log(user, memberships);
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
