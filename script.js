const muteBtn = document.getElementById('muteBtn');
const bgMusic = document.getElementById('bg-music');
const bgVideo = document.getElementById('bg-video');
const clickOverlay = document.getElementById('clickOverlay');
const bioCard = document.getElementById('bioCard');
const typingElement = document.getElementById('typingText');

let isMuted = true;

// Toggle Mute
muteBtn.addEventListener('click', () => {
    const icon = muteBtn.querySelector('i');
    muteBtn.classList.add('rotating');

    setTimeout(() => {
        if(isMuted){
            icon.classList.replace('fa-volume-mute','fa-volume-up');
            bgMusic.play().catch(()=>console.log('Autoplay blocked'));
            bgVideo.muted = false;
            bgMusic.muted = false;
        } else {
            icon.classList.replace('fa-volume-up','fa-volume-mute');
            bgVideo.muted = true;
            bgMusic.muted = true;
        }
        isMuted = !isMuted;
    }, 200);

    setTimeout(()=>muteBtn.classList.remove('rotating'),400);
});

// Overlay Click
clickOverlay.addEventListener('click', () => {
    clickOverlay.classList.add('hidden');
    setTimeout(() => {
        clickOverlay.style.display = 'none';
        bioCard.classList.add('visible');
        enableCardTilt();
        if(isMuted) muteBtn.click(); // auto unmute on first click
    }, 600);
});

// Card Tilt
function enableCardTilt(){
    bioCard.addEventListener('mousemove', e=>{
        const rect = bioCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width/2;
        const centerY = rect.height/2;
        const rotateX = (y - centerY)/centerY * -15;
        const rotateY = (x - centerX)/centerX * 15;
        bioCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    bioCard.addEventListener('mouseleave', ()=>{
        bioCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
}

// Typing Effect
const texts = [".gg/sora.xyz", "REN"];
let textIndex=0,charIndex=0,isDeleting=false;

function type(){
    const currentText = texts[textIndex];
    if(isDeleting){
        charIndex--;
        typingElement.textContent = currentText.substring(0,charIndex);
        if(charIndex===0){isDeleting=false;textIndex=(textIndex+1)%texts.length; setTimeout(type,500);}
        else setTimeout(type,50);
    } else {
        charIndex++;
        typingElement.textContent = currentText.substring(0,charIndex);
        if(charIndex===currentText.length){isDeleting=true; setTimeout(type,1500);}
        else setTimeout(type,100);
    }
}
type();

// Particles.js
particlesJS.load('particles-js','particles.json',()=>console.log('Particles loaded'));
