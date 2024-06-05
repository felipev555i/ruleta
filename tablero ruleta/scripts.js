document.addEventListener('DOMContentLoaded', () => {
    const slots = document.querySelectorAll('.slot');
    const dozens = document.querySelectorAll('.dozen');
    const clearBetsButton = document.getElementById('clear-bets');

    slots.forEach(slot => {
        slot.addEventListener('click', () => {
            slot.classList.toggle('selected');
        });
    });

    dozens.forEach(dozen => {
        dozen.addEventListener('click', () => {
            dozen.classList.toggle('selected');
        });
    });

    clearBetsButton.addEventListener('click', () => {
        slots.forEach(slot => {
            slot.classList.remove('selected');
        });
        dozens.forEach(dozen => {
            dozen.classList.remove('selected');
        });
    });
});

