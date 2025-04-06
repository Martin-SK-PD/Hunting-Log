# Info o projekte:
- Meno a priezvisko: Martin Košovský
- Názov projektu: Poľovnícka kniha (Hunting log)
- Link na repozitár:  https://github.com/Martin-SK-PD/Hunting-Log/


# Info o reportovanej verzii:  
- Tag: week7                      
- Obdobie: 7. týždeň, 31.3. - 6.4.2025 

# Plán:
- Vytvoriť stránky, ktoré umožnia administrátorovi pridávať/upravovať oblasti a štruktúry v revíri, a taktiež pridávať oznamy.
- Vytvoriť alebo navrhnúť mechanizmus, ako môže administrátor odovzdať svoju rolu inému používateľovi v rámci toho istého revíru.



# Vykonaná práca:
- Vytvoril som model, ktorý mi umožňuje narábať s používateľmi. (commit d2e6cfc)

- Pridal som backendovú API s cestami pre správu používateľov. (commit 86e73aa)

- Vytvoril som model, ktorý mi umožňuje spravovať poľovnícke oblasti. (commit 33d1e2e)

- Vytvoril som model pre správu poľovníckych štruktúr. (commit 6716874)

- Aktualizoval som API pre poľovné oblasti tak, aby využívalo funkcie z modelu. (commit 4e2971b)

- Vytvoril som formulár pre pridávanie a úpravu poľovných oblastí. (commit dfda2de)

- Vytvoril som formulár pre pridávanie a úpravu poľovníckych štruktúr. (commit 7874e09)

- Vytvoril som komponent pre potvrdenie vymazania, ktorý sa dá použiť na potvrdenie vymazania oblasti, štruktúry, návštevy a úlovku. (commit 348751d)

- Vytvoril som frontendovú stránku, ktorá zobrazuje členov revíru a umožňuje adminovi predať jeho rolu admina inému členovi. (commit 17c6877)

- Aktualizoval som API pre štruktúry tak, aby používalo funkcionalitu z modelu namiesto priameho SQL. (commit 6c4340b)

- Vytvoril som stránku pre správu oblastí a štruktúr v rámci revíru. (commit 332d26d)

- Rozšíril som backendové API pre návštevy a úlovky o možnosť ich mazania a úpravy. (commit b841684)

- Upravil som stránku návštev tak, aby správca mohol mazať záznamy. (commit 7e509e4)

- Aktualizoval som model a API pre návštevy tak, aby vedeli správne a bez chýb upravovať a mazať záznamy. (commit 930a0b0)

- Aktualizoval som model a API pre úlovky, aby sa správne kontroloval/validoval času úlovku a aby sa mohol záznam zmeniť/vymazať. (commit 8058384)

- Upravil som komponenty súvisiace so zobrazením úlovkov na fronte tak, aby administrátor mohol záznamy upravovať aj mazať. (commit 37c12f4)




# Zdôvodnenie rozdielov medzi plánom a vykonanou prácou:
- Väčšina naplánovanej práce bola úspešne dokončená.
- Nestihol som implementovať funkcionalitu pre správu oznamov, keďže som sa musel venovať diplomovke a práci na magisterskom projekte.
- Oznamy budú aj tak nakoniec súčasťou domovskej stránky, ktorá ešte nie je implementovaná – plánujem ju spraviť v priebehu budúceho týždňa.


# Plán na ďalší týždeň:
- Implementovať pridávanie, úpravu a mazanie oznamov pre administrátora.
- Vytvoriť domovskú stránku, ktorá bude zobrazovať oznamy a ďalší obsah.
- Upraviť zobrazovanie záznamov návštev a úlovkov tak, aby sa zobrazovali po jednotlivých dňoch a implementovať základné filtrovanie záznamov.


# Problémy:
- Vyskytli sa drobné problémy pri nastavovaní ciest pre mazanie a úpravu záznamov.
- V modeloch som riešil menšie komplikácie s funkciami, ktoré majú overovať oprávnenie používateľa 
  na úpravu alebo mazanie záznamov.
- Problémy sa však podarilo úspešne vyriešiť.

# Zmeny v špecifikácii:
- Žiadne zmeny v špecifikácii.
 

