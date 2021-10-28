const mealsEl = document.querySelector('.meals');
const favcont = document.getElementById('favcont');
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('searchbtn');
const mealPopUp = document.getElementById('meal-popup');
const closePopBtn = document.getElementById('closepop');
const mealInfoEl = document.getElementById('meal-info');

getRandomMeal();
fetchFavMeals();

// getting random Meals
async function getRandomMeal() {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const resp = await response.json();
    // console.log(resp);
    const randomMeal = resp.meals[0];
    // console.log(randomMeal);

    addMeal(randomMeal, true);
}
// getting meals By Id
async function getMealById(id) {
    const response = await fetch(
        'https://www.themealdb.com/api/json/v1/1/lookup.php?i= ' + id
    );
    const resp = await response.json();
    const meal = resp.meals[0];
    return meal;
}
// getting meals by Name
async function getMealsBySearch(name) {
    const response = await fetch(
        'https://www.themealdb.com/api/json/v1/1/search.php?s=' + name
    );
    const resp = await response.json();
    const meals = resp.meals;
    console.log(meals);
    return meals;
}
// adding meal to app
const addMeal = (mealData, random = false) => {
    const meal = document.createElement('div');
    meal.classList.add('meal');
    // console.log(mealData);

    meal.innerHTML = `<div class="meal-head">
    ${random ? ` <span class="random">Random Recipe</span>` : ''} 
   
    

    
                        
                        <img
                            src="${mealData.strMealThumb}"
                            alt="${mealData.strMeal}"
                        />
                    </div>
                    <div class="meal-body">
                        <h4>${mealData.strMeal}</h4>
                        <button class="fav-btn">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>`;
    mealsEl.appendChild(meal);
    // console.log(meal);
    const btn = meal.querySelector('.meal-body .fav-btn');
    btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) {
            removeMealFromLS(mealData.idMeal);
            btn.classList.remove('active');
        } else {
            addMealsToLS(mealData.idMeal);
            btn.classList.add('active');
        }

        fetchFavMeals();
    });
    meal.addEventListener('click', () => {
        showMeals(mealData);
    });
};

const addMealsToLS = mealId => {
    const mealIds = getMealsFromLS();
    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
};

const removeMealFromLS = mealId => {
    const mealIds = getMealsFromLS();

    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id => id !== mealId)));
};
function getMealsFromLS() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));
    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
    favcont.innerHTML = '';
    const mealIds = getMealsFromLS();
    // console.log(mealIds);

    const meals = [];

    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];
        const meal = await getMealById(mealId);
        addMealToFav(meal);
    }
    console.log(meals);
}

function addMealToFav(mealData) {
    const favMeal = document.createElement('li');
    favMeal.innerHTML = `<img
                            src="${mealData.strMealThumb}"
                            alt="${mealData.strMeal}"
                        /><span>${mealData.strMeal}</span>
                        <button class='clear'><i class="far fa-window-close"></i></button>`;

    const clearButton = favMeal.querySelector('.clear');
    clearButton.addEventListener('click', () => {
        const btn = document.querySelector('.meal-body .fav-btn');
        btn.classList.remove('active');
        removeMealFromLS(mealData.idMeal);
        fetchFavMeals();
    });
    favMeal.addEventListener('click', () => {
        showMeals(mealData);
    });

    favcont.appendChild(favMeal);
}

function showMeals(mealData) {
    mealInfoEl.innerHTML = '';
    const mealEl = document.createElement('div');
    mealEl.innerHTML = `<h1>${mealData.strMeal}</h1>
                        <img
                            src=${mealData.strMealThumb}
                            alt="${mealData.strMeal}"
                        />
                    </div>
                    <div>
                    <h3 style="text-align:center">Ingredients...</h3>
                        <ul style="text-align: center; list-style: none">
                            <li style="vertical-align: middle ;">1.${mealData.strIngredient1}</li>
                            <li style="vertical-align: middle ;">2.${mealData.strIngredient2}</li>
                            <li style="vertical-align: middle ;">3.${mealData.strIngredient3}</li>
                        </ul>
                        <p>
                            ${mealData.strInstructions}
                        </p>
                        </div>`;

    mealInfoEl.appendChild(mealEl);
    mealPopUp.classList.remove('hidden');
}

searchBtn.addEventListener('click', async () => {
    if (searchInput.value === '') {
        alert('Insert a value');
    } else {
        mealsEl.innerHTML = '';
        const search = searchInput.value;
        const meals = await getMealsBySearch(search);
        if (meals) {
            meals.forEach(meal => addMeal(meal));
        } else {
            alert(`No values for ${search}`);
            location.reload();
        }
    }
});

closePopBtn.addEventListener('click', () => {
    mealPopUp.classList.add('hidden');
});
