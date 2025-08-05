// Quand on soumet le formulaire avec l'id "contactForm"
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    // On empêche le rechargement de la page (comportement par défaut d'un formulaire)
    e.preventDefault();

    // On référence le formulaire lui-même
    const form = this;

    // On récupère les données du formulaire (tous les champs remplis)
    const data = new FormData(form);

    // --- Gestion visuelle du bouton d'envoi (facultatif) ---
    // On sélectionne le bouton d'envoi
    const btn = form.querySelector('button[type="submit"]');

    // On sauvegarde son contenu initial (pour pouvoir le rétablir ensuite)
    const btnOriginal = btn.innerHTML;

    // On désactive le bouton pour éviter plusieurs clics
    btn.disabled = true;

    // On indique à l'utilisateur que l'envoi est en cours avec une icône de chargement
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Envoi...';

    try {
        // On envoie les données du formulaire à l'URL définie dans l'attribut action du formulaire
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

            // Après 2 secondes, on remet tout à l'état initial
            setTimeout(() => {
                btn.innerHTML = btnOriginal;
                btn.disabled = false;
                btn.classList.remove('bg-success');
                form.reset(); // Vide les champs du formulaire
            }, 2000);
        } else {
            // Si le serveur répond avec une erreur (ex: 500), on affiche un message d'erreur
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

    // On vide complètement le contenu de l'élément au départ
    element.innerHTML = '';

    // Fonction interne pour écrire chaque lettre
    function type() {
        // Tant qu'on n'a pas affiché tout le texte...
        if (i < text.length) {
            // On ajoute la lettre suivante au contenu de l'élément
            element.innerHTML += text.charAt(i);

            // On passe à la lettre suivante
            i++;

            // On attend "speed" millisecondes avant d'écrire la suivante
            setTimeout(type, speed);
        }
    }

    // On lance l'écriture
    type();
}

// Variables globales pour la musique
const toggler = document.getElementById('music-toggle');
const music = document.getElementById('background-music');

// Fonction pour sauvegarder l'état de la musique
function saveMusicState(isPlaying) {
    localStorage.setItem('musicState', isPlaying ? 'playing' : 'paused');
}

// Fonction pour charger l'état de la musique
function loadMusicState() {
    return localStorage.getItem('musicState') || 'paused'; // Par défaut en pause
}

// Fonction pour mettre à jour l'icône selon l'état
function updateMusicIcon(isPlaying) {
    if (isPlaying) {
        toggler.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    } else {
        toggler.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    }
}

// Gestion du toggle de la musique
toggler.addEventListener('click', () => {
    if (music.paused) {
        music.play();
        updateMusicIcon(true);
        saveMusicState(true);
    } else {
        music.pause();
        updateMusicIcon(false);
        saveMusicState(false);
    }
});

// Initialisation au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
    // Charger l'état sauvegardé
    const savedState = loadMusicState();
    const shouldPlay = savedState === 'playing';

    // Appliquer l'état sauvegardé
    if (shouldPlay) {
        // Ne pas démarrer la musique immédiatement à cause des restrictions navigateur
        // On met juste l'icône correcte, la musique se lancera au premier clic utilisateur
        updateMusicIcon(true);
    } else {
        music.pause();
        updateMusicIcon(false);
    }
});

// Alternative : Si vous voulez vraiment que la musique reprenne automatiquement
// (mais cela peut être bloqué par les navigateurs)
document.addEventListener("DOMContentLoaded", () => {
    const savedState = loadMusicState();
    const shouldPlay = savedState === 'playing';

    if (shouldPlay) {
        // Essayer de reprendre la musique (peut être bloqué par le navigateur)
        music.play().then(() => {
            updateMusicIcon(true);
        }).catch(() => {
            // Si bloqué, on garde juste l'icône pour indiquer l'intention
            updateMusicIcon(true);
            console.log('Autoplay bloqué par le navigateur');
        });
    } else {
        music.pause();
        updateMusicIcon(false);
    }
});

// Version simple et claire
document.addEventListener("DOMContentLoaded", () => {
    const savedState = loadMusicState();
    const wasPlaying = savedState === 'playing';

    // Toujours commencer en pause au rechargement (respect des politiques navigateur)
    music.pause();

    // Toujours afficher l'icône "mute" au démarrage pour être clair
    updateMusicIcon(false);

    // Si la musique était en cours, on peut essayer de la relancer silencieusement
    if (wasPlaying) {
        music.play().catch(() => {
            // Autoplay bloqué, pas grave, l'utilisateur cliquera s'il veut
        });
    }
});

