import fetch from "node-fetch";

export async function handler(event, context) {
    try {
        const { title, body } = JSON.parse(event.body);

        const response = await fetch("https://api.github.com/repos/AzOr45/LivePlan/issues", {
            method: "POST",
            headers: {
                "Authorization": `token ${process.env.GITHUB_TOKEN}`,
                "Accept": "application/vnd.github+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, body })
        });

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (err) {
        return { statusCode: 500, body: err.toString() };
    }
}