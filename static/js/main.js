// Add new travel record
function submitTravel() {
    const travelData = {
        institution: document.getElementById('institution').value,
        city: document.getElementById('city').value,
        country: document.getElementById('country').value,
        travelstart: document.getElementById('travelstart').value,
        travelend: document.getElementById('travelend').value
    };

    fetch('/api/travel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(travelData)
    })
    .then(response => response.json())
    .then(data => {
        const messageDiv = document.getElementById('message');
        if (data.message) {
            // Display success message
            messageDiv.style.color = 'green';
            messageDiv.textContent = 'Travel Successfully Added.';
        } else if (data.error) {
            // Display error message
            messageDiv.style.color = 'red';
            messageDiv.textContent = `Error: ${data.error}`;
        }
    })
    .catch(error => {
        // Handle network or other errors
        const messageDiv = document.getElementById('message');
        messageDiv.style.color = 'red';
        messageDiv.textContent = `Error: ${error.message}`;
    });
}

// All travel record for the user 
function loadTravel(userid) {
    console.log(`Fetching travel records for user ID: ${userid}`); // Debug log

    fetch(`/api/travel/${userid}`)
        .then(response => {
            console.log(`Response status: ${response.status}`); // Debug log
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Travel data:', data); // Debug log
            const travelList = document.getElementById('travelList');
            travelList.innerHTML = ''; // Clear any existing content

            if (data.length === 0) {
                travelList.innerHTML = '<p>No travel records found.</p>';
                return;
            }

            // Create a table element
            const table = document.createElement('table');
            table.setAttribute('border', '1'); 
            table.style.width = '100%'; 

            // Create the table header
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th>Institution</th>
                    <th>City</th>
                    <th>Country</th>
                    <th>Travel Start</th>
                    <th>Travel End</th>
                    <th>Actions</th>
                </tr>
            `;
            table.appendChild(thead);

            // Create the table body
            const tbody = document.createElement('tbody');
            data.forEach(travel => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${travel.institution}</td>
                    <td>${travel.city}</td>
                    <td><a href="/country-details/${travel.country}" class="btn btn-link">${travel.country}</a></td>
                    <td>${formatDateToDDMMYYYY(travel.travelstart)}</td>
                    <td>${formatDateToDDMMYYYY(travel.travelend)}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="window.location.href='/update-travel/${travel.travelid}'">Update</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteTravel(${travel.travelid})">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            table.appendChild(tbody);

            // Append the table to the travelList container
            travelList.appendChild(table);
        })
        .catch(error => {
            console.error('Error:', error); // Debug log
            const travelList = document.getElementById('travelList');
            travelList.innerHTML = '<p>An error occurred while loading travel records. Please try again later.</p>';
        });
}


function submitUpdateTravel(travelId) {
    const travelData = {
        travelid: travelId, // Use the travelId parameter directly
        institution: document.getElementById('institution').value,
        city: document.getElementById('city').value,
        country: document.getElementById('country').value,
        travelstart: document.getElementById('travelstart').value, // Use the raw date value
        travelend: document.getElementById('travelend').value // Use the raw date value
    };

    fetch(`/update-travel/${travelId}`, { // Format the URL with travelId
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(travelData)
    })
    .then(response => {
        if (response.ok) {
            alert('Travel record updated successfully!');
            window.location.href = '/view-travel/{{session["userid"]}}'; // Redirect back to the travel list
        } else {
            alert('Failed to update travel record. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the travel record.');
    });
}

function deleteTravel(travelId) {
    if (confirm('Are you sure you want to delete this travel record?')) {
        fetch(`/api/travel/${travelId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.message) {
                // Display success message
                const messageDiv = document.getElementById('message');
                messageDiv.style.color = 'green';
                messageDiv.textContent = `The travel to ${data.institution} from ${data.travelstart} to ${data.travelend} has been deleted.`;

                // Reload the travel list to reflect the deletion
                loadTravel(data.userid);
            } else if (data.error) {
                // Display error message
                const messageDiv = document.getElementById('message');
                messageDiv.style.color = 'red';
                messageDiv.textContent = `Error: ${data.error}`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const messageDiv = document.getElementById('message');
            messageDiv.style.color = 'red';
            messageDiv.textContent = `Error: ${error.message}`;
        });
    }
}

