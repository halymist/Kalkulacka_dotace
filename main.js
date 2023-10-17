import { tables, HeadlineNames } from "./tabulky.js";

let currentSlide = 1;
const parentContainer = document.getElementById("slide-container");
const container = document.getElementById("current-slide");
const headline = document.getElementById("headline");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");

let mladyZemedelec = false;
let malyZemedelec = false;
let sazba = 'EUR';

let csvData = [];
let savedSlides = [];


function Init() {
  container.innerHTML = '';

  const mladyLabel = document.createElement('label');
  mladyLabel.textContent = 'Mladý zemědělec:';
  container.appendChild(mladyLabel);
  
  const mladyYesInput = document.createElement('input');
  mladyYesInput.setAttribute('type', 'radio');
  mladyYesInput.setAttribute('name', 'mlady');
  mladyYesInput.setAttribute('value', 'true');
  mladyYesInput.id = "mladyYes"
  container.appendChild(mladyYesInput);
  container.appendChild(document.createTextNode('Ano'));

  
  const mladyNoInput = document.createElement('input');
  mladyNoInput.setAttribute('type', 'radio');
  mladyNoInput.setAttribute('name', 'mlady');
  mladyNoInput.setAttribute('value', 'false');
  mladyNoInput.id = "mladyNo" 
  container.appendChild(mladyNoInput);
  container.appendChild(document.createTextNode('Ne'));

  if (mladyZemedelec) {
    mladyYesInput.setAttribute('checked', 'true');
  } else {
    mladyNoInput.setAttribute('checked', 'true');
  }

  mladyYesInput.addEventListener('click', function() {
    mladyZemedelec = true;
  });

  mladyNoInput.addEventListener('click', function() {
    mladyZemedelec = false;
  });
  
    // Create labels and radio inputs for "Malý zemědělec"
  const malyLabel = document.createElement('label');
  malyLabel.textContent = 'Malý zemědělec:';
  container.appendChild(malyLabel);
  
  const malyYesInput = document.createElement('input');
  malyYesInput.setAttribute('type', 'radio');
  malyYesInput.setAttribute('name', 'maly');
  malyYesInput.setAttribute('value', 'true');
  malyYesInput.id = "malyYes" 
  container.appendChild(malyYesInput);
  container.appendChild(document.createTextNode('Ano'));
  
 
  const malyNoInput = document.createElement('input');
  malyNoInput.setAttribute('type', 'radio');
  malyNoInput.setAttribute('name', 'maly');
  malyNoInput.setAttribute('value', 'false');
  malyNoInput.id = "malyNo" 
  container.appendChild(malyNoInput);
  container.appendChild(document.createTextNode('Ne'));

  if (malyZemedelec) {
    malyYesInput.setAttribute('checked', 'true');
  } else {
    malyNoInput.setAttribute('checked', 'true');
  }

  malyYesInput.addEventListener('click', function() {
    malyZemedelec = true;
  });

  malyNoInput.addEventListener('click', function() {
    malyZemedelec = false;
  });
  
    // Create labels and radio inputs for "Sazba"
  const sazbaLabel = document.createElement('label');
  sazbaLabel.textContent = 'Sazba:';
  container.appendChild(sazbaLabel);
  

  const sazbaEurInput = document.createElement('input');
  sazbaEurInput.setAttribute('type', 'radio');
  sazbaEurInput.setAttribute('name', 'sazba');
  sazbaEurInput.setAttribute('value', 'true');
  if (sazba == 'EUR') {
    sazbaEurInput.setAttribute('checked', 'true');
  }
  sazbaEurInput.id = "sazbaEur" 
  container.appendChild(sazbaEurInput);
  container.appendChild(document.createTextNode('EUR'));

  

  const sazbaCzkInput = document.createElement('input');
  sazbaCzkInput.setAttribute('type', 'radio');
  sazbaCzkInput.setAttribute('name', 'sazba');
  sazbaCzkInput.setAttribute('value', 'false');
  if (sazba == 'CZK') {
    sazbaCzkInput.setAttribute('checked', 'true');
  }
  sazbaCzkInput.id = "sazbaCzk" 
  container.appendChild(sazbaCzkInput);
  container.appendChild(document.createTextNode('CZK'));

  sazbaEurInput.addEventListener('click', function() {
    sazba = 'EUR';
  });

  sazbaCzkInput.addEventListener('click', function() {
    sazba = 'CZK';
  });

}

