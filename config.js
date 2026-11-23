// Всё, что меняется, — здесь.
window.PARTY = {
  // URL веб-приложения Apps Script (Deploy → Web app → URL, заканчивается на /exec)
  scriptUrl: "https://script.google.com/macros/s/AKfycbyR7ZXiwEoZtpMUSvDvbPha-Y5SRQsJJOw7J151GLu7K4gftz6vEVzHvUFCNvPczTOsOw/exec",

  date: "2026-12-05",
  dateText: "Суббота, 5 декабря",
  time: "в 12:00",
  place: "KazQuest",
  address: "пр. Райымбека, 120/124",
  mapUrl: "https://2gis.kz/almaty/geo/9430047374967689/76.942120,43.269789",
  site: "https://www.instagram.com/kazquest.kz",

  // kaspi: ссылка на товар (https://kaspi.kz/shop/p/...) или поисковый запрос — тогда «Искать на Kaspi»
  gifts: [
    { id: "tab-paws",     title: "Набор для создания сквишей «таба-лапка»", kaspi: "https://www.wildberries.kz/catalog/296162548/detail.aspx?size=450896874" },
    { id: "paint-num",    title: "Картина по номерам",              kaspi: "https://kaspi.kz/shop/p/kartina-po-nomeram-malen-kii-prints-na-kite-holst-na-podramnike-40x30-sm-167075618/" },
    { id: "canvas",       title: "Холст для рисования",             kaspi: "https://kaspi.kz/shop/p/holst-30h40-na-podramnike-h30-40-168741938/" },
    { id: "cat-lamp",     title: "Ночник в форме кошки",            kaspi: "https://kaspi.kz/shop/p/marco-nochnik-detskii-191465-koshechka-silikon-110070017/" },
    { id: "soap",         title: "Набор для мыловарения",           kaspi: "https://kaspi.kz/shop/p/nabor-dlja-mylovarenija-fantazer-mylo-svoimi-rukami-varezhka-s-pingvinom--185182063/" },
    { id: "bedding-glow", title: "Детское постельное бельё, светится в темноте", note: "160×80, «Юниор»", kaspi: "https://www.wildberries.kz/catalog/440602912/detail.aspx" },
    { id: "bunny-charm",  title: "Брелок с жидкостью и блёстками",         kaspi: "https://kaspi.kz/shop/p/brelok-zhidkost-ju-s-blestkami-na-kljuchi-i-rjukzak-4h12-sm-kost-1-sht-185230773/" },
    { id: "hp-pajama",    title: "Пижама «Гарри Поттер»", note: "рост 144, размер S — сверьте с таблицей продавца", kaspi: "https://www.wildberries.kz/catalog/1537221796/detail.aspx?size=2388746152" },
    { id: "hp-science",   title: "Набор опытов «Гарри Поттер» 8 в 1", kaspi: "https://www.wildberries.kz/catalog/1707240120/detail.aspx?size=2784334518" },
    { id: "hp-mug",       title: "Кружка «Гарри Поттер», 350 мл", kaspi: "https://kaspi.kz/shop/p/kruzhka-garri-potter-350-ml-keramika-151061603/" },
    { id: "hp-rug",       title: "Круглый коврик «Гриффиндор», 120×120 см", kaspi: "https://kaspi.kz/shop/p/harry-potter-dekorativnyi-kovrik-120x120-sm-griffindor-kruglaja-131571823/" },
    { id: "hp-bag",       title: "Мини-сумка «Гарри Поттер»", note: "оранжево-коричневая", kaspi: "https://kaspi.kz/shop/p/mini-sumka-harry-potter-111-iskusstvennaja-kozha-oranzhevyi-korichnevyi-113610106/" },
    { id: "karate-chest", title: "Нагрудник для карате Arawaza WKF, белый", note: "размер XS", kaspi: "https://kaspi.kz/shop/p/arawaza-wkf-approved-belyi-xs-187626948/" },
    { id: "karate-blue",  title: "Накладки для карате Arawaza, синие", note: "размер S", kaspi: "https://kaspi.kz/shop/p/arawaza-nakladki-dlja-karate-sinii-s-164728598/" },
    { id: "mc-lego",      title: "Конструктор Minecraft, 404 детали", kaspi: "https://kaspi.kz/shop/p/konstruktor-minecraft-minecraft-366b10-detalei-404-sht-181689367/" },
    { id: "doll",         title: "Кукла ручной работы", kaspi: "https://www.instagram.com/krepak_nataly/" }
  ]
};
