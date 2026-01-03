// =========================================
// AREA CALCULATOR PAGE SCRIPTS
// =========================================

// Set current year in footer
const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const mobileOverlay = document.getElementById('mobileOverlay');

function openMenu() {
    if (mobileNav) mobileNav.classList.add('active');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    if (menuToggle) menuToggle.classList.add('active');
    document.body.classList.add('menu-open');
}

function closeMenu() {
    if (mobileNav) mobileNav.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    if (menuToggle) menuToggle.classList.remove('active');
    document.body.classList.remove('menu-open');
}

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        mobileNav.classList.contains('active') ? closeMenu() : openMenu();
    });
}

if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMenu);
}

document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// =========================================
// SAVE INPUT DATA TO LOCALSTORAGE
// =========================================

const calcFields = [
    'pesticideAmount',
    'pesticideUnit',
    'waterAmount',
    'waterUnit',
    'labelArea',
    'labelAreaUnit',
    'yourArea',
    'sandThickness',
    'sandArea'
];

// Restore saved values on page load
window.addEventListener('DOMContentLoaded', () => {
    calcFields.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        const saved = localStorage.getItem('thelawn_' + id);
        if (saved !== null) {
            el.value = saved;
        }
    });
});

// Save value on change / input
calcFields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('input', () => {
        localStorage.setItem('thelawn_' + id, el.value);
    });

    el.addEventListener('change', () => {
        localStorage.setItem('thelawn_' + id, el.value);
    });
});

// =========================================
// CTA LINK HANDLER
// =========================================
const ctaLink = document.getElementById('ctaLink');
if (ctaLink) {
    ctaLink.addEventListener('click', (e) => {
        // Data already saved to localStorage by app.js updateUI()
        // Just let the link navigate normally
    });
}

// =========================================
// COLLAPSIBLE "WHY IT MATTERS" SECTIONS
// =========================================
function toggleWhy(sectionId) {
    // Get all "Why it matters" sections and buttons
    const allContents = document.querySelectorAll('.why-matters-content');
    const allButtons = document.querySelectorAll('.why-matters-toggle');

    // Toggle all sections and buttons simultaneously
    allContents.forEach(content => {
        content.classList.toggle('active');
    });

    allButtons.forEach(button => {
        button.classList.toggle('active');
    });
}

// Make toggleWhy available globally
window.toggleWhy = toggleWhy;

// =========================================
// BACK TO TOP BUTTON
// =========================================
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// =========================================
// PESTICIDE/FOLIAR CALCULATOR
// =========================================
const calculatePesticideBtn = document.getElementById('calculatePesticide');
if (calculatePesticideBtn) {
    calculatePesticideBtn.addEventListener('click', () => {
        const pesticideAmount = parseFloat(document.getElementById('pesticideAmount').value) || 0;
        const pesticideUnit = document.getElementById('pesticideUnit').value;
        const waterAmount = parseFloat(document.getElementById('waterAmount').value) || 0;
        const waterUnit = document.getElementById('waterUnit').value;
        const labelArea = parseFloat(document.getElementById('labelArea').value) || 0;
        const labelAreaUnit = document.getElementById('labelAreaUnit').value;
        const yourArea = parseFloat(document.getElementById('yourArea').value) || 0;

        if (!pesticideAmount || !waterAmount || !labelArea || !yourArea) {
            alert('Sila isi semua ruangan');
            return;
        }

        // Convert labelArea to sqft
        let labelAreaSqft = labelArea;
        if (labelAreaUnit === 'm2') {
            labelAreaSqft = labelArea * 10.764;
        } else if (labelAreaUnit === 'hectare') {
            labelAreaSqft = labelArea * 107639;
        }

        // Calculate ratio
        const ratio = yourArea / labelAreaSqft;

        // Calculate pesticide needed (convert to ml for display)
        let pesticideNeeded = pesticideAmount * ratio;
        let pesticideDisplay = '';
        if (pesticideUnit === 'liter') {
            pesticideNeeded = pesticideNeeded * 1000; // Convert to ml
        }
        if (pesticideNeeded >= 1000) {
            pesticideDisplay = (pesticideNeeded / 1000).toFixed(2) + ' liter';
        } else {
            pesticideDisplay = pesticideNeeded.toFixed(1) + ' ml';
        }

        // Calculate water needed (convert to liters for display)
        let waterNeeded = waterAmount * ratio;
        let waterDisplay = '';
        if (waterUnit === 'ml') {
            waterNeeded = waterNeeded / 1000; // Convert to liters
        }
        if (waterNeeded < 1) {
            waterDisplay = (waterNeeded * 1000).toFixed(0) + ' ml';
        } else {
            waterDisplay = waterNeeded.toFixed(2) + ' liter';
        }

        document.getElementById('pesticideNeeded').textContent = pesticideDisplay;
        document.getElementById('waterNeeded').textContent = waterDisplay;
        document.getElementById('pesticideResult').style.display = 'block';
    });
}

// =========================================
// TOPDRESS SAND CALCULATOR
// =========================================
const calculateSandBtn = document.getElementById('calculateSand');
if (calculateSandBtn) {
    calculateSandBtn.addEventListener('click', () => {
        const sandThickness = parseFloat(document.getElementById('sandThickness').value) || 0;
        const sandArea = parseFloat(document.getElementById('sandArea').value) || 0;

        if (!sandThickness || !sandArea) {
            alert('Sila isi semua ruangan');
            return;
        }

        // Convert sqft to m2
        const areaM2 = sandArea * 0.0929;

        // Convert mm to m
        const thicknessM = sandThickness / 1000;

        // Calculate volume in m3
        const volumeM3 = areaM2 * thicknessM;

        // Convert to tons (assuming sand density of 1.6 tons per m3)
        const tons = volumeM3 * 1.6;

        let sandDisplay = '';
        if (tons < 1) {
            sandDisplay = (tons * 1000).toFixed(0) + ' kg';
        } else {
            sandDisplay = tons.toFixed(2) + ' tan';
        }

        document.getElementById('sandVolume').textContent = sandDisplay;
        document.getElementById('sandResult').style.display = 'block';
    });
}
