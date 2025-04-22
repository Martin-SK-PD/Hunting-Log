# Info o projekte:
- Meno a priezvisko: Martin Košovský
- Názov projektu: Poľovnícka kniha (Hunting log)
- Link na repozitár:  https://github.com/Martin-SK-PD/Hunting-Log/
- Link na verejnú inštanciu projektu: https://hunting-log.onrender.com/


# Info o reportovanej verzii:
- Tag: beta   


# Info k testovaniu:     

- Pre účely testovania bol vytvorený revír s kódom 12345.
- Tento revír obsahuje:
    - niekoľko zadaných oblastí
    - zaznamenané návštevy v období 17. 4. 2025 – 26. 4. 2025
    - niekoľko úlovkov pre mesiac apríl


- Testovacie účty pre tento revír:

    Admin/správca revíru:
    - email: lovec.admin@lovec.com
    - prihlasovacie meno: LovecAdmin
    - heslo: lovecadmin

    Poľovníci:
    - email: lovec1@lovec.com
    - prihlasovacie meno: Lovec1
    - heslo: lovec1

    - email: lovec2@lovec.com
    - prihlasovacie meno: Lovec2
    - heslo: lovec2

    - email: lovec3@lovec.com
    - prihlasovacie meno: Lovec3
    - heslo: lovec3

    - email: lovec4@lovec.com
    - prihlasovacie meno: Lovec4
    - heslo: lovec4

    - Môžete si vytvoriť aj vlastný účet pre testovací revír pomocou registrácie. 
      Pri registrácii je potrebné zadať číslo revíru 12345.


- Dodatočné informácie:
    - Prvé prihlásenie na Redneri bude pravdepodobne pomalé. 
    - V aplikácii je možné vytvárať aj nové revíry a nových používateľov.
    - Pri registrácii nového revíru (teda pri registrácii nového správcu revíru) prosím použite náhodné maximálne 4-ciferné číslo, 
      aby sa nezasahovalo do existujúcich reálnych čísel revírov.
    - Pri testovaní funkcie presunu správcovskej roly prosím o navrátenie roly pôvodnému správcovi (LovecAdmin) po skončení testovania.


# Postup, ako rozbehať vývojové prostredie 

- Naklonujte si repozitár z GitHubu pomocou príkazu: git clone https://github.com/Martin-SK-PD/Hunting-Log/

- V PostgreSQL vytvorte databázu a príslušné tabuľky pomocou súboru database.sql, ktorý sa nachádza v priečinku my-app-be.

- Do priečinka my-app-be pridajte súbor .env s nasledovnými premennými:

    - jwtSecret = "secret"          # ľubovolný tajný reťazec použitý na podpisovanie JWT tokenov
    - host = "localhost"            # alebo podľa vašich nastavení
    - user = ""                     # doplniť podľa vašich nastavení
    - password = ""                 # doplniť podľa vašich nastavení
    - dbport = ""                   # doplniť podľa vašich nastavení
    - database = "Hunting_log"      # alebo názov vašej databázy
    - IS_RENDER = "false"           # pre lokálny vývoj


- Následne v priečinkoch my-app-be a my-app-fe spustite príkaz: npm install

- V priečinku my-app-be spustite backend pomocou: npm run dev
- V priečinku my-app-fe spustite frontend pomocou: npm run dev

- Aplikácia by následne mala bežať na:
    - Backend: http://localhost:3000
    - Frontend: http://localhost:5173



# Stav implementácie:

- Sú implementované všetky funkcionality:
    - zaznamenávanie a upravovanie návštev (poľovník môže upravovať len svoje návštevy, správca všetky)
    - mazanie návštev (len správca revíru)
    - zaznamenávanie a upravovanie úlovkov  (poľovník môže upravovať len svoje úlovky, správca všetky)
    - mazanie úlovkov (len správca revíru)
    - zaznamenávanie, upravovanie a mazanie oznamov (len správca revíru)
    - presunutie funkcie admina/správcu revíru na iného používateľa 



# Časový plán:

- týždeň 10:
    - Počkať na spätnú väzbu z betaverzie, začať opravovať nájdené chyby a pracovať na odporúčaných zmenách/vylepšeniach.
    - Vyskúšať doriešiť problém s posunom času.
    - Zamerať sa na vylepšenia používateľského rozhrania na veľkých aj malých zariadeniach.


- týždeň 11:
    - Finalizovať posledné vylepšenia a doladiť vzhľad aj funkčnosť aplikácie.
    - Nasadiť final verziu aplikácie na hosting.



# Problémy:
- Vyskytol sa jeden problém s posúvaním časov. Render používa iné časové pásmo ako lokálne prostredie, 
  čo spôsobovalo posun uložených časov o dve hodiny. 
- Tento problém som dočasne vyriešil pomocou utilu s funkciou adjustDateIfNeeded, ktorá zabezpečuje 
  spracovanie dátumov a časov v závislosti od prostredia.
