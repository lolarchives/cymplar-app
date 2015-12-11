export class MainController {
  
  /* @ngInject */
  constructor (private toastr: any) { 
    this.toastr = toastr;
  }

  showToastr() {
    this.toastr.info('Welcome');
  }
  
}
