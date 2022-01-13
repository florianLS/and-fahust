const headers = document.querySelectorAll('.highlight');
const modal = document.querySelector('#aboutModal');
// debounce function to limit function running to 1 time every 10ms. just copied directly from stackoverflow
function debounce(func, wait = 10, immediate = true) {
	var timeout;
	return function() {
	  var context = this, args = arguments;
	  var later = function() {
		 timeout = null;
		 if (!immediate) func.apply(context, args);
	  };
	  var callNow = immediate && !timeout;
	  clearTimeout(timeout);
	  timeout = setTimeout(later, wait);
	  if (callNow) func.apply(context, args);
	};
 }

// function that will make headers font-size increase when scrolled into view!
function dynamicHeaders(e){
// Run code for every header in modal
	headers.forEach(header => {
// set up constants defining when headers are in view; Math needs work here
// totalScroll tracks pixels for exact bottom of what is in view;
const totalScroll = (modal.scrollTop + window.innerHeight);
// should show if screen has been scrolled more than each header.offsetTop
const inView = totalScroll > header.offsetTop;
const headerBottom = (header.offsetTop + header.clientHeight); 
const notScrolledPast = headerBottom < totalScroll;
console.log(`${notScrolledPast} ${header.offsetTop} ${header.clientHeight} ${totalScroll}`);
// add class that 'pops up' headers when scrolled into view.
	if(inView){
	header.classList.add('fadeIntoView');	
// if header is not in view, remove that class. 
	} else {
		header.classList.remove('fadeIntoView');	
		}
	})
};
// modal scroll listener
modal.addEventListener('scroll', debounce(dynamicHeaders));