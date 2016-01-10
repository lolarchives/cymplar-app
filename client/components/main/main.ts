export class MainController {
  
  /* @ngInject */
  constructor (private toastr: any, private AuthToken: any, private $state: any) { 
    this.toastr = toastr;
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
