/* ==========================================
   KAVYA PORTFOLIO | INTERACTIVE JAVASCRIPT
   Space Explorer Portfolio
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const finePointer = window.matchMedia(
        "(pointer: fine)"
    ).matches;


    // =====================================
    // 1. ANIMATED INTRO LOADER
    // =====================================

    const loader = document.getElementById("site-loader");
    let loaderTimeout;

    function hideLoader() {
        if (loader) {
            loader.classList.add("loaded");
        }

        clearTimeout(loaderTimeout);
    }

    if (loader) {
        if (document.readyState === "complete") {
            hideLoader();
        } else {
            window.addEventListener("load", hideLoader, {
                once: true
            });

            loaderTimeout = setTimeout(hideLoader, 2500);
        }
    }


    // =====================================
    // 2. CUSTOM CIRCLE + DOT CURSOR
    // =====================================

    const circle = document.querySelector(".cursor-circle");
    const dot = document.querySelector(".cursor-dot");

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

        document.querySelectorAll(
            "a, button, input, textarea, select"
        ).forEach(element => {

            element.addEventListener("mouseenter", () => {
                circle.classList.add("cursor-hover");
            });

            element.addEventListener("mouseleave", () => {
                circle.classList.remove("cursor-hover");
            });

        });
    }


    // =====================================
    // 3. RED SCROLL PROGRESS BAR
    // =====================================

    const progressBar = document.getElementById("scroll-progress");

    function updateScrollProgress() {
        if (!progressBar) return;

        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

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
        let animationId = null;
        let animationRunning = false;

        function resizeCanvas() {
            const dpr = Math.min(
                window.devicePixelRatio || 1,
                2
            );

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

            particles = Array.from(
                { length: count },
                () => ({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 1.8 + 0.5,
                    speed: Math.random() * 0.4 + 0.12,
                    drift: (Math.random() - 0.5) * 0.25,
                    opacity: Math.random() * 0.5 + 0.2
                })
            );
        }

        function drawParticles() {
            if (document.hidden) {
                animationRunning = false;
                animationId = null;
                return;
            }

            animationRunning = true;

            ctx.clearRect(0, 0, width, height);

            particles.forEach(particle => {

                particle.y -= particle.speed;
                particle.x += particle.drift;

                if (particle.y < -5) {
                    particle.y = height + 5;
                    particle.x = Math.random() * width;
                }

                if (particle.x < -5) {
                    particle.x = width + 5;
                }

                if (particle.x > width + 5) {
                    particle.x = -5;
                }

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

            });

            ctx.globalAlpha = 1;

            animationId = requestAnimationFrame(drawParticles);
        }

        function startParticles() {
            if (animationRunning || document.hidden) return;

            animationRunning = true;
            animationId = requestAnimationFrame(drawParticles);
        }

        function stopParticles() {
            if (animationId !== null) {
                cancelAnimationFrame(animationId);
            }

            animationId = null;
            animationRunning = false;
        }

        resizeCanvas();
        startParticles();

        window.addEventListener("resize", resizeCanvas);

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopParticles();
            } else {
                startParticles();
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
            let typingTimer = null;

            function typeWords() {

                if (document.hidden) return;

                const currentWord = words[wordIndex];

                typingElement.textContent =
                    currentWord.substring(0, characterIndex);

                if (
                    !deleting &&
                    characterIndex < currentWord.length
                ) {
                    characterIndex++;

                    typingTimer = setTimeout(
                        typeWords,
                        85
                    );

                } else if (!deleting) {

                    deleting = true;

                    typingTimer = setTimeout(
                        typeWords,
                        1400
                    );

                } else if (characterIndex > 0) {

                    characterIndex--;

                    typingTimer = setTimeout(
                        typeWords,
                        42
                    );

                } else {

                    deleting = false;

                    wordIndex =
                        (wordIndex + 1) % words.length;

                    typingTimer = setTimeout(
                        typeWords,
                        300
                    );
                }
            }

            typeWords();

            document.addEventListener("visibilitychange", () => {

                clearTimeout(typingTimer);

                if (!document.hidden) {
                    typeWords();
                }

            });
        }
    }


    // =====================================
    // 6. 3D PROFILE CARD
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
                "perspective(1000px) " +
                "rotateX(0deg) rotateY(0deg) " +
                "scale3d(1,1,1)";

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
        ".skill-card, .project-card, .timeline-item, " +
        ".contact-box, .resume-card, .certificates-heading"
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
    // =====================================

    const themeButton = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");

    function applyTheme(isLight) {

        document.body.classList.toggle(
            "white-mode",
            isLight
        );

        if (themeButton) {

            themeButton.setAttribute(
                "aria-label",
                isLight
                    ? "Switch to dark mode"
                    : "Switch to light mode"
            );

            themeButton.setAttribute(
                "aria-pressed",
                String(isLight)
            );
        }

        if (themeIcon) {
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
        // Theme switching works even if storage is unavailable.
    }

    applyTheme(storedTheme === "light");

    if (themeButton) {

        themeButton.addEventListener("click", () => {

            const currentlyLight =
                document.body.classList.contains("white-mode");

            const nextLight = !currentlyLight;

            applyTheme(nextLight);

            try {

                localStorage.setItem(
                    "portfolio-theme",
                    nextLight ? "light" : "dark"
                );

            } catch (error) {
                // Do nothing if storage is unavailable.
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

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton.setAttribute(
            "aria-label",
            "Open navigation"
        );
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
                isOpen
                    ? "Close navigation"
                    : "Open navigation"
            );
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 700) {
                closeMenu();
            }
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

            const name = String(
                formData.get("name") || ""
            ).trim();

            const email = String(
                formData.get("email") || ""
            ).trim();

            const message = String(
                formData.get("message") || ""
            ).trim();

            const recipient = (
                contactForm.dataset.email || ""
            ).trim();

            if (
                !recipient ||
                recipient === "your-email@example.com"
            ) {

                if (formStatus) {
                    formStatus.textContent =
                        "Add your real email address to the contact form first.";
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
                    "Your email application is opening. Send the email there to complete delivery.";
            }

            window.location.href = mailto;
        });
    }


    // =====================================
    // 12. RESUME DOWNLOAD FEEDBACK
    // =====================================

    const resumeLink = document.querySelector(
        '#resume a[download]'
    );

    if (resumeLink) {

        resumeLink.addEventListener("click", function () {

            const originalHTML = this.innerHTML;

            this.innerHTML = "Downloading... ✓";

            setTimeout(() => {
                this.innerHTML = originalHTML;
            }, 1800);

        });
    }


    // =====================================
    // 13. EXCEL + GENAI CERTIFICATE POPUPS
    // =====================================

    const certificatePopups = [

        {
            trigger: document.getElementById("viewCertificate"),
            modal: document.getElementById("certificateModal"),
            close: document.getElementById("closeCertificate")
        },

        {
            trigger: document.getElementById("viewGenAICertificate"),
            modal: document.getElementById("genaiCertificateModal"),
            close: document.getElementById("closeGenAI")
        }

    ];

    let previouslyFocusedElement = null;

    function openCertificatePopup(popup) {

        if (!popup.modal) return;

        previouslyFocusedElement = popup.trigger;

        popup.modal.classList.add("active");

        popup.modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow = "hidden";

        if (popup.close) {
            popup.close.focus();
        }
    }

    function closeCertificatePopup(modal) {

        if (!modal) return;

        modal.classList.remove("active");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        const anotherPopupOpen =
            document.querySelector(".certificate-modal.active");

        if (!anotherPopupOpen) {
            document.body.style.overflow = "";
        }

        if (
            previouslyFocusedElement &&
            document.contains(previouslyFocusedElement)
        ) {
            previouslyFocusedElement.focus();
        }
    }

    certificatePopups.forEach(popup => {

        if (!popup.trigger || !popup.modal || !popup.close) {
            return;
        }

        // Open the relevant certificate popup
        popup.trigger.addEventListener("click", () => {
            openCertificatePopup(popup);
        });

        // Close with the X button
        popup.close.addEventListener("click", () => {
            closeCertificatePopup(popup.modal);
        });

        // Close by clicking outside the popup content
        popup.modal.addEventListener("click", event => {

            if (event.target === popup.modal) {
                closeCertificatePopup(popup.modal);
            }
        });
    });

    // Close any active certificate popup using Escape
    document.addEventListener("keydown", event => {

        if (event.key !== "Escape") return;

        const activePopup = document.querySelector(
            ".certificate-modal.active"
        );

        if (activePopup) {
            closeCertificatePopup(activePopup);
        }
    });


    // =====================================
    // 14. CERTIFICATE LINK FEEDBACK
    // =====================================

    const certificateLinks = document.querySelectorAll(
        ".certificate-link"
    );

    certificateLinks.forEach(link => {

        link.addEventListener("click", function () {

            this.style.opacity = "0.65";

            setTimeout(() => {
                this.style.opacity = "1";
            }, 400);

        });
    });


    // =====================================
    // 15. AUTOMATIC FOOTER YEAR
    // =====================================

    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

});
