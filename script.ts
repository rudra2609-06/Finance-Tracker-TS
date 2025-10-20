interface Transaction {
	transactionDescription: string;
	transactionAmount: number;
	transactionType: "Income" | "Expense";
	transactionId: number;
}

document.addEventListener("DOMContentLoaded", () => {
	// Element references
	const inputDescription = document.getElementById("input-description") as HTMLInputElement;
	const inputAmount = document.getElementById("input-amount") as HTMLInputElement;
	const inputType = document.getElementById("input-type") as HTMLSelectElement;
	const addTransactionBtn = document.getElementById("add-btn") as HTMLButtonElement;
	const filterBtn = document.getElementById("filter-btn") as HTMLButtonElement;
	const searchTransactionField = document.getElementById("search-transactions") as HTMLInputElement;

	const balancePlaceholder = document.getElementById("temporary-balance-placeholder") as HTMLParagraphElement;
	const incomePlaceholder = document.getElementById("temporary-income-placeholder") as HTMLParagraphElement;
	const expensePlaceholder = document.getElementById("temporary-expense-placeholder") as HTMLParagraphElement;

	const showTransactionDiv = document.getElementById("show-transaction") as HTMLDivElement;

	// Data arrays
	let allTransactions: Transaction[] = JSON.parse(localStorage.getItem("transactions") || "[]");
	let transactions: Transaction[] = [...allTransactions];

	// Utility: Display message when no transactions exist
	function noTransactionMessage(): void {
		const noTransaction = document.createElement("h3");
		noTransaction.className = "text-gray-500 text-center font-bold text-lg";
		noTransaction.textContent = "No Transactions";
		showTransactionDiv.appendChild(noTransaction);
	}

	// Add transaction
	function addTransaction(): void {
		const enteredDescription = inputDescription.value.trim();
		const enteredAmount = parseInt(inputAmount.value);
		const enteredType = inputType.value;

		console.log("Entered type is:", enteredType);

		if (!enteredDescription || !enteredAmount || !enteredType) {
			alert("Please Add the required Fields");
			return;
		}

		const newTransaction: Transaction = {
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
	function displayTransactionDetails(): void {
		showTransactionDiv.replaceChildren();

		let income = 0;
		let expense = 0;

		const transactionList = document.createElement("ul");
		transactionList.className = "w-full bg-white shadow-md rounded-2xl p-4";

		const title = document.createElement("h3");
		title.className = "font-bold text-gray-800 text-xl mb-4";
		title.textContent = "Transactions";
		transactionList.appendChild(title);

		if (transactions.length > 0) {
			transactions.forEach((transaction) => {
				const li = document.createElement("li");
				li.className =
					"py-4 px-6 flex items-center justify-between border-b border-gray-200 last:border-none";

				const desc = document.createElement("h4");
				desc.className = "font-semibold text-gray-800";
				desc.textContent = transaction.transactionDescription;

				const amount = document.createElement("p");
				amount.className =
					transaction.transactionType === "Income"
						? "text-green-600 font-medium"
						: "text-red-600 font-medium";
				amount.textContent = `₹${transaction.transactionAmount}`;

				const type = document.createElement("p");
				type.className = "text-gray-500 italic";
				type.textContent = transaction.transactionType;

				const deleteBtn = document.createElement("button");
				deleteBtn.className =
					"delete-btn p-3 bg-red-500 rounded-md text-white font-medium cursor-pointer hover:bg-red-400 transition-colors duration-400";
				deleteBtn.textContent = "Delete";
				deleteBtn.setAttribute("data-id", transaction.transactionId.toString());

				li.append(desc, amount, type, deleteBtn);
				transactionList.appendChild(li);

				if (transaction.transactionType === "Income") {
					income += transaction.transactionAmount;
				} else {
					expense += transaction.transactionAmount;
				}
			});

			showTransactionDiv.appendChild(transactionList);
		}

		incomePlaceholder.textContent = `+ ₹${income}`;
		expensePlaceholder.textContent = `- ₹${expense}`;
		balancePlaceholder.textContent = `₹${income - expense}`;
	}

	// Delete functionality
	showTransactionDiv.addEventListener("click", (e) => {
		const targetedListEvent = e.target as HTMLElement;
		if (
			targetedListEvent.tagName === "BUTTON" &&
			targetedListEvent.classList.contains("delete-btn")
		) {
			const id = Number(targetedListEvent.getAttribute("data-id"));
			if (!id) return;

			transactions = transactions.filter((t) => t.transactionId !== id);
			saveTransaction();
			displayTransactionDetails();

			if (transactions.length === 0) {
				noTransactionMessage();
			}
		}
	});

	// Save to localStorage
	function saveTransaction(): void {
		localStorage.setItem("transactions", JSON.stringify(transactions));
	}

	// Event listeners
	addTransactionBtn.addEventListener("click", addTransaction);
	searchTransactionField.addEventListener("input", searchTransactions);
	filterBtn.addEventListener("click", filterTransactions);

	// Search functionality
	function searchTransactions(): void {
		if (transactions.length === 0) {
			alert("No Transaction Yet Added");
			searchTransactionField.disabled = true;
			return;
		}

		const queryedTransaction = searchTransactionField.value.trim().toLowerCase();
		console.log("Entered Query is:", queryedTransaction);

		if (queryedTransaction === "") {
			transactions = [...allTransactions];
			displayTransactionDetails();
			return;
		}

		transactions = allTransactions.filter(
			(t) => t.transactionDescription.toLowerCase() === queryedTransaction
		);

		if (transactions.length > 0) {
			displayTransactionDetails();
		} else {
			showTransactionDiv.className = "font-bold text-center text-lg";
			showTransactionDiv.textContent = "No Such Transaction Found";
			transactions = [...allTransactions];
		}
	}

	// Filter functionality
	let filterCount = 0;
	function filterTransactions(): void {
		if (allTransactions.length === 0) {
			alert("No Transactions Present to Perform Filtration");
			return;
		}

		filterCount++;

		if (filterCount % 3 === 1) {
			filterBtn.textContent = "Showing Incomes";
			transactions = allTransactions.filter((t) => t.transactionType.toLowerCase() === "income");
		} else if (filterCount % 3 === 2) {
			filterBtn.textContent = "Showing Expenses";
			transactions = allTransactions.filter((t) => t.transactionType.toLowerCase() === "expense");
		} else {
			filterBtn.textContent = "Show All";
			transactions = [...allTransactions];
		}

		displayTransactionDetails();
	}

	// Initial load
	if (transactions.length === 0) {
		noTransactionMessage();
	} else {
		displayTransactionDetails();
	}
});
