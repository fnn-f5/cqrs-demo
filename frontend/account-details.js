async function fetchAccount(accountId) {
    try {
        const response = await fetch(`/account/${accountId}`, { method: "GET" });
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Failed to fetch account:", response.statusText);
        }
    } catch (error) {
        console.error("Error fetching account:", error);
    }
}

async function displayAccount(accountId) {
    const account = await fetchAccount(accountId);

    let innerHTMl = `
        <div>
            <p>Balance: ${account.balance}</p>
            <h3>Transaction History:</h3>
            <ul>
    `;
    let count = 1;
    for (let transaction of account.ledger) {
        innerHTMl += `
            <li>
                <h4>Transaction${count}</h4>
                <p>Description: ${transaction.description}</p>
                <p>Amount: ${transaction.amount}</p>
            </li>
        `;
        count++;
    }

    innerHTMl += `</ul></div>`;
    document.getElementById("account-details").innerHTML = innerHTMl;
}

async function depositMoney(accountId, amount) {
    const body = {
        DepositMoney: {
            amount: Number(amount)
        }
    };
    console.log(accountId);
    console.log(JSON.stringify(body));
    try {
        const response = await fetch(`/account/${accountId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (response.ok) {
            console.log(`Money successfully deposited.`);
        } else {
            const errorText = await response.text();
            console.error(`Failed to deposit money.`, response.statusText, errorText);
        }
    } catch (error) {
        console.error(`Error during deposit`, error);
    }
}

async function withdrawMoney(accountId, amount, atmId) {
    const body = {
        WithdrawMoney: {
            atm_id: atmId,
            amount: amount
        }
    };
    try {
        const response = await fetch(`/account/${accountId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (response.ok) {
            console.log(`Money successfully withdrawn.`);
        } else {
            console.error(`Failed to withdraw money.`, response.statusText);
        }
    } catch (error) {
        console.error(`Error during Withdrawal`, error);
    }
}

async function writeCheck(accountId, amount, checkNumber) {
    const body = {
        WriteCheck: {
            check_number: checkNumber,
            amount: Number(amount)
        }
    };
    console.log(JSON.stringify(body));
    try {
        const response = await fetch(`/account/${accountId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (response.ok) {
            console.log(`Check successfully written.`);
        } else {
            const errorText = await response.text();
            console.error(`Failed to write check.`, response.statusText, errorText);
        }
    } catch (error) {
        console.error(`Error during check writing`, error);
    }
}