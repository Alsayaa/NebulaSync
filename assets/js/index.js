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

const btnUp = document.getElementById('btn-up');
const sound = new Audio('assets/sound/rocketmp3-94928.mp3');

btnUp.addEventListener('click', () => {
   sound.volume = 0.100;
    sound.play();
    
    
});

// Système de traduction complet pour NebulaSync
class NebulaTranslationSystem {
    constructor() {
        this.currentLanguage = 'fr';
        this.translations = {
            fr: {
                // Navigation
                nav_home: "Accueil",
                nav_about: "À propos",
                nav_methodology: "Méthodologie",
                nav_services: "Services",
                nav_contact: "Contact",
                btn_french: "FR",
                btn_english: "EN",

                // Hero Section
                hero_title: "NEBULA SYNC",
                hero_subtitle: "Synchronisez votre présence web avec les étoiles",
                hero_services_btn: "Nos Services",
                hero_contact_btn: "Contactez-nous",

                // About Section
                about_title: "VOUS ÊTES AMBITIEUX,<br>NOUS AUSSI",
                about_description: "Chez <strong>NebulaSync</strong>, nous croyons que chaque présence en ligne mérite de briller aussi fort qu'une étoile.<br>Nous accompagnons les entrepreneurs, créateurs et entreprises à synchroniser leur image digitale avec leurs ambitions.",
                about_custom_websites: "🔹 <strong>Sites web sur mesure</strong> – performants, esthétiques et évolutifs.",
                about_visual_identity: "🔹 <strong>Identité visuelle cohérente</strong> – logo, charte graphique, design moderne.",
                about_full_support: "🔹 <strong>Accompagnement complet</strong> – de la conception à la maintenance.",
                about_human_approach: "🔹 <strong>Approche humaine et agile</strong> – écoute, réactivité, solutions adaptées à votre univers.",
                about_signature: "Avec NebulaSync, transformez vos idées en constellations digitales.",

                // Methodology Section
                methodology_title: "NOTRE MÉTHODOLOGIE",
                methodology_research_title: "RECUEIL DES BESOINS",
                methodology_research_desc: "Analyse approfondie de vos besoins et de votre marché.",
                methodology_specs_title: "SPÉCIFICATIONS FONCTIONNELLES",
                methodology_specs_desc: "Définir les fonctionnalités, l'arborescence et les maquettes.",
                methodology_design_title: "CONCEPTION WEB",
                methodology_design_desc: "Élaborer le design et la structure du site.<br>Développement de l'architecture front/back-end.",
                methodology_test_title: "TEST ET VALIDATION",
                methodology_test_desc: "Vérifier, corriger et valider avec les retours des utilisateurs.",
                methodology_deploy_title: "MISE EN LIGNE ET SUIVI",
                methodology_deploy_desc: "Mettre le site en ligne et assurer son bon fonctionnement (SEO, maintenance).",
                methodology_training_title: "FORMATION",
                methodology_training_desc: "Une formation est prévue pour que le client puisse assurer lui-même la maintenance et les mises à jour du site.",

                // Services Section
                services_title: "NOS SERVICES",
                service_ecommerce_title: "E-COMMERCE",
                service_ecommerce_desc: "Créez votre boutique en ligne pour vendre vos produits efficacement.",
                service_static_title: "STATIQUE",
                service_static_desc: "Site vitrine rapide et optimisé pour présenter votre activité.",
                service_dynamic_title: "DYNAMIQUE",
                service_dynamic_desc: "Sites interactifs avec gestion de contenu et fonctionnalités avancées.",
                service_maintenance_title: "MAINTENANCE",
                service_maintenance_desc: "Suivi technique, mises à jour et sécurisation de votre site web.",
                service_database_title: "BASE DE DONNÉES",
                service_database_desc: "Conception et optimisation de bases de données performantes.",
                service_redesign_title: "REFONTE",
                service_redesign_desc: "Modernisation complète de votre site existant.",
                service_learn_more: "SAVOIR PLUS",

                // Contact Section
                contact_title: "CONTACTEZ-NOUS",
                contact_email_title: "Mail",
                contact_email_link: "Mail",
                contact_discord_title: "Discord",
                contact_discord_link: "Discord",
                contact_location_title: "Localisation",
                contact_location_value: "Niederschaeffolsheim, Bas-Rhin",

                // Form
                form_name_placeholder: "Entrez votre nom complet ici...",
                form_email_placeholder: "Entrez votre adresse mail ici...",
                form_phone_placeholder: "Entrez votre n° de téléphone ici...",
                form_subject_placeholder: "Entrez le sujet de votre message ici...",
                form_message_placeholder: "Entrez votre message ici...",
                form_submit_btn: "Envoyer votre message",

                // Footer
                footer_copyright: "&copy; 2025 Alsaya - Conceptrice designer UI/UX",

                // Modals - Common
                modal_close_btn: "Fermer",
                modal_advantages_title: "✔ Avantages :",
                modal_features_title: "🔧 Caractéristiques :",

                // Modal Static
                modal_static_title: "Site Statique",
                modal_static_subtitle: "Vitrine simple & performante",
                modal_static_description: "Un site vitrine rapide et optimisé, parfait pour présenter votre activité, portfolio ou services, sans gestion de contenu complexe.",
                modal_static_advantage_1: "Chargement ultra-rapide",
                modal_static_advantage_2: "Design responsive moderne",
                modal_static_advantage_3: "Coût de développement réduit",
                modal_static_feature_1: "Pages HTML statiques",
                modal_static_feature_2: "CSS et animations simples",
                modal_static_feature_3: "Pas de base de données ni CMS",
                modal_static_price: "Prix indicatif : <strong>800€</strong>",

                // Modal Dynamic
                modal_dynamic_title: "Site Dynamique",
                modal_dynamic_subtitle: "Interactif & personnalisé",
                modal_dynamic_description: "Développement de sites interactifs avec base de données : blogs, plateformes de réservation, espace membre, interfaces d'administration…",
                modal_dynamic_advantage_1: "Gestion dynamique des contenus",
                modal_dynamic_advantage_2: "Fonctionnalités sur mesure",
                modal_dynamic_advantage_3: "Interface d'administration facile",
                modal_dynamic_feature_1: "Backend en PHP, Node.js, ou autre",
                modal_dynamic_feature_2: "Base de données sécurisée",
                modal_dynamic_feature_3: "Responsive et optimisé SEO",
                modal_dynamic_price: "Prix indicatif : <strong>à partir de 1500€</strong>",

                // Modal E-commerce
                modal_ecommerce_title: "Site E-commerce",
                modal_ecommerce_subtitle: "Boutique en ligne complète",
                modal_ecommerce_description: "Création de boutiques en ligne performantes avec gestion produit, paiement sécurisé, et suivi des commandes.",
                modal_ecommerce_advantage_1: "Catalogue produit illimité",
                modal_ecommerce_advantage_2: "Intégration de moyens de paiement",
                modal_ecommerce_advantage_3: "Gestion des stocks et commandes",
                modal_ecommerce_feature_1: "WordPress + WooCommerce",
                modal_ecommerce_feature_2: "Interface client et admin intuitive",
                modal_ecommerce_feature_3: "Optimisation SEO & mobile friendly",
                modal_ecommerce_price: "Prix indicatif : <strong>à partir de 2000€</strong>",

                // Modal Maintenance
                modal_maintenance_title: "Maintenance de Site",
                modal_maintenance_subtitle: "Sécurité & mises à jour garanties",
                modal_maintenance_description: "Assurez la sécurité, la stabilité et les performances de votre site grâce à un suivi régulier et des mises à jour proactives.",
                modal_maintenance_includes_title: "✔ Ce que comprend la maintenance :",
                modal_maintenance_feature_1: "Mises à jour CMS, plugins et sécurité",
                modal_maintenance_feature_2: "Surveillance et correction des bugs",
                modal_maintenance_feature_3: "Optimisation des performances",
                modal_maintenance_feature_4: "Sauvegardes régulières",
                modal_maintenance_price: "Prix indicatif : <strong>100€/mois</strong>",

                // Modal Database
                modal_database_title: "Gestion de Base de Données",
                modal_database_subtitle: "Performance & sécurité des données",
                modal_database_description: "Conception, optimisation et sécurisation de vos bases de données pour garantir fiabilité et rapidité d'accès.",
                modal_database_services_title: "✔ Nos services :",
                modal_database_feature_1: "Modélisation adaptée à vos besoins",
                modal_database_feature_2: "Optimisation des requêtes SQL",
                modal_database_feature_3: "Sauvegardes et restaurations sécurisées",
                modal_database_feature_4: "Gestion des accès et permissions",
                modal_database_price: "Prix indicatif : <strong>sur devis</strong>",

                // Modal Redesign
                modal_redesign_title: "Refonte de Site",
                modal_redesign_subtitle: "Modernisation & optimisation",
                modal_redesign_description: "Redonnez un coup de jeune à votre site avec un design moderne, une meilleure ergonomie et des performances accrues.",
                modal_redesign_includes_title: "✔ Ce que la refonte comprend :",
                modal_redesign_feature_1: "Design UI/UX repensé",
                modal_redesign_feature_2: "Optimisation mobile et SEO",
                modal_redesign_feature_3: "Migration ou mise à jour technique",
                modal_redesign_feature_4: "Amélioration de la vitesse et sécurité",
                modal_redesign_price: "Prix indicatif : <strong>à partir de 1200€</strong>",

                // Buttons and Misc
                btn_scroll_top_aria: "Remonter en haut",
                btn_music_toggle_aria: "Couper/Activer la musique",
                audio_not_supported: "Votre navigateur ne prend pas en charge l'élément audio."
            },
            en: {
                // Navigation
                nav_home: "Home",
                nav_about: "About",
                nav_methodology: "Methodology",
                nav_services: "Services",
                nav_contact: "Contact",
                btn_french: "FR",
                btn_english: "EN",

                // Hero Section
                hero_title: "NEBULA SYNC",
                hero_subtitle: "Synchronize your web presence with the stars",
                hero_services_btn: "Our Services",
                hero_contact_btn: "Contact Us",

                // About Section
                about_title: "YOU ARE AMBITIOUS,<br>SO ARE WE",
                about_description: "At <strong>NebulaSync</strong>, we believe that every online presence deserves to shine as bright as a star.<br>We help entrepreneurs, creators and businesses synchronize their digital image with their ambitions.",
                about_custom_websites: "🔹 <strong>Custom websites</strong> – performant, aesthetic and scalable.",
                about_visual_identity: "🔹 <strong>Consistent visual identity</strong> – logo, graphic charter, modern design.",
                about_full_support: "🔹 <strong>Complete support</strong> – from design to maintenance.",
                about_human_approach: "🔹 <strong>Human and agile approach</strong> – listening, responsiveness, solutions adapted to your universe.",
                about_signature: "With NebulaSync, transform your ideas into digital constellations.",

                // Methodology Section
                methodology_title: "OUR METHODOLOGY",
                methodology_research_title: "NEEDS GATHERING",
                methodology_research_desc: "In-depth analysis of your needs and market.",
                methodology_specs_title: "FUNCTIONAL SPECIFICATIONS",
                methodology_specs_desc: "Define features, site structure and mockups.",
                methodology_design_title: "WEB DESIGN",
                methodology_design_desc: "Develop design and site structure.<br>Front/back-end architecture development.",
                methodology_test_title: "TESTING & VALIDATION",
                methodology_test_desc: "Check, correct and validate with user feedback.",
                methodology_deploy_title: "DEPLOYMENT & MONITORING",
                methodology_deploy_desc: "Put the site online and ensure proper functioning (SEO, maintenance).",
                methodology_training_title: "TRAINING",
                methodology_training_desc: "Training is provided so the client can handle site maintenance and updates themselves.",

                // Services Section
                services_title: "OUR SERVICES",
                service_ecommerce_title: "E-COMMERCE",
                service_ecommerce_desc: "Create your online store to sell your products effectively.",
                service_static_title: "STATIC",
                service_static_desc: "Fast and optimized showcase site to present your activity.",
                service_dynamic_title: "DYNAMIC",
                service_dynamic_desc: "Interactive sites with content management and advanced features.",
                service_maintenance_title: "MAINTENANCE",
                service_maintenance_desc: "Technical monitoring, updates and security for your website.",
                service_database_title: "DATABASE",
                service_database_desc: "Design and optimization of high-performance databases.",
                service_redesign_title: "REDESIGN",
                service_redesign_desc: "Complete modernization of your existing site.",
                service_learn_more: "LEARN MORE",

                // Contact Section
                contact_title: "CONTACT US",
                contact_email_title: "Email",
                contact_email_link: "Email",
                contact_discord_title: "Discord",
                contact_discord_link: "Discord",
                contact_location_title: "Location",
                contact_location_value: "Niederschaeffolsheim, Bas-Rhin",

                // Form
                form_name_placeholder: "Enter your full name here...",
                form_email_placeholder: "Enter your email address here...",
                form_phone_placeholder: "Enter your phone number here...",
                form_subject_placeholder: "Enter your message subject here...",
                form_message_placeholder: "Enter your message here...",
                form_submit_btn: "Send your message",

                // Footer
                footer_copyright: "&copy; 2025 Alsaya - UI/UX Designer",

                // Modals - Common
                modal_close_btn: "Close",
                modal_advantages_title: "✔ Advantages:",
                modal_features_title: "🔧 Features:",

                // Modal Static
                modal_static_title: "Static Website",
                modal_static_subtitle: "Simple & performant showcase",
                modal_static_description: "A fast and optimized showcase site, perfect for presenting your activity, portfolio or services, without complex content management.",
                modal_static_advantage_1: "Ultra-fast loading",
                modal_static_advantage_2: "Modern responsive design",
                modal_static_advantage_3: "Reduced development cost",
                modal_static_feature_1: "Static HTML pages",
                modal_static_feature_2: "Simple CSS and animations",
                modal_static_feature_3: "No database or CMS",
                modal_static_price: "Indicative price: <strong>€800</strong>",

                // Modal Dynamic
                modal_dynamic_title: "Dynamic Website",
                modal_dynamic_subtitle: "Interactive & personalized",
                modal_dynamic_description: "Development of interactive sites with database: blogs, booking platforms, member areas, administration interfaces…",
                modal_dynamic_advantage_1: "Dynamic content management",
                modal_dynamic_advantage_2: "Custom features",
                modal_dynamic_advantage_3: "Easy administration interface",
                modal_dynamic_feature_1: "Backend in PHP, Node.js, or other",
                modal_dynamic_feature_2: "Secure database",
                modal_dynamic_feature_3: "Responsive and SEO optimized",
                modal_dynamic_price: "Indicative price: <strong>from €1500</strong>",

                // Modal E-commerce
                modal_ecommerce_title: "E-commerce Website",
                modal_ecommerce_subtitle: "Complete online store",
                modal_ecommerce_description: "Creation of high-performance online stores with product management, secure payment, and order tracking.",
                modal_ecommerce_advantage_1: "Unlimited product catalog",
                modal_ecommerce_advantage_2: "Payment method integration",
                modal_ecommerce_advantage_3: "Stock and order management",
                modal_ecommerce_feature_1: "WordPress + WooCommerce",
                modal_ecommerce_feature_2: "Intuitive client and admin interface",
                modal_ecommerce_feature_3: "SEO optimization & mobile friendly",
                modal_ecommerce_price: "Indicative price: <strong>from €2000</strong>",

                // Modal Maintenance
                modal_maintenance_title: "Website Maintenance",
                modal_maintenance_subtitle: "Security & guaranteed updates",
                modal_maintenance_description: "Ensure the security, stability and performance of your site through regular monitoring and proactive updates.",
                modal_maintenance_includes_title: "✔ What maintenance includes:",
                modal_maintenance_feature_1: "CMS, plugin and security updates",
                modal_maintenance_feature_2: "Bug monitoring and correction",
                modal_maintenance_feature_3: "Performance optimization",
                modal_maintenance_feature_4: "Regular backups",
                modal_maintenance_price: "Indicative price: <strong>€100/month</strong>",

                // Modal Database
                modal_database_title: "Database Management",
                modal_database_subtitle: "Performance & data security",
                modal_database_description: "Design, optimization and security of your databases to guarantee reliability and fast access.",
                modal_database_services_title: "✔ Our services:",
                modal_database_feature_1: "Modeling adapted to your needs",
                modal_database_feature_2: "SQL query optimization",
                modal_database_feature_3: "Secure backups and restorations",
                modal_database_feature_4: "Access and permission management",
                modal_database_price: "Indicative price: <strong>on quote</strong>",

                // Modal Redesign
                modal_redesign_title: "Website Redesign",
                modal_redesign_subtitle: "Modernization & optimization",
                modal_redesign_description: "Give your site a fresh look with modern design, better ergonomics and enhanced performance.",
                modal_redesign_includes_title: "✔ What the redesign includes:",
                modal_redesign_feature_1: "Redesigned UI/UX design",
                modal_redesign_feature_2: "Mobile and SEO optimization",
                modal_redesign_feature_3: "Migration or technical update",
                modal_redesign_feature_4: "Speed and security improvement",
                modal_redesign_price: "Indicative price: <strong>from €1200</strong>",

                // Buttons and Misc
                btn_scroll_top_aria: "Scroll to top",
                btn_music_toggle_aria: "Mute/Enable music",
                audio_not_supported: "Your browser does not support the audio element."
            }
        };

        this.init();
    }

