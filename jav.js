// ==========================================================
// Haro Wonchi Hotel — Room Reservation (frontend only)
// ==========================================================

document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Footer year ---------- */
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Mobile nav toggle ---------- */
    var navToggle = document.getElementById('navToggle');
    var navbarNav = document.getElementById('navbarNav');
    if (navToggle && navbarNav) {
        navToggle.addEventListener('click', function () {
            navbarNav.classList.toggle('open');
        });
    }

    /* ---------- Reservation ID generator ---------- */
    var reservationIdEl = document.getElementById('reservationId');
    function randomReservationId(length) {
        var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        var str = '';
        for (var i = 0; i < length; i++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return str;
    }
    function newReservationId() {
        if (reservationIdEl) reservationIdEl.textContent = randomReservationId(8);
    }
    newReservationId();

    /* ---------- Room image preview ---------- */
    var roomSelect = document.getElementById('select1');
    var roomImage = document.getElementById('roomImage');
    var roomImages = {
        '0': 'assets/images/MEDIUM.JPG', // Family Suite
        '1': 'assets/images/SINGLE.JPG', // Single Room
        '2': 'assets/images/TWIN.JPG',   // Twin Room
        '3': 'assets/images/WHITE.JPG'   // Default / none chosen
    };

    function updateRoomImage() {
        if (!roomSelect || !roomImage) return;
        var value = roomSelect.value;
        roomImage.style.opacity = 0;
        setTimeout(function () {
            roomImage.src = roomImages[value] || roomImages['3'];
            roomImage.style.opacity = 1;
        }, 150);
    }

    if (roomSelect) {
        roomSelect.addEventListener('change', updateRoomImage);
    }

    /* ---------- Validation ---------- */
    var form = document.getElementById('reservationForm');
    var formMessage = document.getElementById('formMessage');

    var requiredFields = ['fname', 'lname', 'city', 'state', 'country', 'telephone', 'email', 'arr_date', 'dep_date'];

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(function (el) {
            el.textContent = '';
        });
        document.querySelectorAll('.form-control').forEach(function (el) {
            el.classList.remove('invalid');
        });
    }

    function showError(fieldName, message) {
        var errorEl = document.querySelector('[data-error-for="' + fieldName + '"]');
        var inputEl = document.getElementById(fieldName);
        if (errorEl) errorEl.textContent = message;
        if (inputEl) inputEl.classList.add('invalid');
    }

    function showFormMessage(text, type) {
        if (!formMessage) return;
        formMessage.textContent = text;
        formMessage.className = 'form-message ' + type;
        formMessage.hidden = false;
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function validateForm() {
        clearErrors();
        var valid = true;

        requiredFields.forEach(function (field) {
            var el = document.getElementById(field);
            if (el && !el.value.trim()) {
                showError(field, 'This field is required.');
                valid = false;
            }
        });

        var email = document.getElementById('email');
        if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            showError('email', 'Please enter a valid email address.');
            valid = false;
        }

        var arrDate = document.getElementById('arr_date');
        var depDate = document.getElementById('dep_date');
        if (arrDate && depDate && arrDate.value && depDate.value) {
            if (new Date(depDate.value) <= new Date(arrDate.value)) {
                showError('dep_date', 'Departure date must be after arrival date.');
                valid = false;
            }
        }

        var roomPref = document.getElementById('select1');
        if (roomPref && roomPref.value === '3') {
            valid = false;
            showFormMessage('Please choose a room type before booking.', 'error');
        }

        return valid;
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (validateForm()) {
                showFormMessage(
                    'Reservation request submitted! Your reservation ID is ' +
                    reservationIdEl.textContent + '. We will contact you shortly to confirm.',
                    'success'
                );
                // NOTE: this is a static frontend demo — hook this up to your
                // backend endpoint of choice to actually persist the booking.
            } else if (formMessage.hidden || formMessage.className.indexOf('error') === -1) {
                showFormMessage('Please fix the highlighted fields and try again.', 'error');
            }
        });
    }

    /* ---------- Check availability (demo behaviour) ---------- */
    var checkBtn = document.getElementById('checkAvailabilityBtn');
    var roomResults = document.getElementById('roomResults');
    var discountBadge = document.getElementById('discountBadge');

    var roomNames = {
        '0': 'Family Suite',
        '1': 'Single Room',
        '2': 'Twin Room'
    };

    if (checkBtn) {
        checkBtn.addEventListener('click', function () {
            var value = roomSelect ? roomSelect.value : '3';
            if (value === '3') {
                roomResults.innerHTML = '<i class="fas fa-info-circle"></i> Please select a room type first.';
                discountBadge.hidden = true;
                return;
            }
            roomResults.innerHTML =
                '<div class="room-result-item"><span><i class="fas fa-bed"></i> ' +
                roomNames[value] + '</span><strong>Available</strong></div>';
            discountBadge.hidden = false;
        });
    }

    /* ---------- Reset form ---------- */
    var resetBtn = document.getElementById('resetFormBtn');
    if (resetBtn && form) {
        resetBtn.addEventListener('click', function () {
            setTimeout(function () {
                clearErrors();
                formMessage.hidden = true;
                discountBadge.hidden = true;
                roomResults.innerHTML = '<i class="fas fa-info-circle"></i> Select a room type and click "Check Availability" to see available rooms.';
                updateRoomImage();
                newReservationId();
            }, 0);
        });
    }
});