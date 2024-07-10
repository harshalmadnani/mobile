export default getCurrencyCode = countryCode => {
  switch (countryCode) {
    case 'AF':
      return 'AFN'; // Afghan Afghani
    case 'AL':
      return 'ALL'; // Albanian Lek
    case 'DZ':
      return 'DZD'; // Algerian Dinar
    case 'AD':
      return 'EUR'; // Euro (Andorra uses Euro)
    case 'AO':
      return 'AOA'; // Angolan Kwanza
    case 'AG':
      return 'XCD'; // East Caribbean Dollar (Antigua and Barbuda)
    case 'AR':
      return 'ARS'; // Argentine Peso
    case 'AM':
      return 'AMD'; // Armenian Dram
    case 'AU':
      return 'AUD'; // Australian Dollar
    case 'AT':
      return 'EUR'; // Euro (Austria uses Euro)
    case 'AZ':
      return 'AZN'; // Azerbaijani Manat
    case 'BS':
      return 'BSD'; // Bahamian Dollar
    case 'BH':
      return 'BHD'; // Bahraini Dinar
    case 'BD':
      return 'BDT'; // Bangladeshi Taka
    case 'BB':
      return 'BBD'; // Barbadian Dollar
    case 'BY':
      return 'BYN'; // Belarusian Ruble
    case 'BE':
      return 'EUR'; // Euro (Belgium uses Euro)
    case 'BZ':
      return 'BZD'; // Belize Dollar
    case 'BJ':
      return 'XOF'; // West African CFA Franc (Benin)
    case 'BT':
      return 'BTN'; // Bhutanese Ngultrum
    case 'BO':
      return 'BOB'; // Bolivian Boliviano
    case 'BA':
      return 'BAM'; // Bosnia and Herzegovina Convertible Marka
    case 'BW':
      return 'BWP'; // Botswana Pula
    case 'BR':
      return 'BRL'; // Brazilian Real
    case 'BN':
      return 'BND'; // Brunei Dollar
    case 'BG':
      return 'BGN'; // Bulgarian Lev
    case 'BF':
      return 'XOF'; // West African CFA Franc (Burkina Faso)
    case 'BI':
      return 'BIF'; // Burundian Franc
    case 'CV':
      return 'CVE'; // Cape Verdean Escudo
    case 'KH':
      return 'KHR'; // Cambodian Riel
    case 'CM':
      return 'XAF'; // Central African CFA Franc
    case 'CA':
      return 'CAD'; // Canadian Dollar
    case 'CF':
      return 'XAF'; // Central African CFA Franc (Central African Republic)
    case 'TD':
      return 'XAF'; // Central African CFA Franc (Chad)
    case 'CL':
      return 'CLP'; // Chilean Peso
    case 'CN':
      return 'CNY'; // Chinese Yuan
    case 'CO':
      return 'COP'; // Colombian Peso
    case 'KM':
      return 'KMF'; // Comorian Franc
    case 'CG':
      return 'XAF'; // Central African CFA Franc (Republic of the Congo)
    case 'CD':
      return 'CDF'; // Congolese Franc
    case 'CR':
      return 'CRC'; // Costa Rican Colón
    case 'HR':
      return 'HRK'; // Croatian Kuna
    case 'CU':
      return 'CUP'; // Cuban Peso
    case 'CY':
      return 'EUR'; // Euro (Cyprus uses Euro)
    case 'CZ':
      return 'CZK'; // Czech Koruna
    case 'DK':
      return 'DKK'; // Danish Krone
    case 'DJ':
      return 'DJF'; // Djiboutian Franc
    case 'DM':
      return 'XCD'; // East Caribbean Dollar (Dominica)
    case 'DO':
      return 'DOP'; // Dominican Peso
    case 'TL':
      return 'USD'; // United States Dollar (East Timor)
    case 'EC':
      return 'USD'; // United States Dollar (Ecuador uses USD)
    case 'EG':
      return 'EGP'; // Egyptian Pound
    case 'SV':
      return 'USD'; // United States Dollar (El Salvador uses USD)
    case 'GQ':
      return 'XAF'; // Central African CFA Franc (Equatorial Guinea)
    case 'ER':
      return 'ERN'; // Eritrean Nakfa
    case 'EE':
      return 'EUR'; // Euro (Estonia uses Euro)
    case 'ET':
      return 'ETB'; // Ethiopian Birr
    case 'FJ':
      return 'FJD'; // Fijian Dollar
    case 'FI':
      return 'EUR'; // Euro (Finland uses Euro)
    case 'FR':
      return 'EUR'; // Euro (France uses Euro)
    case 'GA':
      return 'XAF'; // Central African CFA Franc (Gabon)
    case 'GM':
      return 'GMD'; // Gambian Dalasi
    case 'GE':
      return 'GEL'; // Georgian Lari
    case 'DE':
      return 'EUR'; // Euro (Germany uses Euro)
    case 'GH':
      return 'GHS'; // Ghanaian Cedi
    case 'GR':
      return 'EUR'; // Euro (Greece uses Euro)
    case 'GD':
      return 'XCD'; // East Caribbean Dollar (Grenada)
    case 'GT':
      return 'GTQ'; // Guatemalan Quetzal
    case 'GN':
      return 'GNF'; // Guinean Franc
    case 'GW':
      return 'XOF'; // West African CFA Franc (Guinea-Bissau)
    case 'GY':
      return 'GYD'; // Guyanese Dollar
    case 'HT':
      return 'HTG'; // Haitian Gourde
    case 'HN':
      return 'HNL'; // Honduran Lempira
    case 'HU':
      return 'HUF'; // Hungarian Forint
    case 'IS':
      return 'ISK'; // Icelandic Króna
    case 'IN':
      return 'INR'; // Indian Rupee
    case 'ID':
      return 'IDR'; // Indonesian Rupiah
    case 'IR':
      return 'IRR'; // Iranian Rial
    case 'IQ':
      return 'IQD'; // Iraqi Dinar
    case 'IE':
      return 'EUR'; // Euro (Ireland uses Euro)
    case 'IL':
      return 'ILS'; // Israeli New Shekel
    case 'IT':
      return 'EUR'; // Euro (Italy uses Euro)
    case 'CI':
      return 'XOF'; // West African CFA Franc (Ivory Coast)
    case 'JM':
      return 'JMD'; // Jamaican Dollar
    case 'JP':
      return 'JPY'; // Japanese Yen
    case 'JO':
      return 'JOD'; // Jordanian Dinar
    case 'KZ':
      return 'KZT'; // Kazakhstani Tenge
    case 'KE':
      return 'KES'; // Kenyan Shilling
    case 'KI':
      return 'AUD'; // Australian Dollar (Kiribati)
    case 'KW':
      return 'KWD'; // Kuwaiti Dinar
    case 'KG':
      return 'KGS'; // Kyrgyzstani Som
    case 'LA':
      return 'LAK'; // Lao Kip
    case 'LV':
      return 'EUR'; // Euro (Latvia uses Euro)
    case 'LB':
      return 'LBP'; // Lebanese Pound
    case 'LS':
      return 'LSL'; // Lesotho Loti
    case 'LR':
      return 'LRD'; // Liberian Dollar
    case 'LY':
      return 'LYD'; // Libyan Dinar
    case 'LI':
      return 'CHF'; // Swiss Franc (Liechtenstein uses Swiss Franc)
    case 'LT':
      return 'EUR'; // Euro (Lithuania uses Euro)
    case 'LU':
      return 'EUR'; // Euro (Luxembourg uses Euro)
    case 'MG':
      return 'MGA'; // Malagasy Ariary
    case 'MW':
      return 'MWK'; // Malawian Kwacha
    case 'MY':
      return 'MYR'; // Malaysian Ringgit
    case 'MV':
      return 'MVR'; // Maldivian Rufiyaa
    case 'ML':
      return 'XOF'; // West African CFA Franc (Mali)
    case 'MT':
      return 'EUR'; // Euro (Malta uses Euro)
    case 'MH':
      return 'USD'; // United States Dollar (Marshall Islands)
    case 'MR':
      return 'MRU'; // Mauritanian Ouguiya
    case 'MU':
      return 'MUR'; // Mauritian Rupee
    case 'MX':
      return 'MXN'; // Mexican Peso
    case 'FM':
      return 'USD'; // United States Dollar (Micronesia)
    case 'MD':
      return 'MDL'; // Moldovan Leu
    case 'MC':
      return 'EUR'; // Euro (Monaco uses Euro)
    case 'MN':
      return 'MNT'; // Mongolian Tugrik
    case 'ME':
      return 'EUR'; // Euro (Montenegro uses Euro)
    case 'MA':
      return 'MAD'; // Moroccan Dirham
    case 'MZ':
      return 'MZN'; // Mozambican Metical
    case 'MM':
      return 'MMK'; // Myanmar Kyat
    case 'NA':
      return 'NAD'; // Namibian Dollar
    case 'NR':
      return 'AUD'; // Australian Dollar (Nauru)
    case 'NP':
      return 'NPR'; // Nepalese Rupee
    case 'NL':
      return 'EUR'; // Euro (Netherlands uses Euro)
    case 'NZ':
      return 'NZD'; // New Zealand Dollar
    case 'NI':
      return 'NIO'; // Nicaraguan Córdoba
    case 'NE':
      return 'XOF'; // West African CFA Franc (Niger)
    case 'NG':
      return 'NGN'; // Nigerian Naira
    case 'KP':
      return 'KPW'; // North Korean Won
    case 'NO':
      return 'NOK'; // Norwegian Krone
    case 'OM':
      return 'OMR'; // Omani Rial
    case 'PK':
      return 'PKR'; // Pakistani Rupee
    case 'PW':
      return 'USD'; // United States Dollar (Palau)
    case 'PA':
      return 'PAB'; // Panamanian Balboa
    case 'PG':
      return 'PGK'; // Papua New Guinean Kina
    case 'PY':
      return 'PYG'; // Paraguayan Guarani
    case 'PE':
      return 'PEN'; // Peruvian Sol
    case 'PH':
      return 'PHP'; // Philippine Peso
    case 'PL':
      return 'PLN'; // Polish Zloty
    case 'PT':
      return 'EUR'; // Euro (Portugal uses Euro)
    case 'QA':
      return 'QAR'; // Qatari Riyal
    case 'RO':
      return 'RON'; // Romanian Leu
    case 'RU':
      return 'RUB'; // Russian Ruble
    case 'RW':
      return 'RWF'; // Rwandan Franc
    case 'KN':
      return 'XCD'; // East Caribbean Dollar (Saint Kitts and Nevis)
    case 'LC':
      return 'XCD'; // East Caribbean Dollar (Saint Lucia)
    case 'VC':
      return 'XCD'; // East Caribbean Dollar (Saint Vincent and the Grenadines)
    case 'WS':
      return 'WST'; // Samoan Tala
    case 'SM':
      return 'EUR'; // Euro (San Marino uses Euro)
    case 'ST':
      return 'STN'; // São Tomé and Príncipe Dobra
    case 'SA':
      return 'SAR'; // Saudi Riyal
    case 'SN':
      return 'XOF'; // West African CFA Franc (Senegal)
    case 'RS':
      return 'RSD'; // Serbian Dinar
    case 'SC':
      return 'SCR'; // Seychellois Rupee
    case 'SL':
      return 'SLL'; // Sierra Leonean Leone
    case 'SG':
      return 'SGD'; // Singapore Dollar
    case 'SK':
      return 'EUR'; // Euro (Slovakia uses Euro)
    case 'SI':
      return 'EUR'; // Euro (Slovenia uses Euro)
    case 'SB':
      return 'SBD'; // Solomon Islands Dollar
    case 'SO':
      return 'SOS'; // Somali Shilling
    case 'ZA':
      return 'ZAR'; // South African Rand
    case 'KR':
      return 'KRW'; // South Korean Won
    case 'SS':
      return 'SSP'; // South Sudanese Pound
    case 'ES':
      return 'EUR'; // Euro (Spain uses Euro)
    case 'LK':
      return 'LKR'; // Sri Lankan Rupee
    case 'SD':
      return 'SDG'; // Sudanese Pound
    case 'SR':
      return 'SRD'; // Surinamese Dollar
    case 'SZ':
      return 'SZL'; // Swazi Lilangeni
    case 'SE':
      return 'SEK'; // Swedish Krona
    case 'CH':
      return 'CHF'; // Swiss Franc
    case 'SY':
      return 'SYP'; // Syrian Pound
    case 'TJ':
      return 'TJS'; // Tajikistani Somoni
    case 'TZ':
      return 'TZS'; // Tanzanian Shilling
    case 'TH':
      return 'THB'; // Thai Baht
    case 'TG':
      return 'XOF'; // West African CFA Franc (Togo)
    case 'TO':
      return 'TOP'; // Tongan Paʻanga
    case 'TT':
      return 'TTD'; // Trinidad and Tobago Dollar
    case 'TN':
      return 'TND'; // Tunisian Dinar
    case 'TR':
      return 'TRY'; // Turkish Lira
    case 'TM':
      return 'TMT'; // Turkmenistan Manat
    case 'TV':
      return 'AUD'; // Australian Dollar (Tuvalu)
    case 'UG':
      return 'UGX'; // Ugandan Shilling
    case 'UA':
      return 'UAH'; // Ukrainian Hryvnia
    case 'AE':
      return 'AED'; // United Arab Emirates Dirham
    case 'GB':
      return 'GBP'; // British Pound Sterling
    case 'US':
      return 'USD'; // United States Dollar
    case 'UY':
      return 'UYU'; // Uruguayan Peso
    case 'UZ':
      return 'UZS'; // Uzbekistan Som
    case 'VU':
      return 'VUV'; // Vanuatu Vatu
    case 'VA':
      return 'EUR'; // Euro (Vatican City uses Euro)
    case 'VE':
      return 'VES'; // Venezuelan Bolívar
    case 'VN':
      return 'VND'; // Vietnamese Dong
    case 'YE':
      return 'YER'; // Yemeni Rial
    case 'ZM':
      return 'ZMW'; // Zambian Kwacha
    case 'ZW':
      return 'ZWL'; // Zimbabwean Dollar
    default:
      return null; // Return null or handle undefined cases
  }
};
