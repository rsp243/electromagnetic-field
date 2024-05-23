let C = document.getElementById("canvas");

let G = 0.0001;
let K = 10000;
let modeA = 1;
let cursor = { x: 0, y: 0 };
let particles = [];
let ps = [];

let showFl = true;
let flSize = 15;
let pause = false;
let currentId = 0;

// Объект частицы
function Particle(x, y, m, q, s) {
    // Фактическое положение
    this.pos = { x: x, y: y };
    // Предыдущая позиция
    this.prevPos = this.pos;
    // Масса
    this.m = m;
    // Заряд
    this.q = q;
    // Векторная скорость
    this.spd = { x: 0, y: 0 };
    // Векторное ускорение
    this.acc = { x: 0, y: 0 };
    // Статична ли
    this.isStatic = s;
    // ID
    this.id = currentId;
    currentId++;
    // Жива ли
    this.isDead = false;
    // Размер в пикселях для отрисовки
    this.sizeInPx = 15;
    // Функция, которую нужно вызвать для обновления частицы
    this.update = function () {
        if (this.isDead) {
            return false;
        }
        // Сохраняем предыдущую позицию
        this.prevPos = this.pos;
        // Обновляем позицию, если эта частица не статична
        if (!this.isStatic) {
            this.pos.x += this.spd.x;
            this.pos.y += this.spd.y;
        }
        // Если ваша позиция находится за пределами канваса, сделать отскок (умножьте скорость на -1)
        this.spd.x *= this.pos.x < 0 || this.pos.x > C.width ? -1 : 1;
        this.pos.x =
            this.pos.x < 0 ? 0 : this.pos.x > C.width ? C.width : this.pos.x;
        this.spd.y *= this.pos.y < 0 || this.pos.y > C.height ? -1 : 1;
        this.pos.y =
            this.pos.y < 0 ? 0 : this.pos.y > C.height ? C.height : this.pos.y;
        // Скорость обновления
        this.spd.x += this.acc.x;
        this.spd.y += this.acc.y;
        this.acc.x = 0;
        this.acc.y = 0;
        particles.forEach((p) => {
            // Рассчёт расстояние между вашим положением и положением p
            let d = Math.hypot(this.pos.x - p.pos.x, this.pos.y - p.pos.y);
            // Ограничивает расстояние между двумя значениями, чтобы сила не была ни слишком большой, ни слишком маленькой
            d = constrain(d, 50, 300);
            // Если расстояние не равно нулю
            if (d != 0) {
                // Рассчитайте величину силы притяжения или отталкивания между вами и p по формуле
                let acMag;
                if (modeA == 0) {
                    acMag = (G * p.m) / (d * d);
                } else {
                    acMag = (K * this.q * p.q) / (d * d);
                }
                // Добавьте эту силу к общему ускорению
                this.acc.x +=
                    -acMag *
                    Math.cos(
                        Math.PI +
                            Math.atan2(
                                this.pos.y - p.pos.y,
                                this.pos.x - p.pos.x
                            )
                    );
                this.acc.y +=
                    -acMag *
                    Math.sin(
                        Math.PI +
                            Math.atan2(
                                this.pos.y - p.pos.y,
                                this.pos.x - p.pos.x
                            )
                    );
            }
        });
        return true;
    };
    // Функция, которую нужно вызвать для рисования частицы в графическом контексте холста.
    this.display = function (ctx) {
        // Покрас частицы в зависимости от заряда
        if (this.q < 0) {
            ctx.fillStyle = "rgb(255, 0, 0)";
        } else if (this.q > 0) {
            ctx.fillStyle = "rgb(0, 0, 255)";
        } else {
            ctx.fillStyle = "rgb(0, 255, 0)";
        }
        ctx.lineWidth = 1;
        this.hue += 0.1;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.sizeInPx, 0, 2 * Math.PI);
        ctx.fill();
    };
}

function handleMouseMove(e) {
    cursor = { x: e.clientX, y: e.clientY };
}
function constrain(n, min, max) {
    if (Math.abs(n) < min) {
        n = Math.sign(n) * min;
    } else if (Math.abs(n) > max) {
        n = Math.sign(n) * max;
    }
    return n;
}
function draw() {
    let ctx = getContext(C);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, C.width, C.height);
    if (!pause) {
        for (let i = particles.length - 1; i >= 0; i--) {
            if (!particles[i].update()) {
                particles.splice(i, 1);
            }
        }
    }
    if (showFl) {
        let max = 0;
        let accs = [];
        let rows = parseInt(C.height / flSize);
        let cols = parseInt(C.width / flSize);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let ac = Math.abs(getField(j * flSize, i * flSize));
                accs[j + i * cols] = ac;
                max = ac > max ? ac : max;
            }
        }
        accs = accs.map(function (n) {
            return n * 100;
        });

        let img = ctx.createImageData(cols, rows);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let flhere = accs[j + i * cols];
                ctx.fillStyle =
                    flhere < 0
                        ? "hsl(" + (120 + accs[j + i * cols]) + ", 100%, 50%)"
                        : "hsl(" + (120 + accs[j + i * cols]) + ", 100%, 50%)";
                ctx.beginPath();
                ctx.arc(
                    j * flSize,
                    i * flSize +
                        Math.sqrt(accs[j + i * cols]) *
                            Math.sign(accs[j + i * cols]) *
                            2,
                    3,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }
    }
    particles.forEach((p) => {
        p.display(ctx);
    });
    if (pause) {
        ctx.fillStyle = "black";
        ctx.fillText(
            "Заряд поля: " + getField(cursor.x, cursor.y),
            cursor.x,
            cursor.y
        );
    }
    updateData();
}

function getContext(c) {
    if (c.width != window.innerWidth) {
        c.width = window.innerWidth;
    }
    if (c.height != window.innerHeight) {
        c.height = window.innerHeight;
    }
    return c.getContext("2d");
}
function getField(x, y) {
    let output = 0;
    for (let i = 0; i < particles.length; i++) {
        let d = Math.hypot(
            x - particles[i].pos.x,
            y - particles[i].pos.y + particles[i].sizeInPx * 2
        );
        d = constrain(d, 1, 500);
        if (d != 0) {
            let acMag;
            if (modeA == 0) {
                acMag = (G * particles[i].m) / Math.pow(d, 2);
            } else {
                acMag = (K * particles[i].q) / (d * d);
            }
            output += acMag;
        }
    }
    return output;
}
