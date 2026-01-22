// Project Page Layout Component

class ProjectLayout extends HTMLElement {
    connectedCallback() {
        const projectName = this.getAttribute('project-name') || 'Проект';
        const projectLabel = this.getAttribute('project-label') || 'Категория';
        const projectDesc = this.getAttribute('project-desc') || 'Описание проекта';
        
        // Информация о проекте
        const projectType = this.getAttribute('project-type') || 'Тип проекта';
        const projectClient = this.getAttribute('project-client') || 'Заказчик';
        const projectStatus = this.getAttribute('project-status') || 'Статус';
        const projectSite = this.getAttribute('project-site') || 'Сайт';
        const projectYear = this.getAttribute('project-year') || new Date().getFullYear();
        
        // Технологии (передаются как JSON строка)
        const techStack = this.getAttribute('tech-stack') || '[]';
        let techLogos = '';
        try {
            const techs = JSON.parse(techStack);
            techLogos = techs.map(tech => `
                <div class="tech-logo-item">
                    <img src="${tech.icon}" alt="${tech.name}" class="tech-logo">
                </div>
            `).join('');
        } catch (e) {
            console.error('Invalid tech-stack JSON:', e);
        }
        
        // Навигация (передается как JSON строка)
        const navigation = this.getAttribute('navigation') || '[]';
        let navLinks = '';
        try {
            const navItems = JSON.parse(navigation);
            navLinks = navItems.map((item, index) => `
                <a href="#${item.id}" class="project-sidebar__link ${index === 0 ? 'active' : ''}">${item.label}</a>
            `).join('');
        } catch (e) {
            console.error('Invalid navigation JSON:', e);
        }
        
        this.innerHTML = `
            <!-- Project Sidebar -->
            <aside class="project-sidebar">
                <div class="project-sidebar__wrapper">
                    <!-- Навигация -->
                    <div class="project-sidebar__card">
                        <h4 class="project-sidebar__nav-title">Содержание</h4>
                        <nav class="project-sidebar__links">
                            ${navLinks}
                        </nav>
                    </div>
                    
                    <!-- Форма заказа -->
                    <div class="project-sidebar__card project-sidebar__card--cta">
                        <h3 class="project-sidebar__title">Нужно реализовать похожий проект?</h3>
                        <p class="project-sidebar__text">Создам подобное решение под ваши задачи</p>
                        <form class="sidebar-form" id="sidebarForm">
                            <input type="text" name="name" placeholder="Ваше имя" class="sidebar-form__input" required>
                            <input type="tel" name="phone" placeholder="Телефон" class="sidebar-form__input" required>
                            <button type="submit" class="sidebar-form__submit">Обсудить проект</button>
                        </form>
                    </div>
                </div>
            </aside>

            <main class="project-main">
                
                <nav class="breadcrumbs">
                    <a href="../../index.html" class="breadcrumbs__link">Главная</a>
                    <span class="breadcrumbs__separator">/</span>
                    <a href="../" class="breadcrumbs__link">Проекты</a>
                    <span class="breadcrumbs__separator">/</span>
                    <span class="breadcrumbs__current">${projectName}</span>
                </nav>
                
                <section class="project-hero">
                    <a href="../../index.html#work" class="back-link">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        <span>Назад к проектам</span>
                    </a>
                    
                    <div class="project-hero__sidebar">
                        <div class="project-hero__info">
                            <div class="project-info__items">
                                <div class="project-info__item">
                                    <span class="project-info__label">Тип</span>
                                    <span class="project-info__value">${projectType}</span>
                                </div>
                                <div class="project-info__item">
                                    <span class="project-info__label">Заказчик</span>
                                    <span class="project-info__value">${projectClient}</span>
                                </div>
                                <div class="project-info__item">
                                    <span class="project-info__label">Статус</span>
                                    <span class="project-info__value">${projectStatus}</span>
                                </div>
                                <div class="project-info__item">
                                    <span class="project-info__label">Сайт</span>
                                    <span class="project-info__value">${projectSite}</span>
                                </div>
                                <div class="project-info__item">
                                    <span class="project-info__label">Год</span>
                                    <span class="project-info__value">${projectYear}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="project-hero__tech">
                            <div class="tech-logos-grid">
                                ${techLogos}
                            </div>
                        </div>
                    </div>
                    
                    <div class="project-hero__content">
                        <span class="project-hero__label">${projectLabel}</span>
                        
                        <h1 class="project-hero__title">${projectName}</h1>
                        
                        <p class="project-hero__desc">${projectDesc}</p>
                    </div>
                </section>

                <!-- Контент проекта (через slot) -->
                <slot></slot>

                <!-- Back -->
                <section class="project-next" style="margin-top: 80px;">
                    <a href="../../index.html#work" class="project-next__link">
                        <span class="project-next__label">Все проекты</span>
                        <span class="project-next__arrow">→</span>
                    </a>
                </section>
            </main>
        `;
        
        // Инициализация после рендера
        setTimeout(() => this.initializeLayout(), 0);
    }
    
    initializeLayout() {
        // Sidebar form handler
        const sidebarForm = this.querySelector('#sidebarForm');
        if (sidebarForm) {
            sidebarForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(sidebarForm);
                const data = Object.fromEntries(formData);
                console.log('Заявка из sidebar:', data);
                alert('Спасибо! Свяжусь с вами в ближайшее время для обсуждения проекта.');
                sidebarForm.reset();
            });
        }
        
        // Project sidebar navigation
        const sections = document.querySelectorAll('section[id]');
        const sidebarLinks = this.querySelectorAll('.project-sidebar__link');
        
        function setActiveNav() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            sidebarLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        }
        
        window.addEventListener('scroll', setActiveNav);
        setActiveNav();
        
        // Smooth scroll
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Регистрируем кастомный элемент
customElements.define('project-layout', ProjectLayout);
