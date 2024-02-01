import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');

form.addEventListener('submit', onSubmitButtonClick);

function onSubmitButtonClick(e) {
    e.preventDefault();
    
    const delay = Number(e.currentTarget.elements.delay.value);
    const state = e.currentTarget.elements.state.value;
    
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === 'fulfilled') {
                resolve(delay);
            } else {
                reject(delay);
            }
        }, delay);
    });

    promise
        .then(delay => {
            iziToast.success({
                title: 'Success',
                message: `✅ Fulfilled promise in ${delay}ms`,
                position: 'topRight'
            });
        })
        .catch(delay => {
            iziToast.error({
                title: 'Error',
                message: `❌ Rejected promise in ${delay}ms`,
                position: 'topRight'
            });
        });
}