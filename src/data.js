// ─── Mock Data ───────────────────────────────────────────────────────────────

export const BORROWERS = [
  {
    id: "CR-2024-0412",
    name: "Алишер Ҳасанов",
    phone: "+998 90 123 45 67",
    contract: "KR-2022-4812",
    amount: 85_000_000,
    overdue: 12_450_000,
    dpd: 127,
    stage: "Суд",
    collector: "Нилуфар Р.",
    risk: 88,
    product: "Ипотека",
    issueDate: "2022-03-15",
    endDate: "2032-03-15",
    totalPaid: 42_000_000,
    address: "Тошкент, Юнусобод тумани, Навоий кўчаси 12-уй",
    inn: "123456789",
    passportSeries: "AA 1234567",
    employer: "Tashkent Motors LLC",
    salary: 8_500_000,
    calls: [
      { id: 1, date: "2024-06-28", time: "10:32", duration: "3:45", operator: "Нилуфар Р.", type: "outgoing", result: "Ваъда берди", note: "29-июнгача тўловни амалга оширишни ваъда қилди" },
      { id: 2, date: "2024-06-25", time: "14:10", duration: "1:20", operator: "AI Bot", type: "ai", result: "Жавоб бермади", note: "Автоматик xabar yuborildi" },
      { id: 3, date: "2024-06-20", time: "09:15", duration: "5:12", operator: "Камол Б.", type: "incoming", result: "Тўловдан бош тортди", note: "Молиявий қийинчиликни айтди, 2 ой муддат сўради" },
      { id: 4, date: "2024-06-15", time: "16:40", duration: "2:30", operator: "Нилуфар Р.", type: "outgoing", result: "Ваъда берди", note: "500 000 сўм тўлашни ваъда қилди" },
      { id: 5, date: "2024-06-10", time: "11:00", duration: "0:45", operator: "AI Bot", type: "ai", result: "SMS юборилди", note: "Эслатма SMS юборилди" },
    ],
    aiChats: [
      { role: "bot", text: "Ассалому алайкум, Алишер! Мен Trastbank коллекция бўлимининг AI ёрдамчисиман. Сизнинг KR-2022-4812 рақамли кредитингиз бўйича 12 450 000 сўм қарздорлик мавжуд. Имконияти борми, буни муҳокама қиламизми?", time: "10:30" },
      { role: "user", text: "Ҳозир пулим йўқ, бир ой кутишингизни сўрайман", time: "10:31" },
      { role: "bot", text: "Тушунарли. Молиявий қийинчиликларингизни инобатга оламиз. Агар 15 кун ичида 3 000 000 сўм тўласангиз, реструктуризация имкониятини кўриб чиқамиз. Бу Сизга мос келадими?", time: "10:32" },
      { role: "user", text: "Кўриб чиқаман, розиман", time: "10:33" },
    ],
    aiRecs: [
      { type: "critical", icon: "🚨", title: "Дарҳол суд чаклови талаб қилинади", desc: "127 кун DPD — суд жараёни бошланган. Юрист билан мажлис тайинланг." },
      { type: "warning", icon: "⚠️", title: "Реструктуризация таклиф қилинг", desc: "Мижоз молиявий қийинчиликда, лекин тўловга тайёр сигналлар берди." },
      { type: "info", icon: "ℹ️", title: "Гаров аукционини кўриб чиқинг", desc: "Баҳоланган қиймат қарз суммасини қоплайди." },
    ],
    collateral: [
      { id: "G-001", type: "Кўчмас мулк", object: "3-хонали квартира", address: "Тошкент, Юнусобод, Навоий 12", value: 180_000_000, cadastre: "10:01:01:01:01:1234", status: "Гаровда", auctioned: false },
    ],
    court: [
      { id: "С-2024-118", stage: "Апелляция", status: "Кўриб чиқилmoqda", lastDecision: "Биринчи инстанция — тўлаш мажбурияти", nextDate: "2024-07-15", lawyer: "Шерзод Ю.", timeline: [
        { date: "2024-03-10", event: "Арз берилди", desc: "Тошкент шаҳар иқтисодий суди" },
        { date: "2024-04-20", event: "Биринчи мажлис", desc: "Мижоз ҳозир бўлмади" },
        { date: "2024-05-28", event: "Қарор чиқарилди", desc: "Банк фойдасига қарор қабул қилинди" },
        { date: "2024-06-10", event: "Апелляция берилди", desc: "Мижоз апелляция берди" },
      ]},
    ],
    mib: [
      { id: "МИБ-2024-5521", status: "Фаол", executor: "Равшан Қ.", executorPhone: "+998 71 234 56 78", collected: 2_500_000, remaining: 9_950_000, lastAction: "2024-06-22", actions: [
        { date: "2024-06-22", action: "Банк ҳисобидан ундирилди", amount: 500_000 },
        { date: "2024-06-10", action: "Мол-мулк рўйхатга олинди", amount: 0 },
        { date: "2024-05-30", action: "Ижро иши очилди", amount: 0 },
      ]},
    ],
    auction: [],
    payments: [
      { date: "2024-05-15", amount: 1_200_000, type: "Асосий қарз", channel: "Интернет банкинг", status: "Амалга оширилган" },
      { date: "2024-04-10", amount: 800_000, type: "Фоиз", channel: "Касса", status: "Амалга оширилган" },
      { date: "2024-03-05", amount: 1_500_000, type: "Асосий қарз", channel: "Мобил илова", status: "Амалга оширилган" },
    ],
    notes: [
      { date: "2024-06-28", author: "Нилуфар Р.", text: "Мижоз билан учрашув бўлди. 29-июнгача 2 млн тўлашни ваъда қилди. Кузатиш зарур." },
      { date: "2024-06-20", author: "Шерзод Ю.", text: "Апелляция суди 15-июлга тайинланди. Ҳужжатлар тайёр." },
    ],
  },
  {
    id: "CR-2024-0387",
    name: "Малика Юсупова",
    phone: "+998 91 987 65 43",
    contract: "KR-2021-3301",
    amount: 45_000_000,
    overdue: 5_820_000,
    dpd: 62,
    stage: "МИБ",
    collector: "Камол Б.",
    risk: 72,
    product: "Автокредит",
    issueDate: "2021-06-10",
    endDate: "2026-06-10",
    totalPaid: 28_000_000,
    address: "Тошкент, Чилонзор тумани, Катта Ҳалқа йўли 55",
    inn: "987654321",
    passportSeries: "AB 7654321",
    employer: "Samarkand Textile",
    salary: 5_200_000,
    calls: [
      { id: 1, date: "2024-06-27", time: "09:00", duration: "4:20", operator: "Камол Б.", type: "outgoing", result: "Ваъда берди", note: "Июл охирида тўлашни айтди" },
      { id: 2, date: "2024-06-19", time: "15:30", duration: "2:10", operator: "AI Bot", type: "ai", result: "SMS юборилди", note: "Автоматик эслатма" },
    ],
    aiChats: [
      { role: "bot", text: "Саломалайкум, Малика! Автокредитингиз бўйича 5 820 000 сўм муддати ўтган қарздорлик мавжуд.", time: "09:00" },
      { role: "user", text: "Биламан, бир ой ичида ёпаман", time: "09:02" },
    ],
    aiRecs: [
      { type: "warning", icon: "⚠️", title: "МИБ ижро жараёни фаол", desc: "Мижоз ижро жараёнида. Далолатнома тайёр қилинг." },
      { type: "info", icon: "ℹ️", title: "Реструктуризация имконияти", desc: "62 DPD — реструктуризация таклиф қилинса мижоз жавоб бериши мумкин." },
    ],
    collateral: [
      { id: "G-002", type: "Транспорт воситаси", object: "Chevrolet Tracker 2021", address: "ДАВ: 01А 123 ВА", value: 55_000_000, cadastre: "ТС-2021-48291", status: "Гаровда", auctioned: false },
    ],
    court: [],
    mib: [
      { id: "МИБ-2024-3312", status: "Фаол", executor: "Дилноза М.", executorPhone: "+998 71 111 22 33", collected: 1_200_000, remaining: 4_620_000, lastAction: "2024-06-25", actions: [
        { date: "2024-06-25", action: "Иш жойидан ундирилди", amount: 1_200_000 },
        { date: "2024-06-05", action: "Ижро иши очилди", amount: 0 },
      ]},
    ],
    auction: [],
    payments: [
      { date: "2024-05-20", amount: 900_000, type: "Фоиз", channel: "Касса", status: "Амалга оширилган" },
      { date: "2024-04-22", amount: 1_100_000, type: "Асосий қарз", channel: "Интернет банкинг", status: "Амалга оширилган" },
    ],
    notes: [
      { date: "2024-06-27", author: "Камол Б.", text: "Мижоз июл охирида тўлашни ваъда қилди. МИБ ижроси давом эттирилади." },
    ],
  },
  {
    id: "CR-2024-0298",
    name: "Бобур Эргашев",
    phone: "+998 93 456 78 90",
    contract: "KR-2020-1905",
    amount: 120_000_000,
    overdue: 28_300_000,
    dpd: 215,
    stage: "Аукцион",
    collector: "Зафар Т.",
    risk: 96,
    product: "Тижорат кредити",
    issueDate: "2020-11-05",
    endDate: "2025-11-05",
    totalPaid: 65_000_000,
    address: "Самарқанд, Сиёб тумани, Регистон кўчаси 8",
    inn: "456789123",
    passportSeries: "AC 3456789",
    employer: "Ergashev Trade LLC",
    salary: 15_000_000,
    calls: [
      { id: 1, date: "2024-06-26", time: "11:00", duration: "1:05", operator: "Зафар Т.", type: "outgoing", result: "Жавоб бермади", note: "" },
      { id: 2, date: "2024-06-20", time: "10:00", duration: "2:40", operator: "AI Bot", type: "ai", result: "SMS юборилди", note: "Аукцион огоҳлантиришi" },
    ],
    aiChats: [
      { role: "bot", text: "Ҳурматли Бобур! Гаровингиздаги мулк аукционга чиқарилган. Тўлов амалга оширилмаса, 15-июлда сотув бошланади.", time: "10:00" },
      { role: "user", text: "Мен рози эмасман", time: "10:05" },
      { role: "bot", text: "Тушунарли. Суд қарорига кўра жараён давом эттирилади. Юристингиз билан маслаҳатлашишингизни тавсия этамиз.", time: "10:06" },
    ],
    aiRecs: [
      { type: "critical", icon: "🚨", title: "Аукцион 15-июлда бошланади", desc: "Гаров мулки аукционга чиқарилган. Барча ҳужжатлар тайёр." },
      { type: "warning", icon: "⚠️", title: "Мижоз алоқадан чиқиб кетган", desc: "Сўнгги 3 қўнғироқ жавобсиз қолди." },
    ],
    collateral: [
      { id: "G-003", type: "Кўчмас мулк", object: "Савдо маркази (450 м²)", address: "Самарқанд, Регистон 8", value: 320_000_000, cadastre: "14:03:02:01:02:5678", status: "Аукционда", auctioned: true },
    ],
    court: [
      { id: "С-2023-892", stage: "Ижро", status: "Ижро босқичида", lastDecision: "Гаровни ундириш ҳақида қарор", nextDate: null, lawyer: "Беҳзод О.", timeline: [
        { date: "2023-09-15", event: "Арз берилди", desc: "" },
        { date: "2023-11-20", event: "Қарор чиқарилди", desc: "Банк фойдасига. Гаровни ундириш." },
        { date: "2024-01-10", event: "МИБга юборилди", desc: "Ижро иши очилди" },
        { date: "2024-05-20", event: "Аукционга чиқарилди", desc: "Электрон аукцион платформасига юклатилди" },
      ]},
    ],
    mib: [
      { id: "МИБ-2024-1105", status: "Аукцион", executor: "Санжар Р.", executorPhone: "+998 66 333 44 55", collected: 0, remaining: 28_300_000, lastAction: "2024-05-20", actions: [
        { date: "2024-05-20", action: "Аукционга юборилди", amount: 0 },
        { date: "2024-03-15", action: "Мол-мулк баҳоланди", amount: 0 },
        { date: "2024-01-10", action: "Ижро иши очилди", amount: 0 },
      ]},
    ],
    auction: [
      { id: "AUK-2024-341", date: "2024-07-15", winner: null, salePrice: null, paymentDeadline: "2024-07-25", paymentStatus: "Кутилmoqda", paymentDate: null, regStatus: "Жараёнда" },
    ],
    payments: [
      { date: "2024-01-10", amount: 2_000_000, type: "Асосий қарз", channel: "Касса", status: "Амалга оширилган" },
    ],
    notes: [
      { date: "2024-06-26", author: "Зафар Т.", text: "Мижоз алоқадан чиқиб кетган. Аукцион 15-июлда давом эттирилади." },
      { date: "2024-05-20", author: "Беҳзод О.", text: "Суд қарори асосида аукционга чиқарилди. Ҳужжатлар МИБга топширилди." },
    ],
  },
  {
    id: "CR-2024-0501",
    name: "Дилноза Рашидова",
    phone: "+998 94 321 65 87",
    contract: "KR-2023-6621",
    amount: 30_000_000,
    overdue: 1_850_000,
    dpd: 35,
    stage: "Боғланиш",
    collector: "Нилуфар Р.",
    risk: 45,
    product: "Истеъмол кредити",
    issueDate: "2023-01-20",
    endDate: "2026-01-20",
    totalPaid: 18_500_000,
    address: "Тошкент, Бектемир тумани, Саноат кўчаси 3",
    inn: "321654987",
    passportSeries: "AD 9876543",
    employer: "Rashidova Beauty Studio",
    salary: 4_800_000,
    calls: [
      { id: 1, date: "2024-06-29", time: "12:00", duration: "6:30", operator: "Нилуфар Р.", type: "outgoing", result: "Ваъда берди", note: "2 июлда тўлашни ваъда қилди" },
      { id: 2, date: "2024-06-22", time: "10:30", duration: "3:15", operator: "AI Bot", type: "ai", result: "SMS юборилди", note: "Эслатма" },
    ],
    aiChats: [
      { role: "bot", text: "Саломалайкум, Дилноза! 1 850 000 сўм тўлов муддати ўтган. Ёрдам бера оламизми?", time: "12:00" },
      { role: "user", text: "Ҳа, 2-июлда тўлайман", time: "12:02" },
      { role: "bot", text: "Яхши, 2-июлда эслатма юборамиз. Реквизитлар: Trastbank — …", time: "12:03" },
    ],
    aiRecs: [
      { type: "info", icon: "ℹ️", title: "Пайдо бўлиш тавсияси", desc: "35 DPD — ҳали суд жараёнига ўтмаган. Тез боғланиш самарали." },
    ],
    collateral: [],
    court: [],
    mib: [],
    auction: [],
    payments: [
      { date: "2024-06-01", amount: 1_200_000, type: "Асосий қарз", channel: "Мобил илова", status: "Амалга оширилган" },
      { date: "2024-05-05", amount: 1_100_000, type: "Фоиз", channel: "Интернет банкинг", status: "Амалга оширилган" },
    ],
    notes: [
      { date: "2024-06-29", author: "Нилуфар Р.", text: "2-июлда тўлов кутилmoqda. Кузатиш зарур." },
    ],
  },
  {
    id: "CR-2024-0445",
    name: "Санжар Миrzayev",
    phone: "+998 97 654 32 10",
    contract: "KR-2022-5514",
    amount: 65_000_000,
    overdue: 9_120_000,
    dpd: 98,
    stage: "Суд",
    collector: "Камол Б.",
    risk: 81,
    product: "Бизнес кредити",
    issueDate: "2022-08-12",
    endDate: "2027-08-12",
    totalPaid: 32_000_000,
    address: "Фарғона, Марказ тумани, Мустақиллик кўчаси 44",
    inn: "654321098",
    passportSeries: "AE 5432109",
    employer: "Mirzayev Construction",
    salary: 12_000_000,
    calls: [
      { id: 1, date: "2024-06-28", time: "14:20", duration: "2:50", operator: "Камол Б.", type: "outgoing", result: "Тўловдан бош тортди", note: "Суд жараёни ҳақида огоҳлантирилди" },
      { id: 2, date: "2024-06-21", time: "09:45", duration: "1:30", operator: "AI Bot", type: "ai", result: "SMS юборилди", note: "Суд мажлиси эслатмаси" },
    ],
    aiChats: [
      { role: "bot", text: "Санжар, суд мажлиси 10-июлда бўлади. Ҳозирча тўлов имконияти бормизми?", time: "14:20" },
      { role: "user", text: "Суд орқали ҳал қилинади", time: "14:22" },
    ],
    aiRecs: [
      { type: "critical", icon: "🚨", title: "Суд мажлиси 10-июлда", desc: "Ҳужжатлар тайёрланишини таъминланг." },
      { type: "warning", icon: "⚠️", title: "Гаровни баҳолаш керак", desc: "Аукцион учун баҳолаш ҳужжатлари тайёр эмас." },
    ],
    collateral: [
      { id: "G-004", type: "Кўчмас мулк", object: "Омборхона (200 м²)", address: "Фарғона, Мустақиллик 44", value: 95_000_000, cadastre: "26:05:03:02:01:9012", status: "Гаровда", auctioned: false },
    ],
    court: [
      { id: "С-2024-445", stage: "Биринчи инстанция", status: "Кўриб чиқилmoqda", lastDecision: null, nextDate: "2024-07-10", lawyer: "Шерзод Ю.", timeline: [
        { date: "2024-05-20", event: "Арз берилди", desc: "Фарғона иқтисодий суди" },
        { date: "2024-06-15", event: "Биринчи мажлис", desc: "Мижоз ҳозир бўлди, муддат сўради" },
      ]},
    ],
    mib: [],
    auction: [],
    payments: [
      { date: "2024-04-30", amount: 2_100_000, type: "Асосий қарз", channel: "Касса", status: "Амалга оширилган" },
    ],
    notes: [
      { date: "2024-06-28", author: "Камол Б.", text: "Мижоз суд орқали ҳал қилишни хоҳlamoqda. 10-июлдаги мажлисга тайёргарлик зарур." },
    ],
  },
];

