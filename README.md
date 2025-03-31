# Bowdoin Interlibrary Loan Worldmap Logon Page

## Author
[Ben Bockmann](https://github.com/bbockmann)

## View
This project can be viewed at [illiad.bowdoin.edu](https://illiad.bowdoin.edu/).

## About
This project consists of a few main components: an SVG map, JavaScript, a json configuration file, HTML, and CSS. The files container in this GitHub repo are sufficient to fully implement the logon page. However, it is likely that individual customizations will be necessary to fully integrate with an institution's ILLiad webpages.

## WorldMap.js
This file contains the logic for the map and its factoids. All customizable aspects of the map are specified by GLOBALS at the top of the file. From these variables, the programmer can set the pathnames, CSS class names, highlight duration, and more.

## mapConfig.json
This JSON file contains the data that powers the factoids. `factoid_countries` is a list of codes for countries that have factoids. `partner_countries` contains all the codes in `factoid_countries` in addition to any codes for partner countries. `factoids` is a list of JSON objects which represent each factoid. There should be exactly one factoid for each country code in `factoid_countries`. A list of the three-letter country codes can be found [here](https://www.iban.com/country-codes). 

## Logon.html
This is where a user lands when they first navigate to an institution's ILL website. In Bowdoin's case, [illiad.bowdoin.edu](https://illiad.bowdoin.edu/) direct the user to `Logon.html`.

## Updating the map and factoids
To illustrate the process of creating a new factoid to highlight on the logon page, an example factoid will be made for TestCountry. The only files which need to be modified for this are `mapConfig.json` and `WorldMap.js`.

### Add the country code to factoid_countries list
Presumably, the country of the new factoid is already indicated as a partner country in the `partner_countries` list. If not, the country’s three-letter code should be added to both lists. This is how the JavaScript knows to grab the factoid and highlight the country on the map.

### Create a new factoid in mapConfig.json
Copy and paste an existing factoid json object, and replace all of the metadata:

```json
{
"location": "TestCity, TestCountry",
      "institution": "TestUniversity",
      "item": {
      	"description": "Description * description description",
            "bold": "DocType"
      },
      "position": {
      	"bottom": "50%",
      	"left": "50%"
},
"pin_coordinates": {
      	"lat": "90.000",
      	"long": "90.000"
},
      "id": "TES"
}
```
* `location`: the city and country of the partner institution
* `institution`: the name of the partner institution
* `description`: a description of the borrowed item, where “*” is replaced by the DocType
* `bold`: the DocType of the borrowed item, to be bolded in the browser
* `bottom`, `left`: the position of the factoid element as percentages
* `lat`, `long`: the real coordinates of the institution’s city
* `id`: the three-letter code of the institution’s country

The “bottom” and “left” values must be manually determined. To do so, set 
```js
let DO_HIGHLIGHTING =  true;


const TEST_SINGLE_FACTOID = false;
let TEST_FACTOID_NUM = 0;
```

where `TEST_FACTOID_NUM` is the index of the factoid in the factoids list. Then, modify `bottom` and `left` such that the factoid element is positioned correctly. Stylistically, the element should not overlap with the header, footer, or login card, accounting for different screen dimensions. After positioning the factoid correctly, revert the global variables to their original values.

### Modifying the map styles
To modify the styles of the map, the `partner`, `non-partner`, and `pin` CSS classes can be modified. For example, the country colors or border styles can be changed.

## Contact
For questions or comments, please email Ben Bockmann (Bowdoin ILL Web Services Developer) at bbockmann@bowdoin.edu or Guy Saldanha (Bowdoin ILL Supervisor) at gsaldanh@bowdoin.edu.
