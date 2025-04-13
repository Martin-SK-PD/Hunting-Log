# Info o projekte:
- Meno a priezvisko: Martin Košovský
- Názov projektu: Poľovnícka kniha (Hunting log)
- Link na repozitár:  https://github.com/Martin-SK-PD/Hunting-Log/


# Info o reportovanej verzii: 
- Tag: week8                        
- Obdobie: 8. týždeň, 7.4. - 13.4.2025 

# Plán:
- Implementovať pridávanie, úpravu a mazanie oznamov pre administrátora.
- Vytvoriť domovskú stránku, ktorá bude zobrazovať oznamy a ďalší obsah.
- Upraviť zobrazovanie záznamov návštev a úlovkov tak, aby sa zobrazovali po jednotlivých dňoch a implementovať základné filtrovanie záznamov.


# Vykonaná práca:
- Pridal som domovskú stránku, na ktorej sa zobrazujú oznamy, posledná návšteva, plánované návštevy 
  a štatistiky úlovkov používateľa za posledný mesiac. (commit a101639)

- Vytvoril som model pre správu oznamov - vytvorenie oznamu, úprava a mazanie. (commit 6d06b25)

- Pridal som API cesty pre manipuláciu s oznamami. (commit 00c29ca)

- Vytvoril som formulár, pomocou ktorého sa dajú pridávať a upravovať oznamy. (commit dd5ee28)

- Upravil som komponent announcement tak, aby admin mohol vytvárať/upravovať oznamy a aby sa oznamy 
  ukladali a načítavali z databázy. (commit 07a682c)

- Pridal som nový komponent date navigator, ktorý umožňuje na stránkach zobrazovať/filtrovať 
  záznamy podľa daného dňa alebo mesiaca. (commit c5a924f)

- Vytvoril som filter komponent pre návštevy. (commit 57d40bc)

- Vytvoril som filter komponent pre úlovky. (commit c0c1adb)

- Upravil som model a API pre návštevy - pridal som filtrovanie, načítanie plánovaných návštev a poslednej návštevy. (commit 9bc4f21)

- Upravil som model a API pre úlovky - pridal som filtrovanie a mesačné štatistiky. (commit 6d6b8b8)

- Upravil som stránku návštev, aby používala filtre a date navigator. (commit a4c66fd)

- Upravil som stránku úlovkov, aby používala filtre a date navigator. (commit 1acf507)

- Pridal som favicon a spravil drobné vizuálne úpravy na domovskej stránke. (commit eb47d2c)


# Zdôvodnenie rozdielov medzi plánom a vykonanou prácou:
- Všetky naplánované úlohy boli splnené a práca prebehla bez oneskorenia.

# Plán na ďalší týždeň:
- Finalizovať hlavnú funkcionalitu (zaznamenávanie/upravovanie/mazanie návštev a úlovkov) a otestovať funkčnosť všetkých častí.
- Vykonať drobné vizuálne vylepšenia - napríklad rozloženie/zobrazenie filtrov a prispôsobiť niektoré komponenty na menšie obrazovky.
- Nasadiť beta verziu aplikácie na hosting


# Problémy:
- Vyskytol sa problém so zobrazením filtrov na menších obrazovkách – zaberajú príliš veľa miesta a komplikujú manipuláciu s hlavným obsahom.
- Riešil som drobné problémy so správnym odosielaním filtrov na backend a ich následným spracovaním - túto časť sa podarilo úspešne vyriešiť. 


# Zmeny v špecifikácii:
- Žiadne zmeny v špecifikácii.
 

