interface Transaction {
	transactionDescription: string;
	transactionAmount: number;
	transactionType: "Income" | "Expense";
	transactionId : number;
}

document.addEventListener("DOMContentLoaded", () => {
	const inputDescription = document.getElementById("input-description") as HTMLInputElement;
	const inputAmount = document.getElementById("input-amount") as HTMLInputElement;
	const inputType = document.getElementById("input-type") as HTMLSelectElement;
	const addTransactionBtn = document.getElementById("add-btn") as HTMLButtonElement;
	const filterBtn = document.getElementById("filter-btn") as HTMLButtonElement;

	const balancePlaceholder = document.getElementById("temporary-balance-placeholder") as HTMLParagraphElement;
	const incomePlaceholder = document.getElementById("temporary-income-placeholder") as HTMLParagraphElement;
	const expensePlaceholder = document.getElementById("temporary-expense-placeholder") as HTMLParagraphElement;

	const showTransactionDiv = document.getElementById("show-transaction") as HTMLDivElement;

	let allTransactions : Transaction[] = JSON.parse(localStorage.getItem("transactions") || "[]"); //original array
	let transactions: Transaction[] = [...allTransactions]; //array responsible for rendering transactions

	function noTransactionMessage() : void {
		const noTransaction = document.createElement("h3");
		noTransaction.className = "text-gray-500 text-left font-bold";
		noTransaction.textContent = "No Transaction";
		showTransactionDiv.appendChild(noTransaction);
	}

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
			transactionId : Date.now()
		};

		transactions.push(newTransaction);
		saveTransaction();
		console.log(transactions);

		displayTransactionDetails();

		inputDescription.value = "";
		inputAmount.value = "";
	}

	function displayTransactionDetails(): void {
		showTransactionDiv.innerHTML = "";

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
				li.className = "py-4 px-6 flex items-center justify-between border-b border-gray-200 last:border-none";

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

				const deleteBtn = document.createElement('button');
				deleteBtn.className = "delete-btn p-3 bg-red-500 rounded-md text-white font-medium cursor-pointer hover:bg-red-400 transition-colors duration-400";
				deleteBtn.textContent = `Delete`;
				deleteBtn.setAttribute('data-id',transaction.transactionId.toString());


				li.append(desc, amount, type,deleteBtn);
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

		//delete functionality
		showTransactionDiv.addEventListener('click', (e) => {
			const targetedListEvent = e.target as HTMLElement;
			if (targetedListEvent.tagName === "BUTTON" && targetedListEvent.classList.contains("delete-btn")) {
				const id = Number(targetedListEvent.getAttribute('data-id'));
				if(!id) return;
				transactions = transactions.filter((transaction) => transaction.transactionId !== id);
				saveTransaction();
				displayTransactionDetails();
				if (transactions.length === 0) {
					noTransactionMessage();
					return;
				} 
			}
		});
	}

	function saveTransaction() : void{
		localStorage.setItem('transactions',JSON.stringify(transactions));
	}

	addTransactionBtn.addEventListener("click", addTransaction);

	filterBtn.addEventListener('click',filterTransactions);
	let filterCount = 0;

	function filterTransactions(): void {
		if (allTransactions.length === 0) {
			alert("No Transactions Present to perform filtration");
			return;
		}

		filterCount++;

		if (filterCount % 3 === 1) {
			// First click — show only Incomes
			filterBtn.textContent = "Showing Incomes";
			transactions = allTransactions.filter(t => t.transactionType.toLowerCase() === "income");
		} 
		else if (filterCount % 3 === 2) {
			// Second click — show only Expenses
			filterBtn.textContent = "Showing Expenses";
			transactions = allTransactions.filter(t => t.transactionType.toLowerCase() === "expense");
		} 
		else {
			// Third click — reset to all
			filterBtn.textContent = "Show All";
			transactions = [...allTransactions];
		}

		displayTransactionDetails();
	}

	//Show No Transaction Message By Default
	if (transactions.length === 0) {
		noTransactionMessage();
	} else {
		displayTransactionDetails();
	}
});
