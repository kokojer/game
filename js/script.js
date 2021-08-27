function testWebP(callback) {

    var webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

    if (support == true) {
        document.querySelector('body').classList.add('webp');
    }else{
        document.querySelector('body').classList.add('no-webp');
    }
});
"use strict"

const spollersArray = document.querySelectorAll('[data-spollers]');
if(spollersArray.length > 0){
    const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
        return !item.dataset.spollers.split(",")[0];
    });

    if(spollersRegular.length > 0) {
        initSpollers(spollersRegular);
    }

    const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
        return item.dataset.spollers.split(",")[0];
    });

    if(spollersMedia.length > 0){
        const breakpointsArray = [];
        spollersMedia.forEach(item => {
            const params = item.dataset.spollers;
            const breakpoint = {};
            const paramsArray = params.split(',');
            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : 'max';
            breakpoint.item = item;
            breakpointsArray.push(breakpoint);
        })

        let mediaQueries = breakpointsArray.map(function (item) {
            return  '(' + item.type + '-width: ' + item.value + "px)," + item.value + "," + item.type; 
        });
        
        mediaQueries = mediaQueries.filter(function (item, index, self) {
            return self.indexOf(item) === index;
        })

        mediaQueries.forEach(breakpoint => {
            const paramsArray = breakpoint.split(',');
            const mediaBreakpoint = paramsArray[1];
            const mediaType = paramsArray[2];
            const matchMedia = window.matchMedia(paramsArray[0]);


            const spollersArray = breakpointsArray.filter(function (item) {
                if(item.value === mediaBreakpoint && item.type === mediaType) {
                    return true;
                }
            });

            console.log(spollersArray);

            matchMedia.addEventListener('change', function () {
                initSpollers(spollersArray, matchMedia);
            });

            initSpollers(spollersArray, matchMedia)
        })
    }

    function initSpollers(spollersArray, matchMedia = false) {
        spollersArray.forEach(spollersBlock => {
            spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
            // console.log(spollersBlock);
            if(matchMedia.matches || !matchMedia){
                spollersBlock.classList.add('_init');
                initSpollerBody(spollersBlock);
                spollersBlock.addEventListener('click', setSpollerAction);

            }else{
                spollersBlock.classList.remove('_init');
                initSpollerBody(spollersBlock, false);
                spollersBlock.removeEventListener("click", setSpollerAction);
            }
        })
    }

    function initSpollerBody(spollersBlock,hideSpollerBody = true) {
        const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
        if(spollerTitles.length > 0){
            spollerTitles.forEach(spollerTitle => {
                if(hideSpollerBody){
                    spollerTitle.removeAttribute('tabindex');
                    if(!spollerTitle.classList.contains('_active')){
                        spollerTitle.nextElementSibling.hidden = true;
                    }

                    
                }else{
                    spollerTitle.setAttribute('tabindex', '-1')
                    spollerTitle.nextElementSibling.hidden = false;
                }
            })
        }
    }

    function setSpollerAction(e) {
        const el = e.target;
        if(el.hasAttribute('data-spoller') || el.closest('[data-spoller]')){
            const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
            const spollersBlock = spollerTitle.closest('[data-spollers]');
            const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
            if(!spollersBlock.querySelectorAll('._slide').length){
                if(oneSpoller && !spollerTitle.classList.contains('_active')){
                    hideSpollersBody(spollersBlock);
                }
                spollerTitle.classList.toggle('_active');
                _slideToggle(spollerTitle.nextElementSibling, 500);
            }
            e.preventDefault();
        }
    }

    function hideSpollersBody(spollersBlock) {
        const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
        if(spollerActiveTitle){
            spollerActiveTitle.classList.remove('_active');
            _slideUp(spollerActiveTitle.nextElementSibling, 500);
        }
    }
}


let _slideUp = (target, duration = 500) =>{
    if(!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = '0';
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() =>{
            target.hidden = true;
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');

        }, duration);
    }
}

let _slideDown = (target, duration = 500) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        if(target.hidden){
            target.hidden = false;
        }
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');

        }, duration);
    }
}

let _slideToggle = (target, duration = 500) =>{
    if(target.hidden){
        return _slideDown(target, duration);
    }else{
        return _slideUp(target, duration);
    }
};
//-------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () =>{
    const scrollItems = document.querySelectorAll('.scroll-item');
    const why = document.querySelector('.why__item');
    const steamCard = document.querySelector('.steam__card');
    const scrollAnimation = () => {
        let windowCenter = (window.innerHeight / 2 ) + window.scrollY;
        
        scrollItems.forEach(el =>{
            
            let scrollOffset = el.offsetTop + (el.offsetHeight / 2) - 300;
            if(windowCenter >= scrollOffset){
                // console.log(steamCard.offsetHeight);
                // console.log(steamCard.offsetTop);
                el.classList.add('animation-class');
            }else{
                el.classList.remove('animation-class');
            }
        })
    };
    scrollAnimation();
    window.addEventListener('scroll', () =>{
        scrollAnimation();
    })





})
//----------------------------------------------------------------------------------
const iconMenu = document.querySelector('.menu__icon');
if(iconMenu){
    const menuBody = document.querySelector('.menu__body');
    iconMenu.addEventListener('click', (e) =>{
        document.body.classList.toggle('_lock');
        iconMenu.classList.toggle('_active');
        menuBody.classList.toggle('_active');
    })
}

const gameButton = document.querySelector('.game__button');
if(window.innerWidth > 630){
    gameButton.addEventListener('click', () =>{
    window.scrollTo({
    top: 650,
    behavior: "smooth",
    });
    })
}else{
    gameButton.addEventListener('click', () =>{
    window.scrollTo({
    top: 500,
    behavior: "smooth",
    });
    })
}
//----------------------------------------------------------------------------
const swiper = new Swiper('.swiper-container', {
  // Optional parameters
    slidesPerView: 3,
    spaceBetween:50,
    autoplay: {
        stopOnLastSlide: true,

    },
    autoHeight: true,
    breakpoints: {
        1200:{
            slidesPerView: 3,
        },
        884:{
            slidesPerView: 2,
        },
        100:{
            slidesPerView: 1,
        },
    },
  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },
});
//-----------------------------------------------------------------
// const  spollerActive = document.querySelectorAll('.spoller__title');
// for(let item of spollerActive){
//     item.addEventListener('click', (e) =>{
//     setTimeout(() => {
//         var text = e.target.nextElementSibling;
//         var heightText = text.offsetHeight;
//         if(window.innerWidth > 1350){
//         const present = document.querySelector('.present');
//         present.style.paddingTop = 550 - heightText + 'px';
//         console.log('f')
//     }
//     }, 500);
    
  
   
//     // const text = 
// })
// }
