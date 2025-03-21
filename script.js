document.addEventListener("DOMContentLoaded", function() {
    // Game elements
    const startScreen = document.getElementById("start-screen");
    const gameOverScreen = document.getElementById("game-over");
    const startButton = document.getElementById("start-button");
    const restartButton = document.getElementById("restart-button");
    const scoreElement = document.getElementById("score");
    const timeElement = document.getElementById("time");
    const moneyElement = document.getElementById("money");
    const finalScoreElement = document.getElementById("final-score");
    const finalMoneyElement = document.getElementById("final-money");
    const dishNameElement = document.getElementById("dish-name");
    const dishIngredientsElement = document.getElementById("dish-ingredients");
    const potContentsElement = document.getElementById("pot-contents");
    const ingredientsGrid = document.getElementById("ingredients");
    const playerInventory = document.getElementById("player-inventory");
    const recipeList = document.getElementById("recipe-list");
    const cookingTimer = document.getElementById("cooking-timer");
    const cookTimeLeft = document.getElementById("cook-time-left");
    
    // Buttons
    const buyButton = document.getElementById("buy-button");
    const cookButton = document.getElementById("cook-button");
    const serveButton = document.getElementById("serve-button");
    const clearButton = document.getElementById("clear-button");
    
    // Game state
    let score = 0;
    let money = 100;
    let timeLeft = 180;
    let gameTimer;
    let cookTimer;
    let currentRecipe = null;
    let currentPot = [];
    let playerItems = {};
    let orderStartTime = 0;
    let isCooking = false;
    let isDishReady = false;
    
    // Expanded Ingredients List
    const ingredientsList = [
        { name: "Tomato", price: 5 },
        { name: "Onion", price: 3 },
        { name: "Garlic", price: 2 },
        { name: "Beef", price: 15 },
        { name: "Chicken", price: 12 },
        { name: "Pasta", price: 8 },
        { name: "Rice", price: 6 },
        { name: "Potato", price: 4 },
        { name: "Carrot", price: 3 },
        { name: "Cheese", price: 7 },
        { name: "Bell Pepper", price: 4 },
        { name: "Mushroom", price: 6 },
        { name: "Broccoli", price: 5 },
        { name: "Spinach", price: 4 },
        { name: "Eggs", price: 5 },
        { name: "Milk", price: 3 },
        { name: "Butter", price: 4 },
        { name: "Flour", price: 2 },
        { name: "Salt", price: 1 },
        { name: "Pepper", price: 1 },
        { name: "Olive Oil", price: 5 },
        { name: "Shrimp", price: 18 },
        { name: "Fish", price: 16 },
        { name: "Lemon", price: 3 },
        { name: "Basil", price: 4 },
        { name: "Cilantro", price: 3 },
        { name: "Bacon", price: 10 },
        { name: "Sausage", price: 12 },
        { name: "Tofu", price: 7 },
        { name: "Bread", price: 5 }
    ];
    
    // Expanded Recipes List
    const recipes = [
        {
            name: "Pasta Bolognese",
            ingredients: ["Pasta", "Tomato", "Onion", "Garlic", "Beef"],
            cookTime: 8,
            basePrice: 50
        },
        {
            name: "Chicken Rice",
            ingredients: ["Rice", "Chicken", "Onion", "Carrot"],
            cookTime: 6,
            basePrice: 40
        },
        {
            name: "Cheesy Potatoes",
            ingredients: ["Potato", "Cheese", "Garlic"],
            cookTime: 5,
            basePrice: 30
        },
        {
            name: "Vegetable Stir Fry",
            ingredients: ["Bell Pepper", "Carrot", "Broccoli", "Garlic", "Olive Oil"],
            cookTime: 6,
            basePrice: 35
        },
        {
            name: "Mushroom Risotto",
            ingredients: ["Rice", "Mushroom", "Onion", "Butter", "Cheese"],
            cookTime: 10,
            basePrice: 45
        },
        {
            name: "Spinach Omelette",
            ingredients: ["Eggs", "Spinach", "Cheese", "Milk", "Salt"],
            cookTime: 4,
            basePrice: 25
        },
        {
            name: "Garlic Shrimp Pasta",
            ingredients: ["Pasta", "Shrimp", "Garlic", "Olive Oil", "Lemon"],
            cookTime: 8,
            basePrice: 55
        },
        {
            name: "Fish Tacos",
            ingredients: ["Fish", "Bell Pepper", "Cilantro", "Lemon", "Tomato"],
            cookTime: 7,
            basePrice: 48
        },
        {
            name: "Bacon Carbonara",
            ingredients: ["Pasta", "Bacon", "Eggs", "Cheese", "Pepper"],
            cookTime: 9,
            basePrice: 52
        },
        {
            name: "Vegetable Soup",
            ingredients: ["Carrot", "Potato", "Onion", "Garlic", "Salt"],
            cookTime: 12,
            basePrice: 38
        },
        {
            name: "Tofu Stir Fry",
            ingredients: ["Tofu", "Bell Pepper", "Broccoli", "Garlic", "Olive Oil"],
            cookTime: 7,
            basePrice: 42
        },
        {
            name: "Breakfast Sandwich",
            ingredients: ["Bread", "Eggs", "Cheese", "Bacon"],
            cookTime: 5,
            basePrice: 32
        }
    ];
    
    let selectedIngredients = [];

    // Initialize game
    function initGame() {
        // Reset game state
        score = 0;
        money = 100;
        timeLeft = 180;
        currentPot = [];
        playerItems = {};
        selectedIngredients = [];
        isCooking = false;
        isDishReady = false;
        currentRecipe = null;
        
        // Update UI
        scoreElement.textContent = score;
        timeElement.textContent = timeLeft;
        moneyElement.textContent = money;
        
        // Create ingredient shop
        createIngredientShop();
        
        // Create recipe menu
        createRecipeMenu();
        
        // Update inventory display
        updateInventoryDisplay();
        
        // Start the timer
        gameTimer = setInterval(updateTimer, 1000);
    }

    // Create the ingredient shop
    function createIngredientShop() {
        ingredientsGrid.innerHTML = "";
        
        // Create a scrollable container for ingredients
        ingredientsGrid.style.maxHeight = "300px";
        ingredientsGrid.style.overflowY = "auto";
        ingredientsGrid.style.paddingRight = "5px";
        
        ingredientsList.forEach(ingredient => {
            const ingredientItem = document.createElement("div");
            ingredientItem.classList.add("ingredient-item");
            
            const nameElem = document.createTextNode(ingredient.name);
            ingredientItem.appendChild(nameElem);
            
            const priceDiv = document.createElement("div");
            priceDiv.classList.add("price");
            priceDiv.textContent = `$${ingredient.price}`;
            ingredientItem.appendChild(priceDiv);
            
            ingredientItem.addEventListener("click", () => {
                toggleIngredientSelection(ingredient);
            });
            
            ingredientsGrid.appendChild(ingredientItem);
        });
    }

    // Create recipe menu
    function createRecipeMenu() {
        recipeList.innerHTML = "";
        
        // Enhanced scroll styling
        recipeList.style.display = "flex";
        recipeList.style.flexWrap = "nowrap";
        recipeList.style.overflowX = "auto";
        recipeList.style.scrollBehavior = "smooth";
        recipeList.style.padding = "5px";
        recipeList.style.paddingBottom = "10px";
        
        // Add scroll indicator
        const scrollIndicator = document.createElement("div");
        scrollIndicator.classList.add("scroll-indicator");
        scrollIndicator.textContent = "← Scroll for more recipes →";
        scrollIndicator.style.textAlign = "center";
        scrollIndicator.style.color = "#7f8c8d";
        scrollIndicator.style.fontSize = "12px";
        scrollIndicator.style.marginBottom = "5px";
        
        const recipeSelectionDiv = document.querySelector(".recipe-selection");
        recipeSelectionDiv.insertBefore(scrollIndicator, recipeList);
        
        recipes.forEach(recipe => {
            const recipeCard = document.createElement("div");
            recipeCard.classList.add("recipe-card");
            
            const nameHeading = document.createElement("h3");
            nameHeading.textContent = recipe.name;
            recipeCard.appendChild(nameHeading);
            
            const ingredientsDiv = document.createElement("div");
            ingredientsDiv.classList.add("recipe-ingredients");
            ingredientsDiv.textContent = `Ingredients: ${recipe.ingredients.join(", ")}`;
            recipeCard.appendChild(ingredientsDiv);
            
            const timeDiv = document.createElement("div");
            timeDiv.classList.add("recipe-time");
            timeDiv.textContent = `Cook time: ${recipe.cookTime}s`;
            recipeCard.appendChild(timeDiv);
            
            const priceDiv = document.createElement("div");
            priceDiv.classList.add("price");
            priceDiv.textContent = `Sells for: $${recipe.basePrice}`;
            recipeCard.appendChild(priceDiv);
            
            recipeCard.addEventListener("click", () => {
                selectRecipe(recipe);
            });
            
            recipeList.appendChild(recipeCard);
        });
    }

    // Toggle ingredient selection for purchase
    function toggleIngredientSelection(ingredient) {
        const index = selectedIngredients.findIndex(item => item.name === ingredient.name);
        
        if (index === -1) {
            selectedIngredients.push(ingredient);
        } else {
            selectedIngredients.splice(index, 1);
        }
        
        // Update UI
        updateShopSelection();
    }
    
    // Update shop selection UI
    function updateShopSelection() {
        const ingredientItems = ingredientsGrid.querySelectorAll(".ingredient-item");
        ingredientItems.forEach(item => {
            const name = item.firstChild.textContent.trim();
            if (selectedIngredients.some(ingredient => ingredient.name === name)) {
                item.classList.add("selected");
            } else {
                item.classList.remove("selected");
            }
        });
    }

    // Buy selected ingredients
    function buyIngredients() {
        if (selectedIngredients.length === 0) return;
        
        let totalCost = 0;
        selectedIngredients.forEach(ingredient => {
            totalCost += ingredient.price;
        });
        
        // Check if player has enough money
        if (money >= totalCost) {
            money -= totalCost;
            moneyElement.textContent = money;
            
            // Add ingredients to inventory
            selectedIngredients.forEach(ingredient => {
                if (playerItems[ingredient.name]) {
                    playerItems[ingredient.name]++;
                } else {
                    playerItems[ingredient.name] = 1;
                }
            });
            
            // Clear selection
            selectedIngredients = [];
            updateShopSelection();
            
            // Update inventory display
            updateInventoryDisplay();
        } else {
            alert("Not enough money to buy these ingredients!");
        }
    }

    // Update inventory display
    function updateInventoryDisplay() {
        playerInventory.innerHTML = "";
        
        // Make inventory scrollable
        playerInventory.style.maxHeight = "200px";
        playerInventory.style.overflowY = "auto";
        
        let hasItems = false;
        
        for (const [ingredient, count] of Object.entries(playerItems)) {
            if (count > 0) {
                hasItems = true;
                const inventoryItem = document.createElement("div");
                inventoryItem.classList.add("inventory-item");
                inventoryItem.textContent = `${ingredient} (${count})`;
                inventoryItem.addEventListener("click", () => {
                    addIngredientToPot(ingredient);
                });
                playerInventory.appendChild(inventoryItem);
            }
        }
        
        // Add a message if inventory is empty
        if (!hasItems) {
            const emptyMessage = document.createElement("div");
            emptyMessage.textContent = "Your inventory is empty. Buy ingredients!";
            emptyMessage.style.color = "#7f8c8d";
            emptyMessage.style.textAlign = "center";
            emptyMessage.style.padding = "10px";
            playerInventory.appendChild(emptyMessage);
        }
    }

    // Add ingredient to pot
    function addIngredientToPot(ingredient) {
        if (isCooking) return;
        
        if (playerItems[ingredient] > 0) {
            playerItems[ingredient]--;
            currentPot.push(ingredient);
            updatePotDisplay();
            updateInventoryDisplay();
        }
    }

    // Update pot display
    function updatePotDisplay() {
        potContentsElement.innerHTML = "";
        
        // Make pot contents scrollable if many ingredients
        potContentsElement.style.maxHeight = "100px";
        potContentsElement.style.overflowY = "auto";
        
        if (currentPot.length === 0) {
            const emptyMessage = document.createElement("div");
            emptyMessage.textContent = "Add ingredients from your inventory";
            emptyMessage.style.color = "rgba(255, 255, 255, 0.7)";
            emptyMessage.style.textAlign = "center";
            emptyMessage.style.padding = "10px";
            potContentsElement.appendChild(emptyMessage);
            return;
        }
        
        currentPot.forEach(ingredient => {
            const div = document.createElement("div");
            div.classList.add("ingredient");
            div.textContent = ingredient;
            potContentsElement.appendChild(div);
        });
    }

    // Select a recipe
    function selectRecipe(recipe) {
        if (isCooking) return;
        
        currentRecipe = recipe;
        
        // Update all recipe cards
        const recipeCards = recipeList.querySelectorAll(".recipe-card");
        recipeCards.forEach(card => {
            card.classList.remove("selected");
            if (card.querySelector("h3").textContent === recipe.name) {
                card.classList.add("selected");
            }
        });
        
        // Update current dish display
        dishNameElement.textContent = recipe.name;
        
        // Display ingredients
        dishIngredientsElement.innerHTML = "";
        recipe.ingredients.forEach(ingredient => {
            const span = document.createElement("span");
            span.classList.add("ingredient");
            span.textContent = ingredient;
            dishIngredientsElement.appendChild(span);
        });
        
        // Start timing the order
        orderStartTime = Date.now();
    }

    // Cook the dish
    function cookDish() {
        if (currentPot.length === 0 || isCooking || !currentRecipe) return;
        
        // Check if all required ingredients are present
        const hasAllIngredients = currentRecipe.ingredients.every(ingredient => 
            currentPot.includes(ingredient));
        
        if (hasAllIngredients) {
            // Start cooking!
            isCooking = true;
            cookButton.disabled = true;
            clearButton.disabled = true;
            
            let cookTimeRemaining = currentRecipe.cookTime;
            cookTimeLeft.textContent = cookTimeRemaining;
            cookingTimer.classList.remove("hidden");
            
            cookTimer = setInterval(() => {
                cookTimeRemaining--;
                cookTimeLeft.textContent = cookTimeRemaining;
                
                if (cookTimeRemaining <= 0) {
                    clearInterval(cookTimer);
                    finishCooking();
                }
            }, 1000);
        } else {
            alert("Missing ingredients for this recipe!");
        }
    }

    // Finish cooking
    function finishCooking() {
        isCooking = false;
        isDishReady = true;
        cookingTimer.classList.add("hidden");
        serveButton.disabled = false;
        
        // Visual indication that dish is ready
        const cookingPot = document.getElementById("cooking-pot");
        cookingPot.style.backgroundColor = "#27ae60";
        setTimeout(() => {
            cookingPot.style.backgroundColor = "#34495e";
        }, 500);
    }

    // Serve the dish
    function serveDish() {
        if (!isDishReady) return;
        
        // Calculate time bonus
        const timeTaken = (Date.now() - orderStartTime) / 1000;
        let timeBonus = 1.0;
        
        if (timeTaken < 20) {
            timeBonus = 1.5; // 50% bonus for very fast service
        } else if (timeTaken < 30) {
            timeBonus = 1.2; // 20% bonus for fast service
        }
        
        // Calculate price
        const basePrice = currentRecipe.basePrice;
        const finalPrice = Math.round(basePrice * timeBonus);
        
        // Show earnings animation
        const earningsMessage = document.createElement("div");
        earningsMessage.textContent = `Earned $${finalPrice}!`;
        earningsMessage.style.position = "fixed";
        earningsMessage.style.top = "50%";
        earningsMessage.style.left = "50%";
        earningsMessage.style.transform = "translate(-50%, -50%)";
        earningsMessage.style.backgroundColor = "#2ecc71";
        earningsMessage.style.color = "white";
        earningsMessage.style.padding = "15px 25px";
        earningsMessage.style.borderRadius = "10px";
        earningsMessage.style.fontSize = "24px";
        earningsMessage.style.fontWeight = "bold";
        earningsMessage.style.zIndex = "1000";
        earningsMessage.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
        earningsMessage.style.opacity = "0";
        earningsMessage.style.transition = "opacity 0.5s";
        
        document.body.appendChild(earningsMessage);
        
        // Animate the earnings message
        setTimeout(() => {
            earningsMessage.style.opacity = "1";
        }, 50);
        
        setTimeout(() => {
            earningsMessage.style.opacity = "0";
            setTimeout(() => {
                document.body.removeChild(earningsMessage);
            }, 500);
        }, 1500);
        
        // Add money and score
        money += finalPrice;
        score += Math.round(finalPrice / 2);
        
        // Update UI
        moneyElement.textContent = money;
        scoreElement.textContent = score;
        
        // Reset cooking state
        isDishReady = false;
        serveButton.disabled = true;
        cookButton.disabled = false;
        clearButton.disabled = false;
        currentPot = [];
        updatePotDisplay();
        
        // Clear current dish
        dishNameElement.textContent = "";
        dishIngredientsElement.innerHTML = "";
        currentRecipe = null;
        
        // Reset recipe selection
        const recipeCards = recipeList.querySelectorAll(".recipe-card");
        recipeCards.forEach(card => {
            card.classList.remove("selected");
        });
    }

    // Clear the pot
    function clearPot() {
        if (isCooking) return;
        
        // Return ingredients to inventory
        currentPot.forEach(ingredient => {
            if (playerItems[ingredient]) {
                playerItems[ingredient]++;
            } else {
                playerItems[ingredient] = 1;
            }
        });
        
        currentPot = [];
        updatePotDisplay();
        updateInventoryDisplay();
    }

    // Update timer
    function updateTimer() {
        timeLeft--;
        timeElement.textContent = timeLeft;
        
        if (timeLeft <= 30) {
            timeElement.style.color = "#e74c3c";
        }
        
        if (timeLeft <= 0) {
            endGame();
        }
    }

    // End the game
    function endGame() {
        clearInterval(gameTimer);
        if (cookTimer) {
            clearInterval(cookTimer);
        }
        
        finalScoreElement.textContent = score;
        finalMoneyElement.textContent = money;
        gameOverScreen.classList.remove("hidden");
    }

    // Event listeners
    startButton.addEventListener("click", () => {
        startScreen.classList.add("hidden");
        initGame();
    });
    
    restartButton.addEventListener("click", () => {
        gameOverScreen.classList.add("hidden");
        initGame();
    });
    
    buyButton.addEventListener("click", buyIngredients);
    cookButton.addEventListener("click", cookDish);
    serveButton.addEventListener("click", serveDish);
    clearButton.addEventListener("click", clearPot);
});
