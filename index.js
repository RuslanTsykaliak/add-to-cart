import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://shop-cart04-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

// add trim()
addButtonEl.addEventListener("click", () => {
    const inputValue = inputFieldEl.value.trim()
    if (inputValue !== "") {
    push(shoppingListInDB, inputValue)
    clearInputFieldEl()
    }
})

onValue(shoppingListInDB, snapshot => {
    const items = snapshot.val()
    const itemsArray = items ? Object.entries(items) : []

    clearShoppingListEl()

    itemsArray.forEach(([itemID, itemValue]) => {
        appendItemToShoppingListEl(itemID, itemValue)
    })

    if (itemsArray.length === 0) {
        shoppingListEl.innerHTML = "<h2>No items here... yet.</h2>"
    } else {
        const deleteMessage = "<p>To delete an item, double-click on it.</p>"
        shoppingListEl.insertAdjacentHTML("beforeend", deleteMessage)
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(itemID, itemValue) {
    let newEl = document.createElement("li")
    newEl.textContent = itemValue
    newEl.dataset.deleteCount = 0

    newEl.addEventListener("click", function() {
        let deleteCount = parseInt(this.dataset.deleteCount)
        
        if (deleteCount === 0) {
            this.dataset.deleteCount = 1
        } else if (deleteCount === 1) {
            remove(ref(database, `shoppingList/${itemID}`))
            this.remove()
        }
    })
    
    shoppingListEl.appendChild(newEl)
}
