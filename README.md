# Labyrinth Game
============================

Welcome to the Labyrinth Game!
This is a simple HTML5 game using CANVAS and AJAX. Tested and developed in Google Chrome only so far.

# Game description
First, you enter your players' name for starting a new game. You can move across the map using your arrow keys or "wasd"-Keys. While moving there, you can collect items and beat monsters. 
In the navigation you always can have a look at your account and inventory or the settings, highscore and help. 
The goal is to find the escape point to port into a new labyrinth.

# Getting started
* Clone this repository
* Make sure that the folder 'media/game' have permissions to add files with all subfoders
* Enjoy playing

# Settings
Change labyrinth size: Go to the file 'oop/Map.class.php' and change the constants MAP_HEIGHT and MAP_WIDTH to the amount of fields you want to have. Warning: A size with more than 50 * 50 Fields could make the creation of the map very slow.

# Usage examples
Check out my [live version](http://jules-rau.de/projekte/labyrinth) for getting a first impression.

# Licensing
Labyrinth Game is licensed under the [Apache-2.0 license](https://github.com/ammerzone/Labyrinth-Game/blob/master/LICENSE.md)

# Known Bugs
* Mobile device: Navigation (opens to bottom)
* Mobile device: Moving (no action)
* Movement issues in Firefox (and other browsers)
