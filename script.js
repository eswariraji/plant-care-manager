document.addEventListener("DOMContentLoaded", () => {
    const plantForm = document.getElementById("plantForm");
    const plantList = document.getElementById("plantList");
    const message = document.getElementById("message");
    const notificationsPanel = document.getElementById("notifications");

    let plants = JSON.parse(localStorage.getItem("plants")) || [];

    function savePlants() {
        localStorage.setItem("plants", JSON.stringify(plants));
    }

    function showMessage(text, type) {
        message.textContent = text;
        message.className = type;
        message.classList.remove("hidden");

        setTimeout(() => {
            message.classList.add("hidden");
        }, 3000);
    }

    function getNextDate(days) {
        let today = new Date();
        today.setDate(today.getDate() + parseInt(days));
        return today.toDateString();
    }

    function renderPlants() {
        plantList.innerHTML = "";
        plants.forEach((plant, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${plant.name}</strong> <br>
                 Water every ${plant.waterDays} days (Next: ${getNextDate(plant.waterDays)}) <br>
                 Prune every ${plant.pruneDays} days (Next: ${getNextDate(plant.pruneDays)}) <br>
                 Fertilize every ${plant.fertilizeDays} days (Next: ${getNextDate(plant.fertilizeDays)}) <br>
                <button onclick="removePlant(${index})"> Remove</button>
            `;
            plantList.appendChild(li);
        });
    }

    function checkReminders() {
        notificationsPanel.innerHTML = "";
        let today = new Date().toDateString();
        let notifications = [];

        plants.forEach((plant) => {
            let waterDate = getNextDate(-plant.waterDays);
            let pruneDate = getNextDate(-plant.pruneDays);
            let fertilizeDate = getNextDate(-plant.fertilizeDays);

            if (today === waterDate) {
                notifications.push(` Time to water **${plant.name}**!`);
            }
            if (today === pruneDate) {
                notifications.push(` Time to prune **${plant.name}**!`);
            }
            if (today === fertilizeDate) {
                notifications.push(` Time to fertilize **${plant.name}**!`);
            }
        });

        if (notifications.length > 0) {
            notifications.forEach((note) => {
                let div = document.createElement("div");
                div.className = "notification";
                div.innerHTML = note;
                notificationsPanel.appendChild(div);
            });
        } else {
            notificationsPanel.innerHTML = "<p>No reminders today! </p>";
        }
    }

    plantForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const plantName = document.getElementById("plantName").value.trim();
        const waterDays = document.getElementById("waterDays").value;
        const pruneDays = document.getElementById("pruneDays").value;
        const fertilizeDays = document.getElementById("fertilizeDays").value;

        if (!plantName) {
            showMessage(" Please enter a plant name.", "error");
            return;
        }
        if (waterDays < 1 || pruneDays < 1 || fertilizeDays < 1) {
            showMessage(" All numbers must be greater than zero.", "error");
            return;
        }

        plants.push({
            name: plantName,
            waterDays: waterDays,
            pruneDays: pruneDays,
            fertilizeDays: fertilizeDays,
        });

        savePlants();
        renderPlants();
        checkReminders();
        plantForm.reset();
        showMessage(" Plant added successfully!", "success");
    });

    window.removePlant = function (index) {
        plants.splice(index, 1);
        savePlants();
        renderPlants();
        checkReminders();
        showMessage(" Plant removed!", "success");
    };

    renderPlants();
    checkReminders();
});
