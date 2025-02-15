// ==UserScript==
// @name          [Pokeclicker] Enhanced Auto Mine
// @namespace     Pokeclicker Scripts
// @author        Ephenia (Credit: falcon71, KarmaAlex, umbralOptimatum, Pastaficionado)
// @description   Automatically mines the Underground with Bombs. Features adjustable settings as well.
// @copyright     https://github.com/Ephenia
// @license       GPL-3.0 License
// @version       2.2.4

// @homepageURL   https://github.com/Ephenia/Pokeclicker-Scripts/
// @supportURL    https://github.com/Ephenia/Pokeclicker-Scripts/issues
// @downloadURL   https://raw.githubusercontent.com/Ephenia/Pokeclicker-Scripts/master/enhancedautomine.user.js
// @updateURL     https://raw.githubusercontent.com/Ephenia/Pokeclicker-Scripts/master/enhancedautomine.user.js

// @match         https://www.pokeclicker.com/
// @icon          https://www.google.com/s2/favicons?domain=pokeclicker.com
// @grant         unsafeWindow
// @run-at        document-idle
// ==/UserScript==

class AutoMiner {
    static sellTreasureState = this.#getLocalStore("autoSellTreasure", false);
    static mineState = this.#getLocalStore("autoMineState", false);
    static smallRestoreState = this.#getLocalStore("autoRestore", false);

    /**
     * Verify if the value is set in local storage and if not, set it
     * @param {string} key The key to check in local storage
     * @param {*} value The value to set in local storage
     * @returns {*} The value in local storage
     */
    static #getLocalStore(key, value) {
        function validParse(key) {
            try {
                if (key === null) {
                    throw new Error();
                }
                JSON.parse(key);
                return true;
            } catch (e) {
                return false;
            }
        }
        if (!validParse(localStorage.getItem(key))) {
            localStorage.setItem(key, value);
        }
        return JSON.parse(localStorage.getItem(key));
    }

    /**
     * Parent class to determine where the button will be displayed
     */
    static #Parent = {
        Header: 0,
        Card: 1,
    };

    /**
     * Display the Auto Mine button in the header
     */
    static #displayAutoMineHeaderButton() {
        document
            .querySelector("#undergroundDisplay")
            .prepend(this.#autoMineStartButton(this.#Parent.Header));
    }

    /**
     * Display the Auto Mine card with the buttons to toggle the Auto Mine and Auto Restore features
     */
    static #displayAutoMineCard() {
        const container = document.createElement("div");
        container.id = "auto-mine-container";
        container.style = "background-color: rgba(0,0,0,.03);";
        container.appendChild(this.#autoMineStartButton(this.#Parent.Card));
        container.appendChild(this.#autoRestoreButton());
        document.querySelector("#dig > div > .card").prepend(container);
    }

    /**
     * Create the button for the Auto Mine feature
     * @param {#Parent} parent where the button will be displayed
     * @returns the button to toggle the Auto Mine feature
     */
    static #autoMineStartButton(parent) {
        const button = document.createElement("button");
        button.id = "auto-mine-start";
        if (parent == this.#Parent.Header) {
            button.className = `col-3 btn btn-${this.mineState ? "success" : "danger"
                }`;
            button.style =
                "position: absolute; top: 0px; left: 0px; width: auto; height: 41px; font-size: 9px;";
        } else if (parent == this.#Parent.Card) {
            button.className = `col-12 col-md-2 btn btn-${this.mineState ? "success" : "danger"
                }`;
        }

        button.textContent = `Auto Mine [${this.mineState ? "ON" : "OFF"}]`;
        button.addEventListener('click', this.#autoMineEventListener);
        return button;
    }

    /**
     * Create the button for the Auto Restore feature
     * @returns {HTMLButtonElement} The button to toggle the Auto Restore feature
     */
    static #autoRestoreButton() {
        const button = document.createElement("button");
        button.id = "small-restore-start";
        button.className = `col-12 col-md-3 btn btn-${this.smallRestoreState ? "success" : "danger"
            }`;
        button.textContent = `Auto Restore [${this.smallRestoreState ? "ON" : "OFF"
            }]`;
        button.addEventListener("click", this.#autoRestoreEventListener);
        return button;
    }

    /**
     * Display the button to toggle the Auto Sell Treasure feature
     */
    static #displayAutoSellTreasureButton() {
        //Creating the button
        const autoSellButton = document.createElement("button");
        autoSellButton.id = "auto-sell-treasure";
        autoSellButton.className = `col-12 col-md-3 btn btn-${this.sellTreasureState ? "success" : "danger"
            }`;
        autoSellButton.textContent = `Auto Sell Treasure [${this.sellTreasureState ? "ON" : "OFF"
            }]`;
        autoSellButton.addEventListener("click", this.#autoSellTreasureEventListener);

        //Creating the card header to hold the button
        const autoSellerHeader = document.createElement("div");
        autoSellerHeader.className = "card-header";
        autoSellerHeader.appendChild(autoSellButton);

        //Creating the card to hold the header
        const autoSellerContainer = document.createElement("div");
        autoSellerContainer.className = "card";
        autoSellerContainer.appendChild(autoSellerHeader);

        //Appending the card to the parent
        document.getElementById("treasures").prepend(autoSellerContainer);
    }

    /**
     * Initialize the Auto Mine feature
     */
    static initAutoMine() {
        this.#displayAutoMineHeaderButton();
        this.#displayAutoMineCard();
        this.#displayAutoSellTreasureButton();
    }

    /**
     * Toggle the Auto Mine feature
     * @param {*} event Click event
     */
    static #autoMineEventListener(event){
        const element = event.target;
        this.mineState = !this.mineState;
        this.mineState ? element.classList.replace("btn-danger", "btn-success") : element.classList.replace("btn-success", "btn-danger");
        element.textContent = `Auto Mine [${this.mineState ? "ON" : "OFF"}]`;
        localStorage.setItem("autoMineState", this.mineState);
    }

    /**
     * Toggle the Auto Mine feature
     * Legacy code
     * @param {*} event Click event
     */
    static #autoRestoreEventListener(event) {
        const element = event.target;
        this.smallRestoreState = !this.smallRestoreState;
        this.smallRestoreState
            ? element.classList.replace("btn-danger", "btn-success")
            : element.classList.replace("btn-success", "btn-danger");
        element.textContent = `Auto Restore [${this.smallRestoreState ? "ON" : "OFF"
            }]`;
        localStorage.setItem("autoRestore", this.smallRestoreState);
    }

    /**
     * Toggle the Auto Sell Treasure feature
     * Legacy code
     * @param {*} event Click event
     */
    static #autoSellTreasureEventListener(event) {
        const element = event.target;
        this.sellTreasureState = !this.sellTreasureState;
        this.sellTreasureState
            ? element.classList.replace("btn-danger", "btn-success")
            : element.classList.replace("btn-success", "btn-danger");
        element.textContent = `Auto Sell Treasure [${this.sellTreasureState ? "ON" : "OFF"
            }]`;
        localStorage.setItem("autoSellTreasure", this.sellTreasureState);
    }
}

