# Platform Handling Änderungen

## Datenbank
In der game_list Entität kann per entityValue eine PlatformID mit gespeichert werden

## Frontend
### Oberfläche
User kann beim hinzufügen von Suchergebnissen und auf der GameList Anzeige genau eine Platform auswählen, das getrackte Release Date ändert sich dann auf das Platformspezifische Datum.
Der User kann auf der GameList auf die Ausgewählte Platform klicken um alle Platformen zu deselektieren und wieder das erste Release Datum zu tracken
### API Aufrufe
postUserGames - Wenn Platform ausgewählt wird, muss eine Anfrage an postUserGames gemacht werden entweder nur mit der ID oder ein Objekt mit ID und Platform.

## API
### GameList Einträge
postUserGames - ein Game darf nicht mehr zweimal hinzugefügt werden, wenn die ID bereits existiert und eine Platform mitgegeben wird, muss die ID aus der Datenbank ersetzt wurden durch ein Objekt mit ID und Platform
deleteUserGames - kann momentan nur ID-Einträge aus der Entität löschen, muss daher ebenfalls Objekt Einträge löschen können
### Game Daten aus IGDB
getGameSearch - soll alle Release Dates mit Platform Daten zurückgeben
getUserGames - soll alle Release Dates mit Platform Daten zurückgeben




