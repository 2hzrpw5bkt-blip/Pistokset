# Pistospäiväkirja

Kotinäytölle asennettava web-sovellus iPhonelle. Ei vaadi App Storea eikä tiliä. Merkinnät
tallentuvat puhelimeen ja synkronoituvat omaan Supabase-tietokantaan salaisen avaimen alla,
joten samat merkinnät näkyvät Safarissa, kotinäytön sovelluksessa ja Macilla. Toimii myös ilman verkkoa.

## Tiedostot

| Tiedosto | Mitä tekee |
|---|---|
| `index.html` | Koko sovellus: ulkoasu, aikataulu, tallennus, varmuuskopio |
| `manifest.json` | Kertoo iPhonelle, että sivun voi asentaa sovelluksena (nimi, kuvake, värit) |
| `supabase.sql` | Tietokannan taulu ja funktiot (ajettu kerran Supabasen SQL-editorissa) |
| `sw.js` | Service worker: tallentaa sovelluksen välimuistiin, jotta se aukeaa ilman verkkoa |
| `icon-*.png` | Kotinäytön kuvakkeet |
| `.nojekyll` | Kertoo GitHub Pagesille, ettei tiedostoja tarvitse käsitellä |

## Asennus iPhonelle

1. Avaa sovelluksen osoite Safarissa.
2. Paina **Jaa**-painiketta (neliö, josta nuoli ylös) ja valitse **Lisää Kotivalikkoon**.
3. Avaa sovellus jatkossa kotinäytön kuvakkeesta – Safarin välilehden sijaan. Kotinäytön
   sovelluksen tiedot säilyvät varmasti; pelkässä Safarissa iOS voi siivota käyttämättömän
   sivun tiedot pois viikon jälkeen.

## Pilvitallennus

Sovellus luo ensimmäisellä avauksella salaisen synkronointiavaimen ja tallentaa merkinnät
sen alle Supabaseen. Toisella laitteella (tai Safarissa vs. kotinäytön sovelluksessa) samat
merkinnät saa näkyviin painamalla **Pilvitallennus → Jaa linkki toiselle laitteelle** ja
avaamalla linkin siellä – tai liittämällä avaimen kohtaan *Käytä toista avainta*.

Supabasen julkinen avain (`SB_KEY`) on tarkoitettu selaimeen. Taulua ei voi lukea suoraan;
ainoa pääsy on funktioiden kautta oikealla synkronointiavaimella. Älä jaa synkronointiavainta.

Alaosassa on lisäksi **Varmuuskopio**: merkinnät voi kopioida tekstinä talteen ja palauttaa.

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
