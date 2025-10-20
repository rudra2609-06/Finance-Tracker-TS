document.addEventListener("DOMContentLoaded", function () {
    var inputDescription = document.getElementById("input-description");
    var inputAmount = document.getElementById("input-amount");
    var inputType = document.getElementById("input-type");
    var addTransactionBtn = document.getElementById("add-btn");
    var filterBtn = document.getElementById("filter-btn");
    var balancePlaceholder = document.getElementById("temporary-balance-placeholder");
    var incomePlaceholder = document.getElementById("temporary-income-placeholder");
    var expensePlaceholder = document.getElementById("temporary-expense-placeholder");
    var showTransactionDiv = document.getElementById("show-transaction");
    var transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    function noTransactionMessage() {
        var noTransaction = document.createElement("h3");
        noTransaction.className = "text-gray-500 text-left font-bold";
        noTransaction.textContent = "No Transaction";
        showTransactionDiv.appendChild(noTransaction);
    }
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
            transactionId: Date.now()
        };
        transactions.push(newTransaction);
        saveTransaction();
        console.log(transactions);
        displayTransactionDetails();
        inputDescription.value = "";
        inputAmount.value = "";
    }
    function displayTransactionDetails() {
        showTransactionDiv.innerHTML = "";
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
                li.className = "py-4 px-6 flex items-center justify-between border-b border-gray-200 last:border-none";
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
                var deleteBtn = document.createElement('button');
                deleteBtn.className = "delete-btn p-3 bg-red-500 rounded-md text-white font-medium cursor-pointer hover:bg-red-400 transition-colors duration-400";
                deleteBtn.textContent = "Delete";
                deleteBtn.setAttribute('data-id', transaction.transactionId.toString());
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
        //delete functionality
        showTransactionDiv.addEventListener('click', function (e) {
            var targetedListEvent = e.target;
            if (targetedListEvent.tagName === "BUTTON" && targetedListEvent.classList.contains("delete-btn")) {
                var id_1 = Number(targetedListEvent.getAttribute('data-id'));
                if (!id_1)
                    return;
                transactions = transactions.filter(function (transaction) { return transaction.transactionId !== id_1; });
                saveTransaction();
                displayTransactionDetails();
                if (transactions.length === 0) {
                    noTransactionMessage();
                    return;
                }
            }
        });
    }
    function saveTransaction() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }
    addTransactionBtn.addEventListener("click", addTransaction);
    filterBtn.addEventListener('click', filterTransactions);
    //Show No Transaction Message By Default
    if (transactions.length === 0) {
        noTransactionMessage();
    }
    else {
        displayTransactionDetails();
    }
});
