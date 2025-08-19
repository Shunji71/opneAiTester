console.clear();

gsap.registerPlugin(Flip);

const items = document.querySelector('.items')
let flipping = false;
let count = 0;

// Face bits!

const faceBits = [
  '.left-eye',
  '.left-pupil',
  '.left-upper-lid',
  '.left-lower-lid',
  '.right-eye',
  '.right-pupil',
  '.right-upper-lid',
  '.right-lower-lid',
  '.mouth',
  '.teeth'
]

/* 
  We need to convert all the svg shapes 
  into paths for the SVGMorph plugin to 
  work later on.
*/
faceBits.forEach(bit => MorphSVGPlugin.convertToPath(bit))

/*
  Setting up a GSAP timeline that we'll
  use to animate the morphing footer face.
  The animation will be linked to the scroll
  position using ScrollTrigger
*/
const scroll = gsap.timeline({
  scrollTrigger: {
    scrub: 0.5,
    trigger: "footer",
    start: "bottom bottom",
    end: "top 55%",
    // markers: true
  },
  onComplete: () => addMore()
});

/*
  We add all the face bits SVGMorph animations 
  to the scroll animation. Each face bit morphs 
  through 3 steps. Sad -> looking up -> Happy. 
  'Sad' is the initial stat of the svg, 'looking up'
  states are defined in #face-step-1 and 'happy' 
  is #face-step-2
*/
for(i=1; i <=2; i++) {
  faceBits.forEach(bit => {
    scroll.to(`.face ${bit}`, {morphSVG: `#face-step-${i} ${bit}`, duration:1, ease:'none'}, i - 1)
  })
}

/* 
  Adding a little empty animtion at the end
  just so we see the happy face for a little 
  longer
*/
scroll.to('footer', {duration: 0.3}, 2)

/*
  This is a little scrollTriggered animation
  for the page loading spinner, we want to
  appear just at the last second.
*/
gsap.from(".loading", {
  scrollTrigger: {
    trigger: "footer",
    start: "top 55%",
    toggleActions: "play none none reset",
    // markers: true,
  },
  scale: 0,
  duration: 0.3,
  ease: "back.out"
});

/*
  The hand waving/cookie animation is
  a seperate scrollTrigger animation.
  This just animates the hand appearing,
  the wave is a CSS animation
*/
gsap.from(".hand", {
  scrollTrigger: {
    trigger: "footer",
    start: "top 57%",
    toggleActions: "play none none reverse",
    // markers: true,
    onEnter: () => { 
      count++;
      document.querySelector('.hand').dataset.type = (count <= 1 || Math.random() < 0.8) ? 'wave' : 'cookie';  
    }
  },
  scale: 0.3,
  opacity: 0,
  duration: 0.4,
  y: 200,
  ease: "back.out"
});

/*
  This function is called at the end of
  the face morph scroll animation. It sets 
  up a FLIP animation for the new page content
  and moving the footer down the page.
*/
function addMore() {
  if(!flipping) {
    flipping = true;
    Flip.killFlipsOf('[data-flip]', true)
    createItems();
    const state = Flip.getState('[data-flip]');
    prepForFlip()
    ScrollTrigger.refresh();
    Flip.from(state, {
      duration: 0.7, 
      ease: "bounce.out",
      onComplete: () => {
        flipping = false;
        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) addMore();
      },
      onEnter: elements => gsap.fromTo(elements, {xPercent: -120, opacity: 1}, {xPercent: 0, opacity: 1, delay: 0.1, duration: .5, stagger: 0.1, ease: "back.out"})
    });
  }
}

/*
  This adds the new elements to the page
*/
function createItems() {
  for(let i = 0; i < 4; i++) {
    const p = document.createElement("p");
    const li = document.createElement("li");
    
    li.dataset.flip = '';
    li.className = 'flipping';

    li.appendChild(p)
    items.appendChild(li)	
  }
}

/* 
  This un-hides the new elements after the 
  FLIP state has been recorded.
*/
function prepForFlip() {
  items.querySelectorAll('[data-flip]')
    .forEach(item => {
      item.classList.remove('flipping')
      delete item.dataset.flip
    }) 
}

