const currencyIcons = {
  AED: 'د.إ', // United Arab Emirates Dirham
  AFN: '؋', // Afghan Afghani
  ALL: 'L', // Albanian Lek
  AMD: 'Դ', // Armenian Dram
  ANG: 'ƒ', // Netherlands Antillean Guilder
  AOA: 'Kz', // Angolan Kwanza
  ARS: '$', // Argentine Peso
  AUD: 'A$', // Australian Dollar
  AWG: 'ƒ', // Aruban Florin
  AZN: '₼', // Azerbaijani Manat
  BAM: 'KM', // Bosnia and Herzegovina Convertible Mark
  BBD: 'Bds$', // Barbadian Dollar
  BDT: '৳', // Bangladeshi Taka
  BGN: 'лв', // Bulgarian Lev
  BHD: 'ب.د', // Bahraini Dinar
  BIF: 'FBu', // Burundian Franc
  BMD: 'BD$', // Bermudian Dollar
  BND: 'B$', // Brunei Dollar
  BOB: 'Bs.', // Bolivian Boliviano
  BRL: 'R$', // Brazilian Real
  BSD: 'B$', // Bahamian Dollar
  BTN: 'Nu.', // Bhutanese Ngultrum
  BWP: 'P', // Botswana Pula
  BYN: 'Br', // Belarusian Ruble
  BZD: 'BZ$', // Belize Dollar
  CAD: 'C$', // Canadian Dollar
  CDF: 'FC', // Congolese Franc
  CHF: 'CHF', // Swiss Franc
  CLP: '$', // Chilean Peso
  CNY: '¥', // Chinese Yuan
  COP: '$', // Colombian Peso
  CRC: '₡', // Costa Rican Colón
  CUP: '₱', // Cuban Peso
  CVE: '$', // Cape Verdean Escudo
  CZK: 'Kč', // Czech Koruna
  DJF: 'Fdj', // Djiboutian Franc
  DKK: 'kr', // Danish Krone
  DOP: 'RD$', // Dominican Peso
  DZD: 'د.ج', // Algerian Dinar
  EGP: 'E£', // Egyptian Pound
  ERN: 'Nfk', // Eritrean Nakfa
  ETB: 'Br', // Ethiopian Birr
  EUR: '€', // Euro
  FJD: 'FJ$', // Fijian Dollar
  FKP: '£', // Falkland Islands Pound
  GBP: '£', // British Pound
  GEL: '₾', // Georgian Lari
  GHS: 'GH₵', // Ghanaian Cedi
  GIP: '£', // Gibraltar Pound
  GMD: 'D', // Gambian Dalasi
  GNF: 'FG', // Guinean Franc
  GTQ: 'Q', // Guatemalan Quetzal
  GYD: 'GY$', // Guyanese Dollar
  HKD: 'HK$', // Hong Kong Dollar
  HNL: 'L', // Honduran Lempira
  HRK: 'kn', // Croatian Kuna
  HTG: 'G', // Haitian Gourde
  HUF: 'Ft', // Hungarian Forint
  IDR: 'Rp', // Indonesian Rupiah
  ILS: '₪', // Israeli New Shekel
  INR: '₹', // Indian Rupee
  IQD: 'ع.د', // Iraqi Dinar
  IRR: '﷼', // Iranian Rial
  ISK: 'kr', // Icelandic Króna
  JMD: 'J$', // Jamaican Dollar
  JOD: 'د.أ', // Jordanian Dinar
  JPY: '¥', // Japanese Yen
  KES: 'KSh', // Kenyan Shilling
  KGS: 'с', // Kyrgyzstani Som
  KHR: '៛', // Cambodian Riel
  KMF: 'CF', // Comorian Franc
  KPW: '₩', // North Korean Won
  KRW: '₩', // South Korean Won
  KWD: 'د.ك', // Kuwaiti Dinar
  KYD: 'CI$', // Cayman Islands Dollar
  KZT: '₸', // Kazakhstani Tenge
  LAK: '₭', // Lao Kip
  LBP: 'ل.ل', // Lebanese Pound
  LKR: 'රු', // Sri Lankan Rupee
  LRD: 'L$', // Liberian Dollar
  LSL: 'L', // Lesotho Loti
  LYD: 'ل.د', // Libyan Dinar
  MAD: 'د.م.', // Moroccan Dirham
  MDL: 'L', // Moldovan Leu
  MGA: 'Ar', // Malagasy Ariary
  MKD: 'ден', // Macedonian Denar
  MMK: 'K', // Myanmar Kyat
  MNT: '₮', // Mongolian Tögrög
  MOP: 'MOP$', // Macanese Pataca
  MRO: 'UM', // Mauritanian Ouguiya
  MUR: '₨', // Mauritian Rupee
  MVR: 'ރ.', // Maldivian Rufiyaa
  MWK: 'MK', // Malawian Kwacha
  MXN: '$', // Mexican Peso
  MYR: 'RM', // Malaysian Ringgit
  MZN: 'MT', // Mozambican Metical
  NAD: 'N$', // Namibian Dollar
  NGN: '₦', // Nigerian Naira
  NIO: 'C$', // Nicaraguan Córdoba
  NOK: 'kr', // Norwegian Krone
  NPR: 'रु', // Nepalese Rupee
  NZD: 'NZ$', // New Zealand Dollar
  OMR: 'ر.ع.', // Omani Rial
  PAB: 'B/', // Panamanian Balboa
  PEN: 'S/', // Peruvian Sol
  PGK: 'K', // Papua New Guinean Kina
  PHP: '₱', // Philippine Peso
  PKR: '₨', // Pakistani Rupee
  PLN: 'zł', // Polish Złoty
  PYG: '₲', // Paraguayan Guarani
  QAR: 'ر.ق', // Qatari Riyal
  RON: 'lei', // Romanian Leu
  RSD: 'дин', // Serbian Dinar
  RUB: '₽', // Russian Ruble
  RWF: 'RF', // Rwandan Franc
  SAR: 'ر.س', // Saudi Riyal
  SBD: 'SI$', // Solomon Islands Dollar
  SCR: '₨', // Seychellois Rupee
  SDG: 'ج.س.', // Sudanese Pound
  SEK: 'kr', // Swedish Krona
  SGD: 'SGD', // Singapore Dollar
  SHP: '£', // Saint Helena Pound
  SLL: 'Le', // Sierra Leonean Leone
  SOS: 'Sh', // Somali Shilling
  SRD: 'SRD', // Surinamese Dollar
  SSP: '£', // South Sudanese Pound
  STD: 'Db', // São Tomé and Principe Dobra
  SVC: '₡', // Salvadoran Colón
  SYP: 'ل.س', // Syrian Pound
  SZL: 'L', // Swazi Lilangeni
  THB: '฿', // Thai Baht
  TJS: 'с', // Tajikistani Somoni
  TMT: 'm', // Turkmenistan Manat
  TND: 'د.ت', // Tunisian Dinar
  TOP: 'T$', // Tongan Paʻanga
  TRY: '₺', // Turkish Lira
  TTD: 'TT$', // Trinidad and Tobago Dollar
  TWD: 'NT$', // New Taiwan Dollar
  TZS: 'TSh', // Tanzanian Shilling
  UAH: '₴', // Ukrainian Hryvnia
  UGX: 'USh', // Ugandan Shilling
  USD: '$', // United States Dollar
  UYU: '$U', // Uruguayan Peso
  UZS: 'с', // Uzbekistan Som
  VND: '₫', // Vietnamese Dong
  VUV: 'VT', // Vanuatu Vatu
  WST: 'WS$', // Samoan Tala
  XAF: 'FCFA', // Central African CFA Franc
  XCD: '$', // East Caribbean Dollar
  XOF: 'CFA', // West African CFA Franc
  XPF: '₣', // CFP Franc
  YER: '﷼', // Yemeni Rial
  ZAR: 'R', // South African Rand
  ZMW: 'ZK', // Zambian Kwacha
  ZWL: 'Z$', // Zimbabwean Dollar
};

export function getCurrencyIcon(currencyCode) {
  return currencyIcons[currencyCode] || 'Uk';
}
