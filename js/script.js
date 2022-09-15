let form = document.querySelector('.my-form'),
    formInputs = document.querySelectorAll('.my-input'),
    formTextArea = document.querySelector('.my-textarea');


form.addEventListener('submit', (e) => {
    e.preventDefault();

    formInputs.forEach((input)=> {
        if(input.value === '') {
            input.classList.add('error');
            console.log('input empty');
        } else {
            input.classList.remove('error');
        }
    });

    if(formTextArea.value === ''){
        formTextArea.classList.add('error');
        console.log('textarea empty');
    } else {
        formTextArea.classList.remove('error');
    }
});    