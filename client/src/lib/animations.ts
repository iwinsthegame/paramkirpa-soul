export const animateEmojiReaction = (element: HTMLElement) => {
  // Create floating emoji animation
  const emoji = element.querySelector('span')?.textContent || '✨';
  
  const floatingEmoji = document.createElement('div');
  floatingEmoji.textContent = emoji;
  floatingEmoji.className = 'fixed pointer-events-none z-[100] text-2xl animate-bounce';
  floatingEmoji.style.left = `${element.getBoundingClientRect().left + element.offsetWidth / 2}px`;
  floatingEmoji.style.top = `${element.getBoundingClientRect().top}px`;
  
  document.body.appendChild(floatingEmoji);
  
  // Animate upward movement and fade out
  floatingEmoji.animate([
    { transform: 'translateY(0) scale(1)', opacity: 1 },
    { transform: 'translateY(-60px) scale(1.5)', opacity: 0 }
  ], {
    duration: 1000,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  });
  
  // Remove element after animation
  setTimeout(() => {
    document.body.removeChild(floatingEmoji);
  }, 1000);
  
  // Add button pulse effect
  element.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(1.2)' },
    { transform: 'scale(1)' }
  ], {
    duration: 300,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  });
};

export const createEmojiRain = (container: HTMLElement) => {
  const emojis = ['🙏', '✨', '💫', '🌟', '❤️', '🕉️'];
  const emojiCount = 8;
  
  for (let i = 0; i < emojiCount; i++) {
    const emoji = document.createElement('div');
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.className = 'fixed pointer-events-none z-[100] text-3xl animate-emoji-rain';
    emoji.style.left = `${Math.random() * window.innerWidth}px`;
    emoji.style.top = '-100px';
    emoji.style.animationDelay = `${Math.random() * 2}s`;
    
    container.appendChild(emoji);
    
    // Remove after animation
    setTimeout(() => {
      if (container.contains(emoji)) {
        container.removeChild(emoji);
      }
    }, 3000 + Math.random() * 1000);
  }
};

export const createFloatingSphere = (container: HTMLElement) => {
  const sphere = document.createElement('div');
  sphere.className = 'fixed pointer-events-none z-[100] w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full opacity-0';
  sphere.style.left = `${window.innerWidth / 2 - 16}px`;
  sphere.style.top = `${window.innerHeight / 2 - 16}px`;
  
  container.appendChild(sphere);
  
  // Animate sphere
  sphere.animate([
    { 
      transform: 'scale(0) translateY(0)',
      opacity: 0
    },
    { 
      transform: 'scale(1.5) translateY(-100px)',
      opacity: 1
    },
    { 
      transform: 'scale(0.5) translateY(-200px)',
      opacity: 0
    }
  ], {
    duration: 2000,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  });
  
  // Remove after animation
  setTimeout(() => {
    if (container.contains(sphere)) {
      container.removeChild(sphere);
    }
  }, 2000);
};