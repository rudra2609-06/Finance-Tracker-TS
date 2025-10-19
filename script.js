;
document.addEventListener('DOMContentLoaded', function () {
    var inputDescription = document.getElementById("input-description");
    var inputAmount = document.getElementById("input-amount");
    var inputType = document.getElementById("input-type");
    var addTransactionBtn = document.getElementById("add-btn");
    //Display Details 
    var balancePlaceholder = document.getElementById("temporary-balance-placeholder");
    var incomePlaceholder = document.getElementById("temporary-income-placeholder");
    var expensePlaceholder = document.getElementById("temporary-expense-placeholder");
    //Transactions Array
    var transactions = [];
    function addTransaction() {
        var enteredDescription = inputDescription.value.trim();
        var enteredAmount = parseInt(inputAmount.value);
        var enteredType = inputType.value;
        console.log("Entered type is: ", enteredType);
        var newTransaction = {
            transactionDescription: enteredDescription,
            transactionAmount: enteredAmount,
            transactionType: enteredType === "income" ? "Income" : "Expense",
        };
        transactions.push(newTransaction);
        console.log(transactions);
        if ((!enteredDescription || !enteredAmount || !enteredType)) {
            alert("Please Add the required Fields");
            return;
        }
        else {
            displayTransactionDetails();
        }
        inputDescription.value = "";
        inputAmount.value = "";
    }
    function displayTransactionDetails() {
        var income = 0;
        var expense = 0;
        transactions.forEach(function (transaction) {
            if (transaction.transactionType === "Income") {
                income += transaction.transactionAmount;
            }
            else {
                expense += transaction.transactionAmount;
            }
        });
        incomePlaceholder.textContent = "+ ".concat(income);
        expensePlaceholder.textContent = "".concat(expense);
        balancePlaceholder.textContent = "".concat(income - expense);
    }
    addTransactionBtn.addEventListener('click', addTransaction);
});