//Legacy code

var setThreshold;
var autoMineTimer;
var layersMined;
var treasureHunter;
var itemThreshold;

function initAutoMine() {
    document.getElementById("small-restore").value =
        setThreshold.toLocaleString("en-US");
    document.getElementById("treasure-hunter").value = treasureHunter;
    document.getElementById("item-threshold").value =
        itemThreshold.toLocaleString("en-US");
    setTreasureImage();

    document
        .getElementById("auto-mine-start")
        .addEventListener("click", (event) => {
            startAutoMine(event);
        });
    document
        .getElementById("small-restore-start")
        .addEventListener("click", (event) => {
            autoRestore(event);
        });
    document
        .getElementById("auto-sell-treasure")
        .addEventListener("click", (event) => {
            autoSellTreasure(event);
        });
    document
        .getElementById("treasure-hunter")
        .addEventListener("input", (event) => {
            treasureHunt(event);
        });

    document
        .querySelector("#small-restore")
        .addEventListener("input", (event) => {
            setThreshold = +event.target.value
                .replace(/[A-Za-z!@#$%^&*()]/g, "")
                .replace(/[,]/g, "");
            localStorage.setItem("autoBuyThreshold", setThreshold);
            event.target.value = setThreshold.toLocaleString("en-US");
        });
    document
        .querySelector("#item-threshold")
        .addEventListener("input", (event) => {
            itemThreshold = +event.target.value
                .replace(/[A-Za-z!@#$%^&*()]/g, "")
                .replace(/[,]/g, "");
            localStorage.setItem("itemThreshold", itemThreshold);
            event.target.value = itemThreshold.toLocaleString("en-US");
        });

    addGlobalStyle(
        "#threshold-input { display:flex;flex-direction:row;flex-wrap:wrap;align-content:center;justify-content:space-evenly;align-items:center; }"
    );
    addGlobalStyle(
        "#item-threshold-input { display:flex;flex-direction:row;flex-wrap:wrap;align-content:center;justify-content:space-evenly;align-items:center; }"
    );
    addGlobalStyle("#small-restore { width:150px; }");
    addGlobalStyle("#item-threshold { width:75px; }");

    if (mineState) {
        // Wait a few seconds to not mine before underground is fully loaded
        setTimeout(() => {
            autoMineTimer = setInterval(function () {
                doAutoMine();
            }, 1000);
        }, 5000);
    }
}

function startAutoMine(event) {
    const element = event.target;
    mineState = !mineState;
    mineState
        ? element.classList.replace("btn-danger", "btn-success")
        : element.classList.replace("btn-success", "btn-danger");
    element.textContent = `Auto Mine [${mineState ? "ON" : "OFF"}]`;
    if (mineState) {
        autoMineTimer = setInterval(function () {
            doAutoMine();
        }, 1000); // Happens every 1 second
    } else {
        clearInterval(autoMineTimer);
    }
    localStorage.setItem("autoMineState", mineState);
}

function doAutoMine() {
    const treasureHunting = Math.sign(treasureHunter) >= 0 && itemThreshold > 0;
    const treasureTypes = [
        "Fossils",
        "Evolution Items",
        "Gem Plates",
        "Shards",
        "Mega Stones",
        "Diamond Value",
    ];
    const surveyResult = Mine.surveyResult();
    let treasureAmount;
    if (Mine.loadingNewLayer) {
        // Do nothing while the new layer is loading
        return;
    }
    if (treasureHunting && surveyResult) {
        // Parse survey for the treasure type we want
        try {
            let re = new RegExp(String.raw`${treasureTypes[treasureHunter]}: (\d+)`);
            treasureAmount = +re.exec(surveyResult)[1];
            // Count fossil pieces as fossils
            if (treasureHunter == 0) {
                re = new RegExp(`Fossil Pieces: (\d+)`);
                treasureAmount += +re.exec(surveyResult)[1];
            }
        } catch (err) {
            treasureAmount = 0;
        }
    }
    if (treasureHunting && !surveyResult) {
        // Survey the layer
        mineMain();
    } else if (
        treasureHunting &&
        treasureAmount < itemThreshold &&
        Mine.skipsRemaining() > 0
    ) {
        // Too few of the desired treasure type, skip
        resetLayer();
    } else if (
        !treasureHunting &&
        Mine.itemsBuried() < itemThreshold &&
        Mine.skipsRemaining() > 0
    ) {
        // Too few items, skip
        resetLayer();
    } else {
        // Either the layer meets requirements or we're out of skips
        mineMain();
    }
    if (
        sellTreasureState &&
        layersMined != App.game.statistics.undergroundLayersMined()
    ) {
        Underground.sellAllMineItems();
        layersMined = JSON.stringify(App.game.statistics.undergroundLayersMined());
        localStorage.setItem("undergroundLayersMined", layersMined);
    }

    function mineMain() {
        if (smallRestoreState) {
            if (
                ItemList["SmallRestore"].price() == 30000 &&
                player.itemList["SmallRestore"]() == 0 &&
                App.game.wallet.currencies[GameConstants.Currency.money]() >=
                setThreshold + 30000
            ) {
                ItemList["SmallRestore"].buy(1);
            }
            if (
                Math.floor(App.game.underground.energy) <
                Math.max(App.game.underground.getSurvey_Cost(), Underground.BOMB_ENERGY)
            ) {
                if (player.itemList["LargeRestore"]() > 0) {
                    ItemList["LargeRestore"].use();
                } else if (player.itemList["MediumRestore"]() > 0) {
                    ItemList["MediumRestore"].use();
                } else {
                    ItemList["SmallRestore"].use();
                }
            }
        }
        if (!surveyResult && treasureHunting && Mine.skipsRemaining() != 0) {
            if (
                Math.floor(App.game.underground.energy) >=
                App.game.underground.getSurvey_Cost()
            ) {
                Mine.survey();
                $("#mine-survey-result").tooltip("hide");
            }
            return true;
        } else {
            if (Math.floor(App.game.underground.energy) >= 1) {
                // Get location of all reward tiles
                let rewards = Mine.rewardGrid.flatMap((row, y) => {
                    return row
                        .map((tile, x) => {
                            return tile
                                ? { item: tile.value, revealed: tile.revealed, x: x, y: y }
                                : 0;
                        })
                        .filter((tile) => tile != 0);
                });
                // Calculate number of distinct items visible
                let rewardsSeen = new Set();
                rewards.forEach((tile) => {
                    if (tile.revealed) {
                        rewardsSeen.add(tile.item);
                    }
                });
                if (Mine.itemsBuried() > rewardsSeen.size) {
                    // Use bombs while there are still items left to uncover
                    if (
                        Math.floor(App.game.underground.energy) >= Underground.BOMB_ENERGY
                    ) {
                        Mine.bomb();
                    }
                } else {
                    // All items have at least one tile revealed, let's excavate them
                    if (Mine.toolSelected() != 0) {
                        Mine.toolSelected(Mine.Tool.Chisel);
                    }
                    let tilesToMine = rewards.filter(
                        (tile) => rewardsSeen.has(tile.item) && !tile.revealed
                    );
                    while (
                        tilesToMine.length &&
                        Math.floor(App.game.underground.energy) >= Underground.CHISEL_ENERGY
                    ) {
                        let tile = tilesToMine.pop();
                        Mine.click(tile.y, tile.x);
                    }
                }
            }
        }
    }

    function resetLayer() {
        if (!Mine.loadingNewLayer) {
            Mine.loadingNewLayer = true;
            setTimeout(Mine.completed, 1500);
            if (Mine.skipsRemaining() > 0) {
                GameHelper.incrementObservable(Mine.skipsRemaining, -1);
            }
        }
    }
}

setThreshold = JSON.parse(localStorage.getItem("autoBuyThreshold"));
sellTreasureState = JSON.parse(localStorage.getItem("autoSellTreasure"));
treasureHunter = JSON.parse(localStorage.getItem("treasureHunter"));
itemThreshold = JSON.parse(localStorage.getItem("itemThreshold"));

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName("head")[0];
    if (!head) {
        return;
    }
    style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = css;
    head.appendChild(style);
}

/**
 * Load this script
 * @param {*} scriptName Name of the script
 * @param {*} initFunction Function to run when the game starts
 * @param {*} priorityFunction Function to run before the game starts
 */
function loadEpheniaScript(scriptName, initFunction, priorityFunction) {
    function reportScriptError(scriptName, error) {
        console.error(
            `Error while initializing '${scriptName}' userscript:\n${error}`
        );
        Notifier.notify({
            type: NotificationConstants.NotificationOption.warning,
            title: scriptName,
            message: `The '${scriptName}' userscript crashed while loading. Check for updates or disable the script, then restart the game.\n\nReport script issues to the script developer, not to the Pokéclicker team.`,
            timeout: GameConstants.DAY,
        });
    }
    const windowObject = !App.isUsingClient ? unsafeWindow : window;
    // Inject handlers if they don't exist yet
    if (windowObject.epheniaScriptInitializers === undefined) {
        windowObject.epheniaScriptInitializers = {};
        const oldInit = Preload.hideSplashScreen;
        var hasInitialized = false;

        // Initializes scripts once enough of the game has loaded
        Preload.hideSplashScreen = function (...args) {
            var result = oldInit.apply(this, args);
            if (App.game && !hasInitialized) {
                // Initialize all attached userscripts
                Object.entries(windowObject.epheniaScriptInitializers).forEach(
                    ([scriptName, initFunction]) => {
                        try {
                            initFunction();
                        } catch (e) {
                            reportScriptError(scriptName, e);
                        }
                    }
                );
                hasInitialized = true;
            }
            return result;
        };
    }

    // Prevent issues with duplicate script names
    if (windowObject.epheniaScriptInitializers[scriptName] !== undefined) {
        console.warn(`Duplicate '${scriptName}' userscripts found!`);
        Notifier.notify({
            type: NotificationConstants.NotificationOption.warning,
            title: scriptName,
            message: `Duplicate '${scriptName}' userscripts detected. This could cause unpredictable behavior and is not recommended.`,
            timeout: GameConstants.DAY,
        });
        let number = 2;
        while (
            windowObject.epheniaScriptInitializers[`${scriptName} ${number}`] !==
            undefined
        ) {
            number++;
        }
        scriptName = `${scriptName} ${number}`;
    }
    // Add initializer for this particular script
    windowObject.epheniaScriptInitializers[scriptName] = initFunction;
    // Run any functions that need to execute before the game starts
    if (priorityFunction) {
        $(document).ready(() => {
            try {
                priorityFunction();
            } catch (e) {
                reportScriptError(scriptName, e);
                // Remove main initialization function
                windowObject.epheniaScriptInitializers[scriptName] = () => null;
            }
        });
    }
}

if (!App.isUsingClient || localStorage.getItem("enhancedautomine") === "true") {
    loadEpheniaScript("enhancedautomine", AutoMiner.initAutoMine);
}
