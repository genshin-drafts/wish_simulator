const finalizeBtn = document.getElementById('finalizeBtn');

window.generateChart = async function () {
    try {
        // Get the value of the wishes input
        const wishes = document.getElementById('wishesInput').value;
        if (wishes == 0) {
            alert("Adicione o número de tiros!")
            return;
        }
        // Get the value of the wishes input
        const pity_char = document.getElementById('charPity').value;
        // Get the value of the wishes input
        const pity_weap = document.getElementById('weapPity').value;

        const charGaranteed = document.querySelector('input[name="charGuaranteed"]:checked').value == "yes";
        const weapGaranteed = document.querySelector('input[name="weapGuaranteed"]:checked').value == "yes";
        const weapFate = document.querySelector('input[name="weapFate"]:checked').value == "yes";

        // const wishes = 100; // Adjust this value as needed
        const prio = resultArray;
        let { result_data, success, leftover_wishes_avg } = simulate(wishes, prio, pity_char, charGaranteed, pity_weap, weapGaranteed, weapFate);

        const threshold = 0.1;
        let labels_original = getLabels(prio);

        // Filter the array to remove values lower than the threshold
        let dataArray = result_data;
        dataArray.shift();
        dataArray = dataArray.filter(value => value >= threshold);
        let labels = labels_original.slice(0, dataArray.length);

        while (dataArray.length < 3) {
            dataArray.push(0);
            labels.push('');
        }

        // Update chart info text
        document.getElementById('successRate').innerText = `Chance de pegar ${labels_original[labels_original.length - 1]}: ${success.toFixed(2)}%`;
        document.getElementById('avgWishesLeft').innerText = `Média do número de desejos que sobraram no fim: ${leftover_wishes_avg.toFixed(2)}`;

        // Get the context of the canvas
        const ctx = document.getElementById('myBarChart').getContext('2d');

        // Destroy the existing chart if it exists
        if (window.myBarChart && window.myBarChart.destroy) {
            window.myBarChart.destroy();
        }

        // Create a new Chart
        window.myBarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Percentage Data',
                    data: dataArray,
                    backgroundColor: 'rgba(248, 131, 54, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,  // Set the minimum value to 0
                        max: 100,  // Set the maximum value to 100
                        ticks: {
                            callback: function (value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return tooltipItem.raw + '%';
                            }
                        }
                    }
                }
            }
        });

        // Show the canvas
        document.getElementById('myBarChart').style.display = 'block';

    } catch (error) {
        console.error("Error generating chart:", error); // Log any errors
    }
}

// Handle finalize button click
finalizeBtn.addEventListener('click', () => {

    const genBtn = document.getElementById('genBtn');
    const items = Array.from(priorityList.children);
    resultArray = new Array(12).fill(2); // Default value 2
    finalizeBtn.disabled = true;
    finalizeBtn.classList.add('disabled'); // Visual feedback for disabled button

    document.querySelectorAll('.priority-container').forEach(container => {
        container.classList.add('fixed'); // Remove disabled visual feedback
    });

    document.querySelectorAll('.buttons button').forEach(button => {
        button.innerText = button.id; // Set button text back to initial
        button.disabled = true;
        button.classList.add('disabled'); // Remove disabled visual feedback
    });

    items.forEach(item => {
        const text = item.innerText;
        const index = Array.from(priorityList.children).indexOf(item);
        if (text.startsWith('C')) {
            resultArray[index] = 0;
        } else if (text.startsWith('R')) {
            resultArray[index] = 1;
        }
    });

    genBtn.disabled = false;
});

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('charPity');
    const min = parseInt(input.min, 10);
    const max = parseInt(input.max, 10);

    function validateValue() {
        let value = parseInt(input.value, 10);

        if (isNaN(value)) {
            value = min; // Optional: set to min if empty or invalid
        } else if (value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }

        input.value = value;
    }

    input.addEventListener('input', validateValue);
    input.addEventListener('blur', validateValue);
});

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('weapPity');
    const min = parseInt(input.min, 10);
    const max = parseInt(input.max, 10);

    function validateValue() {
        let value = parseInt(input.value, 10);

        if (isNaN(value)) {
            value = min; // Optional: set to min if empty or invalid
        } else if (value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }

        input.value = value;
    }

    input.addEventListener('input', validateValue);
    input.addEventListener('blur', validateValue);
});

document.addEventListener('DOMContentLoaded', () => {
    const priorityList = document.getElementById('priorityList');
    const resetBtn = document.getElementById('resetBtn');
    const charPityInput = document.getElementById('charPity');
    const weapPityInput = document.getElementById('weapPity');
    const finalizeBtn = document.getElementById('finalizeBtn');

    let currentPriorityType = null;
    let currentPriorityValue = null;

    // Function to handle priority button clicks
    function handlePriorityClick(event) {
        const buttonValue = event.target.innerText;

        // Create a new item for the priority list with the current button value
        const item = document.createElement('div');
        item.className = 'priority-item';
        item.innerText = buttonValue;
        priorityList.appendChild(item);

        // Update the priority value and button text
        if (currentPriorityType === 'C') {
            currentPriorityValue = parseInt(buttonValue.substring(1));
            if (currentPriorityValue < 6) {
                currentPriorityValue++;
                event.target.innerText = `C${currentPriorityValue}`;
            } else {
                event.target.disabled = true;
                event.target.classList.add('disabled'); // Visual feedback for disabled button
            }
        } else if (currentPriorityType === 'R') {
            currentPriorityValue = parseInt(buttonValue.substring(1));
            if (currentPriorityValue < 5) {
                currentPriorityValue++;
                event.target.innerText = `R${currentPriorityValue}`;
            } else {
                event.target.disabled = true;
                event.target.classList.add('disabled'); // Visual feedback for disabled button
            }
        }
    }

    // Set up buttons
    document.querySelectorAll('.buttons button').forEach(button => {
        button.addEventListener('click', event => {
            const id = event.target.id;
            if (id.startsWith('C')) {
                currentPriorityType = 'C';
            } else if (id.startsWith('R')) {
                currentPriorityType = 'R';
            }
            handlePriorityClick(event);
        });
    });



    // Handle reset button click
    resetBtn.addEventListener('click', () => {
        // Clear the priority list
        priorityList.innerHTML = '';
        const genBtn = document.getElementById('genBtn');

        // Destroy the existing chart if it exists
        if (window.myBarChart && window.myBarChart.destroy) {
            window.myBarChart.destroy();
        }
        document.getElementById('successRate').innerText = ``;
        document.getElementById('avgWishesLeft').innerText = ``;

        // Reset all buttons to initial values
        document.querySelectorAll('.buttons button').forEach(button => {
            button.innerText = button.id; // Set button text back to initial
            button.disabled = false;
            button.classList.remove('disabled'); // Remove disabled visual feedback
        });

        finalizeBtn.disabled = false;
        finalizeBtn.classList.remove('disabled');

        document.querySelectorAll('.priority-container').forEach(container => {
            container.classList.remove('fixed'); // Remove disabled visual feedback
        });

        // Reset priority type and value
        currentPriorityType = null;
        currentPriorityValue = null;

        genBtn.disabled = true;
    });
});
