document.addEventListener('DOMContentLoaded', () => {
    // ===== 3D INTERACTIVE BACKGROUND =====
    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#bg-canvas'),
            alpha: true
        });

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.setZ(5);

        const geometry = new THREE.IcosahedronGeometry(1.5, 1);
        const material = new THREE.MeshPhongMaterial({
            color: 0x8E44AD,
            shininess: 100,
            specular: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });
        const shape = new THREE.Mesh(geometry, material);
        scene.add(shape);

        const pointLight = new THREE.PointLight(0x00A3FF, 1.5);
        pointLight.position.set(10, 10, 10);
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(pointLight, ambientLight);

        let mouseX = 0;
        let mouseY = 0;
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        function animate() {
            requestAnimationFrame(animate);
            shape.rotation.x += 0.0005;
            shape.rotation.y += 0.0005;
            shape.rotation.y += (mouseX * 0.3 - shape.rotation.y) * 0.02;
            shape.rotation.x += (mouseY * 0.3 - shape.rotation.x) * 0.02;
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    } catch (error) {
        console.error("3D animation error:", error);
        const canvas = document.querySelector('#bg-canvas');
        if(canvas) canvas.style.display = 'none';
    }

    // ===== GSAP SCROLL-TRIGGERED ANIMATIONS =====
    gsap.registerPlugin(ScrollTrigger);
    
    // --- Header Animation ---
    const header = document.querySelector('.site-header');
    ScrollTrigger.create({
        start: 'top -150px',
        end: 99999,
        onUpdate: self => {
            header.classList.toggle('visible', self.direction === -1);
        }
    });

    // --- Hero Animation ---
    gsap.from('.hero-intro-text .line span', {
        y: '100%',
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2
    });
    gsap.from('.hero-journey-text', {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power3.out',
        delay: 1
    });

    // --- General Section Reveal ---
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        const sectionTitle = section.querySelector('.section-title');
        if (sectionTitle) {
            gsap.from(sectionTitle, {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        }
    });

    // --- Specific Section Animations ---
    gsap.from('.about-container > *', {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.about-container',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
    
    gsap.from('.skill-category', {
        opacity: 0,
        y: 50,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });
    
    gsap.from('.project-card', {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
    
    gsap.from('.timeline-item', {
        opacity: 0,
        x: -50,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.experience-timeline',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.cert-card:not(.hidden)', {
        opacity: 0,
        y: 50,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.certifications-grid',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // --- Show More Certificates ---
    const showMoreButton = document.getElementById('show-more-certs');
    const hiddenCerts = document.querySelectorAll('.cert-card.hidden');

    if (showMoreButton) {
        showMoreButton.addEventListener('click', () => {
            hiddenCerts.forEach(cert => {
                cert.style.display = 'flex';
                cert.classList.remove('hidden');
            });
            gsap.from(hiddenCerts, {
                opacity: 0,
                y: 20,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power3.out'
            });
            gsap.to(showMoreButton, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    showMoreButton.style.display = 'none';
                }
            });
        });
    }


    // --- Magnetic Links ---
    document.querySelectorAll('.magnetic-link').forEach(link => {
        const span = link.querySelector('span');
        if (!span) return;
        
        link.addEventListener('mousemove', (e) => {
            const { clientX, clientY, currentTarget } = e;
            const { left, top, width, height } = currentTarget.getBoundingClientRect();
            const x = (clientX - left - width / 2) * 0.4;
            const y = (clientY - top - height / 2) * 0.6;
            gsap.to(span, { x: x, y: y, duration: 0.8, ease: 'power3.out' });
        });
        link.addEventListener('mouseleave', () => {
            gsap.to(span, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)' });
        });
    });
});