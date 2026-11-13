'use strict';

// Открытие мобильного меню
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.site-nav');
menuToggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Открыть меню');
}));

// Приятные плавные появления без скачков разметки
if ('IntersectionObserver' in window) {
  document.body.classList.add('js-enabled');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Сортировка карточек достижений
const filterButtons = document.querySelectorAll('.filter');
const workCards = document.querySelectorAll('.work-card');
filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(other => {
    const active = other === button;
    other.classList.toggle('active', active);
    other.setAttribute('aria-pressed', String(active));
  });
  workCards.forEach(card => {
    card.hidden = filter !== 'all' && card.dataset.category !== filter;
  });
}));

// Содержание открывающихся карточек
const works = [
  ["Гран-при интерьерного конкурса", "В 2025 году моя концепция «Тихая гармония» получила Гран-при конкурса интерьерных проектов. Я разработала функциональную планировку квартиры, подобрала отделку, мебель и освещение, подготовила визуализации и представила проект жюри. Главной задачей было создать спокойное пространство, в котором каждый квадратный метр работает на комфорт.", "project-winning-plan.webp", "https://www.pexels.com/photo/gold-trophy-in-close-up-photography-6532362/"],
  ["32 авторских дизайн-проекта", "В портфолио собраны 32 проекта жилых пространств: от компактных студий до загородных домов. В каждом проекте я продумываю планировку, формирую общую концепцию, подбираю материалы и свет. Особенно люблю задачи, где нужно найти нестандартное решение для небольшого помещения.", "https://images.pexels.com/photos/8142052/pexels-photo-8142052.jpeg?auto=compress&cs=tinysrgb&w=1150", "https://www.pexels.com/photo/modern-apartment-interior-design-8142052/"],
  ["14 реализованных интерьеров", "Четырнадцать проектов уже воплощены в жизнь. Это квартиры, спальни, кухни-гостиные и отдельные функциональные зоны. Самый приятный этап работы для меня, когда готовый интерьер начинает жить: мебель встаёт на место, включается свет и появляется та атмосфера, ради которой всё задумывалось.", "https://images.pexels.com/photos/6207817/pexels-photo-6207817.jpeg?auto=compress&cs=tinysrgb&w=1150", "https://www.pexels.com/photo/light-and-modern-interior-of-big-living-room-6207817/"],
  ["Интерьер в профильном журнале", "Моя работа попала в подборку интерьерного издания. В материале рассказали о проекте современной квартиры, его цветовой палитре и решениях для удобного хранения. Публикация стала важной возможностью показать свой подход широкой аудитории.", "magazine-feature.webp", "https://www.pexels.com/photo/hands-holding-magazine-5418515/"],
  ["Победа в конкурсе 3D-визуализаций", "В 2026 году моя визуализация спальни победила в профессиональной номинации. Для этого проекта я особенно тщательно работала с естественным освещением, фактурами и реалистичными оттенками материалов, чтобы изображения передавали атмосферу будущего интерьера.", "bedroom-visualization.webp", "https://www.pexels.com/photo/modern-apartment-interior-with-bed-near-glass-door-to-kitchen-6444969/"],
  ["Приглашённый спикер на дизайн-форуме", "На дизайн-форуме я выступила с презентацией о том, как сделать современный интерьер уютным и практичным. Показала примеры планировочных решений, рассказала о работе с освещением и о деталях, которые помогают связать разные зоны квартиры в единое пространство.", "design-forum-photo.webp", ""]
];
const dialog = document.querySelector('.work-dialog');
const dialogClose = dialog.querySelector('.dialog-close');
let opener = null;
document.querySelectorAll('.work-open').forEach(button => button.addEventListener('click', () => {
  opener = button;
  const [title, text, picture] = works[Number(button.dataset.work)];
  dialog.querySelector('#dialog-title').textContent = title;
  dialog.querySelector('.dialog-description').textContent = text;
  dialog.querySelector('.dialog-image img').src = picture;
  dialog.querySelector('.dialog-image img').alt = title;
  dialog.showModal();
  document.body.classList.add('modal-open');
}));
function closeDialog() {
  dialog.close();
}
dialogClose.addEventListener('click', closeDialog);
dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
dialog.querySelector('.dialog-contact').addEventListener('click', closeDialog);
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); opener?.focus(); });

// Линия прогресса просмотра страницы
let ticking = false;
function updateProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const progress = total > 0 ? window.scrollY / total * 100 : 0;
  document.documentElement.style.setProperty('--progress', progress.toFixed(1) + '%');
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateProgress);
    ticking = true;
  }
}, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

