// HopeRise website script
console.log("HopeRise website script loaded");

// Newsletter subscribe handler – used in all page footers
function subscribeNewsletter(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const email = input.value.trim();
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }
    const subject = encodeURIComponent('Newsletter Subscription – HopeRise');
    const body = encodeURIComponent(
        'Dear HopeRise Team,\n\nPlease add me to your newsletter mailing list.\n\nMy email address: ' + email + '\n\nThank you!'
    );
    window.location.href = 'mailto:hoperiseuganda@gmail.com?subject=' + subject + '&body=' + body;
}

// Volunteer form submit handler – sends info via mailto
function submitVolunteerForm(e) {
    e.preventDefault();
    const firstName = document.getElementById('vol-first-name') ? document.getElementById('vol-first-name').value.trim() : '';
    const lastName = document.getElementById('vol-last-name') ? document.getElementById('vol-last-name').value.trim() : '';
    const email = document.getElementById('vol-email') ? document.getElementById('vol-email').value.trim() : '';
    const interest = document.getElementById('vol-interest') ? document.getElementById('vol-interest').value : '';
    const message = document.getElementById('vol-message') ? document.getElementById('vol-message').value.trim() : '';

    const subject = encodeURIComponent('Volunteer Application – HopeRise');
    const body = encodeURIComponent(
        'Dear HopeRise Team,\n\nI would like to volunteer with your organisation.\n\n' +
        '--- VOLUNTEER APPLICATION ---\n' +
        'Name: ' + firstName + ' ' + lastName + '\n' +
        'Email: ' + email + '\n' +
        'Area of Interest: ' + interest + '\n' +
        (message ? '\nMessage:\n' + message + '\n' : '') +
        '\n--- END OF APPLICATION ---\n\nThank you,\n' + firstName + ' ' + lastName
    );
    window.location.href = 'mailto:hoperiseuganda@gmail.com?subject=' + subject + '&body=' + body;
}

// Contact form submit handler
function submitContactForm(e) {
    e.preventDefault();
    const name = document.getElementById('contact-name') ? document.getElementById('contact-name').value.trim() : '';
    const email = document.getElementById('contact-email') ? document.getElementById('contact-email').value.trim() : '';
    const phone = document.getElementById('contact-phone') ? document.getElementById('contact-phone').value.trim() : '';
    const subject_val = document.getElementById('contact-subject') ? document.getElementById('contact-subject').value.trim() : '';
    const message = document.getElementById('contact-message') ? document.getElementById('contact-message').value.trim() : '';

    const subject = encodeURIComponent('Website Contact – ' + (subject_val || 'General Enquiry'));
    const body = encodeURIComponent(
        'Dear HopeRise Team,\n\n' +
        '--- CONTACT FORM SUBMISSION ---\n' +
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        (phone ? 'Phone: ' + phone + '\n' : '') +
        (subject_val ? 'Subject: ' + subject_val + '\n' : '') +
        (message ? '\nMessage:\n' + message + '\n' : '') +
        '\n--- END OF SUBMISSION ---\n\nThank you,\n' + name
    );
    window.location.href = 'mailto:hoperiseuganda@gmail.com?subject=' + subject + '&body=' + body;
}
