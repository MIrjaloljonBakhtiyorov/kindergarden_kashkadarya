import { 
  UserRole, 
  Dish, 
  Group, 
  KitchenTask, 
  LabSample, 
  InventoryProduct, 
  Transaction, 
  InspectionType, 
  AuditRecord,
  ParentUser
} from '../types';

export const ROLES_INFO: Record<UserRole, { label: string; description: string }> = {
  DIRECTOR: { label: 'Bog‘cha Admin / Direktor', description: 'Strategik boshqaruv va KPI nazorati' },
  OPERATOR: { label: 'Operator', description: 'Tezkor ma’lumotlarni kiritish va davomat' },
  STOREKEEPER: { label: 'Omborchi', description: 'Inventarizatsiya va ta’minot zanjiri' },
  DIETITIAN: { label: 'Dietolog', description: 'Ozuqalanish va menyu rejalashtirish' },
  KITCHEN_MANAGER: { label: 'Oshxona mas’uli', description: 'Taom tayyorlash va operatsion jarayon nazorati' },
  CHEF: { label: 'Oshpaz', description: 'Retseptlar va tayyorlash ijrosi' },
  LAB_CONTROLLER: { label: 'Sinama nazoratchisi', description: 'Sifat va xavfsizlik nazorati' },
  TEACHER: { label: 'Tarbiyachi', description: 'Davomat va ovqatlanish nazorati' },
  NURSE: { label: 'Hamshira', description: 'Tibbiy ko‘rik va salomatlik monitoringi' },
  PARENT: { label: 'Ota-ona', description: 'Farzand salomatligi va kundalik hisoboti' },
  INSPECTOR: { label: 'Inspektor / Auditor', description: 'Mustaqil audit va sifat nazorati' },
  PROFILES: { label: 'Ota-ona va bolalar profili', description: 'Hisob ma’lumotlari va tizim nazorati' },
  SUPPLY: { label: 'Ta’minot boshqaruvi', description: 'Tashqi buyurtmalar va yetkazib beruvchilar zanjiri' },
  FINANCE: { label: 'Buxgalteriya va moliya', description: 'Xarajatlar nazorati va moliyaviy tahlil' },
};

export const DISH_DATABASE: Dish[] = [];

export const INITIAL_GROUPS: Group[] = [];

export const INITIAL_KITCHEN_TASKS: KitchenTask[] = [];

export const INITIAL_LAB_SAMPLES: LabSample[] = [];

export const INITIAL_INVENTORY: InventoryProduct[] = [];

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const MOCK_CHECKLISTS: Record<InspectionType, string[]> = {
  KITCHEN: [
    "Oziq-ovqat mahsulotlarini saqlash harorati me'yordami?",
    "Pishirish jarayonida sanitariya-gigiyena qoidalariga rioya qilinyaptimi?",
    "Tayyor taomlarning vizual ko'rinishi va hidi talablarga javob beradimi?",
    "Oshxona jihozlari va idishlari tozalangan va dezinfeksiya qilinganmi?",
    "Pishirish harorati va vaqti retseptura bo'yicha to'g'ri olib borilyaptimi?",
    "Oshpazlarning maxsus kiyimi va shaxsiy gigiyenasi tekshirildimi?"
  ],
  WAREHOUSE: [
    "Mahsulotlarning yaroqlilik muddati va qadoqlari butunligi tekshirildimi?",
    "Omborxonada harorat va namlik ko'rsatkichlari jurnali yuritilyaptimi?",
    "Xom-ashyolar turlari bo'yicha (go'sht, sut, quruq) alohida saqlanyaptimi?",
    "Omborxona pol va devorlari toza, kemiruvchilarga qarshi chora ko'rilganmi?",
    "Keltirilgan mahsulotlarning sifat sertifikatlari to'liq mavjudmi?"
  ],
  HYGIENE: [
    "Xodimlar ish boshlashdan oldin tibbiy ko'rikdan o'tkazildimi?",
    "Yuvinish xonalari sanitariya vositalari (sovun, sochiq) bilan ta'minlanganmi?",
    "Bolalar ovqatlanish zallarida stol va stullar ovqatdan oldin va keyin tozalandimi?",
    "Chiqindilarni yig'ish va utilizatsiya qilish tartibi to'g'ri yo'lga qo'yilganmi?",
    "Xonalar muntazam ravishda shamollatilyaptimi va tozalash jadvallari bormi?"
  ],
  SAMPLE: [
    "Kundalik tayyorlangan barcha taomlardan 48 soatlik sinama olinganmi?",
    "Sinamalar maxsus steril idishlarda, yopiq holda saqlanyaptimi?",
    "Sinama idishlarida taom nomi, tayyorlangan sana va vaqti yozilganmi?",
    "Sinamalar saqlanadigan muzlatkich harorati muntazam tekshirib borilyaptimi?",
    "Sinamalarni olish va utilizatsiya qilish maxsus jurnalda qayd etilyaptimi?"
  ]
};

export const INITIAL_AUDITS: AuditRecord[] = [];

export const INITIAL_PARENT_USERS: ParentUser[] = [];