function submitUpdateUser() {
    // Use the currentUserId variable passed from the server
    const userId = window.location.pathname.split('/').pop();

    const userData = {
        userid: userId, // Include the current user's ID
        firstname: document.getElementById('firstname').value,
        surname: document.getElementById('surname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        role: document.getElementById('role').value
    };

    fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
    .then(response => {
        const messageDiv = document.getElementById('message'); 
        if (response.ok) {
            messageDiv.style.color = 'green';
            messageDiv.textContent = 'User record updated successfully!';

        } else {
            messageDiv.style.color = 'red';
            messageDiv.textContent = 'Failed to update user record. Please try again.';
            alert('Failed to update user record. Please try again.');
        }
    })
    .catch(error => {
        // Handle network or other errors
        const messageDiv = document.getElementById('message');
        messageDiv.style.color = 'red';
        messageDiv.textContent = `Error: ${error.message}`;
    });
}

function formatDateToDDMMYYYY(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
}

function loadCurrentTravel() {
    fetch('/api/current-travel') // Fetch current travel data from the backend
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Current travel data:', data); // Log the data for debugging
            travelData = data; // Store the data globally
            displayTravelData(travelData); // Display the data in the table
        })
        .catch(error => {
            console.error('Error:', error);
            const travelList = document.getElementById('travelList');
            travelList.innerHTML = '<p>An error occurred while loading travel records. Please try again later.</p>';
        });
}