// Lorsque toute la page est complètement chargée (y compris images, styles, etc.)
window.addEventListener('load', function() {
    // Après un délai de 1000 millisecondes (1 seconde)...
    setTimeout(() => {
        // SUPPRIMÉ : music.play(); - La musique ne se lance plus automatiquement

        // On sélectionne l'élément HTML avec la classe .hero-subtitle
        const subtitle = document.querySelector('.hero-subtitle');

        // Si l'élément est trouvé sur la page...
        if (subtitle) {
            // On mémorise son contenu d'origine (le texte affiché dans l'élément)
            const originalText = subtitle.textContent;

            // On applique l'effet de frappe (typewriter) au texte avec une vitesse de 80 ms par lettre
            typeWriter(subtitle, originalText, 80);
        }
    }, 1000); // fin du setTimeout (attente d'1 seconde)
});

window.addEventListener('scroll', function() {
    // On sélectionne le bouton avec l'id #scrollTopBtn
    const btn = document.getElementById('btn-up');

    // Si l'utilisateur a défilé de plus de 200 pixels depuis le haut de la page...
    if (window.scrollY > 1650) {
        // ...on affiche le bouton (display: block)
        btn.style.opacity = '1';
    } else {
        // Sinon (l'utilisateur est en haut de page), on le cache
        btn.style.opacity = '0';
    }
});

// Fonction pour faire défiler progressivement vers le haut de la page (section par section)
function scrollToTopStepByStep() {
    // On récupère toutes les balises <section> visibles à l'écran (non masquées)
    const allSections = Array.from(document.querySelectorAll('section')).filter(sec => sec.offsetParent !== null);

    // Si aucune section n'est trouvée, on remonte directement tout en haut
    if (!allSections.length) {
        window.scrollTo({top: 0, behavior: 'smooth'});
        return;
    }

    // On trie les sections selon leur position verticale (du haut vers le bas)
    allSections.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

    // Si la première section visible n'est pas la page d'accueil (id="home"), on l'ajoute tout en haut
    if (allSections[0].id !== 'home' && document.getElementById('home')) {
        allSections.unshift(document.getElementById('home'));
    }

    // On commence par la dernière section (celle la plus bas sur la page)
    let i = allSections.length - 1;

    // Fonction qui fait défiler une section à la fois
    function step() {
        // Si on a atteint la fin, on arrête
        if (i < 0) return;

        // On fait défiler jusqu'à la section courante avec un effet fluide
        allSections[i].scrollIntoView({behavior: 'smooth', block: 'start'});

        // On passe à la section précédente
        i--;

        // On attend 2 secondes avant de faire défiler la suivante (temps pour lire ou observer)
        if (i >= 0) setTimeout(step, 2000);
    }

    // On démarre le processus
    step();
}

// Lorsqu'on clique sur le bouton "Retour en haut", on lance le scroll progressif
document.getElementById('btn-up').addEventListener('click', scrollToTopStepByStep);

// --- Affichage exclusif d'une section par navigation, avec scroll fluide ---
// Sélectionne tous les liens de navigation qui ont la classe .nav-link
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    // Pour chaque lien, on ajoute un événement "click"
    link.addEventListener('click', function(e) {
        // On récupère la valeur de l'attribut href du lien (ex: "#contact")
        const href = this.getAttribute('href');

        // On vérifie que ce href existe et qu'il pointe vers une ancre (commence par #)
        if (href && href.startsWith('#')) {
            // On empêche le comportement par défaut (évite le saut immédiat sans effet fluide)
            e.preventDefault();

            // On sélectionne la section correspondante à l'ancre (ex: <section id="contact">)
            const section = document.querySelector(href);

            // Si la section est trouvée dans la page...
            if (section) {
                // On fait défiler la page jusqu'à cette section avec un effet fluide
                section.scrollIntoView({
                    behavior: 'smooth', // défilement fluide
                    block: 'start'      // aligne le haut de la section avec le haut de l'écran (ajusté avec scroll-margin-top en CSS)
                });
            }
        }
    });
});