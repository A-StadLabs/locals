/*
Copyright (c) 2015 The Locals Project Authors. All rights reserved.
See authors.md for a list of all members.
*/


  	//'use strict';

  	/**
	* Bind to Polymer
	*/

  var server = "ws://www.opantwerpen.be:7070/ws/server";
  var domein = "opantwerpen.be";

	var stage;
	var app;

	var conn;

  	window.addEventListener('WebComponentsReady', function() {
      // imports are loaded and elements have been registered
      //stage = document.getElementById("pages");
      //app = document.querySelector("labs002-stage");
    });


  	/**
  	* Sending of messages
  	* to: the device address
  	*	command: as a string. SYNC / SHARE / USERUPDATE / VERIFY / VALIDATE / DATAUPDATE
  	*	objectname: as a string. (the object's key)
  	* objectconfig: the "meta" data or configuration (not encrypted)
  	*	objectdata: the encrypted data object that's verified
  	*/

  	function sendMessage(partner, command, objectname, objectconfig, objectdata){
  		console.log("Preparing to send message: ",partner+'//'+command+'//'+objectname+'//'+objectconfig+'//'+objectdata);
      var message = command+'//'+objectname+'//'+objectconfig+'//'+objectdata;
      var msg = $msg({
        to: partner+'@'+domein
      }).cnode(Strophe.xmlElement('body', message)).up()
      .c('active', {xmlns: "http://jabber.org/protocol/chatstates"});
      conn.send(msg);
  	};


  	/**
  	* Receiving of messages
  	*/

  	function receiveMessage(msg){
      console.log("Message received: ", msg);
      var that = this;
      var to = msg.getAttribute('to');
      var from = msg.getAttribute('from');
      var type = msg.getAttribute('type');
      var elems = msg.getElementsByTagName('body');
      var body = elems[0];
      if(body!=null){

        var bodymsg = Strophe.getText(body);
        bodymsg = Strophe.xmlunescape(bodymsg);

        var commandarray = bodymsg.split("//");

        var partner = from;
        var command = commandarray[0];
        var objectname = commandarray[1];
        var objectconfig = commandarray[2];
        var objectdata = commandarray[3];

        //processCommand(partner, command, objectname, objectconfig, objectdata);
        console.log("processCommand: ", partner, command, objectname, objectconfig, objectdata);
        switch(command){
          case "SYNC":
            // Another device wants to sync with this device. This device should say yes or no.
            console.log("Een ander toestel wil al jouw gegevens synchroniseren. Is dat ok?");
            openDialog("Sync", "Een ander toestel wil al jouw gegevens synchroniseren. Is dat ok?");
            return true;
          break;
          case "USERUPDATE":
            // I am a sync/peer for this user so I keep myself up to date.
            // Overwrite the local userobject with the one received.
            console.log("Volledige data wordt gesynct.");
            app.localenc = objectdata;
            app.localapi.lastupdate = Date.now();
            window.location = "/";
            return true;
          break;
          case "VERIFY":
            // Another user wants a dataset verified by this user
            console.log("Iemand wil een dataset laten valideren.");
            //app.openDialog("Wil je deze dataset van Kristien valideren?");
            openDialog("Verify", "Iemand wil een dataset laten valideren.");
            return true;
          break;
          case "VALIDATE":
            // Validate the dataset on this device by adding the sender as a peer
            console.log("Er komt een nieuwe getuige bij.");
            //app.localapi.collection[objectname].peers.push(partner);
            //app.localapi.lastupdate = Date.now();
            return true;
          break;
          case "DATAUPDATE":
            // The incoming dataset has been updated. This device should update the objectconfig and check wether the objectdata has been changed. When changed, the the verification should be cancelled.
            //app.localapi.collection[objectname].peers[partner] = objectconfig;
            console.log("Een van jouw mignons heeft een dataset veranderd.");
            //if(app.localapi.collection[objectname].data === objectdata);

            //app.localapi.lastupdate = Date.now();
            return true;
          break;
        };
      };
          
   	return true;
    };

   	function processCommand(partner, command, objectname, objectconfig, objectdata){
      console.log("processCommand: ", partner, command, objectname, objectconfig, objectdata);
   		switch(command){
   			case "SYNC":
   				// Another device wants to sync with this device. This device should say yes or no.
   				console.log("Een ander toestel wil al jouw gegevens synchroniseren. Is dat ok?");
   			break;
   			case "USERUPDATE":
   				// I am a sync/peer for this user so I keep myself up to date.
   				// Overwrite the local userobject with the one received.
   				console.log("Volledige data wordt gesynct.");
   				app.localenc = objectdata;
   				app.localapi.lastupdate = Date.now();
   				window.location = "/";
   			break;
   			case "VERIFY":
   				// Another user wants a dataset verified by this user
   				console.log("Iemand wil een dataset laten valideren.");
   				//app.openDialog("Wil je deze dataset van Kristien valideren?");
   			break;
   			case "VALIDATE":
   				// Validate the dataset on this device by adding the sender as a peer
   				console.log("Er komt een nieuwe getuige bij.");
   				//app.localapi.collection[objectname].peers.push(partner);
   				//app.localapi.lastupdate = Date.now();
   			break;
   			case "DATAUPDATE":
   				// The incoming dataset has been updated. This device should update the objectconfig and check wether the objectdata has been changed. When changed, the the verification should be cancelled.
   				//app.localapi.collection[objectname].peers[partner] = objectconfig;
   				console.log("Een van jouw mignons heeft een dataset veranderd.");
   				//if(app.localapi.collection[objectname].data === objectdata);

   				//app.localapi.lastupdate = Date.now();
   			break;
   		};
   	};

   	function loginOpenfire(username, password, fn){
   		console.log('starting login openfire for user ', username, ' with pass ', password);

      	conn = new Openfire.Connection(server, function(e){
        	console.log(e);
      	});

      	var that = this;

      	conn.connect(username, password, function(status){
        	if (status === Strophe.Status.CONNECTED) {
          		// Als em goed is ingelogd doe dit
          		
          		//fn();
          		//that.joinRoom(username, password, "astadlabs");
          		conn.addHandler(receiveMessage);
          		conn.send($pres().tree());
          		that.fire('logged-in');
          		that.connected = true;
              console.log('--- Connected to OpenFire');
          		//that.selected = 1;
		        // Read data from localstorage
		        //that.$.localapielem.readData();
		        //showDialog("Getuige worden", "Wil je getuige worden van Michael?"); 
        	} else if (status === Strophe.Status.DISCONNECTED) {
        		// Als er iets fout ging met login doe dit
          		that.fire('disconnected');
          		//that.selected = 0;
          		//that.error = "error!";
          		window.location = '/';
          		//that.connected = false;
        	};
      	});
   	};

    function object2Array(input){
      var newarray = [];
      //var newarray = input;
      var p = input;
      for (var key in p) {
        if (p.hasOwnProperty(key)) {
          console.log(key ," -> " , p[key]);
          console.log(p[key].name);
          newarray.push({
              objectname: p[key].name, 
              objectconfig: p[key].config,
              objectdata: p[key].data,
              objectpeers: p[key].peers,
              objectcomponent: p[key].component
           });
          console.log('New objectsdata: ', newarray);
        }

      };
      //this.newarray = newarray;
      return newarray;
    };