document.addEventListener('DOMContentLoaded', function() {

	// //阅读方向指示
    // var directionGuider = document.getElementById('directionGuider');
	// directionGuider.onclick = function(){
	// 	directionGuider.parentNode.nextElementSibling.childNodes[1].click();
	// }
	// // 画册方向转换
	// var gallery = document.getElementById('my-gallery');
	// if (gallery.getAttribute('readfromright')){
	// 	gallery.style.flexDirection = 'row-reverse'
	// }
	
	//根据首图尺寸设定本篇图片尺寸
	setImageSize();

	//移动端根据屏幕高度触发hover并禁用默认hover
	if (isTouchDevice()) {
		hoverAtCenterDOM();
	} 
})

function setImageSize(){
	let mangaBlocks = document.querySelectorAll('.mangaBlocks');
	mangaBlocks.forEach(mangaBlock =>{
		let img = new Image();
		img.src=mangaBlock.href;
		img.onload = function(){
			for (let i=0;i<mangaBlocks.length;i++){
				mangaBlock.setAttribute('data-pswp-width', img.width);
				mangaBlock.setAttribute('data-pswp-height', img.height);
			}
		}
	})	
}

function isTouchDevice(){
	return 'ontouchstart' in window || navigator.maxTouchPoints;
}

function hoverAtCenterDOM(){
	let posts = document.querySelectorAll('.post-preview');
	window.addEventListener('scroll',function(){
		posts.forEach(function(post){
			if(	postAtCenter(post) ){
				hoverOn(post)
			} else {
				hoverOff(post)
			}	
		});
	});
	
}

function postAtCenter(post){
	return post.getBoundingClientRect().top < window.innerHeight*0.4 && post.nextElementSibling.getBoundingClientRect().bottom >= window.innerHeight*0.4
}

function hoverOn(post){
	post.classList.add('active');
	post.classList.remove('inactive');
}

function hoverOff(post){
	post.classList.replace('active','inactive');
}