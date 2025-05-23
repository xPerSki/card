const sparkColors = ['rgb(0, 104, 150)', '#ffffff', '#ffffff', '#ffffff'];
const sparkShapes = ['★', '✦', '✧', '✩'];

document.addEventListener('mousemove', (e) => {

    const spark = document.createElement('div');
    spark.className = 'spark';
    spark.style.left = `${e.clientX}px`;
    spark.style.top = `${e.clientY}px`;
    spark.style.color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
    spark.style.fontSize = `${8 + Math.random() * 12}px`;
    spark.textContent = sparkShapes[Math.floor(Math.random() * sparkShapes.length)];
    document.body.appendChild(spark);

    setTimeout(() => {
        spark.remove();
    }, 700);
});
