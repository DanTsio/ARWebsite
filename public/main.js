const rowsPerPage = 26;
let currentPage = 1;

function loadTable() {
    fetch("/api/Database.json")
    .then((res) => res.json())
    .then((json) => loadProducts((json)))
}

function loadPages() {
    fetch("/api/Database.json")
    .then((res) => res.json())
    .then((json) => displayTable(currentPage, json))
}

function displayTable(page, data) {

    const DatabaseContainer = document.getElementById("DatabaseContainer");
    DatabaseContainer.addEventListener("click", selectEntry);

    console.log(data)
    const table = document.getElementById("myTable"); 
    const startIndex = (page - 1) * rowsPerPage; 
    const endIndex = startIndex + rowsPerPage; 
    const slicedData = data.slice(startIndex, endIndex); 
    console.log(slicedData)
    // Clear existing table rows 
    table.innerHTML = ` 
    <tr> 
        <th>ID</th> 
        <th>Product</th> 
        <th>Price</th> 
        <th>Price Per Kilo</th> 
    </tr> 
    `; 

    // Add new rows to the table 
    slicedData.forEach(item => { 
        const row = table.insertRow(); 
        const idCell = row.insertCell(0); 
        const productCell = row.insertCell(1); 
        const priceCell = row.insertCell(2);
        const pricePerKiloCell = row.insertCell(3);
        idCell.innerHTML = item.id; 
        productCell.innerHTML = item.product; 
        priceCell.innerHTML = item.price;
        pricePerKiloCell.innerHTML = item.pricekilo;
    }); 

    // Update pagination 
    updatePagination(page, data); 
} 

function updatePagination(currentPage, data) { 
    const pageCount = Math.ceil(data.length / rowsPerPage); 
    const paginationContainer = document.getElementById("pagination"); 
    paginationContainer.innerHTML = ""; 

    for (let i = 1; i <= pageCount; i++) { 
        const pageLink = document.createElement("a"); 
        pageLink.href = "#"; 
        pageLink.innerText = i; 
        pageLink.onclick = function () { 
            displayTable(i, data); 
        }; 
        if (i === currentPage) { 
            pageLink.style.fontWeight = "bold"; 
        } 
        paginationContainer.appendChild(pageLink); 
        paginationContainer.appendChild(document.createTextNode(" ")); 
    } 
}

function loadProducts(Entries) {

    const DatabaseContainer = document.getElementById("DatabaseContainer");
    DatabaseContainer.addEventListener("click", selectEntry);

    let Table = `<table class="TableStyle"><tr><th>ID</th>
        <th>Product</th><th>Price</th><th>Price Per Kilo</th></tr>`

    for (let entry  of Entries) {
        Table += `<tr>
            <td>${entry.id}</td>
            <td>${entry.product}</td>
            <td>${entry.price}</td>
            <td>${entry.pricekilo}</td>
            </tr>`;
    }
    Table += "</table>";

    DatabaseContainer.innerHTML = Table;
}

function selectEntry(event) {
    if (!event.target.outerHTML.startsWith("<td>")) return;
    let aRow = event.target.parentNode;
    let inputs=document.querySelectorAll("#linkForm input");
    for (let i=0; i < inputs.length; i++){
        inputs[i].value = aRow.children[i].innerText;
    } 
    let rows = [...aRow.parentNode.children];
    rows.forEach((r => r.classList.remove("selected")));
    aRow.classList.add("selected");            
}

function getFormData() {
    let aSong = {
        id: document.querySelector("#linkForm [name='id']").value,
        product: document.querySelector("#linkForm [name='product']").value,
        price: document.querySelector("#linkForm [name='price']").value,
        pricekilo: document.querySelector("#linkForm [name='pricekilo']").value
    };
    return JSON.stringify(aSong);
}

function addEntry() {
    let bodyData = getFormData();
    fetch(`/api/Database.json`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: bodyData
    })
        .then((res) => res.json())
        .then((json) => {
            alert(json);
            loadPages();
        })
        .catch((err) => alert("error:", err));
}

function updateEntry() {
    let bodyData = getFormData();
    fetch(`/api/Database.json/`+bodyData.id, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PUT",
        body: bodyData
    })
        .then((res) => res.json())
        .then((json) => {
            alert(json);
            loadPages();
        })
        .catch((err) => alert("error:", err));
}

function removeEntry() {
    let bodyData = getFormData();
    fetch(`/api/Database.json/`+bodyData.id, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "DELETE",
        body: bodyData
    })
        .then((res) => res.json())
        .then((json) => {
            alert(json);
            loadPages();
        })
        .catch((err) => alert("error:", err));
}

function togglePopup() {
    const overlay = document.getElementById("popupOverlay");
    overlay.classList.toggle("show");
}