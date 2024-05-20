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
    console.log(inp)
    console.log(val)
    let att = inp.classList[0];
    console.log(att);
    let p = inp.parentNode.parentNode.parentParticle;
    console.log(p);
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
    nP.infoTr = document.createElement("tr");
    nP.infoTr.parentParticle = nP;
    console.log(nP.infoTr)
    particles.push(nP);
    document.getElementById("stats").appendChild(nP.infoTr);
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
                <td>${p.id}</td>
                <td>${p.isStatic ? "YES" : "NO"}</td>
                <td>${p.q}</td>
                <td>${p.pos.x.toFixed(3)}</td>
                <td>${p.pos.y.toFixed(3)}</td>
                ${!p.isStatic ? `
                    <td>${p.spd.x.toFixed(3)}</td> <td>${p.spd.y.toFixed(3)}</td>` : `<td></td><td></td>`}
                <td><input type = 'button' class = 'isDead' value = 'Delete' onclick = 'setParAtt(this,true)'></td>
				`;
        });
    }
}

function setInfoDiv(paused) {
    if (paused) {
        particles.forEach((p) => {
            console.log(p)
            // console.log(p.infoTr)
            p.infoTr.innerHTML = `
                <td valign="middle" align="center">${p.id}</td>
                <td valign="middle" align="center"><input type='checkbox' class='isStatic' ${p.isStatic ? "checked" : ""} onchange=setParAtt(this,this.checked) /></td>
                <td valign="middle" align="center"><input type='text' class='q form-text' value=${p.q} onkeyup=setParAtt(this,this.value) />
                <input type='range' class='q' step='0.01' min='-1' max=1 value=${p.q} oninput=setParAtt(this,this.value) /></td>
                <td valign="middle" align="center"><input type='num' class='pos x form-text' value='${p.pos.x.toFixed(3)}' onkeyup=setParAtt(this,this.value) /></td>
                <td valign="middle" align="center"><input type='num' class='pos y form-text' value='${p.pos.y.toFixed(3)}' onkeyup=setParAtt(this,this.value) /></td>
                <td valign="middle" align="center"><input type='num' class='spd x form-text' value=${p.spd.x.toFixed(3)} onkeyup=setParAtt(this,this.value) /></td>
                <td valign="middle" align="center"><input type='num' class='spd y form-text' value=${p.spd.y.toFixed(3)} onkeyup=setParAtt(this,this.value) /></td>
                <td valign="middle" align="center"><input type='button' class='isDead' value='Borrar' onclick='setParAtt(this,true)'></td>
			`;
            // console.log(p.infoTr)
        });
    }
}