function updateButtons() {
  if (currentSlide == 1) {
    prevButton.style.display = "none";
    prevButton.disabled = true;
    prevButton.classList.add("prev-button-class");
    nextButton.classList.remove("next-button-class"); // Remove the old class
    nextButton.classList.add("start-button-class"); // Add the new class
    nextButton.textContent = "Start";
  } else if (currentSlide == 2) {
    prevButton.style.display = "block";
    prevButton.disabled = false;
    nextButton.classList.remove("start-button-class"); // Remove the old class
    nextButton.classList.add("next-button-class");
    nextButton.textContent = "Další";
  } else if ((Object.keys(tables)).length === currentSlide - 2) {
    nextButton.style.display = "none";
    nextButton.disabled = true;
  } else if ((Object.keys(tables)).length === currentSlide - 1) {
    nextButton.style.display = "block";
    nextButton.disabled = false;
    nextButton.textContent = "Dokončit";
  } else if ((Object.keys(tables)).length === currentSlide) {
    nextButton.style.display = "block";
    nextButton.disabled = false;
    nextButton.textContent = "Další";
  }
}

function loadSlide() {
  updateButtons();
  if (currentSlide == 1) {
    if (parentContainer.classList.contains('slide')) {
      parentContainer.classList.remove('slide');
    }
    parentContainer.classList.add('start');
    headline.textContent = "Kalkulačka";
    Init();
  } else if ((Object.keys(tables)).length === currentSlide - 2) {
    headline.textContent = "Výsledek";
    if (parentContainer.classList.contains('slide')) {
      parentContainer.classList.remove('slide');
    }
    parentContainer.classList.add('final');
    Results();
  } else {
    if (parentContainer.classList.contains('start')) {
      parentContainer.classList.remove('start');
      parentContainer.classList.add('slide');
    }
    if (parentContainer.classList.contains('final')) {
      parentContainer.classList.remove('final');
      parentContainer.classList.add('slide');
    }

    container.innerHTML = '';
    headline.textContent = HeadlineNames[currentSlide - 2];

    let tableData;
    if (savedSlides.some(slide => slide.slideNumber === currentSlide)) {
      const currentSlideData = savedSlides.find(savedSlide => savedSlide.slideNumber === currentSlide);
      tableData = currentSlideData.slideData.tableData;
      const numberOfColumns = tableData.length > 0 ? tableData[0].length : 0;
      createTable(tableData, numberOfColumns)
      if (currentSlideData.sazbaSetting !== sazba) {
        addSazba();
        recalculateResults();
      } 
    } else {
      const tableName = `tableData${currentSlide}`;
      tableData = tables[tableName];
    
      const numberOfColumns = tableData.length > 0 ? tableData[0].length : 0;
      createTable(tableData, numberOfColumns)
      addSazba();
    }
  }
  if (currentSlide === 2) {
    const plochaInput = document.querySelector('td.plochaInput:not([input]:disabled) input[type="number"]');
    console.log(plochaInput); 
    updateDisabledInputsValue(plochaInput);
    calculateAll();
}

  addInfo();
}



