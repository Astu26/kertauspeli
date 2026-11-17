// Ohjeet ja vastauksen rakenne, joilla Claude tekee koealueen kuvista kertauspaketin.
// Säännöt vastaavat CLAUDE.md:n Kertauspeli-osiota.

export const SYSTEM_PROMPT = `Teet suomenkielisestä koealueesta (oppikirjan sivujen valokuvat) kertauspelin sisältöpaketin alakouluikäiselle lapselle.

EHDOTTOMAT SÄÄNNÖT
1. Kaikki sisältö perustuu vain kuvien aineistoon. Oikea vastaus ja selitys pitää löytyä kuvien tekstistä. Ei yleistietoa, ei omia päätelmiä, ei tulkintoja (esim. "hän oli muuttunut", jos tekstissä ei sanota niin).
2. Käytä kirjan sanamuotoa. Jos kirjassa lukee "äidilleen hyvin rakas", älä kirjoita "äidin suosikki".
3. Pääsisältö = kappaleiden leipäteksti ja Tärkeää-/Muista-/Tiivistelmä-tyyppiset laatikot. Niistä tehdään questions.
4. "Lue lisää" -laatikot ja muut lisätietolaatikot ovat bonusta: niistä tehdään vain bonus_questions ja words-kohtia, joissa bonus=true. Niitä ei käytetä questions-listassa, aikajanassa eikä hahmovihjeissä.
5. Kirjan Tehtävät-osion tietokysymykset (vastaus löytyy tekstistä) tehdään tyypillä "koe". Pohdintatehtävät ja omaa elämää koskevat kysymykset (esim. "Milloin sinusta on tuntunut…", "Pohdi") jätetään kokonaan pois, koska niihin ei ole vastausta aineistossa.
6. Väärät vastausvaihtoehdot saavat olla keksittyjä, mutta niiden pitää olla selvästi vääriä aineiston perusteella. Älä käytä väärinä vaihtoehtoina asioita, jotka aineiston mukaan ovat myös totta.
7. Kieli on selkeää ja lapselle sopivaa. Kysymys on lyhyt. Selitys (explain) on yksi lyhyt lause aineistosta.

KYSYMYSTYYPIT
- "mc": monivalinta. answer = oikea vastaus, wrong = 3 väärää vaihtoehtoa.
- "koe": kuten mc, mutta kirjan Tehtävät-osion tietokysymys.
- "who": "Kuka sanoi?". text = repliikki tai lainaus aineistosta ilman lainausmerkkejä, answer = puhuja, wrong = 3 muuta aineiston henkilöä.
- "tf": totta vai tarua -väite. answer = "Totta" tai "Tarua", wrong = []. Selitys alkaa "Totta!" tai "Tarua!".
- source: lyhyt viite, mistä kohta löytyy (esim. "s. 17, Tärkeää" tai "kuva 3, Lue lisää"). Tämä näytetään vain aikuiselle tarkistusta varten.

MÄÄRÄT
- Jaa aineisto kappaleisiin kirjan otsikoiden mukaan. number = kirjan kappalenumero (0, jos numeroa ei ole). emoji = yksi aiheeseen sopiva emoji.
- Jokaiseen kappaleeseen 8–14 questions-kysymystä, eri tyyppejä sekaisin. Jokaisesta Tärkeää-laatikon kohdasta vähintään yksi kysymys.
- bonus_questions: 0–4 per kappale, vain Lue lisää -laatikoista.
- timeline: 8–15 tapahtumaa aikajärjestyksessä vain, jos aineisto on kertomus tai historiaa. Muuten tyhjä lista.
- characters: vain jos aineistossa on nimettyjä henkilöitä tai hahmoja (4 tai enemmän). clues = 3–4 minämuotoista vihjettä pääsisällöstä, epämääräisestä tarkkaan, eikä nimeä mainita vihjeissä. Muuten tyhjä lista. chapters[].characters = niiden hahmojen nimet, jotka esiintyvät kyseisessä kappaleessa.
- words: 6–12 aineistossa selitettyä käsitettä. definition aineiston sanoin. bonus = true, jos käsite on vain Lue lisää -laatikossa.
- warnings: listaa aikuiselle, jos jokin kuva on epätarkka, teksti on osittain lukukelvoton, sivuja näyttää puuttuvan tai jokin kohta jäi epävarmaksi. Tyhjä lista, jos kaikki oli selvää.

VIERAAT KIELET (englanti, ruotsi, saksa jne.)
Näissä aineissa yllä olevia sääntöjä muutetaan näin:
- Kappaleiden tarinaa ja tapahtumia ei tarvitse osata. Niistä EI tehdä kysymyksiä (ei "Mitä Tom teki?", ei "Kuka sanoi?", ei aikajanaa, ei hahmoja). timeline = [] ja characters = [].
- Tärkeintä ovat sanat ja kielioppiteemat (esim. olla-verbi, prepositiot, monikko, persoonapronominit, kysymyssanat).
- Sanat: ota mukaan kaikki kappaleiden sanalistojen ja sanastojen sanat ja fraasit. words: term = vieraan kielen sana, definition = suomennos kirjan mukaan. Ei määräylärajaa.
- Sanakysymykset molempiin suuntiin: "Mitä on suomeksi 'cat'?" ja "Mitä on englanniksi 'kissa'?". Väärät vaihtoehdot mieluiten muita aineiston sanoja.
- Kielioppikysymykset: aukkolauseita kirjan esimerkkien ja sääntöjen pohjalta (esim. "She ___ happy." → is, wrong: am, are, be). Sääntökysymykset kirjan sanoin (esim. "Mitä olla-verbin muotoa käytetään sanan 'I' kanssa?"). Selitys kertoo säännön lyhyesti kirjan mukaan.
- Jaa chapters kirjan kappaleiden mukaan; jos kielioppiteemalla on oma sivunsa tai laatikkonsa, tee siitä oma chapter (esim. "Olla-verbi"). Kappaleessa 10–20 kysymystä.
- Älä keksi sanoja tai kielioppisääntöjä, joita aineistossa ei ole.

Jos kuvissa ei ole oppimateriaalia, palauta tyhjä chapters-lista ja kerro syy warnings-listassa.

title = lyhyt kuvaava otsikko koealueelle (esim. "Abrahamista Joosefiin"). subtitle = aine, luokka ja kappaleet (esim. "Uskonto, 3. lk · kappaleet 4–10"). subject = aine. emoji = yksi koealueeseen sopiva emoji.`;

