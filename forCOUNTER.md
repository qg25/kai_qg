# Counter

## updateInventory() => counter.js Ln 97

- Ln 110 **FOR-loop** updates all medicine to DB.
  If that ajax were to put in Ln 101 **FOR-loop** instead to update that particular medicine still works the same?

### Upon Completion

- **zero** medicine chosen (paitent dont want) => DB deduct medicine
  Esomeprazole, 10 - minus 10 to DB
  Amoxicillin, 20 - minus 60 to DB

  **if paitent choose both medicine**
  Esomeprazole, 10 - minus 10 to DB (correct)
  Amoxicillin, 20 - becomes 2025
  Diclofenac, 0 - becomes 2105

<!-- ## Timer clock

- remove seconds? (performance based on different laptop. mine poor performance therefore could not update per seconds)
**Ignored, i'm calling every 5 seconds**

## Scan Pass

- the clickable indication appears for the whole row but its only clickable at the "card"
  **Fixed**

## counter.js

- Ln 111 => name is empty so it will return false and could not go in IF statement to update the inventory DB
  **Fixed**

## Instructions

- when Help is clicked and exited from help, the Exit button no longer working unless going to the
  next page to reactive the exit button.
  **Cannot replicate**

- my laptop need to scroll down, to read all. the EXIT and HELP will follow but could not be click if its scrolled down
  **I changed laptop scaling from 125% (Windows recommandation) to 100% then dont have scrolling already.**
  Cannot replicate -->
