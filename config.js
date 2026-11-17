// Всё, что меняется, — здесь.
window.PARTY = {
  // URL веб-приложения Apps Script (Deploy → Web app → URL, заканчивается на /exec)
  scriptUrl: "https://script.google.com/macros/s/AKfycbyR7ZXiwEoZtpMUSvDvbPha-Y5SRQsJJOw7J151GLu7K4gftz6vEVzHvUFCNvPczTOsOw/exec",

  date: "2026-11-28",
  dateText: "Суббота, 28 ноября",
  time: "",      // напр. "14:00–16:00" — пусто = «сообщим позже»
  place: "",     // напр. "Kyn Art Studio, ТРК Forum, 4 этаж"
  mapUrl: "",    // ссылка на 2ГИС

  // kaspi: ссылка на товар (https://kaspi.kz/shop/p/...) или поисковый запрос — тогда «Искать на Kaspi»
  gifts: [
    { id: "tab-paws",     title: "Набор для создания таба-лапок",   kaspi: "https://kaspi.kz/shop/p/nabor-dlja-izgotovlenija-skvishei-taba-lapki-49-pcs-00103-132140001/" },
    { id: "markers",      title: "Волшебные фломастеры",            kaspi: "https://kaspi.kz/shop/p/junlandija-junyi-volshebnik-151430-12-sht-110723518/" },
    { id: "paint-num",    title: "Картина по номерам",              kaspi: "https://kaspi.kz/shop/p/kartina-po-nomeram-malen-kii-prints-na-kite-holst-na-podramnike-40x30-sm-167075618/" },
    { id: "canvas",       title: "Холст для рисования",             kaspi: "https://kaspi.kz/shop/p/holst-30h40-na-podramnike-h30-40-168741938/" },
    { id: "cat-lamp",     title: "Ночник в форме кошки",            kaspi: "https://kaspi.kz/shop/p/marco-nochnik-detskii-191465-koshechka-silikon-110070017/" },
    { id: "soap",         title: "Набор для мыловарения",           kaspi: "https://kaspi.kz/shop/p/nabor-dlja-mylovarenija-fantazer-mylo-svoimi-rukami-varezhka-s-pingvinom--185182063/" },
    { id: "kitten-wear",  title: "Одежда для котёнка",              kaspi: "https://kaspi.kz/shop/p/tolstovka-pchjolka-zheltyi-chernyi-s-131584147/" },
    { id: "hp-bedding",   title: "Постельное бельё «Гарри Поттер»", kaspi: "https://kaspi.kz/shop/p/komplekt-1-5-spal-nyi-garri-potter-navolochki-70x70-sm-hlopok-poplin-138774276/" },
    { id: "piggy",        title: "Копилка",                         kaspi: "https://kaspi.kz/shop/p/kopilka-interpresent-seif-chernyi-103162880/" },
    { id: "bunny-charm",  title: "Брелок с водой «зайчик»",         kaspi: "брелок с жидкостью" },
    { id: "hp-pajama",    title: "Пижама «Гарри Поттер»", note: "рост 144, размер S — сверьте с таблицей продавца", kaspi: "https://kaspi.kz/shop/p/pizhama-harry-potter-bordovyi-153548187/" },
    { id: "doll",         title: "Кукла ручной работы", note: "какую именно — подскажет мама Маши" }
  ]
};
