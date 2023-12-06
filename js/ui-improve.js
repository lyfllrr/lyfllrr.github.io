document.addEventListener('DOMContentLoaded', function() {
    var directionGuider = document.getElementById("directionGuider");
	directionGuider.onclick = function(){
		directionGuider.parentNode.nextElementSibling.childNodes[1].click();
	}
})