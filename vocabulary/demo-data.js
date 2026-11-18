/* Демо-словари. Формат — как в localStorage. Можно править вручную. */
window.DEMO_DATA = {
  "de": [
    {
      "id": "r1", "word": "die Reise", "tr": "путешествие",
      "sections": ["Путешествия"], "subtheme": "Транспорт", "role": "core",
      "level": "A1", "transcription": "ˈʁaɪ̯zə",
      "def": "Поездка куда-либо, обычно с целью отдыха или по делам.",
      "ex": "Unsere Reise war schön.",
      "conjugation": "", "declension": "die Reise, der Reise, die Reise, die Reisen",
      "syn": ["die Fahrt"], "ant": [], "hypo": [], "deriv": ["reisen", "der Reisende"],
      "rel": ["der Urlaub", "buchen"]
    },
    {
      "id": "u1", "word": "der Urlaub", "tr": "отпуск",
      "sections": ["Путешествия", "Работа"], "subtheme": "Отдых", "role": "core",
      "level": "A1", "transcription": "ˈuːɐ̯laʊ̯p",
      "def": "Время отдыха, свободное от работы.",
      "ex": "Ich habe Urlaub.",
      "conjugation": "", "declension": "der Urlaub, des Urlaubs, dem Urlaub, den Urlaub",
      "syn": ["die Ferien"], "ant": [], "hypo": [], "deriv": [],
      "rel": ["die Reise"]
    },
    {
      "id": "f1", "word": "die Fahrt", "tr": "поездка",
      "sections": ["Путешествия"], "subtheme": "Транспорт", "role": "periphery",
      "level": "A1", "transcription": "faːɐ̯t",
      "def": "Процесс перемещения на транспорте.",
      "ex": "Die Fahrt dauert zwei Stunden.",
      "conjugation": "", "declension": "die Fahrt, der Fahrt, die Fahrt, die Fahrten",
      "syn": [], "ant": [], "hypo": ["die Reise"], "deriv": ["fahren"],
      "rel": ["das Auto"]
    },
    {
      "id": "b1", "word": "buchen", "tr": "бронировать",
      "sections": ["Путешествия", "Работа"], "subtheme": "Действия", "role": "core",
      "level": "B1", "transcription": "ˈbuːxn̩",
      "def": "Заранее резервировать место или услугу.",
      "ex": "Ich buche ein Hotel.",
      "conjugation": "ich buche, du buchst, er bucht, wir buchen", "declension": "",
      "syn": ["reservieren"], "ant": ["stornieren"], "hypo": [], "deriv": ["die Buchung"],
      "rel": ["die Reise"]
    },
    {
      "id": "s1", "word": "stornieren", "tr": "отменять",
      "sections": ["Путешествия"], "subtheme": "Действия", "role": "core",
      "level": "B2", "transcription": "ʃtɔʁˈniːʁən",
      "def": "Аннулировать бронирование или заказ.",
      "ex": "Wir mussten stornieren.",
      "conjugation": "ich storniere, du stornierst, er storniert", "declension": "",
      "syn": [], "ant": ["buchen"], "hypo": [], "deriv": ["die Stornierung"],
      "rel": []
    }
  ],
  "en": [
    {
      "id": "e1", "word": "journey", "tr": "путешествие",
      "sections": ["Travel"], "subtheme": "Transport", "role": "core",
      "level": "A2", "transcription": "ˈdʒɜːni",
      "def": "An act of traveling from one place to another.",
      "ex": "It was a long journey.",
      "conjugation": "", "declension": "journey, journeys",
      "syn": ["trip", "travel"], "ant": [], "hypo": [], "deriv": ["journeyer"],
      "rel": ["book", "ticket"]
    },
    {
      "id": "e2", "word": "book", "tr": "бронировать",
      "sections": ["Travel", "Work"], "subtheme": "Actions", "role": "core",
      "level": "A2", "transcription": "bʊk",
      "def": "To reserve in advance.",
      "ex": "I booked a hotel.",
      "conjugation": "I book, you book, he books", "declension": "",
      "syn": ["reserve"], "ant": ["cancel"], "hypo": [], "deriv": ["booking"],
      "rel": ["journey", "flight"]
    }
  ],
  "it": [
    {
      "id": "i1", "word": "il viaggio", "tr": "путешествие",
      "sections": ["Viaggi"], "subtheme": "Trasporto", "role": "core",
      "level": "A1", "transcription": "il ˈvjaddʒo",
      "def": "Spostamento da un luogo a un altro.",
      "ex": "Il viaggio è stato bello.",
      "conjugation": "", "declension": "il viaggio, del viaggio, i viaggi",
      "syn": ["la tratta"], "ant": [], "hypo": [], "deriv": ["viaggiare"],
      "rel": ["prenotare"]
    }
  ],
  "fr": [], "es": [], "ru": []
};