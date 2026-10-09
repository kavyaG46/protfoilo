
/* ==========================================
   KAVYA PORTFOLIO | INTERACTIVE JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // =====================================
    // 1. ANIMATED INTRO LOADER
    // =====================================
    const loader = document.getElementById("site-loader");

    function hideLoader() {
        if (loader) loader.classList.add("loaded");
    }

    // Reveal the website after its resources finish loading.
    window.addEventListener("load", hideLoader, { once: true });

    // Prevent the loader from remaining visible indefinitely.
    const loaderTimeout = setTimeout(hideLoader, 2500);

    if (loader) {
        loader.addEventListener("transitionend", () => {
            if (loader.classList.contains("loaded")) {
                clearTimeout(loaderTimeout);
            }
        });
    }

    // =====================================
    // 2. CUSTOM MOVING CIRCLE + DOT CURSOR
    // =====================================
    const circle = document.querySelector(".cursor-circle");
    const dot = document.querySelector(".cursor-dot");

    const finePointer = window.matchMedia(
        "(pointer: fine)"
    ).matches;

    if (circle && dot && finePointer && !reduceMotion) {
        let mouseX = -100;
        let mouseY = -100;
        let circleX = -100;
        let circleY = -100;

        document.addEventListener("mousemove", event => {
            mouseX = event.clientX;
            mouseY = event.clientY;

            dot.style.left = mouseX + "px";
            dot.style.top = mouseY + "px";
        });

        function animateCursor() {
            circleX += (mouseX - circleX) * 0.18;
            circleY += (mouseY - circleY) * 0.18;

            circle.style.left = circleX + "px";
            circle.style.top = circleY + "px";

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        document.querySelectorAll("a, button, input, textarea").forEach(
            element => {
                element.addEventListener("mouseenter", () => {
                    circle.classList.add("cursor-hover");
                });

                element.addEventListener("mouseleave", () => {
                    circle.classList.remove("cursor-hover");
                });
            }
        );
    }

    // =====================================
    // 3. RED SCROLL PROGRESS BAR
    // =====================================
    const progressBar = document.getElementById("scroll-progress");

    function updateScrollProgress() {
        if (!progressBar) return;

        const documentHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress = documentHeight > 0
            ? (window.scrollY / documentHeight) * 100
            : 0;

        progressBar.style.width = progress + "%";
    }

    window.addEventListener(
        "scroll",
        updateScrollProgress,
        { passive: true }
    );

    window.addEventListener("resize", updateScrollProgress);
    updateScrollProgress();

    // =====================================
    // 4. FLOATING BACKGROUND PARTICLES
    // =====================================
    const canvas = document.getElementById("particles");
    const ctx = canvas ? canvas.getContext("2d") : null;

    if (canvas && ctx && !reduceMotion) {
        let particles = [];
        let width = 0;
        let height = 0;
        let animationId;

        function resizeCanvas() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = Math.min(
                65,
                Math.max(20, Math.floor(width / 20))
            );

            particles = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.8 + 0.5,
                speed: Math.random() * 0.4 + 0.12,
                drift: (Math.random() - 0.5) * 0.25,
                opacity: Math.random() * 0.5 + 0.2
            }));
        }

        function drawParticles() {
            ctx.clearRect(0, 0, width, height);

            for (const particle of particles) {
                particle.y -= particle.speed;
                particle.x += particle.drift;

                if (particle.y < -5) {
                    particle.y = height + 5;
                    particle.x = Math.random() * width;
                }

                if (particle.x < -5) particle.x = width + 5;
                if (particle.x > width + 5) particle.x = -5;

                ctx.beginPath();
                ctx.arc(
                    particle.x,
                    particle.y,
                    particle.radius,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle = "#ff1744";
                ctx.globalAlpha = particle.opacity;
                ctx.fill();
            }

            ctx.globalAlpha = 1;
            animationId = requestAnimationFrame(drawParticles);
        }

        resizeCanvas();

        window.addEventListener("resize", resizeCanvas);
        drawParticles();

        // Pause the animation in background tabs.
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                drawParticles();
            }
        });
    }

    // =====================================
    // 5. HERO TYPING ANIMATION
    // =====================================
    const typingElement = document.getElementById("typing-text");

    const words = [
        "BCA Student",
        "Web Developer",
        "UI/UX Enthusiast",
        "Future Full Stack Developer"
    ];

    if (typingElement) {
        if (reduceMotion) {
            typingElement.textContent = words[0];
        } else {
            let wordIndex = 0;
            let characterIndex = 0;
            let deleting = false;
            let typingTimer;

            function typeWords() {
                const currentWord = words[wordIndex];

                typingElement.textContent = currentWord.substring(
                    0,
                    characterIndex
                );

                if (!deleting && characterIndex < currentWord.length) {
                    characterIndex++;
                    typingTimer = setTimeout(typeWords, 85);
                } else if (!deleting) {
                    deleting = true;
                    typingTimer = setTimeout(typeWords, 1400);
                } else if (characterIndex > 0) {
                    characterIndex--;
                    typingTimer = setTimeout(typeWords, 42);
                } else {
                    deleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    typingTimer = setTimeout(typeWords, 300);
                }
            }

            typeWords();

            document.addEventListener("visibilitychange", () => {
                if (document.hidden) {
                    clearTimeout(typingTimer);
                } else {
                    typeWords();
                }
            });
        }
    }

    // =====================================
    // 6. 3D PROFILE CARD + PHOTO SCAN
    // =====================================
    const profileCard = document.getElementById("profile-card");

    if (profileCard && finePointer && !reduceMotion) {
        profileCard.addEventListener("mousemove", event => {
            const rect = profileCard.getBoundingClientRect();

            const horizontal =
                (event.clientX - rect.left) / rect.width;

            const vertical =
                (event.clientY - rect.top) / rect.height;

            const rotateY = (horizontal - 0.5) * 18;
            const rotateX = (0.5 - vertical) * 18;

            profileCard.style.transform =
                `perspective(1000px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 scale3d(1.025, 1.025, 1.025)`;
        });

        profileCard.addEventListener("mouseleave", () => {
            profileCard.style.transform =
                "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
        });
    }

    // =====================================
    // 7. SCROLL REVEAL ANIMATIONS
    // =====================================
    const revealElements = document.querySelectorAll(
    ".hero-content, .hero-visual, " +
    ".section-heading, .about-main, .about-profile, " +
    ".about-subheading, .journey-card, .about-goals, " +
    ".about-strengths, .about-closing, " +
    ".skill-card, .project-card, .timeline-item, .contact-box"
);

    revealElements.forEach(element => {
        element.classList.add("reveal");
    });

    if (
        reduceMotion ||
        !("IntersectionObserver" in window)
    ) {
        revealElements.forEach(element => {
            element.classList.add("visible");
        });
    } else {
        const revealObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    // =====================================
    // 8. DARK / LIGHT MODE
    // Uses your existing white-mode class
    // =====================================
    const themeButton = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");

    function applyTheme(isLight) {
        document.body.classList.toggle("white-mode", isLight);

        if (themeButton) {
            themeButton.setAttribute(
                "aria-label",
                isLight ? "Switch to dark mode" : "Switch to light mode"
            );

            themeButton.setAttribute(
                "aria-pressed",
                String(isLight)
            );
        }

        if (themeIcon) {
            // Sun in light mode, moon in dark mode.
            themeIcon.textContent = isLight ? "☾" : "☼";
        }

        const themeMeta = document.querySelector(
            'meta[name="theme-color"]'
        );

        if (themeMeta) {
            themeMeta.setAttribute(
                "content",
                isLight ? "#f6f6f8" : "#080808"
            );
        }
    }

    let storedTheme = null;

    try {
        storedTheme = localStorage.getItem("portfolio-theme");
    } catch (error) {
        // Storage might be unavailable in private browsing.
    }

    const initialLightMode = storedTheme === "light";

    applyTheme(initialLightMode);

    if (themeButton) {
        themeButton.addEventListener("click", () => {
            const isCurrentlyLight =
                document.body.classList.contains("white-mode");

            const nextLightMode = !isCurrentlyLight;

            applyTheme(nextLightMode);

            try {
                localStorage.setItem(
                    "portfolio-theme",
                    nextLightMode ? "light" : "dark"
                );
            } catch (error) {
                // Theme switching still works without storage.
            }
        });
    }

    // =====================================
    // 9. MOBILE NAVIGATION MENU
    // =====================================
    const menuButton = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    function closeMenu() {
        if (!menuButton || !navLinks) return;

        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
    }

    if (menuButton && navLinks) {
        menuButton.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") closeMenu();
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 700) closeMenu();
        });
    }

    // =====================================
    // 10. ACTIVE NAVIGATION LINK
    // =====================================
    const pageSections = document.querySelectorAll(
        "main section[id]"
    );

    const navigationLinks = document.querySelectorAll(
        ".nav-links a"
    );

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        navigationLinks.forEach(link => {
                            link.classList.toggle(
                                "active",
                                link.getAttribute("href") ===
                                "#" + entry.target.id
                            );
                        });
                    }
                });
            },
            {
                rootMargin: "-30% 0px -60% 0px",
                threshold: 0
            }
        );

        pageSections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // =====================================
    // 11. CONTACT FORM
    // Opens the visitor's email application
    // =====================================
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    if (contactForm) {
        contactForm.addEventListener("submit", event => {
            event.preventDefault();

            if (!contactForm.reportValidity()) return;

            const formData = new FormData(contactForm);

            const name = String(formData.get("name") || "").trim();
            const email = String(formData.get("email") || "").trim();
            const message = String(formData.get("message") || "").trim();

            const recipient = (
                contactForm.dataset.email || ""
            ).trim();

            if (
                !recipient ||
                recipient === "your-email@example.com"
            ) {
                if (formStatus) {
                    formStatus.textContent =
                        "Please add your real email address in index.html first.";
                }
                return;
            }

            const subject = encodeURIComponent(
                "Portfolio message from " + name
            );

            const body = encodeURIComponent(
                "Name: " + name +
                "\nEmail: " + email +
                "\n\nMessage:\n" + message
            );

            const mailto =
                `mailto:${recipient}?subject=${subject}&body=${body}`;

            if (formStatus) {
                formStatus.textContent =
                    "Opening your email application. Send the message there to complete delivery.";
            }

            window.location.href = mailto;
        });
    }

    // =====================================
    // 12. AUTOMATIC FOOTER YEAR
    // =====================================
    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});
