# Info o projekte:
- Meno a priezvisko: Martin Košovský
- Názov projektu: Poľovnícka kniha (Hunting log)
- Link na repozitár:  https://github.com/Martin-SK-PD/Hunting-Log/

# Info o reportovanej verzii:  
- Tag: week6                       
- Obdobie: 6. týždeň, 24.3. - 30.3.2025 


# Plán:
- Implementovať funkcionalitu na zaznamenávanie návštev a úlovkov.
- Upraviť jednotlivé tabuľky/stránky tak, aby používateľ videl iba údaje zo svojho revíru a mohol pridávať záznamy len do revíru, 
  do ktorého patrí.



# Vykonaná práca:

- Odstránil som súbor .env z repozitára, vytvoril gitignore a aktualizoval som tajné kľúče, aby neboli verejne dostupné. (commit d07e81c)

- Vytvoril som middleware na overovanie autorizačného tokenu aby som zabezpečil prístup k backendovým endpointom. (commit 749caf5)

- Implementoval som backendový model pre prácu s návštevami používateľa - vkladanie nových návštev, úprava 
  a vybratie návštev z databázy. (commit ba57c56)

- Vytvoril som backendové API s cestami na obsluhu operácií návštev. (commit 632a1a1)

- Vytvoril som backendový model pre prácu s úlovkami – vkladanie nových záznamov a ich získavanie z databázy. (commit e09d3f4)

- Implementoval som backendové API s routami pre operácie s úlovkami. (commit f034d23)

- Pridal som backendovú route na načítanie oblastí v revíri. (commit 29f4ae3)

- Pridal som backendovú route, ktorá vracia štruktúry v danej oblasti. (commit a6e0a23)

- Vytvoril som modal komponent, ktorý bude zobrazovať formuláre na zápis návštev a úlovkov. (commit 3877338)

- Vytvoril som formulár pre vytváranie a úpravu návštev. (commit b66b849)

- Vytvoril som formulár pomocou ktorého poľovník zapíše údaje o úlovku. (commit e242306)

- Vytvoril som komponent tabuľky návštev, ktorý vie podľa veľkosti obrazovky správne zobraziť zaznamenané návštevy 
  prihláseného používateľa. (commit 0201bec)

- Vytvoril som komponent tabuľky úlovkov, ktorý zobrazuje záznamy o ulovenej zveri. (commit 0646cf5)

- Upravil som stránku so záznamami o návštevách tak, aby používala komponent tabuľky návštev a príslušný formulár. (commit de8c20e)

- Upravil som stránku so záznamami o úlovkoch tak, aby používala nový komponent tabuľky úlovkov. (commit e38b33b)




# Zdôvodnenie rozdielov medzi plánom a vykonanou prácou:
- Všetky naplánované úlohy boli splnené.
- Práca prebehla bez oneskorenia a v súlade s harmonogramom.

# Plán na ďalší týždeň:
- Vytvoriť stránky, ktoré umožnia administrátorovi pridávať/upravovať oblasti a štruktúry v revíri, a taktiež pridávať oznamy.
- Vytvoriť alebo navrhnúť mechanizmus, ako môže administrátor odovzdať svoju rolu inému používateľovi v rámci toho istého revíru.


# Problémy:
- Pri vkladaní do tabuliek návštev sa občas záznamy vložili duplicitne. To sa vyriešilo pozmenením komponentu.
- Menšie problémy pri úpravách vložených návštev - niektoré povolené zmeny sa ešte nevykonajú  
  alebo vypíšu, že sa úspešne vykonali aj keď nič nezmenili (treba prejsť jednotlivé kroky/kontroly, ktoré sa vykonávajú pri zmene záznamu).


# Zmeny v špecifikácii:
- Do tabuľky visits som pridal stĺpec, v ktorom sa ukladá dátum a čas poslednej úpravy záznamu. 
  Táto informácia sa zobrazuje aj na stránke používateľovi. 
  Túto zmenu som však ešte nestihol do pdf špecifikácie zapísať. 
 

