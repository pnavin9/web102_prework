/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for (const game of games){
        
        // create a new div element, which will become the game card
        var newDiv = document.createElement("div");

        // add the class game-card to the list
        newDiv.classList.add("game-card");

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        
        newDiv.innerHTML = `
        <img src="${game.img}" class = "game-img" />
        <h3>${game.name}</h3>
        <p>${game.description}</p>
        <div class="hover-info">
                <p><strong>Backers:</strong> ${game.backers.toLocaleString()}</p>
                <p><strong>Pledged:</strong> $${game.pledged.toLocaleString()}</p>
                <p><strong>Goal:</strong> $${game.goal.toLocaleString()}</p>
        </div>
        `;

        // append the game to the games-container
        gamesContainer.appendChild(newDiv);
    }

}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const total_backers = GAMES_JSON.reduce((backers_sum, game) => {
    return backers_sum + game.backers
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `
<p>${total_backers.toLocaleString('en-US')}</p>
`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const total_funds = GAMES_JSON.reduce((amount, game) => {
    return amount + game.pledged
}, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `
<p>$${total_funds.toLocaleString('en-US')} </p>
`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const total_number_of_games = GAMES_JSON.reduce((number_of_games, game) => {
    return number_of_games + 1
}, 0);
gamesCard.innerHTML = `
<p>${total_number_of_games}</p>
`


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let listOfUnfundedGames = GAMES_JSON.filter((game) => {
        return game.pledged < game.goal;
    });

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(listOfUnfundedGames);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let listOfFundedGames = GAMES_JSON.filter((game) => {
        return game.pledged > game.goal;
    });

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(listOfFundedGames);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

function filterAndSortGames() {
    let filteredGames = GAMES_JSON.filter((game) =>
        game.name.toLowerCase().includes(searchInput.value.toLowerCase())
    );

    const sortBy = sortSelect.value;
    const order = sortOrder.value;

    filteredGames.sort((a, b) => {
        if (order === "asc") {
            return a[sortBy] - b[sortBy];
        } else {
            return b[sortBy] - a[sortBy];
        }
    });

    deleteChildElements(gamesContainer);
    addGamesToPage(filteredGames);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const sortOrder = document.getElementById("sort-order");


// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click",filterUnfundedOnly)
fundedBtn.addEventListener("click",filterFundedOnly)
allBtn.addEventListener("click",showAllGames)
searchInput.addEventListener("input", filterAndSortGames);
sortSelect.addEventListener("change", filterAndSortGames);
sortOrder.addEventListener("change", filterAndSortGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const total_number_of_unfunded_games = GAMES_JSON.reduce((number_of_games, game) => {
    const number_of_unfunded_games = game.pledged < game.goal ? number_of_games + 1 : number_of_games;
    return number_of_unfunded_games;
}, 0);

// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `A total of $${total_funds.toLocaleString('en-US')} has been raised for ${total_number_of_games.toLocaleString('en-US')}. ${
    total_number_of_unfunded_games > 0
      ? `Currently ${total_number_of_unfunded_games} game${total_number_of_unfunded_games > 1 ? 's' : ''} remain${total_number_of_unfunded_games > 1 ? '' : 's'} unfunded. We need your help to fund these amazing games!`
      : 'Enjoy the amazing games!'
}`;

// create a new DOM element containing the template string and append it to the description container
descriptionContainer.innerHTML += `<p>${displayStr} </p>`;

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [mostFunded, secondMostFunded, ...rest] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
firstGameContainer.innerHTML += `<p>${mostFunded.name}</p>`;

// do the same for the runner up item
secondGameContainer.innerHTML += `<p>${secondMostFunded.name}</p>`;
