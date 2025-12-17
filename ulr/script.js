// HealthBridge Telemedicine Platform - Main JavaScript

// DOM Elements
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const mobileLoginBtn = document.getElementById('mobile-login-btn');
const mobileSignupBtn = document.getElementById('mobile-signup-btn');
const bookConsultationBtn = document.getElementById('book-consultation-btn');
const ctaSignupBtn = document.getElementById('cta-signup-btn');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const appointmentModal = document.getElementById('appointment-modal');
const closeLoginBtn = document.getElementById('close-login');
const closeSignupBtn = document.getElementById('close-signup');
const closeAppointmentBtn = document.getElementById('close-appointment');
const switchToSignup = document.getElementById('switch-to-signup');
const switchToLogin = document.getElementById('switch-to-login');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const appointmentForm = document.getElementById('appointment-form');
const bookDoctorBtns = document.querySelectorAll('.book-doctor-btn');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const notificationToast = document.getElementById('notification-toast');

// Current user state
let currentUser = null;
let currentTestimonialIndex = 0;

// Helper function to get user initials
function getInitials(name) {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

// Initialize the application
function init() {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('healthbridge_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthButtons();
    }
    
    // Set minimum date for appointment booking to today
    const today = new Date().toISOString().split('T')[0];
    const appointmentDateInput = document.getElementById('appointment-date');
    if (appointmentDateInput) {
        appointmentDateInput.min = today;
        
        // Set default to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        appointmentDateInput.value = tomorrow.toISOString().split('T')[0];
    }
    
    // Initialize testimonial slider
    if (testimonialCards.length > 0) {
        showTestimonial(currentTestimonialIndex);
        startTestimonialSlider();
    }
    
    // Add scroll event listener for header shadow
    window.addEventListener('scroll', handleHeaderScroll);
    
    // Initialize smooth scrolling for anchor links
    initSmoothScrolling();
    
    console.log('HealthBridge initialized');
}

// Update authentication buttons based on login state
function updateAuthButtons() {
    if (currentUser) {
        // User is logged in
        if (loginBtn) loginBtn.textContent = currentUser.name.split(' ')[0];
        if (mobileLoginBtn) mobileLoginBtn.textContent = currentUser.name.split(' ')[0];
        
        if (signupBtn) {
            signupBtn.innerHTML = '<i class="fas fa-user-circle"></i> Account';
            signupBtn.classList.remove('btn-primary');
            signupBtn.classList.add('btn-outline');
        }
        
        if (mobileSignupBtn) {
            mobileSignupBtn.innerHTML = '<i class="fas fa-user-circle"></i> Account';
            mobileSignupBtn.classList.remove('btn-primary');
            mobileSignupBtn.classList.add('btn-outline');
        }
    } else {
        // User is not logged in
        if (loginBtn) loginBtn.textContent = 'Login';
        if (mobileLoginBtn) mobileLoginBtn.textContent = 'Login';
        
        if (signupBtn) {
            signupBtn.innerHTML = 'Sign Up';
            signupBtn.classList.remove('btn-outline');
            signupBtn.classList.add('btn-primary');
        }
        
        if (mobileSignupBtn) {
            mobileSignupBtn.innerHTML = 'Sign Up';
            mobileSignupBtn.classList.remove('btn-outline');
            mobileSignupBtn.classList.add('btn-primary');
        }
    }
}

// Handle header scroll effect
function handleHeaderScroll() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    }
}

// Initialize smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                mobileMenu.classList.remove('active');
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
});

mobileMenuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Modal Functions
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function closeAllModals() {
    closeModal(loginModal);
    closeModal(signupModal);
    closeModal(appointmentModal);
}

// Login button event listeners
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        if (currentUser) {
            // User is logged in, redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            openModal(loginModal);
        }
    });
}

if (mobileLoginBtn) {
    mobileLoginBtn.addEventListener('click', () => {
        if (currentUser) {
            // User is logged in, redirect to dashboard
            window.location.href = 'dashboard.html';
            mobileMenu.classList.remove('active');
        } else {
            openModal(loginModal);
            mobileMenu.classList.remove('active');
        }
    });
}

// Signup button event listeners
if (signupBtn) {
    signupBtn.addEventListener('click', () => {
        if (currentUser) {
            // User is logged in, show account menu (could be expanded)
            window.location.href = 'dashboard.html';
        } else {
            openModal(signupModal);
        }
    });
}

