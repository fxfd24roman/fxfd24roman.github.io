document.addEventListener("DOMContentLoaded", function () {
    const pads = document.querySelectorAll(".pad");
    const freqButtons = document.querySelectorAll(".freq-button");
    const stopButton = document.querySelector(".stop-button");
    const slider = document.querySelector(".slider");
    const timeline = document.querySelector(".timeline");
    let activeFreqButton = null;
    let animationInterval;
    let isPlaying = false;
    let audioPlayers = {}; // Объект для хранения аудио-плееров для каждой кнопки частоты

    let w = window.innerWidth;
    let h = window.innerHeight;
    let a;

    if (w > h) {
        a = h - 4;
    } else {
        a = w - 4;
    }

    console.log(a);

    // Функция для воспроизведения звука и создания капли
    function playSoundWithDrop(soundURL, color) {
        const audioPlayer = new Audio(soundURL);
        audioPlayers[soundURL] = audioPlayer; // Сохранить аудио-плеер в объекте для последующего управления

        audioPlayer.play();

        const drop = document.createElement("div");
        drop.classList.add("drop");
        drop.style.borderColor = color;
        drop.style.overflow = "hidden";
        drop.style.width = a + "px";
        drop.style.height = a + "px";
        document.body.appendChild(drop);

        setTimeout(() => {
            drop.remove();
        }, 500);
    }

    // Функция для остановки всех аудио-плееров
    function stopAllAudio() {
        for (const soundURL in audioPlayers) {
            const audioPlayer = audioPlayers[soundURL];
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
        }
    }

    // Функция для запуска интервала для движения ползунка
    function startAnimation(bpm) {
        const beatsPerSlider = 1000; // Количество ударов на длине ползунка
        const intervalDuration = (bpm/60) * 1000 / beatsPerSlider; // Интервал в миллисекундах для одного удара (BPM) на длине ползунка

        let currentPosition = 0;

        // Запустить интервал для движения ползунка
        animationInterval = setInterval(() => {
            const sliderPosition = currentPosition / beatsPerSlider * timeline.clientWidth;
            slider.style.left = sliderPosition + "px";

            currentPosition++;
            if (currentPosition >= beatsPerSlider) {
                stopAnimation();
                stopAllAudio();
                if (activeFreqButton) {
                  isPlaying = false;
                  freqButtons.forEach((btn) => {
                    btn.removeAttribute("disabled");
                    btn.style.backgroundColor = "#4CAF50";
                  });
                  activeFreqButton = null;
                }
                currentPosition = 0;
            }
        }, intervalDuration);
    }

    // Функция для остановки интервала
    function stopAnimation() {
        clearInterval(animationInterval);
        slider.style.left = "0"; // Сбросить ползунок в начальное положение
    }

    // Обработчик событий для каждой кнопки пэда
    pads.forEach((pad) => {
        pad.addEventListener("click", () => {
            const soundURL = pad.getAttribute("data-sound");
            const color = pad.getAttribute("data-color");

            playSoundWithDrop(soundURL, color);
            pad.classList.toggle("active");
        });
    });

    // Обработчик событий для кнопок частот
    freqButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (!isPlaying) {
                isPlaying = true;
                freqButtons.forEach((btn) => {
                    btn.setAttribute("disabled", "disabled");
                });
                button.removeAttribute("disabled");
                button.style.backgroundColor = "#FF0000"; // Измените цвет, чтобы сделать кнопку ярче

                activeFreqButton = button;

                const bpm = parseInt(button.getAttribute("data-bpm"));
                console.log(bpm);
                startAnimation(bpm);
                stopAllAudio(); // Остановить все предыдущие аудио-плееры
                playSoundWithDrop(button.getAttribute("data-sound"), "#FFFFFF"); // Воспроизвести звук для текущей кнопки
            }
        });
    });

    // Обработчик события для кнопки "STOP RITM"
    stopButton.addEventListener("click", () => {
        if (activeFreqButton) {
            isPlaying = false;
            freqButtons.forEach((btn) => {
                btn.removeAttribute("disabled");
                btn.style.backgroundColor = "#4CAF50";
            });
            activeFreqButton = null;
            stopAnimation();
            stopAllAudio(); // Остановить все аудио-плееры при остановке ритма
        }
    });
});
