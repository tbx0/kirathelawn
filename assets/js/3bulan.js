// =========================================
// 3 BULAN PACKAGE PAGE SCRIPTS
// =========================================

// Set current year in footer
const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

// Format number with thousand separator
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// =========================================
// PRODUCT PRICING AND USAGE DATA
// =========================================
const products = {
    baja: {
        name: 'Baja Premium',
        usageRate: 2, // 2g per sqft per month
        pricePerKg: 12.5, // RM12.50 per kg (RM25/2kg pack)
        packPrice: 25, // RM25 per 2kg pack (not used - selling by exact weight)
        packWeight: 2, // 2kg per pack (not used - selling by exact weight)
        months: 3
    },
    racun: {
        name: 'Racun Rumpai',
        price: 70,
        bottleSize: 250, // ml
        usageRate: 10, // 10ml per 400sqft
        coveragePerBottle: 400 * (250 / 10) // sqft
    },
    essentialPlus: {
        name: 'Foliar Essential Plus',
        price: 45,
        bottleSize: 250, // ml
        usageRate: 90, // 90ml per 1000sqft
        coveragePerBottle: 1000 * (250 / 90) // sqft
    },
    bioNutriens: {
        name: 'Foliar Bio Nutriens',
        price: 36,
        packSize: 80, // gram
        usageRate: 10, // 10g per 1000sqft
        coveragePerPack: 1000 * (80 / 10) // sqft
    },
    dethatcher: {
        name: 'Foliar Dethatcher',
        price: 25,
        packSize: 5, // gram
        usageRate: 2.5, // 2.5g per 1000sqft
        coveragePerPack: 1000 * (5 / 2.5) // sqft
    }
};

// Store calculation results globally for order form
let currentCalculation = null;

// =========================================
// CALCULATOR FUNCTIONS
// =========================================

