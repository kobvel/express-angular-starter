(function () {
  'use strict';

  angular
    .module('core')
    .factory('Seo', Seo);

  Seo.$inject = [];

  function Seo() {
    const self = this;
    const service = {
      getTitle,
      setTitle,
      getDescription,
      setDescription,
    };

    self.title = 'Mean';
    self.description = 'mean relational boilerplate';

    return service;

    // declarations
    //
    function getTitle() {
      return self.title;
    }

    function setTitle(title) {
      self.title = title;
    }

    function getDescription() {
      return self.description;
    }

    function setDescription(description) {
      self.description = description;
    }
  }
}());
