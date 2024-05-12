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

//Objeto particula
function Particle(x, y, m, q, s, id) {
    //Posición actual
    this.pos = { x: x, y: y };
    //Posición previa (Para dibujar una línea entre la posición acutal y la previa)
    this.prevPos = this.pos;
    //Masa
    this.m = m;
    //Carga
    this.q = q;
    //Vector velocidad
    this.spd = { x: 0, y: 0 };
    //Vector aceleración
    this.acc = { x: 0, y: 0 };
    //Es estática
    this.isStatic = s;
    //Identificador
    this.id = id;
    //Estás vivo
    this.isDead = false;
    //Función a ser llama para actualizar la particula
    this.update = function () {
        //Guarda la posición previa
        this.prevPos = this.pos;
        //Actualiza la posición si no eres estática
        if (!this.isStatic) {
            this.pos.x += this.spd.x;
            this.pos.y += this.spd.y;
        }
        //Si su posisión está fuera del canvas, cambia de dirección (Multiplica velocidad por -1)
        this.spd.x *= this.pos.x < 0 || this.pos.x > C.width ? -1 : 1;
        this.pos.x =
            this.pos.x < 0 ? 0 : this.pos.x > C.width ? C.width : this.pos.x;
        this.spd.y *= this.pos.y < 0 || this.pos.y > C.height ? -1 : 1;
        this.pos.y =
            this.pos.y < 0 ? 0 : this.pos.y > C.height ? C.height : this.pos.y;
        //Actualiza velocidad
        this.spd.x += this.acc.x;
        this.spd.y += this.acc.y;
        //Calcula la aceleración basado en las otras partículas o algún otro factor
        this.acc.x = 0;
        this.acc.y = 0;
        //Para cada particula p
        particles.forEach((p) => {
            //Calcula la distancia entre tu posición y la de p
            let d = Math.hypot(this.pos.x - p.pos.x, this.pos.y - p.pos.y);
            //Restringe la distancia entre dos valores, para que la fuerza no sea muy grande ni muy pequeña
            d = constrain(d, 50, 300);
            //Si la distancia no es cero (P eres tú)
            if (d != 0) {
                //Calcula la magnitud de la fuerza de atracción o repulsión entre tú y p con la formula
                let acMag;
                if (modeA == 0) {
                    acMag = (G * p.m) / (d * d);
                } else {
                    acMag = (K * this.q * p.q) / (d * d);
                }
                //Agrega esa fuerza a la aceleración total (Componentes rectangulares)
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
        if (this.isDead) {
            this.infoDiv.parentNode.removeChild(this.infoDiv);
            return false;
        }
        return true;
    };
    //Función a ser llamada para dibujar la particula en el contexto gráfico de un canvas
    this.display = function (ctx) {
        //Si la carga es negativa
        if (this.q < 0) {
            //Fija el color a rojo
            ctx.fillStyle = "rgb(255, 0, 0)";
        } else if (this.q > 0) {
            //Si es positiva, fija el color a azul
            ctx.fillStyle = "rgb(0, 0, 255)";
        } else {
            //Si es cero, fija el color a verde
            ctx.fillStyle = "rgb(0, 255, 0)";
        }
        ctx.lineWidth = 1;
        this.hue += 0.1;
        //Dibuja un círculo en la posición actual
        ctx.beginPath();
        //ctx.moveTo(this.prev.x,this.prev.y);
        //ctx.lineTo(this.x,this.y);
        ctx.arc(this.pos.x, this.pos.y, 15, 0, 2 * Math.PI);
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
                        ? "hsl(" + accs[j + i * cols] + ", 100%, 50%)"
                        : "hsl(" + accs[j + i * cols] + ", 100%, 50%)";
                ctx.beginPath();
                ctx.arc(
                    j * flSize,
                    i * flSize +
                        Math.sqrt(accs[j + i * cols]) *
                            Math.sign(accs[j + i * cols]) *
                            2,
                    5,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                //ctx.fillRect(j * flSize, i * flSize, flSize, flSize);
                //let rgb = hslToRgb(accs[j + i * cols], 1, 0.9);
                //img.data[(j + i * cols) * 4 + 0] = rgb[0] * 255;
                //img.data[(j + i * cols) * 4 + 1] = rgb[1] * 255;
                //img.data[(j + i * cols) * 4 + 2] = rgb[2] * 255;
                //img.data[(j + i * cols) * 4 + 3] = 255;
            }
        }
        //ctx.putImageData(img, 0, 0);
    }
    particles.forEach((p) => {
        p.display(ctx);
    });
    if (pause) {
        ctx.fillStyle = "black";
        ctx.fillText(
            "El campo aquí es: " + getField(cursor.x, cursor.y),
            cursor.x,
            cursor.y
        );
    }
    updateData();

    //document.getElementById("p").innerHTML = ""+(Math.sqrt(Math.pow(last.acc.x, 2) + Math.pow(last.acc.y, 2)));
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
        let d = Math.hypot(x - particles[i].pos.x, y - particles[i].pos.y);
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
