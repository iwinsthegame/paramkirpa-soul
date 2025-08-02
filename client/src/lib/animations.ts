export const createEmojiRain = (container: HTMLElement) => {
  const emojis = ['🙏', '✨', '🌟', '💫', '🕯️', '🌸'];
  
  for (let i = 0; i < 20; i++) {
    const emoji = document.createElement('div');
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.className = 'absolute text-2xl animate-emoji-rain pointer-events-none z-50';
    emoji.style.left = Math.random() * 100 + '%';
    emoji.style.animationDelay = Math.random() * 2 + 's';
    
    container.appendChild(emoji);
    
    // Remove emoji after animation
    setTimeout(() => {
      if (emoji.parentNode) {
        emoji.parentNode.removeChild(emoji);
      }
    }, 3000);
  }
};

export const createFloatingSphere = (container: HTMLElement) => {
  const sphere = document.createElement('div');
  sphere.className = 'fixed top-1/2 left-1/2 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-2xl animate-sphere-float pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2';
  
  container.appendChild(sphere);
  
  setTimeout(() => {
    if (sphere.parentNode) {
      sphere.parentNode.removeChild(sphere);
    }
  }, 2000);
};

export const animateEmojiReaction = (element: HTMLElement) => {
  element.style.transform = 'scale(1.2)';
  setTimeout(() => {
    element.style.transform = 'scale(1)';
  }, 200);
};
