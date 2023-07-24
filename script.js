document.addEventListener("DOMContentLoaded", function () {
  const pads = document.querySelectorAll(".pad");
  w = window.innerWidth;
  h = window.innerHeight;
  // console.log(w);
  // console.log(h);
  if (w>h) {
    a = h - 10;
  }
  else {
    a = w - 10;
  }
  console.log(a);
  // Функция для воспроизведения звука и создания капли
  function playSoundWithDrop(soundURL, color) {
    const audioPlayer = new Audio(soundURL);
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
    }, 500); // Увеличим время на 500 миллисекунд для корректного завершения анимации
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
});