    init() {
        // Récupérer la langue sauvegardée ou utiliser français par défaut
        this.currentLanguage = localStorage.getItem('nebula-language') || 'fr';

        // Attacher les événements aux boutons de langue
        this.attachLanguageEvents();

        // Appliquer la traduction initiale
        this.translatePage();

        // Mettre à jour l'état des boutons
        this.updateLanguageButtons();

        // Traduire les placeholders et aria-labels
        this.translatePlaceholders();
        this.translateAriaLabels();
    }

    attachLanguageEvents() {
        const frBtn = document.getElementById('fr-btn');
        const enBtn = document.getElementById('eng-btn');

        if (frBtn) {
            frBtn.addEventListener('click', () => this.changeLanguage('fr'));
        }

        if (enBtn) {
            enBtn.addEventListener('click', () => this.changeLanguage('en'));
        }
    }

    changeLanguage(language) {
        if (this.translations[language] && this.currentLanguage !== language) {
            this.currentLanguage = language;
            localStorage.setItem('nebula-language', language);

            // Animation de transition douce
            document.body.style.opacity = '0.8';

            setTimeout(() => {
                this.translatePage();
                this.updateLanguageButtons();
                this.translatePlaceholders();
                this.translateAriaLabels();
                document.body.style.opacity = '1';
            }, 200);
        }
    }