// Display travel data in the table
function displayTravelData(data) {
    const travelTableBody = document.getElementById('travelTableBody');
    travelTableBody.innerHTML = ''; // Clear existing rows

    if (data.length === 0) {
        travelTableBody.innerHTML = '<tr><td colspan="8">No travel records found.</td></tr>';
        return;
    }

    data.forEach(travel => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${travel.travelid}</td>
            <td>${travel.userid}</td>
            <td>${travel.institution}</td>
            <td>${travel.city}</td>
            <td>${travel.country}</td>
            <td>${formatDateToDDMMYYYY(travel.travelstart)}</td>
            <td>${formatDateToDDMMYYYY(travel.travelend)}</td>

        `;
        travelTableBody.appendChild(row);
    });
}

function filterCountries() {
    const input = document.getElementById('searchBox').value.toLowerCase();
    const rows = document.querySelectorAll('#countryTable tbody tr'); // Only target rows in <tbody>

    rows.forEach(row => {
        const countryNameCell = row.querySelector('td'); // Get the first <td> in the row
        if (countryNameCell) { // Ensure the <td> exists
            const countryName = countryNameCell.textContent.toLowerCase();
            if (countryName.includes(input)) {
                row.style.display = ''; // Show the row if it matches the filter
            } else {
                row.style.display = 'none'; // Hide the row if it doesn't match
            }
        }
    });
}
function setDefaultDates() {
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);
    const formattedToday = today.toISOString().split('T')[0];
    const formattedThreeDaysAgo = threeDaysAgo.toISOString().split('T')[0];

    fromDateInput.value = formattedFromDate;
    toDateInput.value = formattedToDate; 
}
    
// Fetch incident news for current travel records
function searchNews() {
    // Get user-provided search criteria
    const keyword = document.getElementById('filterKeyword').value.trim();
    let fromDate = document.getElementById('filterFromDate').value;
    let toDate = document.getElementById('filterToDate').value;
    const searchIn = document.getElementById('searchIn').value;

    if (fromDate) {
        fromDate = formatDateToYYYYMMDD(fromDate); // Format date to YYYY-MM-DD
    }
    if (toDate) {   
        toDate = formatDateToYYYYMMDD(toDate); // Format date to YYYY-MM-DD
    }
    const params = new URLSearchParams({
        keyword: keyword || 'news',
        from: fromDate,
        to: toDate,
        searchIn: searchIn
    });

    fetch(`/api/news?${params.toString()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(newsData => {
            const newsResults = document.getElementById('newsResults');
            if (newsData.length === 0) {
                newsResults.innerHTML = '<p>No news articles found for the given criteria.</p>';
            } else {
                const articles = newsData.map(article => `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">${article.title}</h5>
                            <p class="card-text">${article.description || 'No description available.'}</p>
                            <a href="${article.url}" target="_blank" class="btn btn-primary">Read More</a>
                        </div>
                    </div>
                `).join('');
                newsResults.innerHTML = articles;
            }
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            const newsResults = document.getElementById('newsResults');
            newsResults.innerHTML = '<p>An error occurred while fetching news. Please try again later.</p>';
        });
}

function formatDateToYYYYMMDD(dateString) {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`; // Format to YYYY-MM-DD
}

function filterTravel() {
    const cityFilter = document.getElementById('filterCity').value.toLowerCase();
    const countryFilter = document.getElementById('filterCountry').value.toLowerCase();
    const startDateFilter = document.getElementById('filterStartDate').value;
    const endDateFilter = document.getElementById('filterEndDate').value;

    const filteredData = travelData.filter(travel => {
        const matchesCity = travel.city.toLowerCase().includes(cityFilter);
        const matchesCountry = travel.country.toLowerCase().includes(countryFilter);
        const matchesStartDate = !startDateFilter || new Date(travel.travelstart) >= new Date(startDateFilter);
        const matchesEndDate = !endDateFilter || new Date(travel.travelend) <= new Date(endDateFilter);

        return matchesCity && matchesCountry && matchesStartDate && matchesEndDate;
    });

    displayTravelData(filteredData); // Update the table with filtered data
}

function loadCountryList() {
    fetch('/api/countries') // Fetch data from the new API endpoint
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            const countryTableBody = document.querySelector('#countryTable tbody');
            countryTableBody.innerHTML = ''; // Clear existing content

            data.forEach(country => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${country.name.common}</td>
                    <td>
                        <a href="/country-details/${country.name.common.toLowerCase().replace(/ /g, '-')}" class="btn btn-link">
                            View Details
                        </a>
                    </td>
                `;
                countryTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error loading country list:', error);
            const countryTableBody = document.querySelector('#countryTable tbody');
            countryTableBody.innerHTML = '<tr><td colspan="2">An error occurred while loading the country list. Please try again later.</td></tr>';
        });
};

function loginAsAdmin() {
    const userid = document.getElementById('userid').value;

    if (!userid) {
        alert('Please enter your User ID before logging in as an administrator.');
        return;
    }

    fetch(`/api/check-admin/${userid}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.isAdmin) {
                // Set the session for the admin user
                fetch(`/api/admin-login/${userid}`, { method: 'POST' })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(() => {
                        // Redirect to the admin dashboard
                        window.location.href = `/admin-dashboard/${userid}`;
                    })
                    .catch(error => {
                        console.error('Error during admin login:', error);
                        alert('An error occurred while logging in as an administrator. Please try again.');
                    });
            } else {
                alert('You do not have administrator privileges.');
            }
        })
        .catch(error => {
            console.error('Error checking admin status:', error);
            alert('An error occurred while checking admin status. Please try again.');
        });
}

function downloadNames() {
    fetch('/api/download-names')    
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
        return response.blob(); // Get the response as a blob
        })
    .then(blob => {
        const url = window.URL.createObjectURL(blob); // Create a URL for the blob
        const a = document.createElement('a'); // Create an anchor element
        a.href = url; // Set the href to the blob URL
        a.download = 'names.csv'; // Set the download attribute with a filename
        document.body.appendChild(a); // Append the anchor to the body
        a.click(); // Programmatically click the anchor to trigger the download
        a.remove(); // Remove the anchor from the document
        })
    .catch(error => {
        console.error('Error downloading names:', error);
        alert('An error occurred while downloading names. Please try again.');
    });
}