function clearCalculation() {
    // Clear saved calculation
    localStorage.removeItem('thelawn_calculation_3bulan');

    // Clear input
    const lawnAreaInput = document.getElementById('lawnArea');
    if (lawnAreaInput) lawnAreaInput.value = '';

    // Hide results
    const results = document.getElementById('results');
    if (results) results.classList.remove('show');

    // Show hint again
    const mapHint = document.getElementById('mapHint');
    if (mapHint) mapHint.classList.remove('hidden');

    // Clear current calculation
    currentCalculation = null;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function calculate() {
    const lawnAreaInput = document.getElementById('lawnArea');
    if (!lawnAreaInput) return;

    // Remove commas from input before parsing
    const inputValue = lawnAreaInput.value.replace(/,/g, '').trim();
    const area = parseFloat(inputValue);

    // Better validation with more specific error messages
    if (!inputValue) {
        alert('Sila masukkan keluasan laman anda');
        return;
    }

    if (isNaN(area)) {
        alert('Sila masukkan nilai yang sah');
        return;
    }

    if (area < 100) {
        alert('Keluasan minimum adalah 100 sqft');
        return;
    }

    // Calculate quantities needed
    const results = calculateProducts(area);

    // Display results
    displayResults(area, results);

    // Show results section
    const resultsSection = document.getElementById('results');
    if (resultsSection) {
        resultsSection.classList.add('show');
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function calculateProducts(area) {
    const results = [];
    let total = 0;

    // 1. Baja Premium calculation - Tailored to customer's lawn size
    const bajaGramsPerMonth = area * products.baja.usageRate;
    const bajaKgPerMonth = bajaGramsPerMonth / 1000;
    const bajaTotalKg = bajaKgPerMonth * products.baja.months;
    const bajaRawPrice = bajaTotalKg * products.baja.pricePerKg;
    const bajaFinalPrice = Math.round(bajaRawPrice);

    results.push({
        name: products.baja.name,
        quantity: `${bajaTotalKg.toFixed(2)}kg`,
        netWeight: bajaTotalKg.toFixed(2) + 'kg',
        details: `${bajaKgPerMonth.toFixed(2)}kg sebulan x 3 bulan`,
        unitPrice: products.baja.pricePerKg,
        price: bajaFinalPrice
    });
    total += bajaFinalPrice;

    // 2. Racun Rumpai calculation
    const racunBottlesNeeded = Math.ceil(area / products.racun.coveragePerBottle * 3);

    results.push({
        name: products.racun.name,
        quantity: `${racunBottlesNeeded} botol x 250ml`,
        netWeight: `${racunBottlesNeeded * 250}ml`,
        details: 'Cover 3 bulan',
        unitPrice: 70,
        price: racunBottlesNeeded * 70
    });
    total += racunBottlesNeeded * 70;

    // 3. Essential Plus calculation
    const essentialBottlesNeeded = Math.ceil(area / products.essentialPlus.coveragePerBottle * 3);

    results.push({
        name: products.essentialPlus.name,
        quantity: `${essentialBottlesNeeded} botol x 250ml`,
        netWeight: `${essentialBottlesNeeded * 250}ml`,
        details: 'Cover 3 bulan',
        unitPrice: 45,
        price: essentialBottlesNeeded * 45
    });
    total += essentialBottlesNeeded * 45;

    // 4. Bio Nutriens calculation
    const bioPacksNeeded = Math.ceil(area / products.bioNutriens.coveragePerPack * 3);

    results.push({
        name: products.bioNutriens.name,
        quantity: `${bioPacksNeeded} pack x 80g`,
        netWeight: `${bioPacksNeeded * 80}g`,
        details: 'Cover 3 bulan',
        unitPrice: 36,
        price: bioPacksNeeded * 36
    });
    total += bioPacksNeeded * 36;

    // 5. Dethatcher calculation
    const dethatcherPacksNeeded = Math.ceil(area / products.dethatcher.coveragePerPack * 3);

    results.push({
        name: products.dethatcher.name,
        quantity: `${dethatcherPacksNeeded} pack x 5g`,
        netWeight: `${dethatcherPacksNeeded * 5}g`,
        details: 'Cover 3 bulan',
        unitPrice: 25,
        price: dethatcherPacksNeeded * 25
    });
    total += dethatcherPacksNeeded * 25;

    return { products: results, total: total };
}

function displayResults(area, results, isRestored = false) {
    // Store results for later use in order form
    currentCalculation = { area, results };

    // Save to localStorage for persistence (only if not restoring)
    if (!isRestored) {
        localStorage.setItem('thelawn_calculation_3bulan', JSON.stringify({ area, results }));
    }

    const displayAreaEl = document.getElementById('displayArea');
    if (displayAreaEl) {
        displayAreaEl.textContent = formatNumber(area.toFixed(0));
    }

    const productList = document.getElementById('productList');
    if (!productList) return;

    productList.innerHTML = '';

    results.products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item-3bulan';

        // For Baja Premium (weight-based), show different format
        let priceBreakdown = '';
        if (product.name === 'Baja Premium') {
            priceBreakdown = `RM${formatNumber(product.unitPrice.toFixed(2))} per kg x ${product.quantity} = RM${formatNumber(product.price.toFixed(2))}`;
        } else {
            priceBreakdown = `RM${formatNumber(product.unitPrice.toFixed(2))} per item x ${product.quantity.split(' ')[0]} = RM${formatNumber(product.price.toFixed(2))}`;
        }

        productItem.innerHTML = `
            <div class="product-info-3bulan">
                <div class="product-name-3bulan">${product.name}</div>
                <div class="product-details-3bulan">
                    <strong>${product.quantity}</strong> (${product.netWeight})<br>
                    ${priceBreakdown}<br>
                    <span style="color: var(--gray-600); font-size: 0.8125rem;">${product.details}</span>
                </div>
            </div>
            <div class="product-price-3bulan">RM ${formatNumber(product.price.toFixed(2))}</div>
        `;
        productList.appendChild(productItem);
    });

    const totalPriceEl = document.getElementById('totalPrice');
    if (totalPriceEl) {
        totalPriceEl.textContent = 'RM ' + formatNumber(results.total.toFixed(2));
    }
}

// =========================================
// ORDER FORM FUNCTIONS
// =========================================

function showOrderForm() {
    if (!currentCalculation) {
        alert('Sila kira pakej anda terlebih dahulu');
        return;
    }

    // Load address data from localStorage (from leaflet map)
    const savedCity = localStorage.getItem('thelawn_city');
    const savedPostcode = localStorage.getItem('thelawn_postalCode');
    const savedState = localStorage.getItem('thelawn_state');

    // Pre-populate city, postcode, state if available
    const cityField = document.getElementById('customerCity');
    const postcodeField = document.getElementById('customerPostcode');
    const stateField = document.getElementById('customerState');

    if (savedCity && cityField) {
        cityField.value = savedCity;
        cityField.classList.add('auto-filled-3bulan');
    }
    if (savedPostcode && postcodeField) {
        postcodeField.value = savedPostcode;
        postcodeField.classList.add('auto-filled-3bulan');
    }
    if (savedState && stateField) {
        stateField.value = savedState;
        stateField.classList.add('auto-filled-3bulan');
    }

    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeOrderForm() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Clear form
    const form = document.getElementById('orderForm');
    if (form) form.reset();

    // Remove auto-filled styling
    const cityField = document.getElementById('customerCity');
    const postcodeField = document.getElementById('customerPostcode');
    const stateField = document.getElementById('customerState');

    if (cityField) cityField.classList.remove('auto-filled-3bulan');
    if (postcodeField) postcodeField.classList.remove('auto-filled-3bulan');
    if (stateField) stateField.classList.remove('auto-filled-3bulan');
}

function submitOrder(event) {
    event.preventDefault();

    const name = document.getElementById('customerName')?.value.trim() || '';
    const phone = document.getElementById('customerPhone')?.value.trim() || '';
    const unitNumber = document.getElementById('unitNumber')?.value.trim() || '';
    const streetAddress = document.getElementById('streetAddress')?.value.trim() || '';
    const city = document.getElementById('customerCity')?.value.trim() || '';
    const postcode = document.getElementById('customerPostcode')?.value.trim() || '';
    const state = document.getElementById('customerState')?.value.trim() || '';

    if (!name || !phone || !unitNumber || !streetAddress) {
        alert('Sila isi maklumat yang diperlukan (Nama, Telefon, No. Unit, Nama Jalan)');
        return;
    }

    if (!currentCalculation) {
        alert('Sila kira pakej anda terlebih dahulu');
        return;
    }

    const { area, results } = currentCalculation;

    // Construct full address
    let fullAddress = unitNumber;
    if (streetAddress) fullAddress += `, ${streetAddress}`;
    if (postcode) fullAddress += `, ${postcode}`;
    if (city) fullAddress += ` ${city}`;
    if (state) fullAddress += `, ${state}`;

    // Generate WhatsApp message with customer info
    let whatsappMessage = `*SET PENJAGAAN LAMAN 3 BULAN*\n\n`;
    whatsappMessage += `*Maklumat Penghantaran:*\n`;
    whatsappMessage += `Nama: ${name}\n`;
    whatsappMessage += `No Telefon: ${phone}\n`;
    whatsappMessage += `Alamat: ${fullAddress}\n\n`;
    whatsappMessage += `Saiz Laman: *${formatNumber(area.toFixed(0))} sqft*\n\n`;
    whatsappMessage += `*Senarai Produk:*\n`;

    results.products.forEach((product, index) => {
        whatsappMessage += `${index + 1}. ${product.name}\n`;
        whatsappMessage += `   • ${product.quantity} (${product.netWeight})\n`;
        whatsappMessage += `   • RM${formatNumber(product.price.toFixed(2))}\n\n`;
    });

    whatsappMessage += `*Jumlah Keseluruhan: RM${formatNumber(results.total.toFixed(2))}*\n`;
    whatsappMessage += `(Penghantaran percuma Semenanjung Malaysia)`;

    // Track Meta Pixel Lead event with order value
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            value: results.total,
            currency: 'MYR',
            content_name: 'Set Penjagaan Laman 3 Bulan',
            content_category: 'Lawn Care Package',
            contents: results.products.map(p => ({
                id: p.name,
                quantity: 1,
                item_price: p.price
            })),
            num_items: results.products.length
        });
    }

    // Open WhatsApp with message
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/601121888274?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');

    // Close modal
    closeOrderForm();
}

