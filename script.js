const scheduleData = {
    friday: [
        {
            type: "Wykład",
            name: "Ochrona własności intelektualnej",
            teacher: "Dr Anna Schulz",
            room: "Google Meet",
            start: "16:45",
            end: "18:15"
        }
    ],
    saturday: [
                {
            type: "Wykład",
            name: "Wprowadzenie do sztucznej inteligencji",
            teacher: "Dr hab. Artur Popko",
            room: "Sala 202A",
            start: "11:30",
            end: "14:30"
        },
                {
            break: true,
            start: "14:30",
            end: "15:00"
        },
        {
            type: "Wykład",
            name: "Podstawy administracji SAP BASIS",
            teacher: "Dr hab. Robert Adam Janczewski",
            room: "Sala 202A",
            start: "15:00",
            end: "18:00"
        }
    ],
    sunday: [
        {
            type: "Wykład",
            name: "Administracja i zarządzanie bazami danych ORACLE",
            teacher: "Dr Maciej Dorobek",
            room: "Sala 109",
            start: "08:00",
            end: "9:30"
        },
        {
            type: "Wykład",
            name: "Podstawy administracji SAP BASIS",
            teacher: "Dr Maciej Dorobek",
            room: "Sala 202Q",
            start: "9:30",
            end: "11:00"
        },
        {
            type: "Ćwiczenia",
            name: "Podstawy administracji SAP BASIS",
            teacher: "Dr Maciej Dorobek",
            room: "Sala 202A",
            start: "11:00",
            end: "12:30"
        },
        {
            type: "Wykład",
            name: "Metodyka pisania pracy dyplomowej",
            teacher: "Dr Maciej Dorobek",
            room: "Sala 202A",
            start: "12:30",
            end: "13:15"
        },
        {
            type: "Ćwiczenia",
            name: "Administracja i zarządzanie bazami danych ORACLE",
            teacher: "Robert Rostkowski",
            room: "Sala 126",
            start: "13:15",
            end: "14:45"
        },
        {
            break: true,
            start: "14:45",
            end: "15:00"
        },
        {
            type: "Ćwiczenia",
            name: "Zaawansowane systemy baz danych – projekt, kontynuacja kursu z semestru V",
            teacher: "Dr Maciej Dorobek",
            room: "202A",
            start: "15:00",
            end: "16:30"
        },
        {
            break: true,
            start: "16:30",
            end: "16:45"
        },
        {
            type: "Ćwiczenia",
            name: "Chmura obliczeniowa",
            teacher: "Robert Rostkowski",
            room: "126",
            start: "16:45",
            end: "18:15"
        },
        {
            break: true,
            start: "18:15",
            end: "18:30"
        },
        {
            type: "Ćwiczenia",
            name: "Wprowadzenie do sztucznej inteligencji",
            teacher: "Robert Rostkowski",
            room: "126",
            start: "18:30",
            end: "20:00"
        }

    ]
};

function getTodayKey() {
    const d = new Date().getDay();
    if (d === 5) return "friday";
    if (d === 6) return "saturday";
    if (d === 0) return "sunday";
    return "friday"; // fallback jeśli pn-czw
}

let currentDay = getTodayKey();

function setDay(day) {
    currentDay = day;
    renderSchedule();
    updateNow();
    highlightDay();
}

function highlightDay() {
    document.querySelectorAll(".day-switcher button").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.day === currentDay);
    });
}

function timeToMinutes(t) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
}

function getCurrentMinutes() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}

function renderSchedule() {
    const container = document.getElementById("schedule");
    container.innerHTML = "";

    const nowMin = getCurrentMinutes();

    scheduleData[currentDay].forEach(item => {
        const div = document.createElement("div");
        div.classList.add("lesson");

        const startMin = timeToMinutes(item.start);
        const endMin = timeToMinutes(item.end);

        if (item.break) {
            div.classList.add("break");

            if (nowMin > endMin) div.classList.add("past");

            div.innerHTML = `
        <div class="time">${item.start} - ${item.end}</div>
        Przerwa
      `;
        } else {
            if (nowMin > endMin) div.classList.add("past");
            if (nowMin >= startMin && nowMin <= endMin) div.classList.add("current");

            div.innerHTML = `
        <div class="time">${item.start} - ${item.end}</div>
        <div class="subject">${item.name}</div>
        <div class="meta">${item.type}</div>
        <div class="meta">${item.teacher}</div>
        <div class="meta">${item.room}</div>
      `;
        }

        container.appendChild(div);
    });
}

function updateNow() {
    const widget = document.getElementById("nowWidget");
    const todayKey = getTodayKey();

    if (currentDay !== todayKey) {
        widget.classList.add("hidden");
        return;
    }

    const nowMin = getCurrentMinutes();
    let found = false;

    scheduleData[currentDay].forEach(item => {
        if (item.break) return;

        const start = timeToMinutes(item.start);
        const end = timeToMinutes(item.end);

        if (nowMin >= start && nowMin <= end) {
            found = true;
            widget.classList.remove("hidden");

            const percent = ((nowMin - start) / (end - start)) * 100;
            document.getElementById("progressBar").style.width = percent + "%";

            document.getElementById("nowTitle").innerText = item.name;
            document.getElementById("headerSubject").innerText = item.name;
            document.getElementById("headerRoom").innerText =
                `${item.room}`;

            document.getElementById("nowTime").innerText =
                item.start + " - " + item.end;
        }
    });

    if (!found) {
        widget.classList.add("hidden");
        document.getElementById("headerSubject").innerText = "Brak zajęć";
        document.getElementById("headerRoom").innerText = "";
    }

    renderSchedule(); // żeby odświeżało wyszarzanie
}

document.querySelectorAll(".day-switcher button").forEach(btn => {
    btn.addEventListener("click", () => setDay(btn.dataset.day));
});

renderSchedule();
highlightDay();
updateNow();
setInterval(updateNow, 25000);