// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    document.body.classList.toggle('menu-open');

    // Toggle hamburger icon
    this.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
});

// Close menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileMenuBtn.textContent = '☰';
    });
});

// Close menu on resize to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileMenuBtn.textContent = '☰';
    }
});

// Multi-Step Form Logic
let currentStep = 1;
let selectedServiceType = '';
const totalSteps = 4;

// Location data
const locationData = {
    'WP Kuala Lumpur': ['Kuala Lumpur', 'Ampang', 'Bangsar', 'Brickfields', 'Bukit Bintang', 'Cheras', 'Damansara', 'Kepong', 'Mont Kiara', 'Sentul', 'Setapak', 'Titiwangsa', 'Wangsa Maju'],
    'WP Putrajaya': ['Putrajaya'],
    'WP Labuan': ['Labuan'],
    'Selangor': ['Petaling Jaya', 'Shah Alam', 'Subang Jaya', 'Klang', 'Puchong', 'Kajang', 'Cyberjaya', 'Bangi', 'Serdang', 'Rawang', 'Sungai Buloh', 'Semenyih', 'Sepang', 'Kuala Selangor', 'Kuala Kubu Bharu', 'Banting', 'Jenjarom', 'Telok Panglima Garang', 'Dengkil', 'Selayang', 'Gombak', 'Hulu Langat', 'Hulu Selangor', 'Sabak Bernam'],
    'Johor': ['Johor Bahru', 'Iskandar Puteri', 'Skudai', 'Pasir Gudang', 'Kulai', 'Kluang', 'Batu Pahat', 'Muar', 'Pontian', 'Segamat', 'Kota Tinggi', 'Mersing', 'Tangkak', 'Yong Peng', 'Ayer Hitam', 'Simpang Renggam', 'Labis', 'Parit Raja', 'Senai', 'Ulu Tiram'],
    'Melaka': ['Melaka City', 'Alor Gajah', 'Jasin', 'Masjid Tanah', 'Bemban', 'Durian Tunggal'],
    'Negeri Sembilan': ['Seremban', 'Port Dickson', 'Nilai', 'Tampin', 'Rembau', 'Kuala Pilah', 'Jempol', 'Jelebu', 'Bahau', 'Gemas'],
    'Penang': ['George Town', 'Bayan Lepas', 'Butterworth', 'Bukit Mertajam', 'Nibong Tebal', 'Kepala Batas', 'Permatang Pauh', 'Bayan Baru', 'Tanjung Tokong', 'Jelutong', 'Gelugor', 'Sungai Bakap', 'Tasek Gelugor', 'Penanti', 'Simpang Ampat', 'Balik Pulau'],
    'Perak': ['Ipoh', 'Taiping', 'Teluk Intan', 'Sitiawan', 'Lumut', 'Kampar', 'Kuala Kangsar', 'Parit Buntar', 'Batu Gajah', 'Tanjung Malim', 'Seri Manjung', 'Tapah', 'Bidur', 'Tanjung Tualang', 'Gopeng', 'Tronoh', 'Bagan Serai', 'Changkat Jering', 'Sungai Siput', 'Lenggong', 'Gerik'],
    'Kedah': ['Alor Setar', 'Sungai Petani', 'Kulim', 'Langkawi', 'Jitra', 'Baling', 'Pendang', 'Kuala Ketil', 'Sik', 'Yan', 'Kuala Nerang', 'Padang Serai', 'Bedong', 'Gurun', 'Kuala Kedah', 'Kubang Pasu'],
    'Perlis': ['Kangar', 'Arau', 'Padang Besar', 'Kuala Perlis'],
    'Pahang': ['Kuantan', 'Temerloh', 'Bentong', 'Raub', 'Pekan', 'Jerantut', 'Kuala Lipis', 'Rompin', 'Maran', 'Bera', 'Cameron Highlands', 'Tanah Rata', 'Mentakab', 'Triang', 'Kuala Krau', 'Chenor', 'Sungai Lembing', 'Muadzam Shah'],
    'Terengganu': ['Kuala Terengganu', 'Kemaman', 'Dungun', 'Marang', 'Besut', 'Hulu Terengganu', 'Setiu', 'Jerteh', 'Chukai', 'Kerteh', 'Paka', 'Kuala Berang'],
    'Kelantan': ['Kota Bharu', 'Pasir Mas', 'Tanah Merah', 'Machang', 'Tumpat', 'Bachok', 'Pasir Puteh', 'Kuala Krai', 'Gua Musang', 'Jeli', 'Wakaf Bharu', 'Rantau Panjang'],
    'Sabah': ['Kota Kinabalu', 'Sandakan', 'Tawau', 'Lahad Datu', 'Keningau', 'Beaufort', 'Semporna', 'Kudat', 'Papar', 'Ranau', 'Kota Belud', 'Tuaran', 'Penampang', 'Putatan', 'Kota Marudu', 'Kunak', 'Kinabatangan', 'Beluran', 'Tongod', 'Tenom', 'Sipitang', 'Kuala Penyu', 'Nabawan', 'Tambunan'],
    'Sarawak': ['Kuching', 'Miri', 'Sibu', 'Bintulu', 'Limbang', 'Sarikei', 'Sri Aman', 'Kapit', 'Betong', 'Mukah', 'Lawas', 'Samarahan', 'Serian', 'Simunjan', 'Dalat', 'Daro', 'Marudi', 'Tatau', 'Belaga', 'Song', 'Kanowit', 'Saratok', 'Roban', 'Kabong', 'Sundar', 'Pusa', 'Bau', 'Lundu', 'Sematan']
};