    translatePage() {
        const elementsToTranslate = document.querySelectorAll('[data-translate]');
        const currentTranslations = this.translations[this.currentLanguage];

        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-translate');

            if (currentTranslations[key]) {
                // Gérer les éléments avec du HTML (comme les br, strong)
                if (currentTranslations[key].includes('<')) {
                    element.innerHTML = currentTranslations[key];
                } else {
                    element.textContent = currentTranslations[key];
                }
            }
        });

        // Mettre à jour l'attribut lang du document
        document.documentElement.lang = this.currentLanguage;
    }

    translatePlaceholders() {
        const placeholderMap = {
            'form_name_placeholder': 'name="nom"',
            'form_email_placeholder': 'name="email"',
            'form_phone_placeholder': 'name="telephone"',
            'form_subject_placeholder': 'name="sujet"',
            'form_message_placeholder': 'name="message"'
        };

        Object.keys(placeholderMap).forEach(key => {
            const element = document.querySelector(`[${placeholderMap[key]}]`);
            if (element && this.translations[this.currentLanguage][key]) {
                element.placeholder = this.translations[this.currentLanguage][key];
            }
        });
    }

    translateAriaLabels() {
        const ariaMap = {
            'btn_scroll_top_aria': '#btn-up',
            'btn_music_toggle_aria': '#music-toggle'
        };

        Object.keys(ariaMap).forEach(key => {
            const element = document.querySelector(ariaMap[key]);
            if (element && this.translations[this.currentLanguage][key]) {
                element.setAttribute('aria-label', this.translations[this.currentLanguage][key]);
                element.setAttribute('title', this.translations[this.currentLanguage][key]);
            }
        });
    }

    updateLanguageButtons() {
        const frBtn = document.getElementById('fr-btn');
        const enBtn = document.getElementById('eng-btn');

        // Réinitialiser les classes
        [frBtn, enBtn].forEach(btn => {
            if (btn) {
                btn.classList.remove('active', 'btn-lang-active');
            }
        });

        // Ajouter la classe active au bouton sélectionné
        if (this.currentLanguage === 'fr' && frBtn) {
            frBtn.classList.add('active', 'btn-lang-active');
        } else if (this.currentLanguage === 'en' && enBtn) {
            enBtn.classList.add('active', 'btn-lang-active');
        }
    }

    // Méthode pour ajouter de nouvelles traductions dynamiquement
    addTranslation(key, frText, enText) {
        this.translations.fr[key] = frText;
        this.translations.en[key] = enText;
    }

    // Méthode pour obtenir une traduction spécifique
    getTranslation(key) {
        return this.translations[this.currentLanguage][key] || key;
    }

    // Méthode pour traduire du texte dynamique
    translate(key) {
        return this.getTranslation(key);
    }

    // Méthode pour traduire les éléments ajoutés dynamiquement
    translateDynamicContent(container) {
        const elementsToTranslate = container.querySelectorAll('[data-translate]');
        const currentTranslations = this.translations[this.currentLanguage];

        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-translate');

            if (currentTranslations[key]) {
                if (currentTranslations[key].includes('<')) {
                    element.innerHTML = currentTranslations[key];
                } else {
                    element.textContent = currentTranslations[key];
                }
            }
        });
    }

    // Méthode pour déboguer les traductions
    debug() {
        console.log('Langue actuelle:', this.currentLanguage);
        console.log('Traductions disponibles:', Object.keys(this.translations));
        console.log('Éléments avec data-translate:', document.querySelectorAll('[data-translate]').length);
    }

    // Méthode pour exporter les traductions (utile pour la maintenance)
    exportTranslations() {
        return JSON.stringify(this.translations, null, 2);
    }

    // Méthode pour importer des traductions
    importTranslations(translationsJSON) {
        try {
            const newTranslations = JSON.parse(translationsJSON);
            this.translations = { ...this.translations, ...newTranslations };
            this.translatePage();
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'importation des traductions:', error);
            return false;
        }
    }

    // Méthode pour vérifier les traductions manquantes
    checkMissingTranslations() {
        const elementsToTranslate = document.querySelectorAll('[data-translate]');
        const missingTranslations = {
            fr: [],
            en: []
        };

        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-translate');

            if (!this.translations.fr[key]) {
                missingTranslations.fr.push(key);
            }
            if (!this.translations.en[key]) {
                missingTranslations.en.push(key);
            }
        });

        if (missingTranslations.fr.length > 0 || missingTranslations.en.length > 0) {
            console.warn('Traductions manquantes:', missingTranslations);
        }

        return missingTranslations;
    }

    // Méthode pour observer les changements dans le DOM
    observeDocumentChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Traduire les nouveaux éléments ajoutés
                            this.translateDynamicContent(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return observer;
    }
}

