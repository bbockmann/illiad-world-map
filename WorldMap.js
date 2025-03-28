/**
 * BOWDOIN COLLEGE INTERLIBRARY LOAN
 * 
 * Javascript for the main logon page map.  
 * expands the logon card and highlights countries and factoids.
 * 
 * Each item in the factoid JSON object is associated with a single country. 
 * Location and institution are straightforward. Item consists of a description and 
 * a bold section. In updateFactoid(), "*"" is replaced by the bolded text. The position key
 * gives percentage coordinates for where to place the factoid. The ID field must match
 * the ID of both the pin and country SVG elements.
 * 
 * @author Ben Bockmann
 * Date: Spring 2024-Spring 2025
 */


// GLOBALS
let DO_HIGHLIGHTING =  true; // When true, cycle through the factoid/country pairs. When false, statically display a single country indicated by country_num
let PARTNER_CLASS = "partner"; // Defined in illiad.css, the class for partner country styles
let NON_PARTNER_CLASS = "non-partner"; // Defined in illiad.css, the class for non-partner country styles
let FACTOID_ELEM; // stores the factoid HTML element
let FACTOID_LIST;  // stores a list of the factoid data
let FACTOID_COUNTRIES; // stores a list of IDs for countries with factoids
let i; // counter for highlight()
let k; // counter for removeHighlight()
let CURR_INTERVAL_ID; // the ID of the current interval, used to stop highlighting

const TO_HIGHLIGHT_ID = "to_highlight"; // the id of the parent element of the countries to highlight
const HIGHLIGHT_CLASS = "highlighted"; // class for the single highlighted country (defined in illiad.css)
const HIGHLIGHT_DURATION = 7000; // the duration of the highlight period (milliseconds)
const MAP_FILEPATH = "pacific_centric_map(v2).svg"; // filepath to the world map .svg file
const FACTOID_FILEPATH = "mapConfig.json"; // filepath to the factoid .json file

// TEST GLOBALS (for use during development)
const TEST_SINGLE_FACTOID = false; // Enable to test factoid placement
let TEST_FACTOID_NUM = 3; // Index of the desired country in the countries list.



$(document).ready(function () {
    
    // Load the map into the "map" element
    fetch(MAP_FILEPATH)
        .then(response => response.text())
        .then(data => {
            let map = document.querySelector(".map");
            map.innerHTML = map.innerHTML + data; // to preserve the HTML for factoid

            let country_elems = map.querySelectorAll('path:not([id*="pin"])');
            for (i = 0; i < country_elems.length; i++) {
                setCountryClass(country_elems[i], NON_PARTNER_CLASS);
                // country_elems[i].classList = [NON_PARTNER_CLASS];
            }
            mapLoadFinished();
        }
    );

    // Add event listeners to the logon element
    const logon_wrap = document.getElementById("logon-wrap");
    const logon_input_wrap = document.querySelector(".logon-input-wrap");
    const logon_inputs = logon_input_wrap.children;

    logon_wrap.addEventListener("mouseenter", () => {
        expandLogon(logon_wrap, logon_input_wrap, logon_inputs);
    }); 

    logon_wrap.addEventListener("focus", () => {
        expandLogon(logon_wrap, logon_input_wrap, logon_inputs);
    });
    
    // Add event listener to the map info element
    let detail = document.getElementById("map-info-detail");
    document.getElementById("map-info-summary").addEventListener("click", () => {
        if (!detail.open) {
            setTimeout( () => {
                detail.removeAttribute("open");
            }, HIGHLIGHT_DURATION);
        }
    });

});

/**
 * Called upon completion of loading in the map svg file. Loads the 
 * mapConfig file, and once completed, calls jsonLoadFinished.
 */
function mapLoadFinished() {
    // Set globals
    FACTOID_ELEM = document.getElementById("factoid");

    // Collect factoids from the JSON file
    fetch(FACTOID_FILEPATH)
        .then(response => response.json())
        .then(data => {
            FACTOID_LIST = data.factoids;
            partner_countries = data.partner_countries;
            for (let i = 0; i < partner_countries.length; i++) {
                let id = partner_countries[i];
                if (document.getElementById(id)) {
                    setCountryClass(document.getElementById(id), PARTNER_CLASS);
                }
                else {
                    console.log(`Unable to locate element for ${id}`);
                }
                // document.getElementById(id).classList = [PARTNER_CLASS];
                // console.log(document.getElementById(id));
            }
            FACTOID_COUNTRIES = data.factoid_countries;
            jsonLoadFinished(partner_countries);
        })
        .catch(error => {
            console.log(error);
        });
}

