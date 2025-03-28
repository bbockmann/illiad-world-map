/**
 * BOWDOIN COLLEGE INTERLIBRARY LOAN
 * 
 * Javascript for the main logon page. Controls the username filtering of "@bowdoin.edu", 
 * expands the logon card, and highlights countries and factoids.
 * 
 * @author Ben Bockmann
 * Date: Spring 2024
 */

$(document).ready(function () {
    // Checks if the username field contains "@bowdoin.edu". If it does, removes it. 
    let username_field = document.getElementById("username");
    username_field.addEventListener("change", () => {
        username = username_field.value;
        if (username.includes("@bowdoin.edu")){
            username = username.replace("@bowdoin.edu", "");
            username_field.value = username;
        }
    });
});
