async function createAccount(accountId) {
    const body = {
        OpenAccount: {
            account_id: accountId,
        },
    };
    const statusMessage = document.getElementById("status-message");

    try {
        const response = await fetch(`/account/${accountId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (response.ok) {
            statusMessage.innerText = "Account created successfully!";
            statusMessage.style.color = "green";
        } else {
            const error = await response.text(); // Fetch error details if any.
            statusMessage.innerText = `Failed to create account: ${error}`;
            statusMessage.style.color = "red";
        }
    } catch (error) {
        statusMessage.innerText = `Error creating account: ${error.message}`;
        statusMessage.style.color = "red";
    }
}