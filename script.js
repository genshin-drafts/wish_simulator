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