const Q = {
  type: 'object', additionalProperties: false,
  required: ['type', 'text', 'answer', 'wrong', 'explain', 'source'],
  properties: {
    type: { type: 'string', enum: ['mc', 'koe', 'who', 'tf'] },
    text: { type: 'string' },
    answer: { type: 'string' },
    wrong: { type: 'array', items: { type: 'string' } },
    explain: { type: 'string' },
    source: { type: 'string' }
  }
};

export const SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['subject', 'title', 'subtitle', 'emoji', 'chapters', 'timeline', 'characters', 'words', 'warnings'],
  properties: {
    subject: { type: 'string' },
    title: { type: 'string' },
    subtitle: { type: 'string' },
    emoji: { type: 'string' },
    chapters: { type: 'array', items: {
      type: 'object', additionalProperties: false,
      required: ['number', 'title', 'emoji', 'characters', 'questions', 'bonus_questions'],
      properties: {
        number: { type: 'integer' },
        title: { type: 'string' },
        emoji: { type: 'string' },
        characters: { type: 'array', items: { type: 'string' } },
        questions: { type: 'array', items: Q },
        bonus_questions: { type: 'array', items: Q }
      }
    } },
    timeline: { type: 'array', items: { type: 'string' } },
    characters: { type: 'array', items: {
      type: 'object', additionalProperties: false,
      required: ['name', 'emoji', 'clues'],
      properties: { name: { type: 'string' }, emoji: { type: 'string' }, clues: { type: 'array', items: { type: 'string' } } }
    } },
    words: { type: 'array', items: {
      type: 'object', additionalProperties: false,
      required: ['term', 'definition', 'bonus'],
      properties: { term: { type: 'string' }, definition: { type: 'string' }, bonus: { type: 'boolean' } }
    } },
    warnings: { type: 'array', items: { type: 'string' } }
  }
};

export function userText({ subject, title, notes, count }) {
  return [
    subject ? `Aine: ${subject}` : '',
    title ? `Koealueen nimi (aikuisen antama): ${title}` : '',
    notes ? `Aikuisen lisätiedot: ${notes}` : '',
    `Yllä on ${count} kuvaa koealueesta järjestyksessä. Tee niistä kertauspaketti ohjeiden mukaan.`
  ].filter(Boolean).join('\n');
}

// Testitila (MOCK=1): pieni esimerkkipaketti ilman API-kutsua
export const MOCK_DRAFT = {
  subject: 'Testi', title: 'Testikoe', subtitle: 'Testiaine · kappale 1', emoji: '🧪',
  chapters: [{ number: 1, title: 'Testikappale', emoji: '🧪', characters: [],
    questions: [
      { type: 'mc', text: 'Mikä on testikysymys?', answer: 'Tämä', wrong: ['Tuo', 'Joku muu', 'Ei mikään'], explain: 'Tämä on testi.', source: 'kuva 1' },
      { type: 'tf', text: 'Tämä on testi.', answer: 'Totta', wrong: [], explain: 'Totta! Tämä on testi.', source: 'kuva 1' },
      { type: 'koe', text: 'Miksi testataan?', answer: 'Jotta virheet löytyvät', wrong: ['Huvin vuoksi', 'Ei mistään syystä', 'Koska on pakko'], explain: 'Testillä löydetään virheet.', source: 'kuva 1, Tehtävät' }
    ],
    bonus_questions: [{ type: 'mc', text: 'Mikä on bonuskysymys?', answer: 'Lisätieto', wrong: ['Pääasia', 'Koe', 'Virhe'], explain: 'Bonus tulee Lue lisää -laatikosta.', source: 'kuva 1, Lue lisää' }]
  }],
  timeline: [], characters: [],
  words: [{ term: 'Testi', definition: 'Kokeilu, jolla tarkistetaan', bonus: false }],
  warnings: ['Tämä on testitila: tekoälyä ei kutsuttu.']
};
