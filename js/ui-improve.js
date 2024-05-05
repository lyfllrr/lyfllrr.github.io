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

	//根据设备加载不同CSS
	loadCSSByDevice();

	//移动端根据屏幕高度触发hover并禁用默认hover
	if (isTouchDevice()) {
		hoverAtCenterDOM();
	} 

	//首次加载时不执行transition效果
	noTransitionUntilLoaded();
})

function isTouchDevice(){
	return 'ontouchstart' in window || navigator.maxTouchPoints;
}

function hoverAtCenterDOM(){
	let posts = document.querySelectorAll('.post-preview');
	window.addEventListener('scroll',function(){
		posts.forEach(post =>{
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


function loadCSSByDevice(){
    let headTag = document.getElementsByTagName('head')[0]
    const linkforCSSfile = document.createElement("link");
    linkforCSSfile.href = isTouchDevice() ? '/css/ui-improve-post-preview-touch-device.css' : '/css/ui-improve-post-preview-PC.css'
    linkforCSSfile.type = 'text/css'
    linkforCSSfile.rel = 'stylesheet'
    headTag.appendChild(linkforCSSfile);
}

function noTransitionUntilLoaded(){
	window.onload = function(){
		let transitionDOMs = document.querySelectorAll('.notransition');
		transitionDOMs.forEach(transitionDOM =>{
			transitionDOM.classList.remove('notransition');
		})
	}
}