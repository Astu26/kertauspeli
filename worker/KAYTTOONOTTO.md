# Kuvista tehtävät kokeet – käyttöönotto

Sovelluksen "📷 Tee uusi koe kuvista" -toiminto tarvitsee pienen palvelinfunktion (Cloudflare Worker), joka lähettää kuvat Claudelle ja tallentaa valmiit kokeet. API-avain on vain palvelimella, ei sovelluksessa.

## Mitä tarvitaan (Aatu tekee itse)

1. **Anthropic API -avain**
   - Kirjaudu osoitteessa https://platform.claude.com (eri tili kuin Claude-tilaus).
   - Osta krediittejä (pienin erä riittää noin kymmeneen koealueeseen, n. 0,50 € / koealue).
   - Aseta kuukausittainen kulukatto: Settings → Limits.
   - Luo avain: Settings → API keys → Create key. Kopioi avain talteen.
2. **Cloudflare-tili** (ilmainen): https://dash.cloudflare.com/sign-up
3. **PIN-koodi**: keksi 4–8-numeroinen koodi. Sillä suojataan kokeiden teko ja poisto, ettei kukaan muu voi käyttää API-avainta.

## Käyttöönotto (Claude tekee, Aatu kirjautuu)

Komennot ajetaan kansiossa `kertauspeli/worker`.

```bash
npm install
npx wrangler login                       # avaa selaimen, Aatu kirjautuu Cloudflareen
npx wrangler kv namespace create PACKS   # tulostaa id:n → wrangler.toml:n kv_namespaces.id
npx wrangler secret put ANTHROPIC_API_KEY   # Aatu liittää avaimen
npx wrangler secret put PARENT_PIN          # Aatu kirjoittaa PIN-koodin
npx wrangler deploy                      # tulostaa osoitteen https://kertauspeli-api.<tunnus>.workers.dev
```

Lopuksi osoite laitetaan `index.html`:n kohtaan `window.KP_API = '...'`, versiotunnus nostetaan ja peli julkaistaan GitHubiin.

## Käyttö

1. Avaa peli, vieritä etusivun alaosaan: **📷 Tee uusi koe kuvista**.
2. Kirjoita aine, valitse kuvat (kirjan sivut järjestyksessä) ja PIN.
3. Odota 1–3 minuuttia. Pidä näyttö päällä.
4. Tarkista kysymykset. Poista ✕-napista virheelliset. 📍 kertoo, mistä kohdasta kysymys on.
5. **Julkaise lapselle**. Koe ilmestyy kaikkiin laitteisiin, joilla peli on auki.

Kokeen voi poistaa: avaa koe → Aikuiselle → Poista tämä koe kaikilta laitteilta.

## Testaus ilman API-avainta

```bash
npm run dev   # testitila: MOCK=1, PIN 1234, ei kutsu Claudea
```
