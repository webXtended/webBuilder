var currentContainer;
var page, pop, lc;


function bindButtonClicks(){

	$(".generateHTMLButton").bind("click",function(){
		var whiteSheet,html;
		html = page.getHTML();
		whiteSheet = $("#whiteSheet");
		whiteSheet.text(html);
		whiteSheet.addClass("visible");
	});

	$(".enterHTMLButton").bind("click",function(){
		var whiteSheet;

		whiteSheet = $('#whiteSheet');
		whiteSheet.addClass("visible");
		whiteSheet.focus();
		$(this).removeClass('is-visible').addClass("is-hidden");
		$(".createLayoutButton").removeClass('is-hidden').addClass("is-visible");
	});

$(".createLayoutButton").bind("click",function(){
	var html, whiteSheet;

	whiteSheet = $("#whiteSheet");
//	html = whiteSheet.text();
	html = whiteSheet.children()[0].value;
	whiteSheet.removeClass('visible');
	// lc.createLayoutFromHTML(html);
	page.remove(0);
	lc.createLayoutFromHtml(html);
		$(this).removeClass('is-visible').addClass("is-hidden");
		$(".enterHTMLButton").removeClass('is-hidden').addClass("is-visible");

});

}



$().ready(function(){
	currentContainer = $("#compPanel");
	start();
	page = new DOM();
	lc = new LayoutCreator();
	
	bindButtonClicks();


emmet.require('textarea').setup({
	pretty_break: true, // enable formatted line breaks (when inserting
			            // between opening and closing tag)
	use_tab: true       // expand abbreviations by Tab key
});


});



function start(){
// target elements with the "draggable" class
interact('.tag')
.draggable({
		// enable inertial throwing
		inertia: false,
		// keep the element within the area of it's parent
		restrict: {
//      restriction: "parent",
//      restriction: document.getElementsByClassName("tagBox")[0],
restriction: function(){return currentContainer;},
//      restriction: currentContainer,
endOnly: true,
elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
},

		// call this function on every dragmove event
		onmove: dragMoveListener,
		// call this function on every dragend event
		onend: function (event) {
//      var textEl = event.target.querySelector('p');
//
//      textEl && (textEl.textContent =
//        'moved a distance of '
//        + (Math.sqrt(event.dx * event.dx +
//                     event.dy * event.dy)|0) + 'px');

console.log("drag eneded");
},

snap: {
	targets: [
	interact.createSnapGrid({ x: 30, y: 30 })
	],
	range: Infinity,
	relativePoints: [ { x: 0, y: 0 } ]
}
});

function dragMoveListener (event) {
	var target = event.target,
//    var target = event.target.cloneNode();
//    $('body').append($(target));

				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
				y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

		// translate the element
		target.style.webkitTransform =
		target.style.transform =
		'translate(' + x + 'px, ' + y + 'px)';

		// update the posiion attributes
		target.setAttribute('data-x', x);
		target.setAttribute('data-y', y);
	}

	// this is used later in the resizing demo
	window.dragMoveListener = dragMoveListener;
/* The dragging code for '.draggable' from the demo above
* applies to this demo as well so it doesn't have to be repeated. */

// enable draggables to be dropped into this
interact('.tagBox').dropzone({
	// only accept elements matching this CSS selector
//  accept: '#yes-drop',
accept: '.tag',
	// Require a 75% element overlap for a drop to be possible
	overlap: 0.75,

	// listen for drop related events:

	ondropactivate: function (event) {
		// add active dropzone feedback
		event.target.classList.add('drop-active');
	},
	ondragenter: function (event) {
		var draggableElement = event.relatedTarget,
		dropzoneElement = event.target;

		// feedback the possibility of a drop
		dropzoneElement.classList.add('drop-target');
		draggableElement.classList.add('can-drop');
//    draggableElement.textContent = 'Dragged in';
$(event.target).addClass("dropHover");
setContainer(event.target);

},
ondragleave: function (event) {
		// remove the drop feedback style
		event.target.classList.remove('drop-target');
		event.relatedTarget.classList.remove('can-drop');
//    event.relatedTarget.textContent = 'Dragged out';
//    event.target.style.background = "#fff";
//    currentContainer = $("#compPanel")[0];
//    event.target.style.border = "none";
$(event.target).removeClass("dropHover");

},
ondrop: function (event) {
//    event.relatedTarget.textContent = 'Dropped';
//    event.target.style.background = "#fff";
var node = createTagBox($(event.relatedTarget).attr("data-tagName")), childNode;
event.target.appendChild(node);
$(".tag").removeAttr("style");
//        event.target.style.border = "none";
$(event.target).removeClass("dropHover");
$(".tag").removeAttr("data-x");
$(".tag").removeAttr("data-y");

childNode = $(event.target).find("[data-newnode='true']")[0];

page.add(event.target, childNode);
$(childNode).removeAttr("data-newnode");




},
ondropdeactivate: function (event) {
		// remove active dropzone feedback
		event.target.classList.remove('drop-active');
		event.target.classList.remove('drop-target');
	}
});


/*
.draggable({
		onmove: window.dragMoveListener
	})
*/

interact('.tagBox')
.resizable({
	edges: { left: true, right: true, bottom: true, top: true }
}).on('resizemove', function (event) {
	var target = event.target,
	x = (parseFloat(target.getAttribute('data-x')) || 0),
	y = (parseFloat(target.getAttribute('data-y')) || 0);

				// update the element's style
				target.style.width  = event.rect.width + 'px';
				target.style.height = event.rect.height + 'px';

				// translate when resizing from top or left edges
				x += event.deltaRect.left;
				y += event.deltaRect.top;

				target.style.webkitTransform = target.style.transform =
				'translate(' + x + 'px,' + y + 'px)';

				target.setAttribute('data-x', x);
				target.setAttribute('data-y', y);
//        target.textContent = event.rect.width + '×' + event.rect.height;
});







}

function setContainer(container){
	var compPanel = $("#compPanel")[0];
	if(container.classList.contains("tagBox")){
		currentContainer = container;
	}
}


function createTagBox(tagName){
	var tagBoxTpl = $("#tagBoxTpl")[0];
	tagBoxTpl = tagBoxTpl.content.cloneNode(true);
	tagBoxTpl.children[0].setAttribute("data-tagname", tagName);
	tagBoxTpl.children[0].setAttribute("data-newNode", "true");
	return tagBoxTpl;
}

