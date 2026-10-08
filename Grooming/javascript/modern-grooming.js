/**
 * Emanuel Pet Grooming - Modern Interactive Engine
 * Handles Reviews, Star Ratings, Service Filters, Portal Previews & Booking
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initBubbles();
  initServiceFilters();
  initReviewsSystem();
  initFAQ();
  initModals();
  initBookingForm();
  initPortalSimulator();
});

/* ==========================================================================
   1. NAVBAR & NAVIGATION
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      toggleBtn.textContent = navMenu.classList.contains('open') ? '✕' : '☰';
    });

    // Close menu when clicking any nav link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.textContent = '☰';
      });
    });
  }
}

// Determine asset base path relative to current HTML location
const isSubfolder = window.location.pathname.includes('/html/') || window.location.pathname.includes('/Grooming/html/');
const assetBase = isSubfolder ? '../assets/' : './Grooming/assets/';

/* ==========================================================================
   2. HERO FLOATING BUBBLES
   ========================================================================== */
function initBubbles() {
  const container = document.getElementById('heroBubbles');
  if (!container) return;

  const bubbleSrc = `${assetBase}png/bubble.png`;
  const bubbleCount = 15;

  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement('img');
    bubble.src = bubbleSrc;
    bubble.alt = 'bubble';
    bubble.className = 'hero-bubble';

    const size = Math.floor(Math.random() * 38) + 16; // 16px to 54px
    const left = Math.floor(Math.random() * 96); // 0% to 96%
    const duration = Math.floor(Math.random() * 6) + 7; // 7s to 13s
    const delay = Math.random() * 7; // 0s to 7s
    const opacity = (Math.random() * 0.35 + 0.15).toFixed(2);

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${left}%`;
    bubble.style.animationDuration = `${duration}s`;
    bubble.style.animationDelay = `${delay}s`;
    bubble.style.opacity = opacity;

    container.appendChild(bubble);
  }
}

/* ==========================================================================
   3. SERVICES CATEGORY FILTERING
   ========================================================================== */
function initServiceFilters() {
  const tabs = document.querySelectorAll('.services-filter-tabs .tab-btn');
  const cards = document.querySelectorAll('.services-grid .service-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter || (filter === 'dog' && category === 'dog') || (filter === 'cat' && category === 'cat')) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. COMMUNITY VOICE & STAR RATINGS SYSTEM (PERSISTENT & INTERACTIVE)
   ========================================================================== */
const DEFAULT_REVIEWS = [
  {
    id: 1,
    author: "Elena Rostova",
    petName: "Milo",
    petType: "dog",
    petBreed: "Goldendoodle",
    service: "Full Spa Haircut & Scissor Finish",
    rating: 5,
    date: "2 days ago",
    avatar: "../assets/photos/women.jpg",
    content: "Emanuel is pure magic with my Goldendoodle! Milo used to shake whenever we took him to big retail salons, but at Emanuel's calm home setting he literally wags his tail walking in. His teddy bear cut is flawless and smells amazing for weeks."
  },
  {
    id: 2,
    author: "Marcus Vance",
    petName: "Luna & Bella",
    petType: "cat",
    petBreed: "Persian & Ragdoll",
    service: "Gentle Cat De-Shedding & Bath",
    rating: 5,
    date: "1 week ago",
    avatar: "../assets/photos/man.jpg",
    content: "Finding someone who genuinely knows how to handle cats with patience is rare. Emanuel treated Luna and Bella with such gentleness. Zero stress, soft mat-free coats, and perfectly trimmed claws. Truly the best cat grooming in town!"
  },
  {
    id: 3,
    author: "Sophia Ramirez & Family",
    petName: "Rocky",
    petType: "dog",
    petBreed: "French Bulldog",
    service: "Hydro-Bath & De-shedding Treatment",
    rating: 5,
    date: "2 weeks ago",
    avatar: "../assets/photos/family.JPEG",
    content: "Rocky sheds so much especially during summer. The deep deshedding treatment removed mounds of dead undercoat without irritating his sensitive skin. His coat looks silky shiny and Emanuel is so warm and welcoming."
  },
  {
    id: 4,
    author: "Amanda K.",
    petName: "Teddy",
    petType: "dog",
    petBreed: "Miniature Poodle",
    service: "Precision Breed Styling",
    rating: 5,
    date: "3 weeks ago",
    avatar: "../assets/photos/girl.jpg",
    content: "The level of scissoring skill here is top tier. Teddy’s poodle cut looks like he just walked out of a high fashion magazine. Plus, the price is fair and you get 1-on-1 personal care. 10/10 recommended!"
  },
  {
    id: 5,
    author: "Carlos Gutierrez",
    petName: "Simba",
    petType: "cat",
    petBreed: "Maine Coon",
    service: "Lion Cut & Sanitary Groom",
    rating: 5,
    date: "1 month ago",
    avatar: "../assets/photos/women2.jpg",
    content: "Simba was heavily matted and grumpy. Emanuel took his time, never rushed, and gave Simba a gorgeous lion trim with clean boots and mane. Simba was purring right after! Thank you so much Emanuel!"
  },
  {
    id: 6,
    author: "Jessica T.",
    petName: "Coco",
    petType: "dog",
    petBreed: "Shih Tzu",
    service: "Full Grooming Package",
    rating: 5,
    date: "1 month ago",
    avatar: "../assets/photos/girl2.jpg",
    content: "We've been coming to Emanuel for over 2 years now. Honest, loving, punctual, and always treats Coco like his own family. The clean sanitized environment gives me total peace of mind."
  }
];

function initReviewsSystem() {
  const reviewsContainer = document.getElementById('reviewsContainer');
  const overallScoreEl = document.getElementById('overallScoreNumber');
  const reviewCountEl = document.getElementById('reviewCountText');
  const filterBtns = document.querySelectorAll('.review-filter-btn');

  // Load reviews from localStorage or initialize with defaults
  let reviews = [];
  try {
    const stored = localStorage.getItem('emanuel_client_reviews');
    if (stored) {
      reviews = JSON.parse(stored);
    } else {
      reviews = [...DEFAULT_REVIEWS];
      localStorage.setItem('emanuel_client_reviews', JSON.stringify(reviews));
    }
  } catch (e) {
    reviews = [...DEFAULT_REVIEWS];
  }

  // Render Reviews and update summary
  renderReviews(reviews, 'all');
  updateReviewsSummary(reviews);

  // Review Filters
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.getAttribute('data-review-filter');
      renderReviews(reviews, type);
    });
  });

  // Setup Star Picker in "Write a Review" Modal
  setupStarPicker();

  // Review Form Submit
  const reviewForm = document.getElementById('writeReviewForm');
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const author = document.getElementById('reviewAuthor').value.trim();
      const petName = document.getElementById('reviewPetName').value.trim();
      const petType = document.getElementById('reviewPetType').value;
      const petBreed = document.getElementById('reviewPetBreed').value.trim() || 'Companion';
      const service = document.getElementById('reviewService').value;
      const rating = parseInt(document.getElementById('reviewRatingValue').value, 10) || 5;
      const content = document.getElementById('reviewComment').value.trim();

      if (!author || !petName || !content) {
        alert('Please complete all required fields.');
        return;
      }

      // Pick an avatar based on type
      const avatarOptions = [
        '../assets/photos/women3.jpg',
        '../assets/photos/man.jpg',
        '../assets/photos/beautiful.jpg',
        '../assets/photos/women.jpg'
      ];
      const randomAvatar = avatarOptions[Math.floor(Math.random() * avatarOptions.length)];

      const newReview = {
        id: Date.now(),
        author,
        petName,
        petType,
        petBreed,
        service,
        rating,
        date: "Just now",
        avatar: randomAvatar,
        content
      };

      // Add to front of list
      reviews.unshift(newReview);
      try {
        localStorage.setItem('emanuel_client_reviews', JSON.stringify(reviews));
      } catch (err) {
        console.error(err);
      }

      // Refresh
      renderReviews(reviews, 'all');
      updateReviewsSummary(reviews);

      // Close modal & reset
      closeModal('reviewModal');
      reviewForm.reset();
      resetStarPicker();

      // Feedback toast
      alert(`🎉 Thank you, ${author}! Your ${rating}-star review for ${petName} has been added to Emanuel Pet Grooming!`);
    });
  }
}

function getAvatarUrl(rawPath) {
  if (!rawPath) return `${assetBase}png/user.png`;
  if (rawPath.startsWith('http')) return rawPath;
  const fileName = rawPath.split('/').pop();
  return `${assetBase}photos/${fileName}`;
}

function renderReviews(reviewsList, filterType) {
  const container = document.getElementById('reviewsContainer');
  if (!container) return;

  const filtered = reviewsList.filter(item => {
    if (filterType === 'all') return true;
    return item.petType === filterType;
  });

  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">No reviews yet in this category. Be the first to add your review!</div>`;
    return;
  }

  filtered.forEach(rev => {
    const starsString = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
    const badgeClass = rev.petType === 'cat' ? 'cat-badge' : '';
    const petIcon = rev.petType === 'cat' ? '🐱' : '🐶';
    const avatarSrc = getAvatarUrl(rev.avatar);
    const fallbackAvatar = `${assetBase}png/user.png`;

    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <div class="review-card-top">
        <div class="review-stars">${starsString}</div>
        <span class="review-badge ${badgeClass}">${petIcon} ${rev.petType.toUpperCase()}</span>
      </div>
      <p class="review-body">${escapeHTML(rev.content)}</p>
      <div class="review-author-wrap">
        <img src="${avatarSrc}" alt="${escapeHTML(rev.author)}" class="author-avatar" onerror="this.src='${fallbackAvatar}'">
        <div class="author-meta">
          <h4>${escapeHTML(rev.author)}</h4>
          <p><span class="author-pet-tag">${escapeHTML(rev.petName)}</span> (${escapeHTML(rev.petBreed)}) • <small>${escapeHTML(rev.service)}</small></p>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function updateReviewsSummary(reviewsList) {
  const scoreEl = document.getElementById('overallScoreNumber');
  const countEl = document.getElementById('reviewCountText');
  const fill5 = document.getElementById('barFill5');
  const fill4 = document.getElementById('barFill4');
  const fill3 = document.getElementById('barFill3');

  if (!reviewsList.length) return;

  const total = reviewsList.length;
  const sum = reviewsList.reduce((acc, r) => acc + r.rating, 0);
  const avg = (sum / total).toFixed(1);

  if (scoreEl) scoreEl.textContent = avg;
  if (countEl) countEl.textContent = `Based on ${total} verified pet parent reviews`;

  const count5 = reviewsList.filter(r => r.rating === 5).length;
  const count4 = reviewsList.filter(r => r.rating === 4).length;
  const count3 = reviewsList.filter(r => r.rating <= 3).length;

  if (fill5) fill5.style.width = `${Math.round((count5 / total) * 100)}%`;
  if (fill4) fill4.style.width = `${Math.round((count4 / total) * 100)}%`;
  if (fill3) fill3.style.width = `${Math.round((count3 / total) * 100)}%`;
}

function setupStarPicker() {
  const container = document.getElementById('starSelector');
  const hiddenInput = document.getElementById('reviewRatingValue');
  const feedback = document.getElementById('starFeedbackText');
  if (!container || !hiddenInput) return;

  const labels = [
    '1 Star - Needs Improvement',
    '2 Stars - Fair Service',
    '3 Stars - Good & Satisfactory',
    '4 Stars - Very Good Experience',
    '5 Stars - Outstanding & Loved It! ⭐'
  ];

  const stars = container.querySelectorAll('.star-item');

  stars.forEach((star, index) => {
    star.addEventListener('mouseenter', () => {
      highlightStars(index + 1);
      if (feedback) feedback.textContent = labels[index];
    });

    star.addEventListener('click', () => {
      hiddenInput.value = index + 1;
      container.setAttribute('data-selected-rating', index + 1);
      highlightStars(index + 1, true);
      if (feedback) feedback.textContent = labels[index];
    });
  });

  container.addEventListener('mouseleave', () => {
    const currentVal = parseInt(container.getAttribute('data-selected-rating') || hiddenInput.value || 5, 10);
    highlightStars(currentVal, true);
    if (feedback) feedback.textContent = labels[currentVal - 1];
  });
}

function highlightStars(count, isPermanent = false) {
  const container = document.getElementById('starSelector');
  if (!container) return;
  const stars = container.querySelectorAll('.star-item');

  stars.forEach((star, idx) => {
    if (idx < count) {
      star.classList.add('selected');
      star.textContent = '★';
    } else {
      star.classList.remove('selected');
      star.textContent = '☆';
    }
  });
}

function resetStarPicker() {
  const container = document.getElementById('starSelector');
  const hiddenInput = document.getElementById('reviewRatingValue');
  const feedback = document.getElementById('starFeedbackText');
  if (hiddenInput) hiddenInput.value = '5';
  if (container) container.setAttribute('data-selected-rating', '5');
  highlightStars(5, true);
  if (feedback) feedback.textContent = '5 Stars - Outstanding & Loved It! ⭐';
}

/* ==========================================================================
   5. CLIENT PORTAL & LIVE PET PROGRESS SIMULATOR
   ========================================================================== */
function initPortalSimulator() {
  const steps = document.querySelectorAll('.mockup-body .timeline-step');
  const statusBadge = document.getElementById('trackerStatusBadge');
  const statusDescription = document.getElementById('trackerStatusDesc');

  const trackerStates = [
    {
      badge: 'Step 1: Check-in & Coat Exam',
      desc: 'Max has arrived safely! Emanuel is conducting a gentle health & skin check, feeling for knots and soothing him with gentle belly rubs.',
      activeStep: 0
    },
    {
      badge: 'Step 2: Hydro-Bath & Blueberry Facial',
      desc: 'Max is enjoying his warm hydro-massage bath with hypoallergenic oatmeal shampoo and tearless facial spa bath! 🛁',
      activeStep: 1
    },
    {
      badge: 'Step 3: Fluff Blow-Dry & Scissor Trim',
      desc: 'Drying with low-noise warm air and precision hand scissoring for that perfect rounded teddy bear look ✂️',
      activeStep: 2
    },
    {
      badge: 'Step 4: Finished & Ready for Hugs!',
      desc: 'All done! Nails clipped, ears cleaned, spritzed with organic fresh scent, and resting comfortably with fresh water waiting for pickup! 🐾',
      activeStep: 3
    }
  ];

  let stateIndex = 2; // Default to step 3

  // Allow clicking timeline steps in mockup
  steps.forEach((step, idx) => {
    step.style.cursor = 'pointer';
    step.addEventListener('click', () => {
      setTrackerState(idx);
    });
  });

  function setTrackerState(idx) {
    stateIndex = idx;
    steps.forEach((s, sIdx) => {
      s.classList.remove('completed', 'current');
      if (sIdx < idx) {
        s.classList.add('completed');
      } else if (sIdx === idx) {
        s.classList.add('current');
      }
    });

    if (statusBadge) statusBadge.textContent = trackerStates[idx].badge;
    if (statusDescription) statusDescription.textContent = trackerStates[idx].desc;
  }

  // Modal Portal Tabs (Login / Register / Preview)
  const portalTabs = document.querySelectorAll('.portal-tab-btn');
  const portalTabContents = document.querySelectorAll('.portal-tab-content');

  portalTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      portalTabs.forEach(t => t.classList.remove('active'));
      portalTabContents.forEach(c => c.style.display = 'none');

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-portal-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.style.display = 'block';
    });
  });

  // Client Portal Login / Signup Mock submission
  const portalLoginForm = document.getElementById('portalLoginForm');
  if (portalLoginForm) {
    portalLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Welcome to Emanuel Pet Grooming! Online client portal is currently in preview mode. You are logged into demo view.');
      closeModal('portalModal');
    });
  }

  const portalRegisterForm = document.getElementById('portalRegisterForm');
  if (portalRegisterForm) {
    portalRegisterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const petName = document.getElementById('regPetName').value || 'your pet';
      alert(`🎉 Wonderful! Account created for ${petName}. You will receive a text when the online booking system launches officially!`);
      closeModal('portalModal');
    });
  }
}

