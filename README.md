# getWikiCAS
## Purpose
To get CAS number from wikipedia page

## How to use
This is created to be used in google sheet.
Copy the content of `getWikiCAS.js` into script editor of active google sheet (Tools>Script editor).
Then use any of the following formula.

    =getWikiCAS("ethanol")

    =getWikiCAS(A2)
	
## Supports

- redirect page from wikipedia
- retrieve multiple CAS number and automatically choose the one with the shortest length