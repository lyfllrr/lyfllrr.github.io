document.addEventListener('DOMContentLoaded', function() {

	// //阅读方向指示
    // var directionGuider = document.getElementById("directionGuider");
	// directionGuider.onclick = function(){
	// 	directionGuider.parentNode.nextElementSibling.childNodes[1].click();
	// }
	// // 画册方向转换
	// var gallery = document.getElementById("my-gallery");
	// if (gallery.getAttribute('readfromright')){
	// 	gallery.style.flexDirection = "row-reverse"
	// }
	
	//根据首图尺寸设定本篇图片尺寸
	let mangaBlocks = document.getElementsByClassName("mangaBlocks");
	let img = new Image();
	img.src=mangaBlocks[0].href;
	img.onload =function(){
		for (let i=0;i<mangaBlocks.length;i++){
			mangaBlocks[i].setAttribute("data-pswp-width", img.width);
			mangaBlocks[i].setAttribute("data-pswp-height", img.height);
		}
	}
	
		



})