function setshowFl(e) {
    showFl = e.srcElement.checked;
}
function setConstant(k) {
    if (modeA == 0) {
        G = k;
    } else {
        K = k;
    }
}
function setParAtt(inp, val) {
    let att = inp.classList[0];
    let p = inp.parentNode.parentParticle;
    if (typeof p[att] == "number" || typeof p[att] == "string") {
        p[att] = val;
        let inputs = inp.parentNode.getElementsByClassName(att);
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = val;
        }
    } else if (typeof p[att] == "boolean") {
        if (val) {
            let spdIn = inp.parentNode.getElementsByClassName("spd");
            console.log(inp.parentNode.parentNode);
            for (let i = 0; i < spdIn.length; i++) {
                spdIn[i].style.display = "none";
            }
        } else {
            let spdIn = inp.parentNode.getElementsByClassName("spd");
            for (let i = 0; i < spdIn.length; i++) {
                spdIn[i].style.display = "block";
            }
        }
        p[att] = val;
    } else if (typeof p[att] == "object") {
        p[att][inp.classList[1]] = parseInt(val);
    }
}

function addPar(e) {
    let nP = new Particle(
        e.clientX,
        e.clientY,
        10000000,
        1,
        false,
        particles.length
    );
    nP.infoDiv = document.createElement("div");
    nP.infoDiv.parentParticle = nP;
    particles.push(nP);
    document.getElementById("stats").appendChild(nP.infoDiv);
    setInfoDiv(pause);
}

function particleData(particleNum, particleAcc) {
    this.particleNum = particleNum;
    this.particleAcc = particleAcc;
}

function keyPressed(e) {
    console.log(e.keyCode);
    if (e.keyCode == 101) {
        showFl = !showFl;
        document.getElementById("campo").checked = showFl;
    }
    if (e.keyCode == 13) {
        var sideNav = document.getElementById("sideNav");
        //sideNav.appendChild(div);
        if (sideNav.classList.contains("open")) {
            sideNav.classList.remove("open");
            sideNav.classList.add("closed");
        } else {
            sideNav.classList.remove("closed");
            sideNav.classList.add("open");
        }
    } else if (e.keyCode == 32) {
        pause = !pause;
        setInfoDiv(pause);
    }
}
function updateData() {
    if (!pause) {
        document.getElementById("stats").childNodes.forEach((n) => {
            let p = n.parentParticle;
            n.innerHTML = `
					Particle no. ${p.id}<br>
					Is static: ${p.isStatic ? "sí" : "no"} <br>
					Charge: ${p.q} <br>
					Position <br>
					X: ${p.pos.x.toFixed(3)} <br>
					Y: ${p.pos.y.toFixed(3)} <br>
					${
                        !p.isStatic
                            ? `Velocity<br> X: ${p.spd.x.toFixed(
                                  3
                              )} <br> Y: ${p.spd.y.toFixed(3)} <br>`
                            : ``
                    }
					<input type = 'button' class = 'isDead' value = 'Delete' onclick = 'setParAtt(this,true)'>
				`;
        });
    }
}
function setInfoDiv(pau) {
    if (pau) {
        particles.forEach((p) => {
            p.infoDiv.innerHTML = `
				Particle no. ${p.id}<br><br>
				Static <input type = 'checkbox' class = 'isStatic' onchange = setParAtt(this,this.checked) /><br>
				Charge<br><input type ='range' class = 'q' step = '0.01' min = '-1' max = 1 value = ${
                    p.q
                } oninput = setParAtt(this,this.value) /> <input type = 'text' class = 'q' value = ${
                p.q
            } onkeyup = setParAtt(this,this.value) /><br>
				X Position<br><input type = 'number' class = 'pos x' value = '${p.pos.x.toFixed(
                    3
                )}' onkeyup = setParAtt(this,this.value) /><br>
				Y Position<br><input type = 'number' class = 'pos y' value = '${p.pos.y.toFixed(
                    3
                )}' onkeyup = setParAtt(this,this.value) /><br>
				<p class = 'spd'>X Velocity</p><br><input type = 'number' class = 'spd x' value = ${p.spd.x.toFixed(
                    3
                )} onkeyup = setParAtt(this,this.value) /><br>
				<p class = 'spd'>Y Velocity</p><br><input type = 'number' class = 'spd y' value = ${p.spd.y.toFixed(
                    3
                )} onkeyup = setParAtt(this,this.value) /><br>
				<input type = 'button' class = 'isDead' value = 'Borrar' onclick = 'setParAtt(this,true)'><br>
			`;
        });
    }
}
