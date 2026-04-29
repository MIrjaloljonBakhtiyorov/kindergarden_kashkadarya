import { 
  ChefHat, 
  Warehouse, 
  Sparkles, 
  Beaker, 
  Utensils,
  Bed,
  Trees,
  Stethoscope,
  BookOpen,
  Activity,
  ShieldCheck,
  Thermometer,
  Wind
} from 'lucide-react';

export const INSPECTION_CATEGORIES = [
  { 
    id: 'KITCHEN', 
    name: 'Oshxona', 
    icon: ChefHat, 
    items: 10,
    questions: [
      'Oziq-ovqat mahsulotlarini saqlash harorati me’yordami?',
      'Pishirish jarayonida sanitariya-gigiyena qoidalariga rioya qilinyaptimi?',
      'Tayyor taomlarning vizual ko‘rinishi va hidi talablarga javob beradimi?',
      'Oshxona jihozlari va idishlari tozalangan va dezinfeksiya qilinganmi?',
      'Pishirish harorati va vaqti retseptura bo‘yicha to‘g‘ri olib borilyaptimi?',
      'Oshpazlarning maxsus kiyimi va shaxsiy gigiyenasi tekshirildimi?',
      'Oshxonada ventilyatsiya tizimi to‘g‘ri ishlayaptimi?',
      'Pichoqlar va taxtalar (go‘sht, sabzavot) alohida ishlatilyaptimi?',
      'Zararkunandalarga qarshi kurash choralari ko‘rilganmi?',
      'Kundalik tozalash jurnali yuritilyaptimi?'
    ]
  },
  { 
    id: 'WAREHOUSE', 
    name: 'Omborxona', 
    icon: Warehouse, 
    items: 10,
    questions: [
      'Mahsulotlarning yaroqlilik muddati va qadoqlari butunligi tekshirildimi?',
      'Omborxonada harorat va namlik ko‘rsatkichlari jurnalga kiritilyaptimi?',
      'Xom-ashyolar turlari bo‘yicha alohida saqlanyaptimi?',
      'Omborxona poli va devorlari toza, kemiruvchilarga qarshi chora ko‘rilganmi?',
      'Keltirilgan mahsulotlarning sifat sertifikatlari mavjudmi?',
      'Mahsulotlar poldan kamida 15 sm balandlikda (stellajda) saqlanyaptimi?',
      'Tez buziluvchi mahsulotlar uchun muzlatkichlar yetarlimi?',
      'Yuvish vositalari oziq-ovqatdan alohida saqlanyaptimi?',
      'Omborxonada begona shaxslar yo‘qligi nazorat qilinadimi?',
      'Kirish va chiqish hujjatlari muntazam yuritilyaptimi?'
    ]
  },
  { 
    id: 'SANITARY', 
    name: 'Sanitariya', 
    icon: Sparkles, 
    items: 10,
    questions: [
      'Xodimlar ish boshlashdan oldin tibbiy ko‘rikdan o‘tkazildimi?',
      'Yuvinish xonalari sanitariya vositalari bilan ta’minlanganmi?',
      'Bolalar ovqatlanishdan oldin va keyin qo‘l yuvganmi?',
      'Chiqindilar yopiq idishda saqlanyaptimi?',
      'Xonalar muntazam shamollatilib, tozalanadimi?',
      'Dezinfeksiya eritmalari to‘g‘ri tayyorlangan va saqlanyaptimi?',
      'Tozalash anjomlari (paqir, latta) tamg‘alanganmi?',
      'Guruhlarda ichimlik suvi rejimi ta’minlanganmi?',
      'Bolalar tuvaklari yoki unitazlari sanitariya holatidami?',
      'Umumiy hududda (koridor, zinapoya) tozalik saqlanyaptimi?'
    ]
  },
  { 
    id: 'DORMITORY', 
    name: 'Yotoqxona', 
    icon: Bed, 
    items: 8,
    questions: [
      'Yotoqxonalarda havo harorati me’yordami?',
      'Krovatlar orasidagi masofa sanitariya qoidalariga mosmi?',
      'Yotoq choyshablari toza va vaqtida almashtirilganmi?',
      'Choyshablar markirovka qilinganmi?',
      'Yotoqxonada begona buyumlar saqlanmayaptimi?',
      'Uxlash vaqtida shamollatish tartibiga rioya qilinadimi?',
      'Shaxsiy gigiyena buyumlari (sochiq va b.) alohida joylanganmi?',
      'Yotoqxona javonlari changdan tozalanganmi?'
    ]
  },
  { 
    id: 'PLAYGROUND', 
    name: 'O‘yin maydonchasi', 
    icon: Trees, 
    items: 8,
    questions: [
      'O‘yin jihozlari (arg‘imchoq, tepalik) mustahkam va xavfsizmi?',
      'Maydoncha hududi begona chiqindilardan tozalanganmi?',
      'Qumloqlar (pesochnitsa) yopiq holatda va qumi toza holatdami?',
      'Maydonchada bolalar xavfsizligini ta’minlovchi qoplama bormi?',
      'Atrof-muhitdagi daraxtlar va butalar butalganmi?',
      'Bolalar yoshi uchun mo‘ljallangan o‘yinchoqlar mavjudmi?',
      'Ochiq suv havzalari yoki xavfli chuqurlar yo‘qligi tekshirildimi?',
      'Soyabonlar (naves) quyoshdan himoya qila oladimi?'
    ]
  },
  { 
    id: 'MEDICAL', 
    name: 'Tibbiyot xonasi', 
    icon: Stethoscope, 
    items: 8,
    questions: [
      'Tibbiyot xonasi zaruriy asbob-uskunalar bilan ta’minlanganmi?',
      'Birinchi yordam dorichasi (aptechka) to‘la va muddati o‘tmaganmi?',
      'Dori-darmonlar saqlash tartibiga rioya qilinyaptimi?',
      'Izolyator xonasi tayyor holatdami?',
      'Bolalarning antropometrik ko‘rsatkichlari qayd etilganmi?',
      'Emlash jurnallari va kartalari muntazam yuritilyaptimi?',
      'Tibbiy xodimning maxsus kiyimi va gigiyenasi joyidami?',
      'Kvarts lampasi o‘rnatilgan va rejali ishlatilyaptimi?'
    ]
  },
  { 
    id: 'EDUCATION', 
    name: 'Ta’lim jarayoni', 
    icon: BookOpen, 
    items: 8,
    questions: [
      'Mashg‘ulotlar rejaga muvofiq olib borilyaptimi?',
      'O‘quv qurollari va materiallari yosh guruhiga mosmi?',
      'Bolalarning mashg‘ulotlardagi ishtiroki va qiziqishi yuqorimi?',
      'Tarbiyachining bolalar bilan muloqoti etikasi saqlanyaptimi?',
      'Guruhda rivojlantiruvchi markazlar (burchaklar) mavjudmi?',
      'Bolalarning ijodiy ishlari namoyish etilganmi?',
      'Mashg‘ulotlar davomiyligi me’yorga mosmi?',
      'Guruhda psixologik iqlim ijobiymi?'
    ]
  },
  { 
    id: 'SAMPLES', 
    name: 'Sinamalar', 
    icon: Beaker, 
    items: 8,
    questions: [
      'Kundalik tayyorlangan barcha taomlardan sinama olinganmi?',
      'Sinamalar maxsus steril idishlarda saqlanyaptimi?',
      'Sinama idishlarida taom nomi, tayyorlangan sana va vaqt yozilganmi?',
      'Sinamalar muzlatkich haroratida saqlanyaptimi?',
      'Sinamalar uchun mas’ul shaxs imzosi mavjudmi?',
      'Sinamalar 72 soat davomida saqlanishi ta’minlanganmi?',
      'Sinama olish idishlari har safar sterilizatsiya qilinadimi?',
      'Sinamalar jurnali xatolarsiz to‘ldirilganmi?'
    ]
  },
  { 
    id: 'FOOD_CONSUMPTION', 
    name: 'Ovqat iste’moli nazorati', 
    icon: Utensils, 
    items: 10,
    questions: []
  },
];

export const CONSUMPTION_LEVELS = [
  { value: 100, label: '100%', description: 'to‘liq yedi', color: 'bg-emerald-500' },
  { value: 75, label: '75%', description: 'katta qismini yedi', color: 'bg-blue-500' },
  { value: 50, label: '50%', description: 'yarmini yedi', color: 'bg-yellow-500' },
  { value: 25, label: '25%', description: 'kam yedi', color: 'bg-orange-500' },
  { value: 0, label: '0%', description: 'yemadi', color: 'bg-red-500' },
];

export const SEVERITY_LEVELS = [
  { id: 'LOW', label: 'LOW', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'MEDIUM', label: 'MEDIUM', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { id: 'HIGH', label: 'HIGH', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'CRITICAL', label: 'CRITICAL', color: 'bg-red-100 text-red-700 border-red-200' },
];
