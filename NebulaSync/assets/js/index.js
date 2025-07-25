// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.trail-container');

    // Vérifier que le container existe
    if (!container) {
        console.error('Container .trail-container non trouvé');
        return;
    }

    const colors = ['warm-white', 'cool-white', 'soft-gold', 'pale-blue', 'lavender', 'mint', 'pearl'];
    const sizes = ['tiny', 'tiny', 'small', 'small', 'medium', 'large'];

    let mouseX = 0;
    let mouseY = 0;
    let particles = [];

    // Suivre la position de la souris
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Créer une lueur stellaire
    function createGlimmer(x, y, isBright = false) {
        const glimmer = document.createElement('div');
        glimmer.className = 'part';

        // Ajouter une taille aléatoire
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        glimmer.classList.add(size);

        // Ajouter une couleur douce
        const color = colors[Math.floor(Math.random() * colors.length)];
        glimmer.classList.add(color);

        // Occasionnellement créer une lueur plus brillante
        if (isBright || Math.random() < 0.15) {
            glimmer.classList.add('bright');
        }

        // Position avec légère variation
        const offsetX = (Math.random() - 0.5) * 15;
        const offsetY = (Math.random() - 0.5) * 15;

        glimmer.style.left = (x + offsetX) + 'px';
        glimmer.style.top = (y + offsetY) + 'px';

        container.appendChild(glimmer);
        particles.push(glimmer);

        // Supprimer la lueur après l'animation
        setTimeout(() => {
            if (glimmer && glimmer.parentNode) {
                glimmer.parentNode.removeChild(glimmer);
                particles = particles.filter(p => p !== glimmer);
            }
        }, 3000);
    }

    // Animation continue
    let lastTime = 0;
    let lastX = 0;
    let lastY = 0;

    function animate() {
        const currentTime = Date.now();

        // Créer des lueurs si la souris bouge
        if (mouseX !== lastX || mouseY !== lastY) {
            if (currentTime - lastTime > 50) {
                createGlimmer(mouseX, mouseY);
                // Parfois créer une lueur supplémentaire
                if (Math.random() < 0.3) {
                    setTimeout(() => {
                        createGlimmer(
                            mouseX + (Math.random() - 0.5) * 20,
                            mouseY + (Math.random() - 0.5) * 20
                        );
                    }, 100);
                }
                lastTime = currentTime;
            }
            lastX = mouseX;
            lastY = mouseY;
        }

        requestAnimationFrame(animate);
    }

    // Créer quelques lueurs initiales
    function createInitialGlimmers() {
        for (let i = 0; i < 100; i++) { // augmenté à 200
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                createGlimmer(x, y, true);
            }, i * 100); // accéléré (200 → 100)
        }
    }

    // Démarrer l'animation
    animate();
    createInitialGlimmers();

    // Créer des lueurs automatiques doucement
    setInterval(() => {
        if (particles.length < 100) { // limite augmentée
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createGlimmer(x, y);
        }
    }, 200); // plus fréquent (1200 → 500)

    // Clic pour créer un petit groupe de lueurs
    document.addEventListener('click', (e) => {
        for (let i = 0; i < 12; i++) { // augmenté à 12
            setTimeout(() => {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 40 + 10;
                const x = e.clientX + Math.cos(angle) * distance;
                const y = e.clientY + Math.sin(angle) * distance;
                createGlimmer(x, y, Math.random() < 0.5);
            }, i * 60); // plus rapide
        }
    });

    // Effet spécial : constellation occasionnelle
    setInterval(() => {
        if (Math.random() < 0.2) {
            const centerX = Math.random() * (window.innerWidth - 200) + 100;
            const centerY = Math.random() * (window.innerHeight - 200) + 100;

            // Créer 10-15 lueurs en constellation
            const numStars = 10 + Math.floor(Math.random() * 6);
            for (let i = 0; i < numStars; i++) {
                setTimeout(() => {
                    const x = centerX + (Math.random() - 0.5) * 100;
                    const y = centerY + (Math.random() - 0.5) * 100;
                    createGlimmer(x, y, true);
                }, i * 100);
            }
        }
    }, 5000); // plus fréquent (8000 → 7000)
});