/**
 * Called when mapConfig is finished loading. 
 * 
 * Picks a random starting point for highlighting, then calls
 * beginHighlight. If screen width is too small, does not highlight,
 * and automatically expands logon card. 
 */
function jsonLoadFinished() {
    // Pick a random starting point for highlighting so that users 
    // are presented with a new country upon each page load.
    let max = FACTOID_COUNTRIES.length;
    let rand = Math.floor(Math.random() * max);
    
    i = rand; // counter for highlight()
    k = rand; // counter for removeHighlight()
    
    if (window.innerWidth  > 850) {
        if (DO_HIGHLIGHTING) {
            beginHighlight();
        }
    } else {
        // Hide factoid when not highlighting
        FACTOID_ELEM.classList = ["hidden"];

        // Add event listeners to the logon element
        const logon_wrap = document.getElementById("logon-wrap");
        const logon_input_wrap = document.querySelector(".logon-input-wrap");
        const logon_inputs = logon_input_wrap.children;
        expandLogon(logon_wrap, logon_input_wrap, logon_inputs);
    }

    //////////// TESTING: Only highlight a single country (for use when determing factoid placement)
    if (!DO_HIGHLIGHTING && TEST_SINGLE_FACTOID) {
        console.log("testing single factoid");
        updateFactoid(FACTOID_COUNTRIES[TEST_FACTOID_NUM]);

        country = document.getElementById(FACTOID_COUNTRIES[TEST_FACTOID_NUM]);

        console.log(country);
        setCountryClass(country, HIGHLIGHT_CLASS);
    }
    ////////////
}

/**
 * Makes an initial call to highlight() to begin displaying factoids. Starts an interval
 * which calls highlight() at the frequency specified by HIGHLIGHT_DURATION.
 */
function beginHighlight() {
    console.log("beginning highlighting");
    highlight(); // initial call so highlighting begins immediately upon page load
    CURR_INTERVAL_ID = setInterval(function () {
        highlight();
    }, HIGHLIGHT_DURATION);
}

/**
 * Stops the highlighting of countries and factoids by breaking
 * the interval that was set in beginHighlight().
 */
function stopHighlight() {
    clearInterval(CURR_INTERVAL_ID);
}

/**
 * Removes the current factoid and stops future highlighting. Expands the logon
 * element and displays the input fields.
 * 
 * @param {HTMLElement} logon_wrap 
 * @param {HTMLElement} logon_input_wrap 
 * @param {HTMLCollection} logon_inputs 
 */
function expandLogon(logon_wrap, logon_input_wrap, logon_inputs) {
    removeHighlight();
    stopHighlight();

    DO_HIGHLIGHTING = false;

    logon_wrap.style.height = "212px";
    logon_wrap.style.width = "300px";
    logon_input_wrap.style.opacity = '1';
    logon_input_wrap.style.margin = "0 0 30px 0";
    logon_inputs[0].style.display = "block";
    logon_inputs[1].style.display = "block";    
}

/**
 * Gets the next country to highlight as indicated by i. If the element type is <path>
 * the country is a single landmass (eg. China or Ireland) and its class can be changed directly.
 * If the element type is <g> (eg. Canada or the U.S.) its child <path> elements must be iterated 
 * through and their classes changed individually. Then, set removeHighlight() to be called
 * in the future. 
 * 
 */
function highlight() {
    if (DO_HIGHLIGHTING) {

        country_to_highlight = document.getElementById(FACTOID_COUNTRIES[i]);
        updateFactoid(FACTOID_COUNTRIES[i]);

        setCountryClass(country_to_highlight, HIGHLIGHT_CLASS);

        // Set removeHighlight() to be called in the future
        setTimeout(function() {
            removeHighlight(FACTOID_COUNTRIES[k]);
        }, (HIGHLIGHT_DURATION - 300));
        i++;

        // Restart the cycle
        if (i == FACTOID_COUNTRIES.length) {
            i = 0;
        }
    } 
}

