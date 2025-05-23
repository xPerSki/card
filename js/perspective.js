const card = document.querySelector('.card');
const maxTilt = 7;

card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;

    const tiltX = percentY * maxTilt;
    const tiltY = -percentX * maxTilt;

    card.style.transform = `perspective(1000px) translate(-50%, -50%) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
});

card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) translate(-50%, -50%)';
});
