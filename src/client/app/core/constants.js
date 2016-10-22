/* global toastr:false, moment:false */
(function () {
  angular
    .module('app.core')
    .constant('toastr', toastr)
    .constant('moment', moment);
}());
