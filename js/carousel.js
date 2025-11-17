// Organization data structure
const organizationData = {
  'america-on-tech': {
    name: 'America On Tech',
    image: 'public/organizations/america-on-tech.png',
    website: 'https://www.americaontech.org/',
    offers: [
      'Tech education and training programs for underserved High Schoolers',
      'Career development and mentorship opportunities',
      'Access to tech industry networks and resources',
      'Project-based learning experiences, web development, data science, and UI/UX design track'
    ],
    impact: [
      'Provided me with valuable tech skills and industry connections',
      'Helped me understand the importance of representation in tech',
      'Connected me with mentors who guided my career path'
    ]
  },
  'girls-make-games': {
    name: 'Girls Make Games',
    image: 'public/organizations/girls-make-games.png',
    website: 'https://www.girlsmakegames.com',
    offers: [
      'Game development workshops and camps',
      'Community of young women in gaming',
      'Game design and programming education',
      'Opportunities to showcase game projects'
    ],
    impact: [
      'Inspired my passion for game development',
      'Provided me with an academic scholarship and Game Developer Conference ticket',
      'Connected me with other women in gaming',
      'Helped me develop technical and creative skills',
      'Fostered my love for creating inclusive gaming experiences'
    ]
  },
  'cal-alumni-african-american': {
    name: 'Cal Alumni Association African American Initiative',
    image: 'public/organizations/cal-alumni-african-american.png',
    website: 'https://alumni.https://alumni.berkeley.edu/get-involved/scholarships/aai/.edu',
    offers: [
      'Networking opportunities with UC Berkeley alumni',
      'Scholarship and financial aid resources',
      'Mentorship programs',
      'Community support for African American students'
    ],
    impact: [
      'Connected me with successful alumni in my field',
      'Provided financial support for my education',
      'Offered mentorship and guidance throughout my journey',
      'Created a sense of community and belonging at Cal'
    ]
  },
  'hispanic-scholar-fund': {
    name: 'Hispanic Scholar Fund',
    image: 'public/organizations/hispanic-scholar-fund.png',
    website: 'https://www.hsf.net',
    offers: [
      'Scholarship opportunities for Hispanic students',
      'Academic and career support services',
      'Networking events and professional development',
      'Access to educational resources and programs'
    ],
    impact: [
      'Supported my academic journey financially',
      'Connected me with other Hispanic scholars',
      'Provided resources for professional development',
      'Helped me navigate higher education as a first-gen student'
    ]
  },
  'uc-berkeley-sss-stem': {
    name: 'UC Berkeley SSS Stem Scholar & Grant Recipient',
    image: 'public/organizations/uc-berkeley-sss-stem.png',
    website: 'https://eop.berkeley.edu/services-programs/eop-stem',
    offers: [
      'Student Support Services for STEM students',
      'Academic advising and tutoring',
      'Grant funding for research and projects',
      'Workshops and professional development opportunities'
    ],
    impact: [
      'Provided crucial academic support throughout my studies',
      'Funded my research and project initiatives',
      'Connected me with STEM resources and opportunities',
      'Helped me succeed academically at UC Berkeley'
    ]
  },
  'ai4all': {
    name: 'AI 4 ALL',
    image: 'public/organizations/ai4all.png',
    website: 'https://ai-4-all.org',
    offers: [
      'AI education and training programs',
      'Research opportunities in artificial intelligence',
      'Mentorship from AI professionals',
      'Community of underrepresented students in AI'
    ],
    impact: [
      'Introduced me to the field of artificial intelligence',
      'Provided hands-on experience with AI projects',
      'Connected me with mentors in the AI industry',
      'Inspired my interest in machine learning and AI'
    ]
  },
  'cal-marginalized-genders-gaming': {
    name: 'Cal Marginalized Genders in Gaming',
    image: 'public/organizations/cal=marginalized-genders-gaming.png',
    website: 'https://cmgg.studentorg.berkeley.edu/',
    offers: [
      'Community for marginalized genders in gaming',
      'Game development workshops and events',
      'Networking with industry professionals',
      'Safe space for discussing gaming and tech'
    ],
    impact: [
      'Created a supportive community at UC Berkeley',
      'Connected me with other students passionate about gaming',
      'Provided opportunities to develop games and projects',
      'Fostered discussions about representation in gaming'
    ]
  },
  'color-stack': {
    name: 'Color Stack',
    image: 'public/organizations/color-stack.png',
    website: 'https://www.colorstack.org',
    offers: [
      'Community for Black and Latinx computer science students',
      'Career development and internship opportunities',
      'Scholarship and financial aid resources',
      'Mentorship and peer support networks'
    ],
    impact: [
      'Connected me with other Black and Latinx CS students',
      'Provided career guidance and internship opportunities',
      'Created a supportive network of peers and mentors',
      'Helped me navigate the tech industry as a person of color'
    ]
  },
  'gamescrafters': {
    name: 'GamesCrafters',
    image: 'public/organizations/GamesCrafters-Logo.png',
    website: 'https://nyc.cs.berkeley.edu/uni/',
    offers: [
      'Research opportunities in computational game theory',
      'Strong solving of combinatorial games using C programs',
      'Web implementation of games using JavaScript',
      'Access to game variants and research tools'
    ],
    impact: [
      'Learning computational game theory through hands-on research',
      'Converted the game Orbito to an online interface with variants',
      'Implemented strong solving algorithms using C programming',
      'Contributed to making game research accessible online',
      'Search for Orbito on the GamesCrafters website below!'
    ]
  }
};