// Выбор трёх деталей только на время текущего посещения; при новом открытии всё сбрасывается.
const PRIORITY_STORAGE_KEY = 'maria-k-apartment-details-v2';
const selectedPriorities = [];
let savedPriorities = [];
const priorityButtons = [...document.querySelectorAll('.priority-option')];
const priorityCount = document.querySelector('#priority-count');
const priorityResult = document.querySelector('#priority-result');
const prioritySave = document.querySelector('#save-priorities');
const priorityStatus = document.querySelector('#priority-save-status');
const savedPreview = document.querySelector('#saved-choice-preview');
const savedText = document.querySelector('#saved-choice-text');
function drawPriorities() {
  priorityButtons.forEach(item => {
    const active = selectedPriorities.includes(item.dataset.priority);
    item.classList.toggle('chosen', active);
    item.setAttribute('aria-pressed', String(active));
    item.querySelector('.priority-check').textContent = active ? '✓' : '+';
  });
  priorityCount.textContent = selectedPriorities.length + ' / 3';
  prioritySave.disabled = selectedPriorities.length !== 3;
}
function drawSavedChoices() {
  if (savedPriorities.length === 3) {
    savedPreview.hidden = false;
    savedText.textContent = savedPriorities.join(' · ');
  } else {
    savedPreview.hidden = true;
    savedText.textContent = '';
  }
}
// Старый выбор больше не загружаем: при входе все девять пунктов пустые.
function resetPrioritiesOnEntry() {
  selectedPriorities.length = 0;
  savedPriorities = [];
  try { localStorage.removeItem(PRIORITY_STORAGE_KEY); } catch (_) {}
  priorityResult.textContent = 'Выберите важные для вас детали интерьера.';
  priorityStatus.textContent = '';
  prioritySave.textContent = 'Сохранить выбор';
  drawPriorities();
  drawSavedChoices();
}
resetPrioritiesOnEntry();
// При возврате на страницу кнопкой «Назад» браузер иногда восстанавливает её из кэша.
window.addEventListener('pageshow', event => {
  if (event.persisted) resetPrioritiesOnEntry();
});
priorityButtons.forEach(button => button.addEventListener('click', () => {
  const value = button.dataset.priority;
  const position = selectedPriorities.indexOf(value);
  if (position >= 0) selectedPriorities.splice(position, 1);
  else if (selectedPriorities.length < 3) selectedPriorities.push(value);
  else {
    priorityResult.textContent = 'Можно отметить три детали. Чтобы изменить выбор, снимите одну отметку.';
    return;
  }
  drawPriorities();
  priorityResult.textContent = selectedPriorities.length === 3
    ? 'Готово! Сохраните выбранные детали.'
    : selectedPriorities.length > 0
      ? 'Осталось выбрать: ' + (3 - selectedPriorities.length)
      : 'Выберите важные для вас детали интерьера.';
  if (savedPriorities.join('|') !== selectedPriorities.join('|')) {
    priorityStatus.textContent = 'После изменения отметок сохраните выбор ещё раз.';
  }
}));
prioritySave.addEventListener('click', () => {
  if (selectedPriorities.length !== 3) return;
  savedPriorities = [...selectedPriorities];
  // Сохраняем выбор для заявки только до следующего открытия страницы.
  drawSavedChoices();
  priorityResult.textContent = 'Выбор сохранён.';
  priorityStatus.textContent = 'Выбор добавлен к заявке. Он попадёт в письмо при отправке.';
  prioritySave.textContent = 'Сохранено ✓';
  setTimeout(() => { prioritySave.textContent = 'Сохранить выбор'; }, 1800);
});

// Рабочая заявка для опубликованного сайта (GitHub Pages).
// После первой попытки FormSubmit отправит на адрес владелицы письмо активации.
// Не выдаём заявку за отправленную, пока сервер не подтвердит успех.
const applicationForm = document.querySelector('#application-form');
const submitButton = applicationForm.querySelector('.submit-application');
const formHint = document.querySelector('#form-hint');
applicationForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!applicationForm.reportValidity()) return;
  const name = document.querySelector('#client-name').value.trim();
  const email = document.querySelector('#client-email').value.trim();
  const space = document.querySelector('#client-space').value;
  const message = document.querySelector('#client-message').value.trim();
  if (!name || !email || !message) return;
  submitButton.disabled = true;
  submitButton.textContent = 'Отправляем...';
  formHint.textContent = 'Отправляем заявку, не закрывайте страницу.';
  const formData = {
    name, email,
    'Помещение': space,
    'Сообщение': message,
    'Важные детали интерьера': savedPriorities.length === 3 ? savedPriorities.join(', ') : 'Не выбраны',
    _subject: 'Заявка на дизайн интерьера MARIA.K: ' + space,
    _template: 'table',
    _honey: applicationForm.querySelector('[name="_honey"]').value
  };
  try {
    const response = await fetch(applicationForm.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(formData)
    });
    const result = await response.json();
    if (!response.ok || result.success === false || result.success === 'false') {
      throw new Error('Сервис не подтвердил отправку.');
    }
    formHint.textContent = 'Заявка принята! Маша получит письмо после подтверждения адреса в FormSubmit.';
    applicationForm.reset();
  } catch(error) {
    formHint.textContent = 'Не получилось отправить заявку. Проверьте интернет или напишите Маше напрямую: mariakohan13@gmail.com';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Отправить';
  }
});
