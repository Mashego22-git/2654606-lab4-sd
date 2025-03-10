const inputField = document.getElementById('Cname');
const button = document.getElementById('button');
const bCountries = document.getElementById('bordering-countries');


async function getCountry(Countryname) {
    const url = "https://restcountries.com/v3.1/name/" + Countryname;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();

        json.forEach(value => {
            const capital = value.capital ? value.capital[0] : 'No capital';  // Handle missing capital
            const population = value.population;
            const region = value.region;
            const flag = value.flags.png;

            const countryinfo = document.getElementById('country-info');
            countryinfo.innerHTML = `
                <p><strong>Capital:</strong> ${capital}</p>
                <p><strong>Population:</strong> ${population}</p>
                <p><strong>Region:</strong> ${region}</p>
                <p><strong>Flag:</strong> <img src="${flag}" alt="Flag" width="100"></p>
            `;
            
            
            bCountries.innerHTML = ''; 
            if (value.borders && value.borders.length > 0) {
                borders(value.borders);  
            } else {
                bCountries.innerHTML = `<p>No bordering countries.</p>`;
            }
        });
    } catch (error) {
        console.log(`Failed to fetch country: ${error}`);
    }
}


async function borders(bordersArray) {
    if (bordersArray && bordersArray.length > 0) {
        for (const borderCode of bordersArray) {
            const borderUrl = `https://restcountries.com/v3.1/alpha/${borderCode}`;
            try {
                const response = await fetch(borderUrl);
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }
                const borderData = await response.json();
                const borderCountry = borderData[0];
                const borderName = borderCountry.name.common;
                const borderFlag = borderCountry.flags.svg;

               
                bCountries.innerHTML += `
                    <p>${borderName}</p>
                    <img src="${borderFlag}" alt="Border flag" width="50">
                `;
            } catch (error) {
                console.log(`Failed to fetch border country: ${error}`);
            }
        }
    } else {
        bCountries.innerHTML = `<p>No bordering countries.</p>`;
    }
}

button.addEventListener('click', function () {
    const Countryname = inputField.value.trim();
    if (Countryname) {
        getCountry(Countryname);  
    } else {
        alert('Please enter a country name.');
    }
});