// Make functions available globally
window.clearCalculation = clearCalculation;
window.calculate = calculate;
window.showOrderForm = showOrderForm;
window.closeOrderForm = closeOrderForm;
window.submitOrder = submitOrder;

// =========================================
// PAGE INITIALIZATION
// =========================================

// Calculator version - increment this when calculation logic changes
const CALCULATOR_VERSION = 4;

// Load saved area on page load
window.addEventListener('DOMContentLoaded', () => {
    // Clear old calculations if version changed
    const savedVersion = localStorage.getItem('thelawn_calculator_version');
    if (!savedVersion || parseInt(savedVersion) !== CALCULATOR_VERSION) {
        localStorage.removeItem('thelawn_calculation_3bulan');
        localStorage.setItem('thelawn_calculator_version', CALCULATOR_VERSION);
    }

    // PRIORITY 1: Check if area data was passed from map measurement (OVERRIDE EVERYTHING)
    const mapArea = localStorage.getItem('thelawn_mapArea');

    if (mapArea) {
        // Parse and validate the map area
        const areaValue = parseFloat(mapArea);

        if (!isNaN(areaValue) && areaValue >= 100) {
            // Use map area if available (highest priority - will override saved calculation)
            const formattedArea = formatNumber(areaValue.toFixed(2));
            const lawnAreaInput = document.getElementById('lawnArea');
            if (lawnAreaInput) lawnAreaInput.value = formattedArea;

            // Hide hint since we have a value
            const mapHint = document.getElementById('mapHint');
            if (mapHint) mapHint.classList.add('hidden');

            // Clear old saved calculation since we have new map data
            localStorage.removeItem('thelawn_calculation_3bulan');

            // Auto-calculate after a brief delay to ensure DOM is ready
            setTimeout(() => {
                calculate();
            }, 100);
        }

        // Clear the mapArea after using it so it doesn't auto-run next time
        localStorage.removeItem('thelawn_mapArea');
        return; // Exit early since we used map area
    }

    // PRIORITY 2: Check if there's a saved calculation to restore
    const savedCalculation = localStorage.getItem('thelawn_calculation_3bulan');

    if (savedCalculation) {
        try {
            const data = JSON.parse(savedCalculation);
            if (data && data.area && data.results) {
                // Restore the input field
                const formattedArea = formatNumber(data.area.toFixed(2));
                const lawnAreaInput = document.getElementById('lawnArea');
                if (lawnAreaInput) lawnAreaInput.value = formattedArea;

                const mapHint = document.getElementById('mapHint');
                if (mapHint) mapHint.classList.add('hidden');

                // Restore the calculation results
                currentCalculation = data;
                displayResults(data.area, data.results, true);

                // Show results section
                const resultsSection = document.getElementById('results');
                if (resultsSection) {
                    resultsSection.classList.add('show');

                    // Scroll to results smoothly
                    setTimeout(() => {
                        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }

                return; // Exit early if we restored saved calculation
            }
        } catch (e) {
            console.error('Error restoring saved calculation:', e);
        }
    }

    // PRIORITY 3: Use previously saved manual input (lowest priority)
    const saved = localStorage.getItem('thelawn_lawnArea_3month');
    if (saved) {
        const savedValue = parseFloat(saved);
        if (!isNaN(savedValue)) {
            const formattedSaved = formatNumber(savedValue.toFixed(2));
            const lawnAreaInput = document.getElementById('lawnArea');
            if (lawnAreaInput) lawnAreaInput.value = formattedSaved;

            // Hide hint since we have a value
            const mapHint = document.getElementById('mapHint');
            if (mapHint) mapHint.classList.add('hidden');
        }
    }
});

// Save area to localStorage and format with commas
const lawnAreaInput = document.getElementById('lawnArea');
if (lawnAreaInput) {
    lawnAreaInput.addEventListener('input', (e) => {
        // Get the raw value without commas
        let value = e.target.value.replace(/,/g, '');

        // Only allow numbers and decimal point
        value = value.replace(/[^\d.]/g, '');

        // Prevent multiple decimal points
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }

        // Format with thousand separator
        if (value) {
            const [integer, decimal] = value.split('.');
            const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            value = decimal !== undefined ? formattedInteger + '.' + decimal : formattedInteger;
        }

        // Update the input value with formatted number
        e.target.value = value;

        // Save raw value (without commas) to localStorage
        const rawValue = value.replace(/,/g, '');
        localStorage.setItem('thelawn_lawnArea_3month', rawValue);

        // Clear saved calculation since user is changing the input
        localStorage.removeItem('thelawn_calculation_3bulan');

        // Hide the hint when user starts typing
        const mapHint = document.getElementById('mapHint');
        if (mapHint) {
            if (value) {
                mapHint.classList.add('hidden');
            } else {
                mapHint.classList.remove('hidden');
            }
        }
    });

    // Allow Enter key to calculate
    lawnAreaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculate();
        }
    });
}

