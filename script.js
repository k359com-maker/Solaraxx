const muteBtn = document.getElementById('muteBtn');
const bgMusic = document.getElementById('bg-music');
const bgVideo = document.getElementById('bg-video');
const clickOverlay = document.getElementById('clickOverlay');
const bioCard = document.getElementById('bioCard');
const typingElement = document.getElementById('typingText');
let isMuted = true;
class ToastNotification {
    constructor() {
        this.container = document.getElementById('toast-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            document.body.appendChild(this.container);
        }
        this.activeToasts = {};
        this.toastCounter = 0;
    }
    showLoading(message = "กำลังโหลด...", toastId = null) {
        if (!toastId) {
            this.toastCounter++;
            toastId = `toast-${this.toastCounter}`;
        }
        if (this.activeToasts[toastId]) {
            this.hideToast(toastId);
            setTimeout(() => this._createToast(toastId, message, 'loading'), 800);
            return toastId;
        }
        this._createToast(toastId, message, 'loading');
        return toastId;
    }
    updateToSuccess(toastId, message = "เสร็จสิ้น!", autoDismiss = true, duration = 4000) {
        const toast = this.activeToasts[toastId];
        if (!toast) return;
        const icon = toast.querySelector('.toast-icon');
        const messageEl = toast.querySelector('.toast-message');
        icon.className = 'toast-icon success';
        icon.innerHTML = '<i class="fa-solid fa-check-circle"></i>';
        messageEl.textContent = message;
        if (autoDismiss) {
            setTimeout(() => {
                this.hideToast(toastId);
            }, duration);
        }
    }
    showSuccess(message = "สำเร็จ!", duration = 4000, toastId = null) {
        if (!toastId) {
            this.toastCounter++;
            toastId = `toast-${this.toastCounter}`;
        }
        this._createToast(toastId, message, 'success');
        
        setTimeout(() => {
            this.hideToast(toastId);
        }, duration);
        return toastId;
    }
    _createToast(toastId, message, type) {
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.id = toastId;
        toast.dataset.toastId = toastId;
        let iconClass = '';
        if (type === 'loading') {
            iconClass = 'fa-solid fa-sync-alt';
        } else if (type === 'success') {
            iconClass = 'fa-solid fa-check-circle';
        }
        toast.innerHTML = `
            <div class="toast-border"></div>
            <div class="toast-icon ${type}">
                <i class="${iconClass}"></i>
            </div>
            <div class="toast-message">${message}</div>
        `;
        this.container.appendChild(toast);
        this.activeToasts[toastId] = toast;
        setTimeout(() => { 
            toast.classList.add('show'); 
        }, 10);
        setTimeout(() => {
            toast.classList.add('slide-in');
        }, 300);
    }
    hideToast(toastId) {
        const toast = this.activeToasts[toastId];
        if (!toast) return;
        toast.classList.add('hide');
        setTimeout(() => {
            toast.remove();
            delete this.activeToasts[toastId];
        }, 1200);
    }
}
const toastSystem = new ToastNotification();
muteBtn.addEventListener('click', () => {
    const icon = muteBtn.querySelector('i');
    muteBtn.classList.add('rotating');

    setTimeout(() => {
        if(isMuted){
            icon.classList.replace('fa-volume-mute','fa-volume-up');
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
clickOverlay.addEventListener('click', () => {
    bgVideo.play().catch(e => console.error("Video Autoplay failed:", e));
    bgMusic.play().catch(e => console.error("Audio Autoplay failed:", e));
    const loadingToastId = toastSystem.showLoading('Initializing System...', 'initial-load');
    clickOverlay.classList.add('hidden');
    setTimeout(() => {
        clickOverlay.style.display = 'none';
        bioCard.classList.add('visible');
        enableCardTilt();
        if(isMuted) muteBtn.click();
        setTimeout(() => {
            toastSystem.updateToSuccess(loadingToastId, 'System Ready. Welcome!', true, 4000);
        }, 3000); 
    }, 600);
});
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
if (typeof particlesJS !== 'undefined') {
    particlesJS.load('particles-js', 'particles.json', () => console.log('Particles loaded'));
} else {
    console.warn('particlesJS is not loaded. Skipping particle initialization.');
}
