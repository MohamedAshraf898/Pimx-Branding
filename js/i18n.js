/* Pimx Branding — translations (EN / AR)
   Elements opt in with data-i18n="key" (text) or data-i18n-attr="attr:key,attr:key". */
(function () {
  'use strict';

  const dict = {
    en: {
      'a11y.skip': 'Skip to content',
      'nav.work': 'Work',
      'nav.about': 'About',
      'nav.services': 'Services',
      'nav.contact': 'Contact',
      'nav.menu': 'Menu',
      'nav.close': 'Close',
      'lang.switch': 'عربي',
      'lang.aria': 'Switch to Arabic',
      'cta.start': 'Start a project',

      'hero.label': 'Branding Studio',
      'hero.disciplines': 'Strategy — Identity — Digital',
      'hero.fig': 'Fig. 01 — Built to fit',
      'hero.l1': 'Your brand,',
      'hero.l2': 'precisely',
      'hero.l3': 'made',
      'hero.lede': 'We build identities around one business at a time — its people, its audience, its ambition. Nothing borrowed. Nothing off the shelf.',
      'hero.scroll': 'Scroll',

      'clients.title': 'Brands we’ve worked with',
      'clients.note': 'A curated collection of the businesses we’ve shaped identities for.',

      'about.label': 'About',
      'about.l1': 'Every brand',
      'about.l2': 'has its own',
      'about.l3': 'shape',
      'about.p1': 'Pimx Branding creates identities around the specifics of each client — the business, the audience, the personality and the ambition behind it. We start with what makes you different, then build a system that holds its shape everywhere it goes.',
      'about.p2': 'No templates. No borrowed ideas. Just a brand that feels like it was always yours.',
      'about.studio': 'Studio',
      'about.focus': 'Focus',
      'about.fig': 'Fig. 02 — Every part, in its place',

      'work.title': 'Selected Work',
      'work.p1': 'Project 01', 'work.p2': 'Project 02', 'work.p3': 'Project 03',
      'work.p4': 'Project 04', 'work.p5': 'Project 05', 'work.p6': 'Project 06',
      'work.c1': 'Brand Identity / Digital',
      'work.c2': 'Strategy / Visual Identity',
      'work.c3': 'Art Direction',
      'work.c4': 'Packaging / Identity',
      'work.c5': 'Brand Guidelines',
      'work.c6': 'Digital Experience',

      'svc.title': 'Services',
      'svc.intro': 'Six disciplines. One system — shaped around you.',
      'svc.1.t': 'Brand Strategy',
      'svc.1.d': 'Positioning, naming, voice — the thinking everything else is built on.',
      'svc.2.t': 'Visual Identity',
      'svc.2.d': 'Marks, typography, colour and a visual language drawn for you alone.',
      'svc.3.t': 'Art Direction',
      'svc.3.d': 'Photography, campaigns and imagery that are unmistakably yours.',
      'svc.4.t': 'Digital Experience',
      'svc.4.d': 'Websites and digital products that carry the brand into every interaction.',
      'svc.5.t': 'Packaging',
      'svc.5.d': 'Structures and surfaces designed around the product — and the shelf it lives on.',
      'svc.6.t': 'Brand Guidelines',
      'svc.6.d': 'Clear, living systems that keep every touchpoint consistent as you grow.',

      'foot.l1': 'Let’s make',
      'foot.l2': 'something',
      'foot.l3': 'that fits.',
      'foot.together': 'Let’s work together.',
      'foot.email': 'Email',
      'foot.phone': 'Phone',
      'foot.instagram': 'Instagram',
      'foot.linkedin': 'LinkedIn',
      'foot.nav': 'Navigate',
      'foot.rights': 'All rights reserved.',
      'foot.top': 'Back to top',

      'cursor.view': 'View',
      'meta.title': 'Pimx Branding — Your brand, precisely made.'
    },

    ar: {
      'a11y.skip': 'انتقل إلى المحتوى',
      'nav.work': 'أعمالنا',
      'nav.about': 'من نحن',
      'nav.services': 'خدماتنا',
      'nav.contact': 'تواصل',
      'nav.menu': 'القائمة',
      'nav.close': 'إغلاق',
      'lang.switch': 'EN',
      'lang.aria': 'التبديل إلى الإنجليزية',
      'cta.start': 'ابدأ مشروعك',

      'hero.label': 'استوديو هويات',
      'hero.disciplines': 'استراتيجية — هوية — رقمي',
      'hero.fig': 'شكل 01 — صُمّم ليلائم',
      'hero.l1': 'علامتك،',
      'hero.l2': 'صُنعت',
      'hero.l3': 'بدقّة',
      'hero.lede': 'نبني الهويات حول كل علامة على حدة — حول ناسها وجمهورها وطموحها. لا شيء مستعار، ولا شيء جاهز.',
      'hero.scroll': 'مرّر',

      'clients.title': 'علامات عملنا معها',
      'clients.note': 'مجموعة مختارة من الأعمال التي صغنا هوياتها.',

      'about.label': 'من نحن',
      'about.l1': 'لكل علامة',
      'about.l2': 'شكلها',
      'about.l3': 'الخاص',
      'about.p1': 'تصنع Pimx هويات تنطلق من تفاصيل كل عميل — طبيعة عمله، وجمهوره، وشخصيته، والطموح الذي يقف خلفه. نبدأ بما يميّزك، ثم نبني نظاماً يحافظ على شكله أينما ظهر.',
      'about.p2': 'لا قوالب جاهزة. لا أفكار مستعارة. فقط علامة تشعر أنها كانت لك دائماً.',
      'about.studio': 'الاستوديو',
      'about.focus': 'التركيز',
      'about.fig': 'شكل 02 — كل جزء في مكانه',

      'work.title': 'أعمال مختارة',
      'work.p1': 'مشروع 01', 'work.p2': 'مشروع 02', 'work.p3': 'مشروع 03',
      'work.p4': 'مشروع 04', 'work.p5': 'مشروع 05', 'work.p6': 'مشروع 06',
      'work.c1': 'هوية بصرية / رقمي',
      'work.c2': 'استراتيجية / هوية بصرية',
      'work.c3': 'توجيه فني',
      'work.c4': 'تغليف / هوية',
      'work.c5': 'دليل العلامة',
      'work.c6': 'تجربة رقمية',

      'svc.title': 'خدماتنا',
      'svc.intro': 'ستّة تخصّصات. نظام واحد — يتشكّل حولك.',
      'svc.1.t': 'استراتيجية العلامة',
      'svc.1.d': 'التموضع والتسمية ونبرة الصوت — التفكير الذي يُبنى عليه كل ما بعده.',
      'svc.2.t': 'الهوية البصرية',
      'svc.2.d': 'الشعار والخطوط والألوان ولغة بصرية تُرسم لك وحدك.',
      'svc.3.t': 'التوجيه الفني',
      'svc.3.d': 'تصوير وحملات وصور تحمل بصمتك بلا شك.',
      'svc.4.t': 'التجربة الرقمية',
      'svc.4.d': 'مواقع ومنتجات رقمية تحمل العلامة إلى كل تفاعل.',
      'svc.5.t': 'التغليف',
      'svc.5.d': 'هياكل وأسطح مصمّمة حول المنتج — والرف الذي يعيش عليه.',
      'svc.6.t': 'دليل العلامة',
      'svc.6.d': 'أنظمة واضحة وحيّة تحافظ على اتساق كل نقطة تواصل مع نموّك.',

      'foot.l1': 'لنصنع',
      'foot.l2': 'شيئاً',
      'foot.l3': 'يليق بك.',
      'foot.together': 'لنعمل معاً.',
      'foot.email': 'البريد',
      'foot.phone': 'الهاتف',
      'foot.instagram': 'إنستغرام',
      'foot.linkedin': 'لينكدإن',
      'foot.nav': 'تصفّح',
      'foot.rights': 'جميع الحقوق محفوظة.',
      'foot.top': 'إلى الأعلى',

      'cursor.view': 'عرض',
      'meta.title': 'Pimx Branding — علامتك، صُنعت بدقّة.'
    }
  };

  function t(lang, key) {
    return (dict[lang] && dict[lang][key]) || dict.en[key] || '';
  }

  function apply(lang, root) {
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach((el) => {
      const value = t(lang, el.dataset.i18n);
      if (value && el.textContent !== value) el.textContent = value;
      // The language switch label is always in the *other* language.
      if (el.dataset.i18n === 'lang.switch') el.lang = lang === 'ar' ? 'en' : 'ar';
    });
    scope.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(',').forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, t(lang, key));
      });
    });
    document.title = t(lang, 'meta.title');
  }

  window.PimxI18n = { dict, t, apply };
})();
