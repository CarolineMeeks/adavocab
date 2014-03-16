if (Meteor.isClient) {
    var question = {
	word: "Function",
	answers: {
	    choice: "an activity or purpose natural to or intended for a person or thing",
	    type: "poetic",
	    choice: "any ceremonious public or social gathering or occasion",
	     type:"wrong",
	    choice: "to perform a specified action or activity; work; operate",
	     type:"wrong",
	    choice: "a named section of a program that performs a specific task",
	     type:"technical"
	},
	poemId: "poem-function"
    }
	
    var rotation = function (){
	$("#image").rotate({
	    angle:0, 
	    animateTo:360, 
	    callback: rotation,
	    easing: function (x,t,b,c,d){        // t: current time, b: begInnIng value, c: change In value, d: duration
		return c*(t/d)+b;
	    }
	});
    }

    Session.setDefault('playing',false);

    Template.ada.helpers ({
	word: function() {
	    word = question.word
	    return word
	},
    })

   Template.ada.rendered = function() {
       $('#poem').append($('#poem-function'))
       $('#poem.#poem-function').show();
   };
    


    Template.ada.events({
	'click input': function () {
	    rotation();
	}
    });

 }

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