function createTable(tableData, numberOfColumns) {
  const table = document.createElement('table');
  table.classList.add('Table');

  const tableHead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  let headers;
  if (numberOfColumns == 4) {
    headers = ['Titul', sazba, 'Plocha', 'Výpočet'];
  } else {
    headers = ['Intervence','Titul', sazba , 'Plocha', 'Výpočet'];
  }
  const columnWidths = (numberOfColumns === 4) ? ['40%', '20%', '20%', '20%'] : ['30%', '30%', '10%', '20%', '15%'];

 
  for (let i = 0; i < numberOfColumns; i++) {
    const header = headers[i];
    const th = document.createElement('th');
    th.textContent = header;

    // Set the width based on the conditions
    th.style.width = columnWidths[i];

    headerRow.appendChild(th);

    if (header === '') {
        th.classList.add('sazbaHeader');
    }
  }

  tableHead.appendChild(headerRow);
  table.appendChild(tableHead);

  const tableBody = document.createElement('tbody');
  let numberOfGeneratedInputs = 0;
  for (const row of tableData) {
    const tr = document.createElement('tr');

  
    // Create cells for each column
    for (let i = 0; i < headers.length; i++) {
      const td = document.createElement('td');

      tr.appendChild(td);
      switch (headers[i]) {
        case 'Intervence':
          td.className = 'intervence';
          td.textContent = row[i] ?? '';
          break;
        case 'Titul':
          td.className = 'titul';
          td.textContent = row[i] ?? '';
          break;
        case 'EUR':
          td.className = 'sazbaValue';
          td.textContent = row[i] ?? '';
          break;
        case 'CZK':
          td.className = 'sazbaValue';
          td.textContent = row[i] ?? '';
          break;
        case 'Plocha':
          if (currentSlide === 2) {
            numberOfGeneratedInputs = numberOfGeneratedInputs + 1
            if (numberOfGeneratedInputs > 1) {
              td.innerHTML = '<input type="number" disabled>';
              td.className = 'plochaInput';
              let plochaInput = td.querySelector('input');
              plochaInput.value = row[i] ?? '0';

            } else {
              td.innerHTML = '<input type="number">';
              td.className = 'plochaInput';
              let plochaInput = td.querySelector('input');
              plochaInput.value = row[i] ?? '0';

              plochaInput.addEventListener('input', () => {
                // Check if the input value is empty
                if (plochaInput.value === '' || plochaInput.value < 0) {
                  plochaInput.value = '0'; // Set it to 0 
                } else if (/^0\d/.test(plochaInput.value)) {
                  // If the input value starts with "0" followed by a digit, remove leading zeroes
                  plochaInput.value = parseInt(plochaInput.value, 10).toString();
                }
  
                updateDisabledInputsValue(plochaInput);
                calculateAll()
              });
            }
          } else {
            td.innerHTML = '<input type="number">';
            td.className = 'plochaInput';
            let plochaInput = td.querySelector('input');
            plochaInput.value = row[i] ?? '0';

            plochaInput.addEventListener('input', () => {
              // Check if the input value is empty
              if (plochaInput.value === '' || plochaInput.value < 0) {
                plochaInput.value = '0'; // Set it to 0 
              } else if (/^0\d/.test(plochaInput.value)) {
                // If the input value starts with "0" followed by a digit, remove leading zeroes
                plochaInput.value = parseInt(plochaInput.value, 10).toString();
              }

              calculate(td, plochaInput)
            });
          }

          break;
        case 'Výpočet':
          td.className = 'vypocet';
          td.textContent = row[i] ?? '0';
          break;
        default:
          break;
      }
    }

    tableBody.appendChild(tr);
  }

  table.appendChild(tableBody);
  container.appendChild(table);

}

function updateDisabledInputsValue(plochaInput) {

  const tbody = document.querySelector('table tbody');
  let rows = tbody.querySelectorAll('tr');


  rows.forEach(row => {
    const intervenceElement = row.closest('tr').querySelector('.intervence');
    const disabledInput = row.querySelector('.plochaInput input:disabled');
    if (disabledInput) {
      if (!mladyZemedelec && intervenceElement.textContent === 'Mladí zemědělci' || (!malyZemedelec && intervenceElement.textContent === 'Malý subjekt')) {
        disabledInput.value = 0;
      } else {
        disabledInput.value = plochaInput.value
      }
    }
  });
}




function loadCsv() {
  Papa.parse('kalkulacka.csv', {
    download: true,
    header: true,
    delimiter: ';',
    complete: function (results) {
      // The parsed data is available in results.data
      csvData = results.data
      console.log(csvData)
    },
    error: function (error) {
      console.error('Error parsing CSV:', error);
    }
  });
}

function saveSlide() {
  const slideData = {};

  const tableElement = document.querySelector('.Table');
  if (tableElement) {
    slideData.tableData = [];
    const tbody = tableElement.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
      const rowData = [];
      const input = row.querySelector('input[type="number"]');
      const cells = row.querySelectorAll('td');
      cells.forEach(cell => {
        if (cell.contains(input)) {
          rowData.push(input.value)
        } else {
          const span = cell.querySelector('span')
          if (span) {
            rowData.push(cell.childNodes[0].textContent.trim());
          } else {
            rowData.push(cell.textContent);
          }
        }
      });
      console.log(rowData)
      slideData.tableData.push(rowData);
    });


    const existingSlideIndex = savedSlides.findIndex(savedSlide => savedSlide.slideNumber === currentSlide);

    if (existingSlideIndex !== -1) {
      // Update the existing slide data
      savedSlides[existingSlideIndex].slideData = slideData;
      savedSlides[existingSlideIndex].sazbaSetting = sazba;

    } else {
      const slide = {
        slideNumber: currentSlide,
        slideData: slideData,
        sazbaSetting: sazba,
      };
      savedSlides.push(slide);
    }
  }
}

function calculate(td, plochaInput) {
  const sazbaValue = parseFloat(td.previousElementSibling.textContent.replace(',', '.'));
  const inputValue = parseFloat(plochaInput.value);
  
  if (!isNaN(sazbaValue) && !isNaN(inputValue)) {
    const result = (sazbaValue * inputValue).toFixed(2);
    td.nextElementSibling.textContent = result;
  }
}

