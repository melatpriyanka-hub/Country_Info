
const searchBtn = document.getElementById("searchBtn");
const countryInput = document.getElementById("countryInput");

const countryDetails = document.getElementById("countryDetails");
const message = document.getElementById("message");

searchBtn.addEventListener("click", searchCountry);

countryInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchCountry();
    }
});

async function searchCountry() {

    const country = countryInput.value.trim();

    if (!country) {
        message.textContent = "Please enter a country name!";
        countryDetails.style.display = "none";
        return;
    }

    message.textContent = "Searching...";
    countryDetails.style.display = "none";

    try {

        const response = await fetch(
            `https://api.restcountries.com/countries/v5?q=${encodeURIComponent(country)}&limit=10`,
            {
                headers: {
                            "Authorization": "Bearer rc_live_f0eec5dbc22b47b7a2ad878f9e68765b"     
                }
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.errors?.[0]?.message || "API request failed"
            );
        }

        const countries = result.data?.objects || [];

        // Find exact country name first
        const countryData = countries.find(
            c => c.names.common.toLowerCase() === country.toLowerCase()
        ) || countries[0];

        if (!countryData) {
            throw new Error("Country not found!");
        }

        // Display flag
        document.getElementById("flag").src =
            countryData.flag.url_png ||
            countryData.flag.url_svg;

        document.getElementById("flag").alt =
            countryData.names.common + " flag";

        // Display country name
        document.getElementById("countryName").textContent =
            countryData.names.common;

        // Display capital
        document.getElementById("capital").textContent =
            countryData.capitals?.map(c => c.name).join(", ")
            || "Not available";

        // Display population
        document.getElementById("population").textContent =
            countryData.population?.toLocaleString("en-IN")
            || "Not available";

        // Display region
        document.getElementById("region").textContent =
            countryData.region || "Not available";

        // Display currency
        document.getElementById("currency").textContent =
            countryData.currencies?.map(
                c => `${c.name} (${c.symbol || "N/A"})`
            ).join(", ") || "Not available";

        // Display languages
        document.getElementById("languages").textContent =
            countryData.languages?.map(
                lang => lang.name
            ).join(", ") || "Not available";

        message.textContent = "";
        countryDetails.style.display = "block";

    } catch (error) {

        console.error(error);

        message.textContent =
            error.message.includes("Failed to fetch")
            ? "Unable to connect. Check internet or API access."
            : error.message;

        countryDetails.style.display = "none";
    }
}
