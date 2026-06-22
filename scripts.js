/* ══════════════════════════════════════════
   Val's Online Jewelry — scripts.js
   Popups (welcome + promo) + Registration form validation
══════════════════════════════════════════ */

/* ─────────────────────────────────────────
   1. POPUP SYSTEM
───────────────────────────────────────── */

function openPopup(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePopup(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

/* Close popup when clicking the dark backdrop */
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('popup-overlay')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

/* Close on Escape key */
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.popup-overlay.active').forEach(function (el) {
            el.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
});

/* Auto-show welcome popup 800ms after page load */
window.addEventListener('load', function () {
    setTimeout(function () { openPopup('popup-welcome'); }, 800);
});


/* ─────────────────────────────────────────
   2. REGISTRATION FORM VALIDATION
───────────────────────────────────────── */

function showError(inputEl, msgEl, message) {
    inputEl.classList.remove('valid');
    inputEl.classList.add('invalid');
    msgEl.textContent = message;
    msgEl.classList.add('visible');
    const sib = inputEl.parentElement.querySelector('.success-msg');
    if (sib) sib.classList.remove('visible');
}

function showSuccess(inputEl, msgEl) {
    inputEl.classList.remove('invalid');
    inputEl.classList.add('valid');
    msgEl.classList.remove('visible');
    const sib = inputEl.parentElement.querySelector('.success-msg');
    if (sib) sib.classList.add('visible');
}

function clearState(inputEl, errEl) {
    inputEl.classList.remove('valid', 'invalid');
    if (errEl) errEl.classList.remove('visible');
    const sib = inputEl.parentElement.querySelector('.success-msg');
    if (sib) sib.classList.remove('visible');
}

/* ── Validators ── */
function validateName(value) {
    if (!value.trim()) return 'Full name is required.';
    if (value.trim().length < 2) return 'Name must be at least 2 characters.';
    if (!/^[a-zA-Z\s\-']+$/.test(value.trim()))
        return 'Name can only contain letters, spaces, hyphens or apostrophes.';
    return null;
}

/**
 * Email validation:
 *  - Must match the pattern:  localpart@domain.tld
 *  - localpart  : letters, digits, dots, hyphens, underscores (no spaces)
 *  - @          : required exactly once
 *  - domain     : letters and digits (e.g. gmail, yahoo)
 *  - .tld       : dot followed by 2+ letters (e.g. .com, .co.ke)
 *
 *  Valid examples:  klerk@gmail.com   klerk34@gmail.com   val.w@yahoo.co.ke
 *  Invalid:         klerk@           klerk.gmail.com      @gmail.com
 */
function validateEmail(value) {
    if (!value.trim()) return 'Email address is required.';
    const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._\-]*@[a-zA-Z0-9]+(\.[a-zA-Z]{2,})+$/;
    if (!emailRegex.test(value.trim()))
        return 'Enter a valid email (e.g. klerk@gmail.com or klerk34@gmail.com).';
    return null;
}

function validatePhone(value) {
    if (!value.trim()) return 'Phone number is required.';
    const cleaned = value.replace(/[\s\-()+]/g, '');
    /* Kenyan numbers: 07xxxxxxxx / 01xxxxxxxx / +2547xxxxxxxx / 2547xxxxxxxx */
    if (!/^(\+?254|0)[17]\d{8}$/.test(cleaned))
        return 'Enter a valid number (e.g. 0788 945 632 or +254788945632).';
    return null;
}

function validateGender(value) {
    if (!value) return 'Please select your gender.';
    return null;
}

/* ── Live validation ── */
function attachLiveValidation() {
    const fields = [
        { id: 'reg-name',   errId: 'err-name',   fn: validateName   },
        { id: 'reg-email',  errId: 'err-email',  fn: validateEmail  },
        { id: 'reg-phone',  errId: 'err-phone',  fn: validatePhone  },
        { id: 'reg-gender', errId: 'err-gender', fn: validateGender },
    ];

    fields.forEach(function (f) {
        const el  = document.getElementById(f.id);
        const err = document.getElementById(f.errId);
        if (!el || !err) return;

        const evt = el.tagName === 'SELECT' ? 'change' : 'blur';
        el.addEventListener(evt, function () {
            const error = f.fn(el.value);
            error ? showError(el, err, error) : showSuccess(el, err);
        });

        if (el.tagName !== 'SELECT') {
            el.addEventListener('input', function () {
                if (el.classList.contains('invalid')) clearState(el, err);
            });
        }
    });
}

/* ── Submit handler ── */
function handleFormSubmit(e) {
    e.preventDefault();

    const fields = [
        { id: 'reg-name',   errId: 'err-name',   fn: validateName   },
        { id: 'reg-email',  errId: 'err-email',  fn: validateEmail  },
        { id: 'reg-phone',  errId: 'err-phone',  fn: validatePhone  },
        { id: 'reg-gender', errId: 'err-gender', fn: validateGender },
    ];

    let allValid = true;

    fields.forEach(function (f) {
        const el  = document.getElementById(f.id);
        const err = document.getElementById(f.errId);
        if (!el || !err) return;
        const error = f.fn(el.value);
        if (error) { showError(el, err, error); allValid = false; }
        else        { showSuccess(el, err); }
    });

    if (!allValid) return;

    /* Show success banner */
    const firstName = document.getElementById('reg-name').value.trim().split(' ')[0];
    const banner    = document.getElementById('form-success-banner');
    if (banner) {
        banner.innerHTML =
            '💍 Thank you, <strong>' + firstName + '</strong>! ' +
            'You\'re now registered with Val\'s Online Jewelry.<br>' +
            'We\'ll be in touch with exclusive deals just for you! ✨';
        banner.classList.add('visible');
    }

    /* Reset */
    document.getElementById('reg-form').reset();
    fields.forEach(function (f) {
        clearState(
            document.getElementById(f.id),
            document.getElementById(f.errId)
        );
    });
}

/* ── DOM ready init ── */
document.addEventListener('DOMContentLoaded', function () {
    attachLiveValidation();
    const form = document.getElementById('reg-form');
    if (form) form.addEventListener('submit', handleFormSubmit);
});
