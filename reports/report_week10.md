# Info o projekte:
- Meno a priezvisko: Martin Košovský
- Názov projektu: Poľovnícka kniha (Hunting log)
- Link na repozitár:  https://github.com/Martin-SK-PD/Hunting-Log/


# Info o reportovanej verzii:  
- Tag: week10                        
- Obdobie: 10. týždeň, 21.4. - 27.4.2025 

# Plán:
- Nasadiť beta verziu aplikácie na hosting.
- Získať/počkať na spätnú väzbu a začať opravovať prípadné chyby.
- Začať pracovať na možných vylepšeniach na základe spätnej väzby.
- Prejsť jednotlivé stránky a komponenty a prípadne vykonať ďalšie UI a funkčné vylepšenia.


# Vykonaná práca:

- Upravil som API volania, aby používali relatívne cesty kvôli nasadeniu na hosting. (commit 0ec0616)

- Upravil som titulok stránky a cesty k pozadiu, aby boli správne zobrazené aj po nasadení. (commit 6aadc13)

- Nahradil som knižnicu bcrypt verziou bcryptjs, kvôli chybe ktorú Render.com vypisoval pri nasadení. (commit 2251c2c)

- Doplnil som chýbajúce veci/zmeny do súboru database.sql . (commit 32a438a)

- Pridal som pomocný util na prácu s dátumami a časmi, pretože Redner mi vypisoval uložené časy posunuté o dve hodiny. (commit 4aaa84a)

- Aktualizoval som modely pre návštevy a úlovky tak, aby používali nový util. (commit 2b34996)

- Vylepšil som util funkcie aby presnejšie určovali o koľko sa má posunúť čas a taktiež aby sa dali použiť pri filtrovaní návštev a úlovkov. (commit 204efe1)

- Upravil som modely, aby správne filtrovali záznamy podľa posunutého času. (commit 76d171e)

- Upravil som API a volania na domovskej stránke tak, aby sa správne zobrazovali mesačné štatistiky. (commit eb07cc6)

- Pridal som report k beta verzii aplikácie. (commit a124066)



# Zdôvodnenie rozdielov medzi plánom a vykonanou prácou:
- Práca bola splnená podľa plánu.
- Prešiel som jednotlivé stránky a premyslel si ďalšie možné vylepšenia.
- Taktiež som vykonal lokálne pár úprav a vylepšení, ktoré commitnem ďalší týždeň.



# Plán na ďalší týždeň:
- Pokračovať vo vylepšovaní a finalizovaní jednotlivých stránok aplikácie.
- Dokončiť posledné funkčné a vizuálne úpravy pred finálnym nasadením.


# Problémy:
- Ako som už spomenul, vyskytol sa mi problem s posunom času. Všetky uložené časy sa mi na Redner.com zobrazovali o dve hodiny posunuté.
- Problém som vyriešil zavedeným utilu ktorý podľa nasadenia (localhost/Redner) posúva časy o danú hodnotu.
- Taktiež pri nasadzovaní stránky na Render som dostaval chybu spôsobovanú knižnicou bcrypt, no vyriešilo sa to vymenením knižnice za bcryptjs.
- Žiadne iné problémy neboli.


# Zmeny v špecifikácii:
- Žiadne zmeny v špecifikácii.