function calculateAll() {
  const plochaInputs = document.querySelectorAll('.plochaInput input');
  const sazbaValues = document.querySelectorAll('.sazbaValue');
  const vypocetCells = document.querySelectorAll('.vypocet');

  plochaInputs.forEach((plochaInput, index) => {
    const inputValue = parseFloat(plochaInput.value) || 0;
    const sazbaValue = parseFloat(sazbaValues[index].textContent.replace(',', '.')) || 0;
    const result = (sazbaValue * inputValue).toFixed(2);
    vypocetCells[index].textContent = result;
  });
}

function recalculateResults() {
  const rows = document.querySelectorAll('.Table tbody tr');
  rows.forEach(row => {
    const tds = row.querySelectorAll('td.plochaInput');
    tds.forEach(td => {
      let plochaInput = td.querySelector('input');
      calculate(td, plochaInput);
    });
  });
}

const titulInfoPairs = [];
function addSazba() {
  let csvSazba;
  if (sazba === 'EUR') {
    csvSazba = 'Sazba (EUR)'
  } else {
    csvSazba = 'Sazba (Kč)'
  }
  const titulElements = document.querySelectorAll('.titul');
  titulElements.forEach(titulElement => {
    const tdText = titulElement.textContent;
    const matchingRow = csvData.find(row => row['titul'] === tdText);

    if (matchingRow) {
      const sazbaValue = matchingRow[csvSazba];
      const sazbaTd = titulElement.closest('tr').querySelector('.sazbaValue');
      sazbaTd.textContent = sazbaValue;

      titulInfoPairs.push({ titul: tdText, info: matchingRow['info'] });
    } else {
      console.log('No matching row found for:', tdText);
    }
  })
}

function addInfo() {
  const titulElements = document.querySelectorAll('td.titul');
  
  titulElements.forEach(titulElement => {
      const titulText = titulElement.textContent;
      const matchingPair = titulInfoPairs.find(pair => pair.titul === titulText);

      if (matchingPair) {
          const infoSpan = document.createElement('span');
          infoSpan.textContent = matchingPair.info;
          titulElement.appendChild(infoSpan);
      }
  });
}

function Results() {
  container.innerHTML = '';
  const slideResults = [];
  console.log(savedSlides)
  savedSlides.forEach(savedSlide => {
    const tableData = savedSlide.slideData.tableData;

    let result = 0;
    tableData.forEach(row => {
      const lastIndex = row.length - 1;
      const lastElement = parseFloat(row[lastIndex].replace(",", ".")) || 0;
      result += lastElement;
    });
     slideResults.push({
      slideNumber: savedSlide.slideNumber,
      result: result,
    });
  });
  console.log(slideResults);

  tableResultsSummary();

  const tableContainer = document.createElement('div');
  tableContainer.id = 'table-container';
  container.appendChild(tableContainer);

  tableResults1(tableContainer);
  tableResults2(slideResults, tableContainer);

  //table Pilir 1
  const table1 = document.getElementById('Pilir1');
  const vypocetCells1 = table1.querySelectorAll('.Vysledek');

  let sum1 = 0;
  vypocetCells1.forEach(cell => {
    sum1 += parseFloat(cell.textContent);
  });

  const pilir1 = document.getElementById('vysledekPilir1');
  pilir1.textContent = sum1;

  //table Pilir 2
  const table2 = document.getElementById('Pilir2');
  const vypocetCells2 = table2.querySelectorAll('.Vysledek');

  let sum2 = 0;
  vypocetCells2.forEach(cell => {
    sum2 += parseFloat(cell.textContent);
  });

  const pilir2 = document.getElementById('vysledekPilir2');
  pilir2.textContent = sum2;

  const celkem = document.getElementById('Celkem');
  celkem.textContent = sum1 + sum2;
}
  

prevButton.addEventListener("click", () => {
  saveSlide();
  currentSlide = currentSlide - 1;
  loadSlide();
  updateProgessBar();
  parentContainer.classList.add("slideRight");

  setTimeout(() => {
    parentContainer.classList.remove("slideRight");
  }, 400);
});

nextButton.addEventListener("click", () => {
  saveSlide();
  currentSlide = currentSlide + 1;
  loadSlide();
  updateProgessBar();
  parentContainer.classList.add("slideLeft");

  setTimeout(() => {
    parentContainer.classList.remove("slideLeft");
  }, 400);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    // Left arrow key was pressed
    prevButton.click();
  } else if (event.key === "ArrowRight") {
    // Right arrow key was pressed
    nextButton.click();
  }
});





