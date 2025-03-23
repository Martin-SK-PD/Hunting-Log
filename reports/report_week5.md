# Info o projekte:
- Meno a priezvisko: Martin Košovský
- Názov projektu: Poľovnícka kniha (Hunting log)
- Link na repozitár:  https://github.com/Martin-SK-PD/Hunting-Log/

# Info o reportovanej verzii:  
- Tag: week5                       
- Obdobie: 5. týždeň, 17.3. - 23.3.2025 

# Plán:
- Implementovať registráciu a prihlásenie používateľa vrátane bezpečného ukladania hesiel.
- Vytvoriť mechanizmus prístupu k jednotlivým častiam aplikácie podľa roly používateľa – poľovník a správca uvidia iba stránky, ku ktorým budú mať prístup.


# Vykonaná práca:
- Vytvoril som základnú štruktúru backendu pomocou express-generator. (commit 2844647)

- Navrhol som SQL schému databázy, ktorá zahŕňa všetky potrebné tabuľky a ENUM typy definované v špecifikácii. (commit 886cebf)

- V špecifikácii som názov tabuľky user zmenil na users, aby nedochádzalo ku konfliktu s rezervovaným kľúčovým slovom v PostgreSQL. (commit 535c07f)

- Vytvoril som pripojenie na databázu PostgreSQL. (commit f09839d)

- Pridal som utilitu na generovanie JWT tokenov, ktorá bude slúžiť na autentifikáciu používateľov. (commit 5537238)

- Implementoval som backendovú route pre registráciu používateľa, ktorá zahŕňa hashovanie hesla a uloženie údajov do databázy. (commit c4a1efc)

- Upravil som registračný formulár na fronte tak, aby zhromaždil všetky požadované údaje a posielal ich na backend. (commit 1f03d76)

- Implementoval som backendovú route pre prihlásenie používateľa. (commit 12407c8)

- Pridal som backendovú route na overenie JWT tokenu a zistenie identity prihláseného používateľa. (commit c24ce4a)

- Vytvoril som komponent AuthContext, ktorý spravuje stav autentifikácie používateľa na frontende. (commit b5d5458)

- Pridal som logiku na spracovanie prihlásenia na strane klienta. (commit 69f879a)

- Implementoval som komponent ProtectedRoute, ktorý zabezpečuje prístup k stránkam podľa roly používateľa. (commit 1c08892)

- Upravil som navigáciu tak, aby sa menila podľa toho, či je používateľ prihlásený a akú má rolu. (commit 4c9656d)



# Zdôvodnenie rozdielov medzi plánom a vykonanou prácou:
- Všetky naplánované úlohy boli splnené.
- Práca prebehla bez oneskorenia a v súlade s harmonogramom.
- Navyše popri práci na registrácii a autentifikácii som doplnil aj databázové tabuľky pre návštevy, úlovky, štruktúry, oznamy a oblasti.
  Keďže som už pracoval so schémou používateľov a revírov, bolo jednoduchšie teraz spraviť aj zvyšok databázy.



# Plán na ďalší týždeň:
- Implementovať funkcionalitu na zaznamenávanie návštev a úlovkov.
- Upraviť jednotlivé tabuľky/stránky tak, aby používateľ videl iba údaje zo svojho revíru a mohol pridávať záznamy len do revíru, do ktorého patrí.


# Problémy:
- Narazil som na problém s názvom tabuľky user, kedže toto slovo je rezervované v PostgreSQL - problém bol vyriešený premenovaním tabuľky na users.
- Vyskytli sa drobné komplikácie pri nastavovaní routovania pre registráciu a prihlásenie na backendovej strane, ako aj pri odosielaní údajov z frontendu - išlo najmä o preklepy, nesprávne importy a menšie nezrovnalosti v dátach.
- Na fronte som riešil problémy s autentifikáciou - konkrétne s uchovaním stavu prihlásenia používateľa a správnym presmerovaním podľa jeho roly.
- Všetky uvedené problémy sa podarilo vyriešiť a aplikácia momentálne funguje podľa očakávaní.


# Zmeny v špecifikácii:
- Zmenil som názov tabuľky 'user' na 'users', pretože som pri implementácii zistil, že user je rezervované slovo v PostgreSQ.
- Žiadné iné zmeny neboli.
 

