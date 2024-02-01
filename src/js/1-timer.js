// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const refs = {
    inputEl: document.querySelector("input#datetime-picker"),
    buttonEl: document.querySelector("button[data-start]"),
    spanDays: document.querySelector("span[data-days]"),
    spanHours: document.querySelector("span[data-hours]"),
    spanMinutes: document.querySelector("span[data-minutes]"),
    spanSeconds: document.querySelector("span[data-seconds]")
};

let intervalId;
refs.buttonEl.disabled = true;
let hasError = false;
let selectedDate;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates, dateStr, instance) {
        clearInterval(intervalId);
        selectedDate = selectedDates[0];
        const currentDate = new Date();

        if (selectedDate < currentDate) {
            if (!hasError) {
                iziToast.show({
                    title: 'Warning',
                    message: 'Please choose a date in the future',
                    position: 'topRight'
                });
                hasError = true;
            }
            refs.buttonEl.disabled = true;
            updateTimerDisplay(null);

        } else {
            hasError = false;
            refs.buttonEl.disabled = false;
        }
    },
};

flatpickr(refs.inputEl, options);
refs.buttonEl.addEventListener("click", () => {
    intervalId = setInterval(() => {
        checkDates(selectedDate);
    }, 1000);
});
function updateTimerDisplay(ms) {
    if (ms === null || isNaN(ms)) {
        refs.spanDays.textContent = "00";
        refs.spanHours.textContent = "00";
        refs.spanMinutes.textContent = "00";
        refs.spanSeconds.textContent = "00";
    } else {
        const time = convertMs(ms);
        refs.spanDays.textContent = String(time.days).padStart(2, '0');
        refs.spanHours.textContent = String(time.hours).padStart(2, '0');
        refs.spanMinutes.textContent = String(time.minutes).padStart(2, '0');
        refs.spanSeconds.textContent = String(time.seconds).padStart(2, '0');
    }
}

function checkDates(selectedDate) {
    const currentDate = new Date();
    if (selectedDate < currentDate) {
        if (!hasError) {
            iziToast.show({
                title: 'Warning',
                message: 'Дія тармеру заверешилась',
                position: 'topRight'
            });
            hasError = true;
        }
        refs.buttonEl.disabled = true;
        updateTimerDisplay(null);
        clearInterval(intervalId);
        return;
    } else {
        hasError = false;
        const difference = selectedDate - currentDate;
        updateTimerDisplay(difference);
    }
}
function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}