// State selection handler
const stateSelect = document.getElementById('state');
if (stateSelect) {
    stateSelect.addEventListener('change', function() {
        const state = this.value;
        const areaSelect = document.getElementById('area');

        // Clear and disable area select
        areaSelect.innerHTML = '<option value="">Select Area</option>';
        areaSelect.disabled = true;
        document.getElementById('location').value = '';

        // Populate areas if state is selected
        if (state && locationData[state]) {
            locationData[state].forEach(area => {
                const option = document.createElement('option');
                option.value = area;
                option.textContent = area;
                areaSelect.appendChild(option);
            });
            areaSelect.disabled = false;
        }
    });
}

// Area selection handler
const areaSelect = document.getElementById('area');
if (areaSelect) {
    areaSelect.addEventListener('change', function() {
        const state = document.getElementById('state').value;
        const area = this.value;

        if (state && area) {
            document.getElementById('location').value = area + ', ' + state;
        }
    });
}

// Service type selection
document.querySelectorAll('.service-type-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.service-type-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selectedServiceType = this.getAttribute('data-type');
        const step1NextBtn = document.getElementById('step1Next');
        if (step1NextBtn) step1NextBtn.disabled = false;
    });
});

// Populate service checkboxes based on selected type
function populateServiceCheckboxes() {
    const checkboxContainer = document.getElementById('serviceCheckboxes');
    checkboxContainer.innerHTML = '';

    const services = selectedServiceType === 'lawn-care'
        ? [
            { value: 'Seeding', label: 'Seeding', icon: '🌱' },
            { value: 'Aeration', label: 'Aeration', icon: '🔄' },
            { value: 'Topdress', label: 'Topdress', icon: '🏖️' },
            { value: 'Mowing', label: 'Mowing', icon: '✂️' },
            { value: 'Dethatch', label: 'Dethatch', icon: '🧹' },
            { value: 'Sprinkler (Lawn Care)', label: 'Sprinkler', icon: '💧' },
            { value: 'Subsoil Drainage (Lawn Care)', label: 'Subsoil Drainage', icon: '🚰' }
        ]
        : [
            { value: 'Cow Grass Installation', label: 'Cow Grass', icon: '🐄' },
            { value: 'Philippine Grass Installation', label: 'Philippine Grass', icon: '🇵🇭' },
            { value: 'Pearl Grass Installation', label: 'Pearl Grass', icon: '💎' },
            { value: 'Japanese Grass Installation', label: 'Japanese Grass', icon: '🇯🇵' },
            { value: 'Sprinkler System (Installation)', label: 'Sprinkler System', icon: '💧' },
            { value: 'Subsoil Drainage (Installation)', label: 'Subsoil Drainage', icon: '🚰' }
        ];

    services.forEach(service => {
        const checkboxCard = document.createElement('div');
        checkboxCard.className = 'service-card';
        checkboxCard.style.cssText = 'cursor: pointer; margin-bottom: 0.5rem; padding: 0.625rem 0.75rem; border: 1px solid var(--gray-300); border-radius: 0.375rem; transition: all 0.3s;';
        checkboxCard.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <input type="checkbox" value="${service.value}" class="service-checkbox" style="width: 16px; height: 16px; cursor: pointer; flex-shrink: 0;">
                <label style="color: var(--gray-900); margin: 0; font-size: 0.9375rem; cursor: pointer; flex: 1;">${service.label}</label>
            </div>
        `;

        checkboxCard.addEventListener('click', function(e) {
            if (e.target.type !== 'checkbox') {
                const checkbox = this.querySelector('.service-checkbox');
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            }
        });

        const checkbox = checkboxCard.querySelector('.service-checkbox');
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                checkboxCard.style.borderColor = 'var(--teal-primary)';
                checkboxCard.style.backgroundColor = 'var(--gray-50)';
            } else {
                checkboxCard.style.borderColor = 'var(--gray-300)';
                checkboxCard.style.backgroundColor = 'transparent';
            }
            updateServiceSelect();
            validateStep2();
        });

        checkboxContainer.appendChild(checkboxCard);
    });
}

// Update hidden select element based on checkboxes
function updateServiceSelect() {
    const checkboxes = document.querySelectorAll('.service-checkbox:checked');
    const serviceSelect = document.getElementById('service');

    // Clear all selections
    Array.from(serviceSelect.options).forEach(opt => opt.selected = false);

    // Select checked services
    checkboxes.forEach(cb => {
        const option = Array.from(serviceSelect.options).find(opt => opt.value === cb.value);
        if (option) option.selected = true;
    });
}

// Validate step 2
function validateStep2() {
    const checkedCount = document.querySelectorAll('.service-checkbox:checked').length;
    document.getElementById('step2Next').disabled = checkedCount === 0;
}

// Validate step 3
function validateStep3() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    document.getElementById('step3Next').disabled = !(name && phone && email);
}

// Add input listeners for step 3
['name', 'phone', 'email'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', validateStep3);
});

// Navigation functions
function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));

    // Show current step
    document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');

    // Update step indicator
    document.querySelectorAll('.step-indicator-item').forEach((item, index) => {
        item.classList.remove('active', 'completed');
        if (index + 1 < step) {
            item.classList.add('completed');
        } else if (index + 1 === step) {
            item.classList.add('active');
        }
    });

    currentStep = step;

    // Special handling for step 2
    if (step === 2 && document.getElementById('serviceCheckboxes').children.length === 0) {
        populateServiceCheckboxes();
    }
}

// Next button handlers
const step1Next = document.getElementById('step1Next');
const step2Next = document.getElementById('step2Next');
const step3Next = document.getElementById('step3Next');
if (step1Next) step1Next.addEventListener('click', () => showStep(2));
if (step2Next) step2Next.addEventListener('click', () => showStep(3));
if (step3Next) step3Next.addEventListener('click', () => showStep(4));

// Previous button handlers
document.querySelectorAll('.btn-prev').forEach(btn => {
    btn.addEventListener('click', function() {
        if (currentStep > 1) {
            // Clear service checkboxes when going back from step 2 to step 1
            // so they repopulate based on new service type selection
            if (currentStep === 2) {
                const checkboxContainer = document.getElementById('serviceCheckboxes');
                if (checkboxContainer) checkboxContainer.innerHTML = '';
            }
            showStep(currentStep - 1);
        }
    });
});

// WhatsApp Form Integration
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const serviceSelect = document.getElementById('service');
        const selectedServices = Array.from(serviceSelect.selectedOptions).map(opt => opt.value);
        const location = document.getElementById('location').value;

        // Format services list
        const servicesText = selectedServices.map(s => `• ${s}`).join('\n');

        // Create well-formatted WhatsApp message with proper styling
        const message = `*THELAWN - BOOKING REQUEST*

━━━━━━━━━━━━━━━━━━━━━━

*Customer Details*
• Name: ${name}
• Phone: ${phone}
• Email: ${email}
• Location: ${location}

*Service Request*
${servicesText}

━━━━━━━━━━━━━━━━━━━━━━

I would like to schedule this service at your earliest convenience.

Looking forward to your confirmation!`;

        const whatsappUrl = `https://wa.me/601121888274?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Infinite Services Carousel
const servicesTrack = document.getElementById('services-carousel');
if (servicesTrack) {
    let currentPosition = 0;
    let isAutoPlaying = true;
    let autoplayInterval;
    let resumeTimeout;
    const cardWidth = 280; // matches CSS
    const gap = 24; // 1.5rem
    const slideAmount = cardWidth + gap;
    const totalCards = 11; // original cards count
    const maxPosition = totalCards * slideAmount;
    const autoplayDelay = 3000;

    function updateCarousel(animate = true) {
        if (!animate) {
            servicesTrack.style.transition = 'none';
        } else {
            servicesTrack.style.transition = 'transform 0.5s ease';
        }
        servicesTrack.style.transform = `translateX(-${currentPosition}px)`;

        // Force reflow if no animation
        if (!animate) {
            servicesTrack.offsetHeight;
            servicesTrack.style.transition = 'transform 0.5s ease';
        }
    }

    function scrollCarouselInternal(direction) {
        currentPosition += slideAmount * direction;

        // Handle infinite loop
        if (currentPosition >= maxPosition) {
            updateCarousel(true);
            setTimeout(() => {
                currentPosition = 0;
                updateCarousel(false);
            }, 500);
        } else if (currentPosition < 0) {
            currentPosition = 0;
            updateCarousel(false);
            setTimeout(() => {
                currentPosition = maxPosition - slideAmount;
                updateCarousel(false);
                setTimeout(() => {
                    currentPosition += slideAmount * direction;
                    updateCarousel(true);
                }, 50);
            }, 50);
        } else {
            updateCarousel(true);
        }
    }

    // Global function for button onclick
    window.scrollCarousel = function(direction) {
        // Clear any existing timers to prevent stacking
        clearInterval(autoplayInterval);
        clearTimeout(resumeTimeout);
        isAutoPlaying = false;

        scrollCarouselInternal(direction);

        // Reset and resume autoplay after full delay
        resumeTimeout = setTimeout(() => {
            isAutoPlaying = true;
            startAutoplay();
        }, autoplayDelay);
    };

    function startAutoplay() {
        clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => {
            if (isAutoPlaying) {
                scrollCarouselInternal(1);
            }
        }, autoplayDelay);
    }

    // Pause on hover
    servicesTrack.addEventListener('mouseenter', () => {
        isAutoPlaying = false;
    });

    servicesTrack.addEventListener('mouseleave', () => {
        if (!isDragging) {
            isAutoPlaying = true;
            startAutoplay();
        }
    });

    // Drag to scroll functionality
    let isDragging = false;
    let startX;
    let dragStartPosition;

    servicesTrack.style.cursor = 'grab';

    servicesTrack.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
        dragStartPosition = currentPosition;
        servicesTrack.style.cursor = 'grabbing';
        servicesTrack.style.transition = 'none';
        clearInterval(autoplayInterval);
        clearTimeout(resumeTimeout);
        isAutoPlaying = false;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const x = e.pageX;
        const walk = startX - x;
        currentPosition = dragStartPosition + walk;

        // Clamp position
        if (currentPosition < 0) currentPosition = 0;
        if (currentPosition > maxPosition) currentPosition = maxPosition;

        servicesTrack.style.transform = `translateX(-${currentPosition}px)`;
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        servicesTrack.style.cursor = 'grab';
        servicesTrack.style.transition = 'transform 0.5s ease';

        // Snap to nearest card
        currentPosition = Math.round(currentPosition / slideAmount) * slideAmount;
        if (currentPosition > maxPosition - slideAmount) {
            currentPosition = 0;
        }
        updateCarousel(true);

        // Resume autoplay after delay
        resumeTimeout = setTimeout(() => {
            isAutoPlaying = true;
            startAutoplay();
        }, autoplayDelay);
    });

    // Touch support
    servicesTrack.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX;
        dragStartPosition = currentPosition;
        servicesTrack.style.transition = 'none';
        clearInterval(autoplayInterval);
        clearTimeout(resumeTimeout);
        isAutoPlaying = false;
    }, { passive: true });

    servicesTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        const x = e.touches[0].pageX;
        const walk = startX - x;
        currentPosition = dragStartPosition + walk;

        if (currentPosition < 0) currentPosition = 0;
        if (currentPosition > maxPosition) currentPosition = maxPosition;

        servicesTrack.style.transform = `translateX(-${currentPosition}px)`;
    }, { passive: true });

    servicesTrack.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        servicesTrack.style.transition = 'transform 0.5s ease';

        currentPosition = Math.round(currentPosition / slideAmount) * slideAmount;
        if (currentPosition > maxPosition - slideAmount) {
            currentPosition = 0;
        }
        updateCarousel(true);

        resumeTimeout = setTimeout(() => {
            isAutoPlaying = true;
            startAutoplay();
        }, autoplayDelay);
    });

    // Start autoplay
    startAutoplay();
}

// Before/After Comparison Slider
document.querySelectorAll('[data-compare]').forEach(container => {
    const slider = container.querySelector('.comparison-slider');
    const beforeDiv = container.querySelector('.comparison-before');

    if (!slider || !beforeDiv) return;

    let isDragging = false;

    function updateSlider(e) {
        if (!isDragging) return;

        const rect = container.getBoundingClientRect();
        let x;

        if (e.type.includes('touch')) {
            x = e.touches[0].clientX - rect.left;
        } else {
            x = e.clientX - rect.left;
        }

        // Clamp between 0 and container width
        x = Math.max(0, Math.min(x, rect.width));

        // Calculate percentage
        const percent = (x / rect.width) * 100;

        // Update slider position
        slider.style.left = percent + '%';

        // Update clip-path for before image (clips from right)
        beforeDiv.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    }

    // Mouse events
    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
    });

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateSlider(e);
    });

    document.addEventListener('mousemove', updateSlider);

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch events
    slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        e.preventDefault();
    });

    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        updateSlider(e);
    });

    document.addEventListener('touchmove', updateSlider);

    document.addEventListener('touchend', () => {
        isDragging = false;
    });
});
