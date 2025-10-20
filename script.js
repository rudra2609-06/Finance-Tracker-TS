var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
document.addEventListener("DOMContentLoaded", function () {
    // Element references
    var inputDescription = document.getElementById("input-description");
    var inputAmount = document.getElementById("input-amount");
    var inputType = document.getElementById("input-type");
    var addTransactionBtn = document.getElementById("add-btn");
    var filterBtn = document.getElementById("filter-btn");
    var searchTransactionField = document.getElementById("search-transactions");
    var balancePlaceholder = document.getElementById("temporary-balance-placeholder");
    var incomePlaceholder = document.getElementById("temporary-income-placeholder");
    var expensePlaceholder = document.getElementById("temporary-expense-placeholder");
    var showTransactionDiv = document.getElementById("show-transaction");
    // Data arrays
    var allTransactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    var transactions = __spreadArray([], allTransactions, true);
    // Utility: Display message when no transactions exist
    function noTransactionMessage() {
        var noTransaction = document.createElement("h3");
        noTransaction.className = "text-gray-500 text-center font-bold text-lg";
        noTransaction.textContent = "No Transactions";
        showTransactionDiv.appendChild(noTransaction);
    }
    // Add transaction
    function addTransaction() {
        var enteredDescription = inputDescription.value.trim();
        var enteredAmount = parseInt(inputAmount.value);
        var enteredType = inputType.value;
        console.log("Entered type is:", enteredType);
        if (!enteredDescription || !enteredAmount || !enteredType) {
            alert("Please Add the required Fields");
            return;
        }
        var newTransaction = {
            transactionDescription: enteredDescription,
            transactionAmount: enteredAmount,
            transactionType: enteredType === "income" ? "Income" : "Expense",
            transactionId: Date.now(),
        };
        transactions.push(newTransaction);
        saveTransaction();
        displayTransactionDetails();
        inputDescription.value = "";
        inputAmount.value = "";
    }
    // Display all transactions
    function displayTransactionDetails() {
        showTransactionDiv.replaceChildren();
        var income = 0;
        var expense = 0;
        var transactionList = document.createElement("ul");
        transactionList.className = "w-full bg-white shadow-md rounded-2xl p-4";
        var title = document.createElement("h3");
        title.className = "font-bold text-gray-800 text-xl mb-4";
        title.textContent = "Transactions";
        transactionList.appendChild(title);
        if (transactions.length > 0) {
            transactions.forEach(function (transaction) {
                var li = document.createElement("li");
                li.className =
                    "py-4 px-6 flex items-center justify-between border-b border-gray-200 last:border-none";
                var desc = document.createElement("h4");
                desc.className = "font-semibold text-gray-800";
                desc.textContent = transaction.transactionDescription;
                var amount = document.createElement("p");
                amount.className =
                    transaction.transactionType === "Income"
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium";
                amount.textContent = "\u20B9".concat(transaction.transactionAmount);
                var type = document.createElement("p");
                type.className = "text-gray-500 italic";
                type.textContent = transaction.transactionType;
                var deleteBtn = document.createElement("button");
                deleteBtn.className =
                    "delete-btn p-3 bg-red-500 rounded-md text-white font-medium cursor-pointer hover:bg-red-400 transition-colors duration-400";
                deleteBtn.textContent = "Delete";
                deleteBtn.setAttribute("data-id", transaction.transactionId.toString());
                li.append(desc, amount, type, deleteBtn);
                transactionList.appendChild(li);
                if (transaction.transactionType === "Income") {
                    income += transaction.transactionAmount;
                }
                else {
                    expense += transaction.transactionAmount;
                }
            });
            showTransactionDiv.appendChild(transactionList);
        }
        incomePlaceholder.textContent = "+ \u20B9".concat(income);
        expensePlaceholder.textContent = "- \u20B9".concat(expense);
        balancePlaceholder.textContent = "\u20B9".concat(income - expense);
    }
    // Delete functionality
    showTransactionDiv.addEventListener("click", function (e) {
        var targetedListEvent = e.target;
        if (targetedListEvent.tagName === "BUTTON" &&
            targetedListEvent.classList.contains("delete-btn")) {
            var id_1 = Number(targetedListEvent.getAttribute("data-id"));
            if (!id_1)
                return;
            transactions = transactions.filter(function (t) { return t.transactionId !== id_1; });
            saveTransaction();
            displayTransactionDetails();
            if (transactions.length === 0) {
                noTransactionMessage();
            }
        }
    });
    // Save to localStorage
    function saveTransaction() {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }
    // Event listeners
    addTransactionBtn.addEventListener("click", addTransaction);
    searchTransactionField.addEventListener("input", searchTransactions);
    filterBtn.addEventListener("click", filterTransactions);
    // Search functionality
    function searchTransactions() {
        if (transactions.length === 0) {
            alert("No Transaction Yet Added");
            searchTransactionField.disabled = true;
            return;
        }
        var queryedTransaction = searchTransactionField.value.trim().toLowerCase();
        console.log("Entered Query is:", queryedTransaction);
        if (queryedTransaction === "") {
            transactions = __spreadArray([], allTransactions, true);
            displayTransactionDetails();
            return;
        }
        transactions = allTransactions.filter(function (t) { return t.transactionDescription.toLowerCase() === queryedTransaction; });
        if (transactions.length > 0) {
            displayTransactionDetails();
        }
        else {
            showTransactionDiv.className = "font-bold text-center text-lg";
            showTransactionDiv.textContent = "No Such Transaction Found";
            transactions = __spreadArray([], allTransactions, true);
        }
    }
    // Filter functionality
    var filterCount = 0;
    function filterTransactions() {
        if (allTransactions.length === 0) {
            alert("No Transactions Present to Perform Filtration");
            return;
        }
        filterCount++;
        if (filterCount % 3 === 1) {
            filterBtn.textContent = "Showing Incomes";
            transactions = allTransactions.filter(function (t) { return t.transactionType.toLowerCase() === "income"; });
        }
        else if (filterCount % 3 === 2) {
            filterBtn.textContent = "Showing Expenses";
            transactions = allTransactions.filter(function (t) { return t.transactionType.toLowerCase() === "expense"; });
        }
        else {
            filterBtn.textContent = "Show All";
            transactions = __spreadArray([], allTransactions, true);
        }
        displayTransactionDetails();
    }
    // Initial load
    if (transactions.length === 0) {
        noTransactionMessage();
    }
    else {
        displayTransactionDetails();
    }
});