if (mobileSignupBtn) {
    mobileSignupBtn.addEventListener('click', () => {
        if (currentUser) {
            // User is logged in, show account menu (could be expanded)
            window.location.href = 'dashboard.html';
            mobileMenu.classList.remove('active');
        } else {
            openModal(signupModal);
            mobileMenu.classList.remove('active');
        }
    });
}

// Book consultation button
if (bookConsultationBtn) {
    bookConsultationBtn.addEventListener('click', () => {
        if (currentUser) {
            openModal(appointmentModal);
        } else {
            openModal(signupModal);
        }
    });
}

// CTA Signup button
if (ctaSignupBtn) {
    ctaSignupBtn.addEventListener('click', () => {
        openModal(signupModal);
    });
}

// Book doctor buttons
bookDoctorBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const doctorName = this.getAttribute('data-doctor');
        
        if (currentUser) {
            // Set the selected doctor in the appointment form
            const doctorSelect = document.getElementById('appointment-doctor');
            if (doctorSelect) {
                const optionIndex = Array.from(doctorSelect.options).findIndex(
                    option => option.text.includes(doctorName)
                );
                if (optionIndex !== -1) {
                    doctorSelect.selectedIndex = optionIndex;
                }
            }
            openModal(appointmentModal);
        } else {
            openModal(signupModal);
        }
    });
});

// Close modal buttons
closeLoginBtn.addEventListener('click', () => closeModal(loginModal));
closeSignupBtn.addEventListener('click', () => closeModal(signupModal));
closeAppointmentBtn.addEventListener('click', () => closeModal(appointmentModal));

// Switch between login and signup modals
switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(loginModal);
    openModal(signupModal);
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(signupModal);
    openModal(loginModal);
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeAllModals();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

// Form Submissions
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Simple validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Get user data from localStorage
    let users = JSON.parse(localStorage.getItem('healthbridge_users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showNotification('Invalid email or password', 'error');
        return;
    }
    
    // Create complete currentUser object
    currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        dob: user.dob || '',
        gender: user.gender || '',
        bloodType: user.bloodType || '',
        allergies: user.allergies || '',
        medicalConditions: user.medicalConditions || '',
        avatar: getInitials(user.name)
    };
    
    // Save to localStorage if "Remember me" is checked
    if (rememberMe) {
        localStorage.setItem('healthbridge_user', JSON.stringify(currentUser));
    }
    
    // Update UI
    updateAuthButtons();
    
    // Close modal
    closeModal(loginModal);
    
    // Show success message
    showNotification('Login successful! Welcome back, ' + currentUser.name);
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const role = document.getElementById('signup-role').value;
    const agreeTerms = document.getElementById('agree-terms').checked;
    
    // Validation
    if (!name || !email || !password || !role) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showNotification('Please agree to the terms and conditions', 'error');
        return;
    }
    
    // Check if user already exists
    let users = JSON.parse(localStorage.getItem('healthbridge_users')) || [];
    if (users.find(u => u.email === email)) {
        showNotification('An account with this email already exists', 'error');
        return;
    }
    
    // Create complete user object
    const user = {
        id: Date.now(),
        name: name,
        email: email,
        password: password, // In a real app, this should be hashed
        role: role,
        phone: '',
        dob: '',
        gender: '',
        bloodType: '',
        allergies: '',
        medicalConditions: '',
        createdAt: new Date().toISOString()
    };
    
    // Add to users array
    users.push(user);
    localStorage.setItem('healthbridge_users', JSON.stringify(users));
    
    // Set as current user
    currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        dob: user.dob,
        gender: user.gender,
        bloodType: user.bloodType,
        allergies: user.allergies,
        medicalConditions: user.medicalConditions,
        avatar: getInitials(user.name)
    };
    
    // Save to localStorage
    localStorage.setItem('healthbridge_user', JSON.stringify(currentUser));
    
    // Update UI
    updateAuthButtons();
    
    // Close modal
    closeModal(signupModal);
    
    // Show success message
    showNotification('Account created successfully! Welcome to HealthBridge');
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
});

appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('Please login to book an appointment', 'error');
        closeModal(appointmentModal);
        openModal(loginModal);
        return;
    }
    
    const doctor = document.getElementById('appointment-doctor').value;
    const date = document.getElementById('appointment-date').value;
    const time = document.getElementById('appointment-time').value;
    const reason = document.getElementById('appointment-reason').value;
    
    if (!doctor || !date || !time) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Format the date for display
    const appointmentDate = new Date(date);
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Get selected doctor name
    const doctorSelect = document.getElementById('appointment-doctor');
    const doctorName = doctorSelect.options[doctorSelect.selectedIndex].text;
    
    // Create appointment object
    const appointment = {
        id: Date.now(),
        userId: currentUser.id,
        doctor: doctorName,
        date: formattedDate,
        time: time,
        reason: reason,
        status: 'upcoming',
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    let appointments = JSON.parse(localStorage.getItem('healthbridge_appointments')) || [];
    appointments.push(appointment);
    localStorage.setItem('healthbridge_appointments', JSON.stringify(appointments));
    
    // Close modal
    closeModal(appointmentModal);
    
    // Reset form
    appointmentForm.reset();
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('appointment-date').value = tomorrow.toISOString().split('T')[0];
    
    // Show success message
    showNotification(`Appointment booked with ${doctorName.split(' (')[0]} on ${formattedDate} at ${time}`);
});

// Testimonial Slider Functions
function showTestimonial(index) {
    // Hide all testimonials
    testimonialCards.forEach(card => {
        card.classList.remove('active');
    });
    
    // Remove active class from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show the selected testimonial
    testimonialCards[index].classList.add('active');
    dots[index].classList.add('active');
    
    currentTestimonialIndex = index;
}

function nextTestimonial() {
    let nextIndex = currentTestimonialIndex + 1;
    if (nextIndex >= testimonialCards.length) {
        nextIndex = 0;
    }
    showTestimonial(nextIndex);
}

function prevTestimonial() {
    let prevIndex = currentTestimonialIndex - 1;
    if (prevIndex < 0) {
        prevIndex = testimonialCards.length - 1;
    }
    showTestimonial(prevIndex);
}

function startTestimonialSlider() {
    // Auto-rotate testimonials every 5 seconds
    setInterval(() => {
        nextTestimonial();
    }, 5000);
}

// Dot click event listeners
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showTestimonial(index);
    });
});

// Prev/Next button event listeners
if (prevBtn) {
    prevBtn.addEventListener('click', prevTestimonial);
}

if (nextBtn) {
    nextBtn.addEventListener('click', nextTestimonial);
}

// Notification System
function showNotification(message, type = 'success') {
    const toast = notificationToast;
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set message
    toastMessage.textContent = message;
    
    // Set icon and color based on type
    if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle toast-icon';
        toast.style.backgroundColor = 'var(--danger-color)';
    } else if (type === 'warning') {
        toastIcon.className = 'fas fa-exclamation-triangle toast-icon';
        toast.style.backgroundColor = 'var(--warning-color)';
    } else {
        toastIcon.className = 'fas fa-check-circle toast-icon';
        toast.style.backgroundColor = 'var(--secondary-color)';
    }
    
    // Show toast
    toast.classList.add('active');
    
    // Hide toast after 5 seconds
    setTimeout(() => {
        toast.classList.remove('active');
    }, 5000);
}

// Update user profile function
function updateUserProfile(updatedData) {
    if (!currentUser) return false;
    
    // Update current user object
    currentUser = { ...currentUser, ...updatedData };
    
    // Update in localStorage
    localStorage.setItem('healthbridge_user', JSON.stringify(currentUser));
    
    // Update in users array
    let users = JSON.parse(localStorage.getItem('healthbridge_users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = {
            ...users[userIndex],
            name: currentUser.name,
            email: currentUser.email,
            phone: currentUser.phone,
            dob: currentUser.dob,
            gender: currentUser.gender,
            bloodType: currentUser.bloodType,
            allergies: currentUser.allergies,
            medicalConditions: currentUser.medicalConditions
        };
        localStorage.setItem('healthbridge_users', JSON.stringify(users));
    }
    
    // Update UI
    updateAuthButtons();
    
    return true;
}

// Logout function (could be used in dashboard)
function logout() {
    currentUser = null;
    localStorage.removeItem('healthbridge_user');
    updateAuthButtons();
    showNotification('Logged out successfully');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);