export const STAGES = ["Барчаси", "Боғланиш", "Суд", "МИБ", "Аукцион"];

export const STAGE_COLORS = {
  "Боғланиш": "badge-blue",
  "Суд": "badge-yellow",
  "МИБ": "badge-orange",
  "Аукцион": "badge-red",
};

export const fmt = (n) =>
  n >= 1_000_000
    ? (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + " млн"
    : n.toLocaleString("uz-UZ");

export const fmtFull = (n) => n.toLocaleString("uz-UZ") + " сўм";

export const DASHBOARD_STATS = {
  problemStart: { count: 127, amount: 4_820_000_000 },
  newProblem: { count: 14, amount: 510_000_000 },
  recovered: { count: 23, amount: 890_000_000 },
  recoveredAmount: 890_000_000,
  inCourt: 38,
  inMib: 29,
  auctionTotal: 12,
  auctionSold: 5,
  auctionPending: 7,
};

export const MONTHLY_DATA = [
  { month: "Янв", recovered: 620, newProblem: 520 },
  { month: "Фев", recovered: 740, newProblem: 480 },
  { month: "Мар", recovered: 580, newProblem: 610 },
  { month: "Апр", recovered: 890, newProblem: 420 },
  { month: "Май", recovered: 1020, newProblem: 390 },
  { month: "Июн", recovered: 890, newProblem: 510 },
];
