document.addEventListener("DOMContentLoaded", function() {
    const image = document.querySelector('.sticky-pic');
    
    if (!image) {
        return;
    }

    const offset = 330; // num pixels to scroll past before sticking
    const stickyStart = image.offsetTop + offset;

    window.addEventListener('scroll', function() {
        const currentScroll = window.scrollY;
       
        if (currentScroll >= stickyStart) {
            if (image.style.position !== 'fixed') {
                image.style.position = 'fixed';
                image.style.top = '10px';
            }
        } else {
            if (image.style.position !== 'absolute') {
                image.style.position = 'absolute';
                image.style.top = 'auto';
            }
        }
        
        if (currentScroll >= stickyStart + 1700) {
            image.src = '../images/thor.jpg'; // 5
            console.log('Image changed to thor.jpg');
        } else if (currentScroll >= stickyStart + 1250) {
            image.src = '../images/spiderman.jpeg'; // 4
            console.log('Image changed to spiderman.jpeg');
        } else if (currentScroll >= stickyStart + 800) {
            image.src = '../images/ironman.png'; // 3
            console.log('Image changed to ironman.png');
        } else if (currentScroll >= stickyStart + 350) {
            image.src = '../images/blackpanther.jpg'; // 2
            console.log('Image changed to blackpanther.jpg');
        } else {
            image.src = '../images/batman.jpg'; // init
        }
    });
});