// Fonction utilitaire pour l'initialisation
function initNebulaTranslations() {
    // Créer une instance globale du système de traduction
    window.nebulaTranslation = new NebulaTranslationSystem();

    // Observer les changements dans le DOM (optionnel)
    // window.nebulaTranslation.observeDocumentChanges();

    // Vérifier les traductions manquantes en mode développement
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.nebulaTranslation.checkMissingTranslations();
    }

    console.log('NebulaSync Translation System initialized');
}

// Initialisation automatique au chargement du DOM
document.addEventListener('DOMContentLoaded', initNebulaTranslations);

// Initialisation de secours si DOMContentLoaded a déjà été déclenché
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNebulaTranslations);
} else {
    initNebulaTranslations();
}

// Export pour utilisation dans d'autres fichiers si nécessaire
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NebulaTranslationSystem;
}

// Fonctions globales utiles
window.changeLanguage = function(lang) {
    if (window.nebulaTranslation) {
        window.nebulaTranslation.changeLanguage(lang);
    }
};

window.getCurrentLanguage = function() {
    return window.nebulaTranslation ? window.nebulaTranslation.currentLanguage : 'fr';
};

window.translate = function(key) {
    return window.nebulaTranslation ? window.nebulaTranslation.translate(key) : key;
};


const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))



function createParticle() {
    const particleContainer = document.getElementById('particles-container');
    const particleCount = 5; // Combien de particules à créer à chaque intervalle

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particles';

        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = '0s';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';

        particleContainer.appendChild(particle);

        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }
}

// Crée les particules toutes les 200 ms (5 particules par appel)
setInterval(createParticle, 200);


document.addEventListener('DOMContentLoaded', function () {
    const bar = document.getElementById('scroll-progress-bar');

    // Vérifie que l'élément existe dans le DOM
    if (!bar) return;

    function updateScrollBar() {
        const scrollY = window.scrollY || window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

        bar.style.width = scrollPercent + "%";
    }

    // Met à jour au scroll, au resize et au chargement initial
    window.addEventListener('scroll', updateScrollBar, { passive: true });
    window.addEventListener('resize', updateScrollBar);
    updateScrollBar();
});