// Carousel functionality
class Carousel {
  constructor() {
    this.wrapper = document.getElementById('carouselWrapper');
    this.items = document.querySelectorAll('.carousel-item');
    this.modal = document.getElementById('carouselModal');
    this.modalBody = document.getElementById('modalBody');
    this.modalClose = document.getElementById('modalClose');
    this.currentIndex = 0;
    this.rotationInterval = null;
    this.isHovered = false;
    this.isPaused = false;
    this.rotationSpeed = 3000; // 3 seconds per rotation
    
    this.init();
  }

  init() {
    if (!this.wrapper || !this.items.length) return;
    
    // Set up event listeners
    this.items.forEach((item, index) => {
      item.addEventListener('click', () => this.openModal(item.dataset.org));
      item.addEventListener('mouseenter', () => {
        this.isHovered = true;
        this.pauseRotation();
        item.classList.add('active');
      });
      item.addEventListener('mouseleave', () => {
        this.isHovered = false;
        item.classList.remove('active');
        if (!this.isPaused) {
          this.startRotation();
        }
      });
    });

    // Modal close handlers
    if (this.modalClose) {
      this.modalClose.addEventListener('click', () => this.closeModal());
    }
    
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.closeModal();
        }
      });
    }

    // Start auto-rotation
    this.startRotation();
  }

  startRotation() {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
    }
    
    this.rotationInterval = setInterval(() => {
      if (!this.isHovered && !this.isPaused) {
        this.rotate();
      }
    }, this.rotationSpeed);
  }

  pauseRotation() {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
      this.rotationInterval = null;
    }
  }

  rotate() {
    // Remove active class from all items
    this.items.forEach(item => item.classList.remove('active'));
    
    // Move to next item
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    
    // Add active class to current item
    this.items[this.currentIndex].classList.add('active');
    
    // Smooth scroll to center the active item
    this.scrollToActive();
    
    // If we've reached the end, loop back to start smoothly
    if (this.currentIndex === 0) {
      setTimeout(() => {
        if (this.wrapper) {
          this.wrapper.scrollLeft = 0;
        }
      }, 600);
    }
  }

  scrollToActive() {
    const activeItem = this.items[this.currentIndex];
    if (activeItem && this.wrapper) {
      const wrapperRect = this.wrapper.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const itemCenter = itemRect.left + itemRect.width / 2;
      const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;
      const scrollOffset = itemCenter - wrapperCenter;
      
      this.wrapper.scrollBy({
        left: scrollOffset,
        behavior: 'smooth'
      });
    }
  }

  openModal(orgKey) {
    this.isPaused = true;
    this.pauseRotation();
    
    const orgData = organizationData[orgKey];
    if (!orgData) return;

    // Populate modal content
    this.modalBody.innerHTML = `
      <img src="${orgData.image}" alt="${orgData.name}" />
      <h2>${orgData.name}</h2>
      
      <h3>What This Program Offers</h3>
      <ul>
        ${orgData.offers.map(offer => `<li>${offer}</li>`).join('')}
      </ul>
      
      <h3>What It Did For Me</h3>
      <ul>
        ${orgData.impact.map(impact => `<li>${impact}</li>`).join('')}
      </ul>
      
      <a href="${orgData.website}" target="_blank" rel="noopener noreferrer">
        Visit ${orgData.name} Website →
      </a>
    `;

    // Show modal
    this.modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.modal.classList.remove('show');
    document.body.style.overflow = '';
    this.isPaused = false;
    
    // Resume rotation after a short delay
    setTimeout(() => {
      if (!this.isHovered) {
        this.startRotation();
      }
    }, 500);
  }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Carousel();
});

