// ===================================
// OASIS HOTEL - MAIN JAVASCRIPT
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // INITIALIZATION
    // ===================================
    
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 100
        });
    }
    
    // ===================================
    // VARIABLES
    // ===================================
    
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
    const contactForm = document.getElementById('contactForm');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    // Auto-scroll chỉ áp dụng cho hero section
    let isAutoScrollEnabled = true;
    let isScrolling = false;
    
    // ===================================
    // HEADER SCROLL EFFECT
    // ===================================
    
    function handleHeaderScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    }
    
    // ===================================
    // MOBILE MENU
    // ===================================
    
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('show');
        mobileMenuBtn.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = mobileMenuBtn.querySelectorAll('span');
        if (mobileMenuBtn.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'rotate(0) translate(0, 0)';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'rotate(0) translate(0, 0)';
        }
    }
    
    // ===================================
    // SMOOTH SCROLL
    // ===================================
    
    function scrollToSection(sectionId, behavior = 'smooth') {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ 
                behavior: behavior,
                block: 'start'
            });
        }
    }
    
    function isInHeroSection() {
        const heroSection = document.getElementById('home');
        if (!heroSection) return false;
        
        const rect = heroSection.getBoundingClientRect();
        return rect.top <= 0 && rect.bottom > window.innerHeight * 0.5;
    }
    
    function handleHeroAutoScroll(direction) {
        if (isScrolling || !isAutoScrollEnabled) return;
        
        const heroSection = document.getElementById('home');
        const aboutSection = document.getElementById('about');
        
        if (!heroSection || !aboutSection) return;
        
        // Chỉ auto-scroll từ hero xuống about
        if (direction === 'down' && isInHeroSection()) {
            isScrolling = true;
            scrollToSection('about');
            
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }
    }
    
    // ===================================
    // WHEEL EVENT HANDLER (CHỈ CHO HERO)
    // ===================================
    
    let wheelTimeout;
    function handleWheel(e) {
        // Chỉ áp dụng auto-scroll khi đang ở hero section
        if (!isInHeroSection()) return;
        
        clearTimeout(wheelTimeout);
        
        wheelTimeout = setTimeout(() => {
            const direction = e.deltaY > 0 ? 'down' : 'up';
            
            // Chỉ xử lý scroll down từ hero
            if (direction === 'down') {
                e.preventDefault();
                handleHeroAutoScroll(direction);
            }
        }, 50);
    }
    
    // ===================================
    // NAVIGATION ACTIVE STATE
    // ===================================
    
    function updateActiveNavigation() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // ===================================
    // PARALLAX EFFECTS
    // ===================================
    
    function handleParallax() {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        const heroBg = document.querySelector('.hero-bg');
        
        if (heroContent && heroBg) {
            const speed = scrolled * 0.5;
            heroContent.style.transform = `translateY(${speed}px)`;
            heroBg.style.transform = `translateY(${speed * 0.3}px)`;
        }
    }
    
    // ===================================
    // SCROLL INDICATOR ANIMATION
    // ===================================
    
    function handleScrollIndicator() {
        if (scrollIndicator) {
            const scrollY = window.scrollY;
            if (scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
            } else {
                scrollIndicator.style.opacity = '0.8';
                scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
            }
        }
    }
    
    // ===================================
    // CONTACT FORM HANDLING
    // ===================================
    
    function handleContactForm(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !message) {
            showNotification('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Đang gửi...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.', 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    // ===================================
    // NOTIFICATION SYSTEM
    // ===================================
    
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
            font-family: inherit;
        `;
        
        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
        `;
        
        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            margin-left: auto;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    // ===================================
    // ROOM CARD INTERACTIONS
    // ===================================
    
    function initRoomCards() {
        const roomCards = document.querySelectorAll('.room-card');
        
        roomCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.transition = 'all 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // ===================================
    // GALLERY INTERACTIONS
    // ===================================
    
    function initGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                // Simple lightbox effect
                const img = this.querySelector('img');
                const overlay = document.createElement('div');
                overlay.className = 'lightbox-overlay';
                overlay.innerHTML = `
                    <div class="lightbox-content">
                        <img src="${img.src}" alt="${img.alt}">
                        <button class="lightbox-close">&times;</button>
                    </div>
                `;
                
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.9);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `;
                
                overlay.querySelector('.lightbox-content').style.cssText = `
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                `;
                
                overlay.querySelector('.lightbox-content img').style.cssText = `
                    width: 100%;
                    height: auto;
                    border-radius: 8px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                `;
                
                overlay.querySelector('.lightbox-close').style.cssText = `
                    position: absolute;
                    top: -15px;
                    right: -15px;
                    background: white;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    font-size: 20px;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    color: #333;
                `;
                
                document.body.appendChild(overlay);
                
                setTimeout(() => {
                    overlay.style.opacity = '1';
                }, 100);
                
                function closeLightbox() {
                    overlay.style.opacity = '0';
                    setTimeout(() => overlay.remove(), 300);
                }
                
                overlay.addEventListener('click', function(e) {
                    if (e.target === overlay) closeLightbox();
                });
                
                overlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
                
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape') closeLightbox();
                });
            });
        });
    }
    
    // ===================================
    // LOADING ANIMATION
    // ===================================
    
    function hideLoader() {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }
    }
    
    // ===================================
    // EVENT LISTENERS
    // ===================================
    
    // Scroll events
    window.addEventListener('scroll', function() {
        handleHeaderScroll();
        updateActiveNavigation();
        handleParallax();
        handleScrollIndicator();
        
        // Disable auto-scroll after user scrolls past hero section
        if (window.scrollY > window.innerHeight * 0.8) {
            isAutoScrollEnabled = false;
        }
    });
    
    // Wheel event for hero auto-scroll only
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // Mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Disable auto-scroll when user manually navigates
            isAutoScrollEnabled = false;
            
            scrollToSection(targetId);
            
            // Close mobile menu if open
            if (mobileMenu.classList.contains('show')) {
                toggleMobileMenu();
            }
        });
    });
    
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Scroll indicator click
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            isAutoScrollEnabled = false;
            scrollToSection('about');
        });
    }
    
    // ===================================
    // INITIALIZATION CALLS
    // ===================================
    
    // Initialize components
    initRoomCards();
    initGallery();
    hideLoader();
    
    // Handle initial scroll position
    handleHeaderScroll();
    updateActiveNavigation();
    
    // Add smooth transitions to buttons and links
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add entrance animation for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections for entrance animations
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Reset first section (hero) to be visible
    const heroSection = document.querySelector('#home');
    if (heroSection) {
        heroSection.style.opacity = '1';
        heroSection.style.transform = 'translateY(0)';
    }
    
    // Add resize handler for responsive adjustments
    window.addEventListener('resize', function() {
        // Close mobile menu on resize
        if (window.innerWidth > 768 && mobileMenu.classList.contains('show')) {
            toggleMobileMenu();
        }
    });
    
    // Prevent context menu on images (optional, for a more polished feel)
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', e => e.preventDefault());
        img.style.userSelect = 'none';
        img.style.pointerEvents = 'none';
    });
    
    // Add subtle hover effects to feature items
    document.querySelectorAll('.feature').forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        feature.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    console.log('🏨 Oasis Hotel website loaded successfully!');
});

// ===================================
// HIDE HEADER ON SCROLL
// ===================================

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@master/src/smoothscroll.js';
    document.head.appendChild(script);
}

// Add custom cursor for interactive elements (optional enhancement)
document.addEventListener('mousemove', function(e) {
    const interactiveElements = document.elementsFromPoint(e.clientX, e.clientY);
    const isInteractive = interactiveElements.some(el => 
        el.tagName === 'A' || 
        el.tagName === 'BUTTON' || 
        el.classList.contains('room-card') ||
        el.classList.contains('gallery-item')
    );
    
    document.body.style.cursor = isInteractive ? 'pointer' : 'default';
});



let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  const header = document.querySelector('.header');

  if (!header) return;

  if (currentScroll > lastScrollTop && currentScroll > 100) {
    // Kéo xuống
    header.classList.add('hide-on-scroll');
  } else {
    // Kéo lên
    header.classList.remove('hide-on-scroll');
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});



const vrWrapper = document.getElementById("vrWrapper");

if (vrWrapper) {
  vrWrapper.addEventListener("dblclick", () => {
    if (vrWrapper.requestFullscreen) {
      vrWrapper.requestFullscreen();
    } else if (vrWrapper.webkitRequestFullscreen) {
      vrWrapper.webkitRequestFullscreen();
    } else if (vrWrapper.msRequestFullscreen) {
      vrWrapper.msRequestFullscreen();
    }
  });
}


const vrSwiper = new Swiper(".vr-room-swiper", {
  slidesPerView: 1,
  loop: true,
  spaceBetween: 30,

  // Tự động trượt mỗi 3 giây
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },

  // Chuyển động mượt mà
  speed: 800,

  // Điều hướng bằng nút
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  // Chấm tròn dưới (tùy chọn)
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  // Vuốt chạm (mobile)
  simulateTouch: true,
  grabCursor: true,
});

// Lấy section chứa Swiper
const vrRoomSection = document.querySelector(".vr-room-section");

if (vrRoomSection && vrSwiper) {
  vrRoomSection.addEventListener("mouseenter", () => {
    vrSwiper.autoplay.stop();
  });

  vrRoomSection.addEventListener("mouseleave", () => {
    vrSwiper.autoplay.start();
  });
}


document.addEventListener('DOMContentLoaded', function () {
  // Danh sách ảnh gallery
  const galleryImages = [
    { src: 'images/gallery/IMG_6200.jpg ', alt: 'Bank Hotel - Sảnh Khách Sạn', caption: ' Sảnh Khách Sạn ' },
    { src: 'images/gallery/IMG_6206.jpg ', alt: 'Bank Hotel - Sảnh Khách Sạn', caption: ' Sảnh Khách Sạn ' },
    { src: 'images/gallery/IMG_8298_HDR.jpg ', alt: 'Bank Hotel - Nhà Hàng', caption: ' Nhà Hàng ' },
    { src: 'images/gallery/IMG_8323_HDR.jpg ', alt: 'Bank Hotel - Nhà Hàng', caption: ' Nhà Hàng ' },
    { src: 'images/gallery/IMG_8335_HDR.jpg ', alt: 'Bank Hotel - Nhà Hàng', caption: ' Nhà Hàng ' },
    { src: 'images/gallery/img_3473_32558138614_o-scaled.jpg ', alt: 'Bank Hotel - Phòng 2 người', caption: ' Phòng 2 người ' },
    { src: 'images/gallery/img_3480_32586839203_o-scaled.jpg ', alt: 'Bank Hotel - Phòng 2 người', caption: ' Phòng 2 người ' },
    { src: 'images/gallery/img_3490_32586832853_o-scaled.jpg ', alt: 'Bank Hotel - Phòng 2 người', caption: ' Phòng 2 người ' },
    { src: 'images/gallery/img_3499_32586821103_o-scaled.jpg', alt: 'Bank Hotel - Phòng 3 người', caption: ' Phòng 3 người ' },
    { src: 'images/gallery/img_3503_32586816033_o-scaled.jpg ', alt: 'Bank Hotel - Phòng 3 người', caption: ' Phòng 3 người ' },
    { src: 'images/gallery/img_3520_33017977130_o-scaled.jpg ', alt: 'Bank Hotel - Phòng 3 người', caption: ' Phòng 3 người ' },
    { src: 'images/gallery/img_3528_33017973750_o-scaled.jpg ', alt: 'Bank Hotel - Phòng 3 người', caption: ' Phòng 3 người ' },
    { src: 'images/gallery/IMG_5965_HDR.jpg ', alt: 'Bank Hotel ', caption: '  ' },
    { src: 'images/gallery/IMG_5977_HDR.jpg ', alt: 'Bank Hotel ', caption: '  ' },
    { src: 'images/gallery/IMG_5997_HDR.jpg ', alt: 'Bank Hotel ', caption: '  ' },
    { src: 'images/gallery/IMG_6017_HDR.jpg ', alt: 'Bank Hotel ', caption: '  ' },
    { src: 'images/gallery/IMG_6026_HDR.jpg ', alt: 'Bank Hotel ', caption: '  ' },
    { src: 'images/gallery/IMG_6037_HDR.jpg ', alt: 'Bank Hotel ', caption: '  ' },
    { src: 'images/gallery/IMG_6051a_HDR.jpg ', alt: 'Bank Hotel ', caption: '  ' },
    { src: 'images/gallery/IMG_6059_HDR.jpg ', alt: 'Bank Hotel ', caption: '  ' },
    { src: 'images/gallery/IMG_6079_HDR.jpg ', alt: 'Bank Hotel ', caption: '  ' },
    { src: 'images/gallery/IMG_6086_HDR.jpg ', alt: 'Bank Hotel ', caption: '  ' },
    { src: 'images/gallery/IMG_608a6_HDR.jpg ', alt: 'Bank Hotel ', caption: '  ' },
    { src: 'images/gallery/IMG_6106_HDR.jpg ', alt: 'Bank Hotel ', caption: '  ' },
    { src: 'images/gallery/IMG_6121_HDR.jpg ', alt: 'Bank Hotel ', caption: '  ' },
    { src: 'images/gallery/IMG_6126_HDR.jpg ', alt: 'Bank Hotel ', caption: '  ' },
    { src: 'images/gallery/IMG_6133_HDR.jpg ', alt: 'Bank Hotel ', caption: '  ' },
    { src: 'images/gallery/IMG_6153_HDR.jpg ', alt: 'Bank Hotel ', caption: '  ' },
    { src: 'images/gallery/IMG_6160_HDR.jpg ', alt: 'Bank Hotel ', caption: '  ' },
    { src: 'images/gallery/IMG_6166_HDR.jpg ', alt: 'Bank Hotel ', caption: '  ' },
    { src: 'images/gallery/IMG_6172_HDR.jpg ', alt: 'Bank Hotel ', caption: '  ' },

    
  ];

  const galleryWrapper = document.getElementById('galleryWrapper');

  // Tạo slide HTML từ JS
  galleryImages.forEach((img, index) => {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    slide.innerHTML = `
      <div class="gallery-item" data-index="${index}">
        <img src="${img.src}" alt="${img.alt}" loading="lazy" />
        <div class="gallery-overlay">
          <div class="gallery-content">
            <i class="fas fa-search-plus"></i>
            ${img.caption ? `<h4>${img.caption}</h4>` : ''}
          </div>
        </div>
      </div>`;
    galleryWrapper.appendChild(slide);
  });

  // Khởi tạo Swiper
  const gallerySwiper = new Swiper('.gallery-swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.gallery-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.gallery-next',
      prevEl: '.gallery-prev',
    },
    breakpoints: {
      640: { slidesPerView: 2, spaceBetween: 20 },
      768: { slidesPerView: 3, spaceBetween: 30 },
      1024: { slidesPerView: 4, spaceBetween: 30 },
    },
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  let currentIndex = 0;

  function openLightbox(index) {
    const imgData = galleryImages[index];
    lightboxImage.src = imgData.src;
    lightboxImage.alt = imgData.alt;
    lightboxCaption.textContent = imgData.caption || '';
    lightboxCaption.style.display = imgData.caption ? 'block' : 'none';
    lightboxCounter.textContent = `${index + 1} / ${galleryImages.length}`;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => lightbox.style.opacity = '1', 10);
  }

  function closeLightbox() {
    lightbox.style.opacity = '0';
    setTimeout(() => {
      lightbox.style.display = 'none';
      document.body.style.overflow = 'auto';
    }, 300);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    openLightbox(currentIndex);
  }

  // Gán sự kiện click vào ảnh
  document.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (item) {
      currentIndex = parseInt(item.dataset.index);
      openLightbox(currentIndex);
    }
  });

  // Nút và keyboard
  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    }
  });

  // Click nền để đóng
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Vuốt trái/phải trên mobile
  let startX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].screenX;
  });
  lightbox.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? showNext() : showPrev();
    }
  });
});


document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.toggle-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const container = btn.closest('.room-desc');
        const shortText = container.querySelector('.short-text');
        const fullText = container.querySelector('.full-text');

        const isExpanded = !fullText.classList.contains('hidden');

        if (isExpanded) {
          shortText.classList.remove('hidden');
          fullText.classList.add('hidden');
          btn.textContent = ' Xem thêm';
        } else {
          shortText.classList.add('hidden');
          fullText.classList.remove('hidden');
          btn.textContent = ' Rút gọn';
        }
      });
    });
  });

