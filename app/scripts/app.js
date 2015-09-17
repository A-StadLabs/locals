/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  //'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  var labsuser = false;

  function importPage(url){
    return new Promise(function(resolve, reject){
      Polymer.Base.importHref(url, function(e){
        resolve(e.target.import);
      }, reject);
    });
  };

  app.displayInstalledToast = function() {
    document.querySelector('#caching-complete').show();
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
    var app = document.querySelector('#app');
  });

  app._ofuserEmpty = function(){
    console.log("Openfireuser not found.");
    importPage("elements/labs002-newopenfireuser/labs002-newopenfireuser.html").then(function(){
      var element = document.createElement("labs002-newopenfireuser");
      body.appendChild(element);
      element._createOpenFireUser();
    }, function(err){
      console.log(err, "error");
    });
  };

  app._ofuserFound = function(){
    console.log("Openfireuser found.");

    // Eerst checken of er ook al een locals user is aangemaakt.
    // Anders gaan we een locals user aanmaken. 
    if(labsuser){

      // We hebben een locals user gevonden.
      importPage("elements/labs002-stage/labs002-stage.html").then(function(){
        var element = document.createElement("labs002-stage");
        body.appendChild(element);
      }, function(err){
        console.log(err, "error");
      });
    } else {
      importPage("elements/lo-newuser/lo-newuser.html").then(function(){
        var element = document.createElement("lo-newuser");
        body.appendChild(element);
      }, function(err){
        console.log(err, "error");
      });
    }
  };

  app._localuserFound = function(){
    console.log("Local user found.");
    labsuser = true;
  };
  




})(document);
