interface Transaction {
	transactionDescription : string,
	transactionAmount : number,
	transactionType : "Income" | "Expense"
};


document.addEventListener('DOMContentLoaded' , () =>  {

	const inputDescription = (document.getElementById("input-description") as HTMLInputElement);
	const inputAmount = (document.getElementById
	("input-amount") as HTMLInputElement);
	const inputType = (document.getElementById
	("input-type") as HTMLSelectElement);
	const addTransactionBtn = (document.getElementById
	("add-btn") as HTMLButtonElement);

	//Display Details 
	const balancePlaceholder = (document.getElementById
	("temporary-balance-placeholder") as HTMLParagraphElement);
	const incomePlaceholder = (document.getElementById
	("temporary-income-placeholder") as HTMLParagraphElement);
	const expensePlaceholder = (document.getElementById
	("temporary-expense-placeholder") as HTMLParagraphElement);

	//Transactions Array
	let transactions : Transaction[] = [];


	function addTransaction() : void {
		const enteredDescription = inputDescription.value.trim();
		const enteredAmount =  parseInt(inputAmount.value);
		const enteredType = inputType.value;
		console.log("Entered type is: ",enteredType);
		
		
		const newTransaction : Transaction = {
			transactionDescription : enteredDescription,
			transactionAmount : enteredAmount,
			transactionType: enteredType === "income" ? "Income" : "Expense",
		};

		transactions.push(newTransaction);
		console.log(transactions);

		if ((!enteredDescription || !enteredAmount || !enteredType)) {
			alert("Please Add the required Fields");
			return;
		} else {
			displayTransactionDetails();
		}

		inputDescription.value = "";
		inputAmount.value = "";
	}

	function displayTransactionDetails() : void {
		let income = 0;
		let expense = 0;

		transactions.forEach((transaction) => {
			if (transaction.transactionType === "Income") {
				income += transaction.transactionAmount;
			} else {
				expense += transaction.transactionAmount;
			}
		});

		incomePlaceholder.textContent = `+ ${income}`;
		expensePlaceholder.textContent = `${expense}`;
		balancePlaceholder.textContent = `${income - expense}`;
	}

	addTransactionBtn.addEventListener('click',addTransaction);

	






})