/* ==========================================================================
   6. BOOKING APPOINTMENT REQUEST FORM
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById('appointmentBookingForm');
  if (!form) return;

  // Set min date to today
  const dateInput = document.getElementById('bookDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const ownerName = document.getElementById('bookOwnerName').value.trim();
    const phone = document.getElementById('bookPhone').value.trim();
    const petName = document.getElementById('bookPetName').value.trim();
    const petType = document.getElementById('bookPetType').value;
    const service = document.getElementById('bookService').value;
    const date = document.getElementById('bookDate').value;
    const time = document.getElementById('bookTime').value;

    alert(
      `🐾 Appointment Request Received!\n\n` +
      `Thank you, ${ownerName}!\n` +
      `We have received your request for ${petName} (${petType.toUpperCase()}) for "${service}" on ${date || 'next available'} around ${time || 'morning'}.\n\n` +
      `Emanuel will call or text you at ${phone} to confirm the exact time slot and discuss any special care requirements.`
    );

    form.reset();
  });
}

/* ==========================================================================
   7. FAQ ACCORDION
   ========================================================================== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   8. MODAL WINDOWS CONTROLLER
   ========================================================================== */
function initModals() {
  // Close buttons
  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) closeModal(modal.id);
    });
  });

  // Background click to close
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.show').forEach(m => {
        closeModal(m.id);
      });
    }
  });
}

window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
};

/* ==========================================================================
   HELPER UTILITY
   ========================================================================== */
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
