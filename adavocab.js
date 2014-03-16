if (Meteor.isClient) {
    Session.setDefault('duration',5000);
    Session.setDefault('question',0);
    Session.setDefault('techScore',0);
    Session.setDefault('poeticScore',0);
    Session.setDefault('rotate','go')

    var question = [{
	word: "Structure",
	answers: [
	    {choice: "The relationship or organization of the component parts of a work of art or literature",
	    type: "wrong"},
	    {choice: "Something built or constructed like a building or a bridge",
	     type:"poetic"},
	    {choice: "A complex system considered from the point of view of the whole rather than of any single part",
	     type:"wrong"},
	    {choice: "A particular way of storing and organizing data.",
	     type:"technical"}]
    },{
	word: "string",
	answers: [
	    {choice: "Any series of things arranged or connected in a line or following closely one after another",
	    type: "poetic"},
	    {choice: "something resembling a cord or thread.",
	     type:"wrong"},
	    {choice: "to make tense, as the sinews, nerves, mind, etc.",
	     type:"wrong"},
	    {choice: " a sequence of characters",
	     type:"technical"}]
    }, {
	word: "process",
	answers: [
	    {choice: "An instance of a computer program that is being executed.",
	     type: "technical"},
	    {choice: "The action of going forward or on.",
	     type: "wrong"},
	    {choice:  "the summons, mandate, or writ by which a defendant or thing is brought before court for litigation.",
	     type: "wrong"},
	    {choice: "to handle (papers, records, etc.) by systematically organizing them.",
	     type: "poetic"}]
	}, {
	    word: "character",
	    answers: [
		{choice: "A part or role, as in a play or film.",
		 type: "wrong"},
		{choice: "A symbol, such as a letter, number, or punctuation mark, that occupies one byte of memory.",
		 type: "technical"},
		{choice: "Moral or ethical quality.",
		 type: "poetic"},
		{choice: "An odd, eccentric, or unusual person.",
		 type: "wrong"}]
	    },{
		word: "code",
		answers: [
		    {choice: "A systematically arranged collection or compendium of laws, rules, or regulations.",
		     type: "poetic"},
		    {choice: "A system used for secret communication.",
		     type: "wrong"},
		    {choice: "A system of symbols and rules used to represent instructions to a computer.",
		     type: "technical"},
		    {choice: "A patient whose heart has stopped beating, as in cardiac arrest.",
		     type: "wrong"}]
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
	   //This code maybe useful if we decide to use different poems for different words.
//	   poemhtml = $('#poem-function').html()
//	   $('#poem').html(poemhtml);
	   $('#poem.p').wrapInTag({words: ["Function", question[q].word], tag: "em"}); //This isn't working!
	   for (var i = 0; i < question[q].answers.length; i++) {
	       $('#choices').append("<li><a href=# class=' "+ question[q].answers[i].type + "'>"+question[q].answers[i].choice +"</a></li>");
	   }
	   rotation();
       } else {
	   //Game is over all the questions are done!
	   if ( Session.get('techScore') > 3 ) {
	       $('#saveAda').replaceWith('<div id="saveAda"><h4>You Saved Ada from the Madness of Poetry!!</h4></div>')
	       Session.set('rotate','stop');
	       $('#main').append($('#math'))
	       $('#math li').bounce({
		   'speed': 7
	       });
	   } else if (Session.get('poeticScore') > 3 ) {
	       $('#saveAda').replaceWith('<div id="saveAda"><h4>Oh no!!  Ada is spinning in her grave from the Madness of Poetry</h4></div>')
	       Session.set('duration',100)
	       rotation();
	   } else {
	       //didn't get more then 3 of either technical or poetic.
	       $('#saveAda').replaceWith('<div id="saveAda"><h4>Please Try Again</h4></div>')
	       Session.set('rotate','stop');
	   }
	   $('#saveAda').append("<p> You choose " + Session.get('techScore') + " correct Computer Science definitions and " + Session.get('poeticScore') + " definitions that matched the poem's usage out of " + question.length + " total questions.");
	   $('#choices').append("<li class='reset'>Play Again?</li>");
       }
	   
   };
    


    Template.ada.events({
	'tap, click #choices': function (e) {
	    var newDuration = Session.get('duration'); 
	    if ($(e.target).hasClass('wrong')) {
		newDuration = Session.get('duration')*.75;
	    } else if ($(e.target).hasClass('poetic')) {
		newDuration = Session.get('duration')*.5;
		poeticScore = Session.get('poeticScore') + 1;
		Session.set('poeticScore',poeticScore);
	    }  else if ($(e.target).hasClass('technical')) {
		newDuration = Session.get('duration')*2;
		techScore = Session.get('techScore') + 1;
		Session.set('techScore',techScore);
	    } else if  ($(e.target).hasClass('reset')) {
		newDuration = 5000;
		$('#math').hide();
		Session.set('question',-1);  //We add 1 below
		Session.set('techScore',0);
		Session.set('poeticScore',0);
		Session.set('rotate','go')
	    }
	    if (newDuration < 150) {
		newDuration = 200
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

  // http://stackoverflow.com/a/7873502

$.fn.bounce = function(options) {
    console.log('bounce');
    var settings = $.extend({
        speed: 10
    }, options);

    return $(this).each(function() {
        console.log('inside each');
        var $this = $(this),
            $parent = $this.parent(),
            height = $parent.height(),
            width = $parent.width(),
            top = Math.floor(Math.random() * (height / 2)) + height / 4,
            left = Math.floor(Math.random() * (width / 2)) + width / 4,
            vectorX = settings.speed * (Math.random() > 0.5 ? 1 : -1),
            vectorY = settings.speed * (Math.random() > 0.5 ? 1 : -1);

	console.log($this);
        // place initialy in a random location
        $this.css({
            'top': top,
            'left': left
        }).data('vector', {
            'x': vectorX,
            'y': vectorY
        });

        var move = function($e) {
            
            var offset = $e.offset(),
                width = $e.width(),
                height = $e.height(),
                vector = $e.data('vector'),
                $parent = $e.parent();

            if (offset.left <= 0 && vector.x < 0) {
                vector.x = -1 * vector.x;
            }
            if ((offset.left + width) >= $parent.width()) {
                vector.x = -1 * vector.x;
            }
            if (offset.top <= 0 && vector.y < 0) {
                vector.y = -1 * vector.y;
            }
            if ((offset.top + height) >= $parent.height()) {
                vector.y = -1 * vector.y;
            }

            $e.css({
                'top': offset.top + vector.y + 'px',
                'left': offset.left + vector.x + 'px'
            }).data('vector', {
                'x': vector.x,
                'y': vector.y
            });
            
            setTimeout(function() {
                move($e);
            }, 50);
            
        };
        
        move($this);
    });

};

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}


