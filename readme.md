# Hot or Cold

**Hot or Cold** is a game in which participants use geographic prompts to find each other in the physical world.

By accessing the players' GPS locations, the server identifies each player's nearest neighbor and gives them hints like "Hot" (you're getting closer) and "Cold" (you're getting further away), or letting them know the distance to the nearest neighbor, to aid their search.

Currently, when players end up at the same GPS location, the game notifies them by sending a "Fusion" message.  However, future gameplay will involve players exchanging information with the server to authenticate that they have genuinely found each other, as follows:

1. Player 1 arrives at Player 2's GPS coordinates.
2. Server notifies Player 1 and Player 2 that they have "fusion".
3. Player 1 and Player 2 look for each other.  Possible search gameplay:
   1. Passphrase:
      1. Server sends Player 1 and Player 2 unique passphrase/counterphrase combinations.  
      2. Player 1 and Player 2 wander around asking nearby people their respective passphrases.  
      3. When someone answers with the correct counterphrase, Player 1 and Player 2 know that they have found each other.
   2. Chat:
      1. When players arrive at the same GPS location, chat between them is enabled.
      2. They can use this chat to find each other.
   3. Once found:
      1. At this point, each player can generate a one-time key that the other player can enter, or use a QR code.
      2. If either player submits a correct key, the server identifies them as having successful fusion.
      3. Players are now given their next closest target, and the server no longer identifies them as each other's potential targets.
      4. Players can now choose to search separately, or search as a group.