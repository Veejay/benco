# Benco
Wrapper for Crédit Agricole bank statement extracts

# TODO

- [x] Modularize code
- [x] Hide implementation details in class constants (line separators, etc.)
- [ ] Add configuration for `ReferenceFormatter`
- [ ] See whether or not `streams` make sense for this use case
- [ ] Implement query ability on `TransactionCollection`
- [ ] Add different backends for `TransactionCollection` (HTML, JSON, CSV)
- [ ] Add ability to consolidate *several statements* as on unified source