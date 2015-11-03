// Use this minimalistic definition file as bluebird dependency
// generate a lot of errors.

// Very bad one but fix compiler complaints.
declare module karma {
  var Server: any;
}

declare module "karma" {
  export = karma;
}