/**
 * Calls hideFactoid and setCountryClass to hide the factoid
 * element and change the highlighted country color back to
 * PARTNER_CLASS.
 * 
 * If at the end of the factoid list, start over at 0. 
 */
function removeHighlight() {
    if (DO_HIGHLIGHTING) {
        hideFactoid();
        if(window.innerWidth  > 850) {
            country_to_unhighlight = document.getElementById(FACTOID_COUNTRIES[k]);

            setCountryClass(country_to_highlight, PARTNER_CLASS);
        }
        
        k++;
    
        if (k == FACTOID_COUNTRIES.length) {
            k = 0;
        }
    }    
}

/**
 * Changes the class of the specified country to the new class.
 * 
 * @param {object} country the country SVG element
 * @param {string} new_class name of the new CSS class
 */
function setCountryClass(country, new_class) {
    // The country is a single landmass (eg. a single path)

    if (country.tagName == "path") {
        country.classList = [new_class];
    }

    // The country is more than one landmass (eg. islands, territories, etc)
    if (country.tagName == "g") {
        let paths = country.children;
        for (let j = 0; j < paths.length; j++) {
            paths[j].classList = [new_class];
        }
    }
}

/**
 * Displays the factoid element and the associated location pin. Updates the text
 * of the city and country, institution, and description. The item type is displayed in
 * bold by replacing the * in the description. Moves the factoid to the position 
 * specified in the JSON.
 * 
 * @param {object} country_name the name of the country to be highlighted. Corresponds
 * to an id in the factoid list. 
 */
function updateFactoid(country_name) {
    
    curr_factoid = null;

    // Retrieve the metadata via country_name
    found = false;
    for (let i = 0; i < FACTOID_LIST.length; i++) {
        if (FACTOID_LIST[i].id === country_name) {
            curr_factoid = FACTOID_LIST[i];
            found = true;
            break;
        }
    }

    if (!found) {console.log(country_name + " NOT FOUND");}

    FACTOID_ELEM.style.opacity = "1";

    // Update the city pin location
    let coords = curr_factoid.pin_coordinates;
    placePin(parseFloat(coords.lat), parseFloat(coords.long));

    // Update the position
    FACTOID_ELEM.style.bottom = curr_factoid.position.bottom;
    FACTOID_ELEM.style.left = curr_factoid.position.left;

    // Update factoid text
    document.getElementById("factoid-location").innerText = curr_factoid.location;
    document.getElementById("factoid-institution").innerText = curr_factoid.institution;

    let item_descr = curr_factoid.item.description;
    let bold = `<span style='font-weight: bold;'>${curr_factoid.item.bold}</span>`;
    item_descr = item_descr.replace("*", bold);
    document.getElementById("factoid-description").innerHTML = item_descr;
}

/**
 * Hides the factoid element by setting its opacity to 0. Also hides
 * the pin element. 
 */
function hideFactoid() {
    FACTOID_ELEM.style.opacity = "0";
    let pin = document.getElementsByClassName("pin")[0];
    if (pin) {
        pin.setAttribute("class", "hidden");
    }
}

/**
 * Translates the latitude and longitude coordinates into relative points (from bottom 
 * and left, so 0,0 is the bottom left hand corner). The map is projected using the 
 * equirectangular projection, which makes translating coordinates into a relative 
 * system very simple. Every unit of latitude and longitude corresponds to the same 
 * distance unit, regardless of position on the map.
 * 
 * Displays the pin element and updates its position. 
 * 
 * @param {Float} lat the latitude of the pin
 * @param {Float} long the longitude of the pin
 */
function placePin(lat, long) {
    // x = longitude
    // y = latitude
    let left;
    let bottom;

    // get the left position
    if (long < -18 || (lat > 55 && long < -11)) {
        left = (long + 360 + 18.2) / 3.66412;
    } else {
        left = (long + 18.2) / 3.66412;
    }

    // get the bottom position
    bottom = (lat + 56) / 1.396408;

    // round to 4 decimal places
    left = left.toFixed(4);
    bottom = bottom.toFixed(4);
        
    let pin = document.getElementById("pin");
    let styleStr = `bottom: ${bottom}%; left: ${left}%;`;
    pin.setAttribute("style", styleStr); // Set the pin location
    pin.className = "pin"; // Display the pin
}
