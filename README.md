# Pistospäiväkirja

Kotinäytölle asennettava web-sovellus iPhonelle. Ei vaadi App Storea, tiliä eikä palvelinta:
kaikki merkinnät tallentuvat puhelimeen (localStorage), ja sovellus toimii myös ilman verkkoa.

## Tiedostot

| Tiedosto | Mitä tekee |
|---|---|
| `index.html` | Koko sovellus: ulkoasu, aikataulu, tallennus, varmuuskopio |
| `manifest.json` | Kertoo iPhonelle, että sivun voi asentaa sovelluksena (nimi, kuvake, värit) |
| `sw.js` | Service worker: tallentaa sovelluksen välimuistiin, jotta se aukeaa ilman verkkoa |
| `icon-*.png` | Kotinäytön kuvakkeet |
| `.nojekyll` | Kertoo GitHub Pagesille, ettei tiedostoja tarvitse käsitellä |

## Asennus iPhonelle

1. Avaa sovelluksen osoite Safarissa.
2. Paina **Jaa**-painiketta (neliö, josta nuoli ylös) ja valitse **Lisää Kotivalikkoon**.
3. Avaa sovellus jatkossa kotinäytön kuvakkeesta – Safarin välilehden sijaan. Kotinäytön
   sovelluksen tiedot säilyvät varmasti; pelkässä Safarissa iOS voi siivota käyttämättömän
   sivun tiedot pois viikon jälkeen.

## Merkintöjen varmuuskopio

Merkinnät ovat vain siinä puhelimessa, johon ne on tehty. Sovelluksen alaosassa on
**Varmuuskopio**-osio: *Jaa / kopioi merkinnät* lähettää ne tekstinä esimerkiksi
Muistiinpanoihin, ja *Palauta kopiosta* tuo ne takaisin (esim. uuteen puhelimeen).

## Rytmin muuttaminen

Aikataulu lasketaan `index.html`-tiedoston alussa olevista asetuksista:

```js
var START='2026-09-21';     // ensimmäinen pistospäivä
var RETA_EVERY=5;           // reta joka 5. päivä
var TESTO_PATTERN=[4,4,5];  // testo: välit päivinä, toistuu
```

Rivit jatkuvat automaattisesti 70 päivää eteenpäin, joten päivät eivät lopu kesken.
Yli kaksi viikkoa vanhat rivit piiloutuvat *Näytä aiemmat* -napin taakse.

## Päivittäminen

Kun muutat `index.html`-tiedostoa, nosta myös `sw.js`-tiedoston `CACHE`-versionumeroa
(`pistokset-v1` → `pistokset-v2`), niin puhelin hakee uuden version seuraavalla avauksella.
