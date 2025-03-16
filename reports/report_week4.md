# Info o projekte:
- Meno a priezvisko: Martin Košovský
- Názov projektu: Poľovnícka kniha (Hunting log)
- Link na repozitár:  https://github.com/Martin-SK-PD/Hunting-Log/

# Info o reportovanej verzii:  
- Tag: week4                        
- Obdobie: 4. týždeň, 10.3. - 16.3.2025 

# Plán:
- Definovať vizuálne rozloženie a štruktúru hlavných obrazoviek aplikácie (login, dashboard, registračný formulár)
- Implementovať úvodné komponenty stránok s dočasným obsahom a funkčnou navigáciou medzi stránkami



# Vykonaná práca:

- Vytvoril som základnú štruktúru aplikácie pomocou React a Vite. (commit 2246c56)

- Implementoval som komponent pre navigačný panel s odkazmi na jednotlivé základné podstránky a komponent päty (footer).
  Tieto dva komponenty sa budú zobrazovať na každej stránke. (commit 907af17)

- Vytvoril som kompent layout, ktorý spája hlavičku, obsah a pätu. Zároveň som pridal úvodnú stránku s prihlasovacím formulárom 
  a odkazom na registračný formulár. (commit aecf621)

- Pripravil som stránku so záznamami návštev. Obsahuje dočasnú tabuľku s údajmi a oznamami. (commit f1928e1)

- Vytvoril som samostatný komponent announcement card, keďže chcem aby sa oznamy zobrazovali na viacerých stránkach. (commit 7ae32af)

- Navrhol som stránku so záznamami úlovkov, použil som rovnaké rozloženie ako pri návštevách, ale upravil som stĺpce tabuľky. (commit 8ded4dd)

- Na základe spätnej väzby som aktualizoval špecifikáciu. (commit d535e29)

- Navrhol som registračnú stránku, ktorá umožní registráciu poľovníka/správcu revíru. (commit 731faf0)




# Zdôvodnenie rozdielov medzi plánom a vykonanou prácou:
- Všetky naplánované úlohy boli splnené.  
- Práca prebehla bez oneskorenia a v súlade s harmonogramom.



# Plán na ďalší týždeň:
- Implementujem registráciu a prihlásenie používateľa vrátane bezpečného ukladania hesiel.
- Vytvorím mechanizmus prístupu k jednotlivým častiam aplikácie podľa roly používateľa – poľovník a správca uvidia iba stránky, ku ktorým budú mať prístup.



# Problémy:
- Žiadne závažné technické problémy.
- Menšie problémy s Bootstrap gridom a zobrazovaním tabuliek na menších obrazovkách (mobiloch) - ešte bude treba doladiť.



# Zmeny v špecifikácii:
Na základe spätnej väzby boli zapracované nasledovné úpravy:
- Doplnená tabuľka 'Announcements' do dátového modelu.
- Tabuľky "User", "Hunting_grounds" a "User_hunting_ground" sa budú napĺňať počas registrácie používateľov (detaily v Specification.pdf)
- V tabuľke "Visits" bol odstránený nadbytočný atribút 'hunting_ground_id' a pridaný constraint pre atribút 'structure'
- Pridaná väzba medzi tabulkami "Visits" a "Hunting_record", čím sa zabezpečí prepojenie úlovku s konkrétnou návštevou. Doplnili sa taktiež predpokladané constraints:
    - Úlovok musí patriť k návšteve, ktorej účel bol „hunting“
    - Čas strelenia musí byť v intervale trvania danej návštevy