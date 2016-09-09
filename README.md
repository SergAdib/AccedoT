# AccedoT
Test work (app) for AccedoTV (web dev role)
Task scope: Build a simple VoD application, enabling video watching && scrolling with history.
Built on MEAN stack (Mongo, Node, Express, Angular)
For more information on task pls see 'Accedo FE Developer Test' docx file in rep

Test installation instructions:
> As expected you have node environment with MongoDB, 'express' and 'gulp' globally installed
> 1. Clone repository to destination folder
> 2. Run 'npm install && bower install' (and make a cup of coffee then)
> 3. For the first time run 'gulp first' and then use 'gulp serve'
> 4. To run and work on use 'gulp serve'
> P.S. Nodemon used for server-side script watching/reloading, browsersync for proxying, client server scripts/styles and static processing
> P.P.S. Sometimes nodemon could crash after serious code faults (if you add any to current code, ha-ha) leaving behind port blocked, which prevents running again on this port (:5000 by default). If this occurs (check with lsof) use process soft (-15) kill and run again.

Test app brief description:

1. Server-side defines API (see scheme && stored DB collections examples in MData folder) used by app. Server stores and manages movie list and sessions data (histories) from clients.
2. Client retrieve given movie list from server (here is just static example, different lists use/composing not covered by this test) and compose a 'Carousel' functionality with movie instances (images, details and video available in modal window upon clicking the instance).
3. Client checks local storage for any previous session (history): create a new if no session found or, if one is found, compare it with stored by server and restores histories from stored locally or in server whatever is newest.
4. Every play/pause event triggers storing movie (being viewed at the moment) details in array in local storage session. History is saved on server only upon leaving/closing app to prevent exsessive network activity. Thus, in case if unexpected network error or app crash or anything else prevents session data from storing to server, data still will be available in local storage.
5. Session / History keeps data from viewed movies (just basics, what, when and was it watched in full or stopped at certain time) and user could continue / watch again.
6. Modal window with player contains also some useful details about movie. Player has custom controls (basics) to play/adjust movie.
7. Generally everything is responsive. Meanwhile I didn't put a goal of being pixel perfect etc. Page design is far from masterpiece, only for being more 'presentable' purpose. :) Pretty ugly outlines on some focused elements (buttons, slides, controls) the same - just to use while keyboard events. This could be easily replaced with small advising popups or more presentable outline styles. Also not optimized for mobiles and small tablets landscape layouts and has no touch-sliding in movie carousel, only controls-driven.  Should be fine for desktops/laptops though.
8. Keyboard controls scheme:
> After page loading press 'tab' to focus history button. Easily could be autofocused.
> On page: with arrows (and tab as -> arrow) switch between history, slides and slides controls, and bottom link. Left slide control scrolls slides from left on <- arrow and jumps on first slide when ->; simmentrically same for Right slide control, up and down switch from controls to history or link. 'Enter' acts as should be.
> In history arrows do cycling up/down elememts, 'Enter' to click. 'Esc' to quite history.
> In modal left-right arrows to switch between elements, up-down to adjust (volume, current time), 'Enter' to trigger play/pause and other controls and close button. 'Esc' to quite modal as well.
