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



// Quand on soumet le formulaire avec l'id "contactForm"
document.getElementById('contactForm').addEventListener('submit', async function(e) {
  // On empêche le rechargement de la page (comportement par défaut d’un formulaire)
  e.preventDefault();

  // On référence le formulaire lui-même
  const form = this;

  // On récupère les données du formulaire (tous les champs remplis)
  const data = new FormData(form);

  // --- Gestion visuelle du bouton d’envoi (facultatif) ---
  // On sélectionne le bouton d’envoi
  const btn = form.querySelector('button[type="submit"]');

  // On sauvegarde son contenu initial (pour pouvoir le rétablir ensuite)
  const btnOriginal = btn.innerHTML;

  // On désactive le bouton pour éviter plusieurs clics
  btn.disabled = true;

  // On indique à l'utilisateur que l'envoi est en cours avec une icône de chargement
  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Envoi...';

  try {
    // On envoie les données du formulaire à l’URL définie dans l’attribut action du formulaire
    const response = await fetch(form.action, {
      method: form.method,         // méthode HTTP (POST, GET…)
      body: data,                  // données du formulaire
      headers: {
        'Accept': 'application/json' // pour recevoir une réponse au format JSON
      }
    });

    // Si la réponse du serveur est un succès (code 200)
    if (response.ok) {
      // On affiche un message de succès sur le bouton
      btn.innerHTML = '<i class="fas fa-check me-2"></i>Message envoyé ! Je vous répondrai sous 48 heures maximum';

      // On colore le bouton en vert pour indiquer la réussite
      btn.classList.add('bg-success');

      // Après 2 secondes, on remet tout à l’état initial
      setTimeout(() => {
        btn.innerHTML = btnOriginal;
        btn.disabled = false;
        btn.classList.remove('bg-success');
        form.reset(); // Vide les champs du formulaire
      }, 2000);
    } else {
      // Si le serveur répond avec une erreur (ex: 500), on affiche un message d’erreur
      btn.innerHTML = '<i class="fas fa-times me-2"></i>Erreur!';
      btn.classList.add('bg-danger');

      // Après 3 secondes, on rétablit le bouton
      setTimeout(() => {
        btn.innerHTML = btnOriginal;
        btn.disabled = false;
        btn.classList.remove('bg-danger');
      }, 3000);
    }
  } catch (err) {
    // En cas d'erreur réseau (pas de connexion, serveur injoignable, etc.)
    btn.innerHTML = '<i class="fas fa-times me-2"></i>Erreur réseau!';
    btn.classList.add('bg-danger');

    // On rétablit le bouton après 3 secondes
    setTimeout(() => {
      btn.innerHTML = btnOriginal;
      btn.disabled = false;
      btn.classList.remove('bg-danger');
    }, 3000);
  }
});

// Fonction qui crée un effet de frappe lettre par lettre sur un élément
function typeWriter(element, text, speed = 100) {
    // Position de la lettre en cours
    let i = 0;

    // On vide complètement le contenu de l’élément au départ
    element.innerHTML = '';

    // Fonction interne pour écrire chaque lettre
    function type() {
        // Tant qu’on n’a pas affiché tout le texte...
        if (i < text.length) {
            // On ajoute la lettre suivante au contenu de l’élément
            element.innerHTML += text.charAt(i);

            // On passe à la lettre suivante
            i++;

            // On attend "speed" millisecondes avant d’écrire la suivante
            setTimeout(type, speed);
        }
    }

    // On lance l’écriture
    type();
}


// ✅ But : afficher un texte (souvent un sous-titre ou une phrase clé) 
// comme si quelqu’un l’écrivait en direct, lettre par lettre.






// Lorsque toute la page est complètement chargée (y compris images, styles, etc.)
window.addEventListener('load', function() {
    // Après un délai de 1000 millisecondes (1 seconde)...
    setTimeout(() => {
        // On sélectionne l’élément HTML avec la classe .neon-subtitle
        const subtitle = document.querySelector('.hero-subtitle');

        // Si l’élément est trouvé sur la page...
        if (subtitle) {
            // On mémorise son contenu d’origine (le texte affiché dans l’élément)
            const originalText = subtitle.textContent;

            // On applique l’effet de frappe (typewriter) au texte avec une vitesse de 80 ms par lettre
            typeWriter(subtitle, originalText, 80);
        }
    }, 1000); // fin du setTimeout (attente d’1 seconde)
});