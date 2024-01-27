$(document).ready(function () {
    let currentPage = 1;
    const pageSize = 100;
    let data; // Global variable to store fetched data
    $('.remove-button').click(function (event) {
        const fileId = $(this).data('fileid');

        // Display confirmation dialog
        const isConfirmed = confirm(`Are you sure you want to remove the file?`);

        if (isConfirmed) {
            // Make an AJAX request to remove the file
            $.ajax({
                url: `/removeFile/${fileId}`,
                type: 'DELETE',
                success: function (response) {
                    // Handle successful removal (you can reload the file list or update the UI)
                    console.log(response);

                    // For example, you can reload the file list after removal
                    location.reload();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error('Error removing file:', errorThrown);
                    console.error('Response Text:', jqXHR.responseText);
                }
            });
        }
    });

    // Event handler for clicking on file names
    $('.file-link').click(function () {
        const fileId = $(this).data('fileid');
    
        // Reset currentPage to 1 when a new file is selected
        currentPage = 1;
    
        // Check if the table is currently visible
        const isTableVisible = $('#tableContainer').is(':visible');
    
        // Make sure fileId is not undefined or null
        if (fileId) {
            // Make an AJAX request to fetch file data
            $.ajax({
                url: `/getFileData/${fileId}`,
                type: 'GET',
                success: function (fetchedData) {
                    data = fetchedData; // Assign fetched data to the global variable
                    displayTable(); // Display the table with pagination
    
                    // Toggle the visibility of the table based on its previous state
                    $('#tableContainer').toggle(!isTableVisible);
    
                    // Update pagination controls based on table visibility
                    if (isTableVisible) {
                        // Table is visible, hide "Next" button
                        $('#paginationControls button:contains("Next")').hide();
                    } else {
                        // Table is hidden, show "Next" button if needed
                        displayPaginationControls();
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error('Error fetching file data:', errorThrown);
                    console.error('Response Text:', jqXHR.responseText);
                }
            });
        } else {
            console.error('FileId is missing');
        }
    });


    function displayTable() {
        if (!data || data.length === 0) {
            // Handle case where data is empty or undefined
            $('#tableContainer').html('<p>No data available.</p>');
            return;
        }
    
        // Assuming data is an array of objects where each object represents a row
        let tableHtml = '<table border="1"><tr>';
    
        // Create table headers (use the keys from the first row, assuming all rows have the same structure)
        const headerKeys = Object.keys(data[0]);
        for (const key of headerKeys) {
            tableHtml += `<th>${key}</th>`;
        }
        tableHtml += '</tr>';
    
        // Calculate start and end index for pagination
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = currentPage * pageSize;
        const paginatedData = data.slice(startIndex, endIndex);
    
        // Create table rows
        paginatedData.forEach(row => {
            tableHtml += '<tr>';
            for (const key of headerKeys) {
                tableHtml += `<td>${row[key]}</td>`;
            }
            tableHtml += '</tr>';
        });
    
        tableHtml += '</table>';
    
        // Display the table in the 'tableContainer' div
        $('#tableContainer').html(tableHtml);
    
        // Display pagination controls
        displayPaginationControls();
    }


    // Function to display pagination controls
    function displayPaginationControls() {
        const totalPages = Math.ceil(data.length / pageSize);
    
        // Clear the pagination controls before rendering
        $('#paginationControls').html('');
    
        // Display "Prev" button if not on the first page
        if (currentPage > 1) {
            $('#paginationControls').append(`<button onclick="prevPage()">Prev</button>`);
        }
    
        // Display "Next" button if not on the last page
        if (currentPage < totalPages) {
            $('#paginationControls').append(`<button onclick="nextPage()">Next</button>`);
        }
    }
    // Function to go to a specific page
    window.goToPage = function (page) {
        currentPage = page;
        displayTable();
    };

    // Function to go to the previous page
    window.prevPage = function () {
        if (currentPage > 1) {
            currentPage--;
            displayTable();
        }
    };

    // Function to go to the next page
    window.nextPage = function () {
        const totalPages = Math.ceil(data.length / pageSize);
        if (currentPage < totalPages) {
            currentPage++;
            displayTable();
        }
    };
});