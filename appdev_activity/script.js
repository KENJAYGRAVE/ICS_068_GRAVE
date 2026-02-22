// Predefined equipment
let equipment = [
    {name: "Notebook", qty: 10},
    {name: "Calculator", qty: 5},
    {name: "Ruler", qty: 15},
    {name: "Pen", qty: 20},
    {name: "Eraser", qty: 20},
    {name: "Textbook - Math", qty: 8},
    {name: "Textbook - Science", qty: 8},
];

// Load saved data
let records = JSON.parse(localStorage.getItem("records")) || [];
let returns = JSON.parse(localStorage.getItem("returns")) || [];
let savedEquipment = JSON.parse(localStorage.getItem("equipment"));
if(savedEquipment) equipment = savedEquipment;

// Save to localStorage
function saveData() {
    localStorage.setItem("records", JSON.stringify(records));
    localStorage.setItem("returns", JSON.stringify(returns));
    localStorage.setItem("equipment", JSON.stringify(equipment));
}

// Borrow equipment (Add & Borrow)
function borrowItem() {
    let borrower = document.getElementById("borrowerName").value.trim();
    let equipText = document.getElementById("equipmentSelect").value;

    if(!borrower) return alert("Enter borrower name!");
    if(!equipText) return alert("Select equipment!");

    let eqName = equipText.split(" (")[0];
    let eq = equipment.find(e => e.name === eqName);
    if(eq.qty <= 0) return alert("Selected equipment is out of stock!");

    eq.qty--;

    let now = new Date();
    let timestamp = now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,'0')+
                    "-"+String(now.getDate()).padStart(2,'0')+" "+
                    String(now.getHours()).padStart(2,'0')+":"+
                    String(now.getMinutes()).padStart(2,'0')+":"+
                    String(now.getSeconds()).padStart(2,'0');

    records.push({borrower: borrower, equipment: eq.name, date: timestamp});
    document.getElementById("borrowerName").value = "";
    saveData();
    loadData();
}

// Return equipment
function returnItem(index) {
    let record = records[index];
    let eq = equipment.find(e => e.name === record.equipment);
    if(eq) eq.qty++;

    let now = new Date();
    let returnTime = now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,'0')+
                     "-"+String(now.getDate()).padStart(2,'0')+" "+
                     String(now.getHours()).padStart(2,'0')+":"+
                     String(now.getMinutes()).padStart(2,'0')+":"+
                     String(now.getSeconds()).padStart(2,'0');

    returns.push({
        borrower: record.borrower,
        equipment: record.equipment,
        borrowedDate: record.date,
        returnedDate: returnTime
    });

    records.splice(index, 1);
    saveData();
    loadData();
}

// Load data into dashboard
function loadData() {
    // Equipment dropdown
    document.getElementById("equipmentSelect").innerHTML = equipment.map(e =>
        `<option>${e.name}</option>`).join("");

    // Borrow records
    document.getElementById("borrowTable").innerHTML = records.map((r,i) =>
        `<tr>
            <td>${r.borrower}</td>
            <td>${r.equipment}</td>
            <td>${r.date}</td>
            <td><button onclick="returnItem(${i})">Return</button></td>
        </tr>`).join("");

    // Return records
    document.getElementById("returnTable").innerHTML = returns.map(r =>
        `<tr>
            <td>${r.borrower}</td>
            <td>${r.equipment}</td>
            <td>${r.borrowedDate}</td>
            <td>${r.returnedDate}</td>
        </tr>`).join("");

    // Dashboard stats
    document.getElementById("totalEquip").innerText = equipment.length;
    document.getElementById("totalBorrow").innerText = records.length;
    document.getElementById("totalReturn").innerText = returns.length;
}

loadData();