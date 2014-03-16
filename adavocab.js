if (Meteor.isClient) {
    Session.setDefault('duration',5000);
    Session.setDefault('question',0);
    Session.setDefault('techScore',0);
    Session.setDefault('poeticScore',0);
    Session.setDefault('rotate','go')

    var question = [{
	word: "Function",
	answers: [
	    {choice: "An activity or purpose natural to or intended for a person or thing",
	    type: "poetic"},
	    {choice: "Any ceremonious public or social gathering or occasion",
	     type:"wrong"},
	    {choice: "To perform a specified action or activity; work; operate",
	     type:"wrong"},
	    {choice: "A named section of a program that performs a specific task",
	     type:"technical"}],
	poemId: "poem-function"
    },
    {
	word: "shell",
	answers: [
	    {choice: "Something like the hard protective outer case of a snail or clam or egg.",
	    type: "poetic"},
	    {choice: "To remove the outer layer of nuts, seeds or peas",
	     type:"wrong"},
	    {choice: "A brand of gas station",
	     type:"wrong"},
	    {choice: "A command-line interface, which means it is soley text-based",
	     type:"technical"}],
	poemId: "poem-function"
    }]
	
    var rotation = function (){
	if (Session.get('rotate') == 'stop') {
	    $('#image').stopRotate;
	} else {
	    $("#image").rotate({
		angle: 0,
		animateTo:360, 
		duration: Session.get('duration'),
		callback: rotation
	    });
	}
    }


    Template.ada.helpers ({
	word: function() {
	    q = Session.get('question');
	    console.log(question.length);
	    if (q < question.length) { 
		word = question[q].word
	    } else {
		if ( Session.get('techScore') > Session.get('poeticScore')) {
		    word = "win"
		} else {
		    word = "lose"
		}
	    }
	    return word
	},
    })

   Template.ada.rendered = function() {
       q = Session.get('question')

       if (q < question.length) { 
	   $('#poem').append($('#poem-function'))
	   $('#poem.p').wrapInTag({words: ["Function", question[q].word], tag: "em"}); //This isn't working!
	   for (var i = 0; i < question[q].answers.length; i++) {
	       $('#choices').append("<li class=' "+ question[q].answers[i].type + "'>"+question[q].answers[i].choice +"</li>");
	   }
	   rotation();
       } else {
	   //Game is over all the questions are done!
	   if ( Session.get('techScore') > Session.get('poeticScore')) {
	       $('#saveAda').replaceWith('<h4>You Saved Ada from the Madness of Poetry!!</h4>')
	       Session.set('rotate','stop');
	   } else {
	       $('#saveAda').replaceWith('<h4>You FAILED to saved Ada from the Madness of Poetry</h4>')
	       Session.set('duration',100)
	       rotation();
	   }
	   $('#choices').append("<li class='reset'>Play Again?</li>");
       }
	   
   };
    


    Template.ada.events({
	'tap, click #choices': function (e) {
	    if ($(e.target).hasClass('wrong')) {
		newDuration = Session.get('duration')*.5;
	    } else if ($(e.target).hasClass('poetic')) {
		newDuration = Session.get('duration')*.25;
		poeticScore = Session.get('poeticScore') + 1;
		Session.set('poeticScore',poeticScore);
	    }  else if ($(e.target).hasClass('technical')) {
		newDuration = Session.get('duration')*2;
		techScore = Session.get('techScore') + 1;
		Session.set('techScore',techScore);
	    } else if  ($(e.target).hasClass('reset')) {
		newDuration = 5000;
		Session.set('question',-1);  //We add 1 below
		Session.set('techScore',0);
		Session.set('poeticScore',0);
		Session.set('rotate','go')
	    }		
	    Session.set('duration', newDuration);
	    nextQ = Session.get('question') + 1;
	    Session.set('question', nextQ);
	    console.log("New duration", newDuration);
	}
    });

    // http://stackoverflow.com/a/1646618

    $.fn.wrapInTag = function(opts) {

	var tag = opts.tag || 'strong',
        words = opts.words || [],
        regex = RegExp(words.join('|'), 'gi'),
        replacement = '<' + tag + '>$&</' + tag + '>';

	// http://stackoverflow.com/a/298758
	$(this).contents().each(function () {
            if (this.nodeType === 3) //Node.TEXT_NODE
            {
		// http://stackoverflow.com/a/7698745
		$(this).replaceWith(getText(this).replace(regex, replacement));
            }
            else if (!opts.ignoreChildNodes) {
		$(this).wrapInTag(opts);
            }
	});
    };

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}


