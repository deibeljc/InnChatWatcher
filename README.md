# InnChatWatcher
Logs all the RSI general chat into a database for later parsing and consumption.

## TODO
- Add usage guide
- Add persistent storage and parsing of incoming messages
  - Parsing:
    - Captures any CIG employee's messages
    - Captures the next ~50 (could be configurable?) messages and mark the CIG
      employee as the parent of that message
    - Store it!
- Expose an API to access messages