function tableResults1(tableContainer) {
const resultSlide = savedSlides.find(savedSlide => savedSlide.slideNumber == 2);
const tableData = resultSlide.slideData.tableData;
console.log(tableData)

const table = document.createElement('table');
table.id = 'Pilir1';

// Create the table header
const thead = document.createElement('thead');
const headerRow = thead.insertRow();

// Create header cells
const headerCell1 = document.createElement('th');
headerCell1.textContent = "Titul";
headerRow.appendChild(headerCell1);

const headerCell2 = document.createElement('th');
headerCell2.textContent = "Výsledek";
headerRow.appendChild(headerCell2);

// Append the header to the table
table.appendChild(thead);

// Create the table body and populate it with data
const tbody = document.createElement('tbody');
tableData.forEach(row => {
  const rowElement = tbody.insertRow();
  const cell1 = rowElement.insertCell();
  cell1.textContent = row[1];
  const cell2 = rowElement.insertCell();
  cell2.classList.add('Vysledek');
  cell2.textContent = row[4]; 
  
});

table.appendChild(tbody);
tableContainer.appendChild(table);

}


function tableResults2(slideResults, tableContainer) {
  const table = document.createElement('table');
  table.id = 'Pilir2';

  // Create the table header with two columns: Slide Number and Result
  const thead = document.createElement('thead');
  const headerRow = thead.insertRow();
  const slideNumberHeader = document.createElement('th');
  slideNumberHeader.textContent = 'Titul';
  const resultHeader = document.createElement('th');
  resultHeader.textContent = 'Výsledek';
  headerRow.appendChild(slideNumberHeader);
  headerRow.appendChild(resultHeader);

  // Append the header to the table
  table.appendChild(thead);

  // Create the table body and populate it with data
  const tbody = document.createElement('tbody');
  slideResults.forEach(result => {
    if (result.slideNumber != 2) {
      const row = tbody.insertRow();
      const slideNumberCell = row.insertCell();
      slideNumberCell.textContent = HeadlineNames[result.slideNumber - 2];
      const resultCell = row.insertCell();
      resultCell.classList.add('Vysledek');
      resultCell.textContent = result.result;
    }
  });

  // Append the body to the table
  table.appendChild(tbody);
  tableContainer.appendChild(table);
}

function tableResultsSummary() {
  // Create a table element
  const table = document.createElement('table');
  table.id = 'Summary'
  // Create the table header
  const thead = document.createElement('thead');
  const headerRow = thead.insertRow();

  // Create header cells
  const headerCell1 = document.createElement('th');
  headerCell1.textContent = 'Pilíř';
  const headerCell2 = document.createElement('th');
  headerCell2.textContent = 'Výsledek';

  headerRow.appendChild(headerCell1);
  headerRow.appendChild(headerCell2);

  table.appendChild(thead);
  const tbody = document.createElement('tbody');

  // Row 1
  const row1 = tbody.insertRow();
  const cell1_1 = row1.insertCell();
  cell1_1.textContent = 'Pilíř I';
  const cell1_2 = row1.insertCell();
  cell1_2.id = 'vysledekPilir1';

  // Row 2
  const row2 = tbody.insertRow();
  const cell2_1 = row2.insertCell();
  cell2_1.textContent = 'Pilíř II';
  const cell2_2 = row2.insertCell();
  cell2_2.id = 'vysledekPilir2';

  // Row 2
  const row3 = tbody.insertRow();
  const cell3_1 = row3.insertCell();
  cell3_1.textContent = 'Celkem';
  const cell3_2 = row3.insertCell();
  cell3_2.id = 'Celkem';

  // Append the body to the table
  table.appendChild(tbody);

  // Add the table to your container (assuming you have a container with the id 'resultContainer')
  
  container.appendChild(table);
}

let progressBar;
const tablesLenght = (Object.keys(tables).length + 2);
function updateProgessBar(){

  if ((currentSlide === 2 && !progressBar) || (currentSlide === tablesLenght - 1 && !progressBar) ) {
    console.log("k")
    progressBar = document.createElement('div');
    progressBar.id = 'progress';
  
    document.body.appendChild(progressBar); 
  } else if ((currentSlide === 1 && progressBar) || (currentSlide === tablesLenght && progressBar)) {
    document.body.removeChild(progressBar); 
    progressBar = null;
    console.log(progressBar)
  }

  if (progressBar) {
    console.log(progressBar)

    const progressBarWidth = ((currentSlide) /tablesLenght) * 100;
    console.log(progressBarWidth)
    progressBar.style.width = progressBarWidth + '%';
  }
}



loadCsv();
loadSlide();