// =========================================
// FAQ TOGGLE FUNCTION
// =========================================

function toggleFaq(button) {
    const faqItem = button.closest('.faq-item');
    if (!faqItem) return;

    const isOpen = faqItem.classList.contains('open');

    // Close all other FAQ items
    document.querySelectorAll('.faq-item.open').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('open');
        }
    });

    // Toggle current item
    if (isOpen) {
        faqItem.classList.remove('open');
    } else {
        faqItem.classList.add('open');
    }
}

// Make FAQ toggle available globally
window.toggleFaq = toggleFaq;

// =========================================
// COMPARISON SLIDER FUNCTIONALITY
// =========================================

function initComparisonSliders() {
    const sliders = document.querySelectorAll('.comparison-slider');

    sliders.forEach(slider => {
        const handle = slider.querySelector('.comparison-slider-handle');
        const afterImg = slider.querySelector('.after-img');
        if (!handle || !afterImg) return;

        let isDragging = false;

        function updateSliderPosition(clientX) {
            const rect = slider.getBoundingClientRect();
            let percentage = ((clientX - rect.left) / rect.width) * 100;
            percentage = Math.max(0, Math.min(100, percentage));

            handle.style.left = percentage + '%';
            afterImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        }

        function startDrag(e) {
            isDragging = true;
            slider.style.cursor = 'ew-resize';
            e.preventDefault();
        }

        function drag(e) {
            if (!isDragging) return;
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            updateSliderPosition(clientX);
        }

        function endDrag() {
            isDragging = false;
            slider.style.cursor = 'ew-resize';
        }

        // Mouse events
        handle.addEventListener('mousedown', startDrag);
        slider.addEventListener('mousedown', (e) => {
            if (e.target === handle) return;
            isDragging = true;
            const clientX = e.clientX;
            updateSliderPosition(clientX);
        });
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);

        // Touch events
        handle.addEventListener('touchstart', startDrag);
        slider.addEventListener('touchstart', (e) => {
            if (e.target === handle) return;
            isDragging = true;
            const clientX = e.touches[0].clientX;
            updateSliderPosition(clientX);
        });
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', endDrag);
    });
}

// Initialize comparison sliders when DOM is ready
document.addEventListener('DOMContentLoaded', initComparisonSliders);

// =========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// =========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
